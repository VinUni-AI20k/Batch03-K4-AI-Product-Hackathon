# eval/ — Golden set + các lượt chạy

**Phụ trách:** Nguyễn Văn Trọng — `2A202601102` · **Hạn: CP3 · 10:30 N2**

Chấm ở [04-rubric.md](../04-rubric.md) **R4 · 15 điểm** — khối điểm lớn thứ hai của bài.

## Phải có gì

| File | Nội dung | Điểm |
|---|---|---|
| `golden-set.json` | ≥20 case: **≥2 case mỗi lớp chỗ khó** (①②③④ = 8 case) + 8-10 case thường + 2-4 case hiếm; **≥10 case từ chatlog thật** | 4 |
| `run-01.md`, `run-02.md`… | Một file mỗi lượt chạy trọn bộ. Bảng đủ **mọi** case kể cả fail, có %, đối chiếu quality bar. Chưa đạt thì phân tích nguyên nhân | 4 |

Hai mục còn lại của R4 nằm trong `spec.md` §7: định nghĩa từng chiều chất lượng (4 điểm) và quality bar bằng số (3 điểm).

## Nhịp lặp — guide §4.1

```
chạy trọn bộ → bảng % → chọn MỘT failure đau nhất → sửa → chạy lại TRỌN BỘ
```

Sửa prompt chỗ này vỡ chỗ kia là chuyện thường, nên **phải chạy lại trọn bộ**, không chạy lại mỗi case vừa sửa. Mỗi lượt một file, giữ cả lượt kém.

## Ba điều BTC cảnh báo — guide §4.1

1. **Golden set toàn case dễ** — TA kiểm độ phủ 4 lớp chỗ khó tại CP3.
2. **Chấm "đạt" theo cảm tính giữa chừng** — quay lại định nghĩa trong `spec.md` §7. Nếu định nghĩa chưa ổn thì sửa định nghĩa **và ghi vào Changelog §9**, không sửa cách chấm im lặng.
3. **Đổi quality bar khi thấy kết quả thấp** — bar chốt lúc 23:59 N1 là khoá. Không đạt mà phân tích được nguyên nhân thì **vẫn tính đủ điểm**; sửa số hoặc che số thì mất.

## Ràng buộc riêng của nhóm — đọc trước khi dựng case

Số trang trong chatlog là số trang **slide gốc** (tới trang 98). Slide trong data pack là **bản rút gọn 29 trang**. Chỉ `d2-slide-hackathon.pdf` có footer `DAY 02 · N / 83` để map trang gốc → trang rút gọn, và chỉ khoảng **20 lượt** chatlog vừa có `day_code` chỉ rõ Day 2 vừa có trang nằm trong map.

Nên case lấy từ chatlog **dùng lại hình dạng case** (gõ tự do về trang đang mở · xin tóm tắt cả bộ · trang không có nội dung), số trang chuyển sang hệ đánh số bản hackathon. **Trong mỗi file kết quả phải ghi rõ case nào verify trực tiếp được và case nào đã chuyển hệ trang** — đừng để nó âm thầm làm lệch % đối chiếu quality bar.

Chi tiết: [cp1/impact-table.md](../cp1/impact-table.md) mục "Giới hạn bằng chứng" #8.

## Bảo mật

Golden set ghi **mã turn / mã đoạn** (`T0769`, `[T03-042]`) thay vì dán nguyên văn dài — luật bảo mật data điều 3.
