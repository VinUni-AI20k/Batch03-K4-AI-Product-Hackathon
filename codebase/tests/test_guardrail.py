"""Bảy guardrail — mỗi cái một test, và mỗi test mô tả đúng thứ nó chặn.

Guardrail nằm ở tầng CODE nên test được offline, không cần API key, không tốn
token. Đây là điểm khác nhau giữa "chống bịa bằng prompt" và "chống bịa bằng
code": cái sau kiểm chứng được bằng pytest.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from timlai import render  # noqa: E402
from timlai.index import TinNhan, boc_url  # noqa: E402
from timlai.tra_cuu import GO_BO_URL, KetQua, neo  # noqa: E402


def _kq(**doi) -> KetQua:
    mac_dinh = dict(
        tim_thay=True, ngoai_pham_vi=False, cau_tra_loi="Đây là slide buổi 5.",
        message_ids=["1001"], do_tin_cay="cao", can_lam_ro=None,
    )
    return KetQua(**{**mac_dinh, **doi})


# Tin nhắn thật kiểu hay gặp nhất trong kênh thông báo: một tin, năm link.
CP = TinNhan(
    id="3001", kenh="ly-thuyet-k3", tac_gia="Văn Thái", thoi_diem="2026-07-30T09:00",
    url="https://discord.com/channels/1/2/3001",
    noi_dung=(
        "CP1: Team và chủ đề lựa chọn: https://forms.gle/dfrSZit7DnyEhAM37\n"
        "CP2: Show Flow/ HTML thể hiện giải pháp: https://forms.gle/Y9sVoXPNWSFQe3tt7\n"
        "CP3: Đánh giá sản phẩm: https://forms.gle/A9CHAkxsXTBveDMp6\n"
        "CP4: Rà soát Specification: https://forms.gle/WHKtkSNcHquLFoJt5\n"
        "CP5: Mốc cuối trước khi Demo: https://forms.gle/xoroSTFV9WtPG1CfA"
    ),
)
LINK_CP5 = "https://forms.gle/xoroSTFV9WtPG1CfA"
LINK_CP1 = "https://forms.gle/dfrSZit7DnyEhAM37"


# ── G1 · link lấy từ DB, không lấy từ chữ model viết ──────────────────


def test_g1_boc_dung_link_trong_tin_nhan(tin_mau):
    assert tin_mau[0].cac_link() == ["https://drive.google.com/file/d/b5"]


def test_g1_bo_dau_cau_dinh_duoi_url():
    # "…/lab2." — dấu chấm cuối câu không phải một phần của URL.
    assert boc_url("Link đây: https://codelabs.vn/lab2.") == ["https://codelabs.vn/lab2"]


def test_g1_render_hien_link_that_truoc_tin_goc(tin_mau):
    text = render.thanh_text(_kq(), [tin_mau[0]])
    assert "🔗 https://drive.google.com/file/d/b5" in text
    assert tin_mau[0].url in text          # vẫn kèm jump_url để user tự kiểm


# ── G2 · URL bịa trong văn bản trả lời bị gỡ ──────────────────────────


def test_g2_go_url_bia_trong_cau_tra_loi(tin_mau):
    """Model neo ĐÚNG id nhưng vẫn gõ thêm một URL bịa vào giữa câu.

    Đây chính là link học viên sẽ copy. neo() theo message_id không chặn được nó —
    phải quét cả văn bản.
    """
    kq, bo_di = neo(
        _kq(cau_tra_loi="Slide đây nhé: https://drive.google.com/file/d/BIA-DAT"),
        tin_mau,
    )
    assert "BIA-DAT" not in kq.cau_tra_loi
    assert GO_BO_URL in kq.cau_tra_loi
    assert "https://drive.google.com/file/d/BIA-DAT" in bo_di   # phải ĐẾM, không nuốt


def test_g2_giu_nguyen_url_co_that(tin_mau):
    that = "https://drive.google.com/file/d/b5"
    kq, bo_di = neo(_kq(cau_tra_loi=f"Slide buổi 5: {that}"), tin_mau)
    assert that in kq.cau_tra_loi
    assert bo_di == []


def test_g2_url_lech_mot_ky_tu_van_bi_go(tin_mau):
    # Fail closed: thà mất một link đúng còn hơn đưa một link sai.
    kq, _ = neo(_kq(cau_tra_loi="https://drive.google.com/file/d/b55"), tin_mau)
    assert "b55" not in kq.cau_tra_loi


# ── G3 · từ chối thì không trích nguồn ────────────────────────────────


def test_g3_ngoai_pham_vi_khong_kem_nguon(tin_mau):
    kq = _kq(ngoai_pham_vi=True, tim_thay=False, cau_tra_loi="Mình chỉ tìm link thôi.")
    assert render.chon_nguon(kq, tin_mau) == []


def test_g3_khong_tim_thay_khong_kem_nguon(tin_mau):
    kq = _kq(tim_thay=False, cau_tra_loi="Không tìm thấy.")
    assert render.chon_nguon(kq, tin_mau) == []


def test_g3_hoi_lai_thi_van_duoc_liet_ke_lua_chon(tin_mau):
    # Ngoại lệ: đang hỏi lại thì danh sách link CHÍNH LÀ các lựa chọn cho user.
    kq = _kq(tim_thay=False, can_lam_ro="Bạn cần buổi mấy?", do_tin_cay="thap")
    assert len(render.chon_nguon(kq, tin_mau)) == 1


# ── G4 · tin nguồn không có link thì nói thẳng ────────────────────────


def test_g4_tin_khong_co_link_bao_ro():
    tin = TinNhan(
        id="2001", kenh="thong-bao", tac_gia="LabCoach", thoi_diem="2026-07-30T10:00",
        url="https://discord.com/channels/1/2/2001",
        noi_dung="Mai lớp học bù nhé cả nhà",
    )
    text = render.thanh_text(_kq(message_ids=["2001"]), [tin])
    assert render.KHONG_CO_LINK in text


# ── G7 · gọi AI hỏng thì nói ra, không im lặng ────────────────────────


# ── G8 · một tin nhiều link -> chỉ trả ĐÚNG link được hỏi ─────────────


def test_g8_chi_hien_link_da_chon():
    """Tin liệt kê CP1..CP5, user hỏi CP5 -> output chỉ được có link CP5.

    Bug 31/07: render đổ 3 link ĐẦU TIÊN của tin rồi cắt — mất đúng link CP5 mà
    user cần, dù model đã nói đúng "đây là link CP5" trong câu trả lời.
    """
    kq = _kq(message_ids=["3001"], link_chon=[LINK_CP5],
             cau_tra_loi="Đây là link nộp Checkpoint 5.")
    text = render.thanh_text(kq, [CP])
    assert LINK_CP5 in text
    assert LINK_CP1 not in text
    assert text.count("🔗") == 1


def test_g8_van_bao_tin_goc_con_link_khac():
    kq = _kq(message_ids=["3001"], link_chon=[LINK_CP5])
    assert "còn 4 link khác" in render.thanh_text(kq, [CP])


def test_g8_khong_chon_duoc_thi_do_ra_co_tran():
    # Model để link_chon rỗng -> quay về hành vi cũ, nhưng phải nói rõ còn bao nhiêu.
    text = render.thanh_text(_kq(message_ids=["3001"], link_chon=[]), [CP])
    assert text.count("🔗") == render.TOI_DA_LINK
    assert "và 2 link nữa" in text


def test_g8_link_chon_bia_bi_go():
    # Model "chọn" một link không có trong tin -> gỡ, đếm vào số đo bịa.
    kq, bo_di = neo(
        _kq(message_ids=["3001"], link_chon=["https://forms.gle/KHONG-CO-THAT"]), [CP]
    )
    assert kq.link_chon == []
    assert "https://forms.gle/KHONG-CO-THAT" in bo_di


def test_g8_link_chon_dung_thi_giu():
    kq, bo_di = neo(_kq(message_ids=["3001"], link_chon=[LINK_CP5]), [CP])
    assert kq.link_chon == [LINK_CP5]
    assert bo_di == []


def test_g8_link_thuoc_tin_khong_duoc_neo_thi_go(tin_mau):
    # Link có thật, nhưng nằm ở tin KHÁC với tin đã neo -> vẫn gỡ.
    kq, bo_di = neo(
        _kq(message_ids=["1001"], link_chon=["https://codelabs.aithucchien.vn/lab2"]),
        tin_mau,
    )
    assert kq.link_chon == []
    assert bo_di == ["https://codelabs.aithucchien.vn/lab2"]


# ── G7 · gọi AI hỏng thì nói ra, không im lặng ────────────────────────


def test_g7_loi_thanh_embed_doc_duoc():
    e = render.embed_loi(RuntimeError("429 RESOURCE_EXHAUSTED " + "x" * 500))
    assert "hết hạn mức" in e.description
    assert "RuntimeError" in e.description
    assert len(e.description) < 400        # không đổ nguyên traceback ra kênh chung
