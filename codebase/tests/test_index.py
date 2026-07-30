"""Lớp ② — retrieval. Đây là chỗ hỏng âm thầm nhất: FTS5 không trả ra tin nhắn
đúng thì sửa prompt bao nhiêu cũng vô ích."""

from timlai import index


def test_tim_duoc_theo_tu_khoa(db):
    kq = index.truy_xuat(db, "slide buổi 5")
    assert kq, "phải tìm ra ít nhất 1 ứng viên"
    assert kq[0].id == "1001"


def test_khong_dau_van_khop(db):
    """Khảo sát cho thấy học viên gõ không dấu rất nhiều ("slie buoi 5").
    unicode61 remove_diacritics 2 phải xử lý được."""
    kq = index.truy_xuat(db, "slide buoi 5")
    assert any(t.id == "1001" for t in kq)


def test_ky_tu_dac_biet_khong_lam_sap(db):
    """Input người dùng chứa toán tử FTS5 (" ( ) * : -) sẽ ném
    sqlite3.OperationalError nếu nối thẳng vào MATCH. _cau_truy_van phải bọc."""
    for cau in ['link slide "buổi 5"?', "slide (buổi 5)", "slide * buổi", "a:b -c", "link??"]:
        index.truy_xuat(db, cau)   # không được raise


def test_cau_rong_tra_ve_rong(db):
    assert index.truy_xuat(db, "") == []
    assert index.truy_xuat(db, "???") == []


def test_index_lai_khong_nhan_ban(db, tin_mau):
    """backfill.py chạy 2 lần không được làm phình index."""
    truoc = index.dem(db)
    index.them_nhieu(db, tin_mau)
    assert index.dem(db) == truoc


def test_khop_ten_file_dinh_kem(db):
    """84% người khảo sát tìm SLIDE, mà slide thường là file .pdf đính kèm chứ
    không phải URL trong text. Không index tên file là mất phần lớn kết quả."""
    kq = index.truy_xuat(db, "day05.pdf")
    assert any(t.id == "1001" for t in kq)


def test_uu_tien_moi_hon_khi_diem_bang_nhau(db):
    """④ Đặc thù domain: tin cũ đã bị thay nguy hiểm hơn không trả lời."""
    kq = index.truy_xuat(db, "slide buổi")
    thoi_diem = [t.thoi_diem for t in kq]
    assert thoi_diem == sorted(thoi_diem, reverse=True) or len(kq) < 2
