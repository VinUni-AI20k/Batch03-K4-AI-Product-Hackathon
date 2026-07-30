"""Lớp ③ — quyết định AI trung tâm.

KHÔNG import discord. Đây là điều kiện để scripts/chay_eval.py gọi hàm này
22 lần ngoài Discord và dựng bảng kết quả golden set (rubric R4, 15 điểm).

Chống bịa bằng CODE, không bằng prompt: neo() kiểm mọi message_id LLM trả về
phải tồn tại thật trong danh sách ứng viên. Không neo được → bỏ.
"""

from __future__ import annotations

import datetime as dt
import time
from typing import Callable, Literal

from pydantic import BaseModel

from . import config
from .index import TinNhan

# ─────────────────────────────────────────────────────────────
# Schema — hợp đồng đầu ra của AI
# ─────────────────────────────────────────────────────────────


class KetQua(BaseModel):
    tim_thay: bool
    ngoai_pham_vi: bool                    # ③ user hỏi thứ bot không được làm
    cau_tra_loi: str
    message_ids: list[str]                 # neo bắt buộc khi tim_thay=True
    do_tin_cay: Literal["cao", "thap"]
    can_lam_ro: str | None                 # ② câu hỏi lại khi input mơ hồ


SYSTEM = """Bạn tìm lại LINK/TÀI LIỆU đã được đăng trong Discord của một khoá học.

Đầu vào: câu hỏi của học viên + danh sách tin nhắn ứng viên, mỗi tin có dạng
[message_id] #kênh · người gửi · thời điểm, rồi tới nội dung.

LUẬT BẮT BUỘC:
1. Chỉ dùng thông tin trong danh sách ứng viên. Không dùng kiến thức ngoài.
   Không có ứng viên nào khớp -> tim_thay=false, message_ids=[], nói thẳng là
   không tìm thấy. TUYỆT ĐỐI không tự tạo link, không đoán link theo quy luật
   đặt tên.
2. Mỗi message_id phải copy nguyên văn từ danh sách ứng viên. Không suy diễn id.
3. Câu hỏi mơ hồ (thiếu buổi số mấy, "hôm qua", chỉ có chữ "link") mà có nhiều
   ứng viên khác nhau -> do_tin_cay="thap", điền can_lam_ro bằng một câu hỏi lại
   ngắn, và liệt kê các lựa chọn tìm được.
4. Câu hỏi KIẾN THỨC (giải thích khái niệm, cách làm bài, sửa code) hoặc đòi
   đáp án bài tập -> ngoai_pham_vi=true, tim_thay=false. Từ chối ngắn gọn rồi
   chỉ chỗ hữu ích (kênh hỏi-đáp, Lab Coach, AI Tutor trên VLearn).
5. Nhiều tin nhắn cùng nói về một tài liệu -> ưu tiên tin MỚI NHẤT theo thời
   điểm, và nêu rõ là bản mới nhất.
6. cau_tra_loi viết tiếng Việt, tối đa 3 câu, không markdown link — chỉ nói nội
   dung; phần link do hệ thống render riêng từ message_ids."""


# ─────────────────────────────────────────────────────────────
# Chống bịa — bằng code
# ─────────────────────────────────────────────────────────────


def neo(kq: KetQua, ung_vien: list[TinNhan]) -> tuple[KetQua, list[str]]:
    """Bỏ mọi message_id không tồn tại trong ứng viên.

    Trả về (kết quả đã lọc, danh sách id bị bỏ). Danh sách bị bỏ chính là SỐ ĐO
    hallucination cho bảng kết quả R4 — đừng bỏ im lặng, hãy đếm nó.
    """
    hop_le = {t.id for t in ung_vien}
    bo_di = [i for i in kq.message_ids if i not in hop_le]
    kq.message_ids = [i for i in kq.message_ids if i in hop_le]

    # Khai báo tìm thấy nhưng không neo được vào tin nhắn nào -> hạ xuống không
    # tìm thấy. Đây là chỗ khó ① Nguồn sự thật, xử lý bằng code chứ không tin prompt.
    if kq.tim_thay and not kq.message_ids:
        kq.tim_thay = False
        kq.do_tin_cay = "thap"
        kq.cau_tra_loi = (
            "Mình không tìm thấy link này trong các kênh mình theo dõi. "
            "Bạn thử nói rõ hơn (buổi mấy, loại tài liệu gì) nhé."
        )
    return kq, bo_di


def canh_bao_cu(tin: TinNhan, hom_nay: dt.date | None = None, nguong: int = 7) -> str | None:
    """④ Đặc thù domain: trả link CŨ ĐÃ BỊ THAY nguy hiểm hơn không trả lời.

    Tính bằng code, không hỏi LLM — ngày tháng là việc của code.
    """
    try:
        ngay = dt.datetime.fromisoformat(tin.thoi_diem).date()
    except ValueError:
        return None
    so_ngay = ((hom_nay or dt.date.today()) - ngay).days
    if so_ngay >= nguong:
        return f"Tin này từ {so_ngay} ngày trước ({ngay:%d/%m}) — có thể đã có bản mới hơn."
    return None


