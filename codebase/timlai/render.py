"""Trình bày kết quả. Tách khỏi tra_cuu.py để test được text mà không cần Discord.

Bốn đường đi trải nghiệm (rubric R3) nằm hết ở đây, mỗi đường một màu:
    happy          xanh   — tìm thấy, do_tin_cay=cao
    low-confidence vàng   — ② mơ hồ, kèm câu hỏi lại
    failure        xám    — ① không căn cứ
    ngoài phạm vi  đỏ nhạt— ③ user đòi thứ bot không làm
"""

from __future__ import annotations

from .index import TinNhan
from .tra_cuu import KetQua, canh_bao_cu

MAU = {"happy": 0x2ECC71, "thap": 0xF1C40F, "fail": 0x9E9E9E, "ngoai": 0xE74C3C}


def _dong_nguon(tin: TinNhan) -> str:
    dong = f"• [#{tin.kenh} · {tin.tac_gia}]({tin.url})"
    if (cb := canh_bao_cu(tin)) :
        dong += f"\n  ⚠️ {cb}"
    return dong


def thanh_text(kq: KetQua, nguon: list[TinNhan]) -> str:
    """Bản text thuần — dùng cho test và cho scripts/chay_eval.py."""
    phan = [kq.cau_tra_loi]
    if kq.can_lam_ro:
        phan.append(f"❓ {kq.can_lam_ro}")
    for tin in nguon:
        phan.append(_dong_nguon(tin))
    return "\n".join(phan)


def chon_nguon(kq: KetQua, ung_vien: list[TinNhan]) -> list[TinNhan]:
    """Lấy đúng các TinNhan mà AI đã neo, giữ nguyên thứ tự AI chọn."""
    theo_id = {t.id: t for t in ung_vien}
    return [theo_id[i] for i in kq.message_ids if i in theo_id]


def thanh_embed(kq: KetQua, nguon: list[TinNhan], bo_di: list[str]):
    """Embed Discord. Import discord trong hàm -> test không cần discord.py."""
    import discord

    if kq.ngoai_pham_vi:
        tieu_de, mau = "Ngoài phạm vi mình làm được", MAU["ngoai"]
    elif not kq.tim_thay:
        tieu_de, mau = "Không tìm thấy", MAU["fail"]
    elif kq.do_tin_cay == "thap":
        tieu_de, mau = "Có thể là mấy cái này — bạn xác nhận giúp", MAU["thap"]
    else:
        tieu_de, mau = "Tìm thấy rồi", MAU["happy"]

    e = discord.Embed(title=tieu_de, description=kq.cau_tra_loi[:4000], color=mau)

    if kq.can_lam_ro:
        e.add_field(name="❓ Cho mình hỏi lại", value=kq.can_lam_ro[:1024], inline=False)

    if nguon:
        e.add_field(
            name="🔗 Tin nhắn gốc",
            value="\n".join(_dong_nguon(t) for t in nguon)[:1024],
            inline=False,
        )

    if bo_di:
        # Không che số đo hallucination — hiện luôn cho người dùng và cho giám khảo.
        e.set_footer(text=f"Đã bỏ {len(bo_di)} kết luận không neo được vào tin nhắn thật.")
    return e
