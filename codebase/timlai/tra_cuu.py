"""Lớp ③ — quyết định AI trung tâm.

KHÔNG import discord. Đây là điều kiện để scripts/chay_eval.py gọi hàm này
22 lần ngoài Discord và dựng bảng kết quả golden set (rubric R4, 15 điểm).

Chống bịa bằng CODE, không bằng prompt: neo() kiểm mọi message_id LLM trả về
phải tồn tại thật trong danh sách ứng viên. Không neo được → bỏ.
"""

from __future__ import annotations

import datetime as dt
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


def _goi_claude(cau_hoi: str, ung_vien: list[TinNhan]) -> KetQua:
    """1 lời gọi AI thật ở quyết định trung tâm (rubric R5)."""
    import anthropic  # import trong hàm -> test không cần cài anthropic

    config.can_anthropic()
    client = anthropic.Anthropic()
    than = "\n\n".join(t.dong_prompt() for t in ung_vien)
    resp = client.messages.parse(
        model=config.MODEL,
        max_tokens=config.MAX_TOKENS,
        system=[{                                  # prefix ổn định -> cache được
            "type": "text",
            "text": SYSTEM,
            "cache_control": {"type": "ephemeral"},
        }],
        messages=[{
            "role": "user",
            "content": f"CÂU HỎI: {cau_hoi}\n\nTIN NHẮN ỨNG VIÊN:\n{than}",
        }],
        output_format=KetQua,
    )
    print(f"[trace] usage={resp.usage} request_id={resp._request_id}")  # log cho R5
    return resp.parsed_output


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
    kq = (goi_llm or _goi_claude)(cau_hoi, ung_vien)
    return neo(kq, ung_vien)