# ─────────────────────────────────────────────────────────────
# Gọi AI
# ─────────────────────────────────────────────────────────────

GoiLLM = Callable[[str, list[TinNhan]], KetQua]

# Mã lỗi đáng thử lại: 429 hết hạn mức, 500/503 Google quá tải. Mọi mã khác
# (400 sai request, 403 sai key) chờ bao lâu cũng không tự khỏi -> ném lên ngay.
_LOI_TAM_THOI = {429, 500, 503}

_GOI_GAN_NHAT = 0.0


def _cho_het_gian_cach() -> None:
    """Giãn nhịp cho free tier — hạn của nó là lời gọi/phút, không phải token.

    Chỉ giãn các lời gọi LIỀN NHAU, nên một câu hỏi lẻ trong Discord không bị chậm
    (lần gọi trước đã quá lâu). Chỗ bị giãn là chay_eval.py bắn 22 case liên tiếp.
    """
    global _GOI_GAN_NHAT
    cho = config.GIAN_CACH_GOI - (time.monotonic() - _GOI_GAN_NHAT)
    if cho > 0:
        time.sleep(cho)
    _GOI_GAN_NHAT = time.monotonic()


def _goi_gemini(cau_hoi: str, ung_vien: list[TinNhan]) -> KetQua:
    """1 lời gọi AI thật ở quyết định trung tâm (rubric R5)."""
    from google import genai              # import trong hàm -> test không cần cài SDK
    from google.genai import errors, types

    client = genai.Client(api_key=config.can_gemini())
    than = "\n\n".join(t.dong_prompt() for t in ung_vien)
    cau_hinh = types.GenerateContentConfig(
        system_instruction=SYSTEM,
        response_mime_type="application/json",
        response_schema=KetQua,            # Gemini tự ép JSON đúng schema
        temperature=0,                     # chạy lại lượt eval phải ra cùng kết quả
        max_output_tokens=config.MAX_TOKENS,
        # KHÔNG truyền thinking_config: đo tay 30/07 cho thấy tắt thinking thì model
        # trả 2 message_id cho "slide buổi 5" thay vì chọn bản mới nhất — tức là hỏng
        # luật 5 trong SYSTEM, đúng rủi ro ④. Thêm ~2s nhưng vẫn dưới mốc <5s ở §7.
        # Ngoài ra gemini-3.6-flash ném 400 nếu bị truyền thinking_budget=0.
    )
    noi_dung = f"CÂU HỎI: {cau_hoi}\n\nTIN NHẮN ỨNG VIÊN:\n{than}"

    for lan in range(1, config.SO_LAN_THU + 1):
        _cho_het_gian_cach()
        try:
            resp = client.models.generate_content(
                model=config.MODEL, contents=noi_dung, config=cau_hinh
            )
            break
        except errors.APIError as e:
            # 429 = hết hạn mức phút/ngày của free tier. Hết hạn mức NGÀY thì chờ
            # cũng vô ích, nhưng phân biệt được hai loại thì phải đọc chi tiết lỗi —
            # cứ thử lại vài lần rồi ném lên, đừng nuốt lỗi thành kết quả sai.
            # 500/503 = quá tải phía Google, không phải lỗi mình. Bắt cả hai loại vì
            # một cú 503 ở case thứ 9 làm hỏng cả lượt eval 22 case và không ghi ra
            # được file kết quả nào — đo lại từ đầu tốn 2,5 phút và 9 lời gọi.
            ma = getattr(e, "code", None)
            if ma not in _LOI_TAM_THOI or lan == config.SO_LAN_THU:
                raise
            cho = config.GIAN_CACH_GOI * 2**lan
            print(f"[{ma}] lỗi tạm thời, chờ {cho:.0f}s rồi thử lại (lần {lan})")
            time.sleep(cho)

    print(f"[trace] usage={resp.usage_metadata} id={resp.response_id}")  # log cho R5
    kq = resp.parsed
    if not isinstance(kq, KetQua):         # SDK không parse được -> tự parse từ text
        kq = KetQua.model_validate_json(resp.text)
    return kq


def tra_cuu(
    cau_hoi: str,
    ung_vien: list[TinNhan],
    *,
    goi_llm: GoiLLM | None = None,
) -> tuple[KetQua, list[str]]:
    """Điểm vào duy nhất của lớp ③.

    goi_llm cho phép test thay LLM bằng hàm giả — nhờ vậy 4 lớp chỗ khó test
    được offline, không cần API key, không tốn token.
    """
    if not ung_vien:
        # FTS5 không ra ứng viên nào -> khỏi tốn 1 lời gọi AI.
        return (
            KetQua(
                tim_thay=False,
                ngoai_pham_vi=False,
                cau_tra_loi="Mình không tìm thấy tin nhắn nào khớp với câu hỏi này.",
                message_ids=[],
                do_tin_cay="thap",
                can_lam_ro=None,
            ),
            [],
        )
    kq = (goi_llm or _goi_gemini)(cau_hoi, ung_vien)
    return neo(kq, ung_vien)
