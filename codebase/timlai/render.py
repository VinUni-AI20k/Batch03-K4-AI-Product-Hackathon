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


KHONG_CO_LINK = "⚠️ Tin này không chứa link nào — chỉ có nội dung. Mở tin gốc để xem."
TOI_DA_LINK = 3          # một tin dán 10 link thì cắt bớt, đừng vỡ field 1024 ký tự


def _dong_nguon(tin: TinNhan, da_chon: list[str] | tuple[str, ...] = ()) -> str:
    """Một tin nguồn -> khối text: LINK THẬT trước, rồi mới tới tin gốc.

    Link bóc từ `noi_dung` đã lưu trong index (`TinNhan.cac_link`), không phải từ
    chữ model viết ra — đó là điều kiện để cái link này đáng tin. Vẫn kèm jump_url
    để học viên tự mở tin gốc mà kiểm (nguyên tắc G11 ở spec §4b).

    `da_chon` là link model đã chọn và code đã đối chiếu xong. Nó tồn tại vì một
    tin thường chứa nhiều link: một tin liệt kê link nộp CP1..CP5 mà user hỏi CP5
    thì đổ cả 5 link ra là vô dụng — tệ hơn nữa, cắt còn 3 link đầu thì mất đúng
    cái user cần. Có link đã chọn thì chỉ hiện link đó.
    """
    tat_ca = tin.cac_link()
    loc = [u for u in tat_ca if u in da_chon]

    if loc:
        phan = [f"🔗 {u}" for u in loc]
        con = len(tat_ca) - len(loc)
        if con:
            # Vẫn nói cho user biết tin gốc còn link khác — nhỡ bot chọn nhầm cái.
            phan.append(f"_(tin gốc còn {con} link khác)_")
    elif tat_ca:
        # Model không chọn được link nào -> đổ ra, nhưng có trần để khỏi vỡ field.
        phan = [f"🔗 {u}" for u in tat_ca[:TOI_DA_LINK]]
        if len(tat_ca) > TOI_DA_LINK:
            phan.append(f"…và {len(tat_ca) - TOI_DA_LINK} link nữa trong tin gốc")
    else:
        # G4: tin được chọn nhưng không có link nào. Nói thẳng, đừng để học viên
        # tưởng bot đưa link rồi bấm vào tên kênh.
        phan = [KHONG_CO_LINK]

    ngay = tin.ngay_ngan()
    phan.append(f"↪ [#{tin.kenh} · {tin.tac_gia}{' · ' + ngay if ngay else ''}]({tin.url})")
    if (cb := canh_bao_cu(tin)) :
        phan.append(f"⚠️ {cb}")
    return "\n".join(phan)


def thanh_text(kq: KetQua, nguon: list[TinNhan]) -> str:
    """Bản text thuần — dùng cho test và cho scripts/chay_eval.py."""
    phan = [kq.cau_tra_loi]
    if kq.can_lam_ro:
        phan.append(f"❓ {kq.can_lam_ro}")
    for tin in nguon:
        phan.append(_dong_nguon(tin, kq.link_chon))
    return "\n".join(phan)


def chon_nguon(kq: KetQua, ung_vien: list[TinNhan]) -> list[TinNhan]:
    """Lấy đúng các TinNhan mà AI đã neo, giữ nguyên thứ tự AI chọn.

    G3 — từ chối thì không được trích nguồn. Một embed tiêu đề "Không tìm thấy"
    hoặc "Ngoài phạm vi" mà bên dưới vẫn liệt kê link là tự mâu thuẫn: học viên
    đọc lướt sẽ bấm vào link và tưởng đó là câu trả lời. Ngoại lệ duy nhất là khi
    bot đang HỎI LẠI (can_lam_ro) — lúc đó danh sách link chính là các lựa chọn.
    """
    if kq.ngoai_pham_vi or (not kq.tim_thay and not kq.can_lam_ro):
        return []
    theo_id = {t.id: t for t in ung_vien}
    return [theo_id[i] for i in kq.message_ids if i in theo_id]


def embed_loi(loi: Exception):
    """G7 — gọi AI hỏng thì nói cho user biết, đừng im lặng.

    Hay gặp nhất là 429 hết hạn mức free tier (20 lời gọi/ngày/model). Không im
    lặng, cũng không đổ nguyên traceback ra kênh chung — chỉ tên lỗi + một dòng.
    """
    import discord

    return discord.Embed(
        title="Mình đang không trả lời được",
        description=(
            "Lời gọi AI thất bại — có thể hết hạn mức trong ngày hoặc mạng lỗi. "
            "Bạn thử lại sau vài phút nhé.\n"
            f"`{type(loi).__name__}: {str(loi)[:150]}`"
        ),
        color=MAU["fail"],
    )


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
            name="🔗 Link",
            value="\n".join(_dong_nguon(t, kq.link_chon) for t in nguon)[:1024],
            inline=False,
        )

    if bo_di:
        # Không che số đo hallucination — hiện luôn cho người dùng và cho giám khảo.
        e.set_footer(text=f"Đã bỏ {len(bo_di)} kết luận không neo được vào tin nhắn thật.")
    return e
