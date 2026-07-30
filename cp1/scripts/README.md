# Phương pháp đếm — kiểm lại được

Chuẩn B của R1 đòi *"phương pháp đếm kiểm lại được"*. Thư mục này là phần đó.

```
python cp1/scripts/verify.py
```

Một lệnh, in ra **mọi con số** được trích trong `canvas.md` và `impact-table.md`. Không cần cài gì ngoài Python 3.7+ (chỉ dùng thư viện chuẩn).

## Số nào ra từ mục nào

| Mục in ra | Con số | Được trích ở |
|---|---|---|
| §0 | 1.261 turn · 369 user · 585 hội thoại · 46,2% không citation | canvas mục 4 · impact-table |
| §1 | 13,6% (bộ hẹp) và 23,2% (bộ rộng) | canvas mục 4 · giới hạn #2 |
| §2 | **21,1% vs 2,0%** + phân tích độ dài đoạn bôi đen | canvas mục 4 (a) — bằng chứng chính |
| §3 | **55%** ca thất bại nằm trên trang đã chứng minh có text | impact-table "Trigger xác định" |
| §4 | cả bộ 67 lượt / 53 user · một trang 23 lượt / 61% fail | canvas mục 4 (b) |
| §5 | bao nhiêu người × tần suất cho 5 ứng viên | impact-table "Bảng impact" |
| §6 | hai giả thuyết đã kiểm và không đứng vững | impact-table "Giới hạn bằng chứng" #3, #4 |
| §8 | **"tốn gì mỗi lần"** — 62,5% không được trả lời · 49% là câu cuối trong ngày · 92,9% không mở hội thoại khác | canvas mục 3 (hậu quả) · impact-table cột "tốn gì mỗi lần" |
| §7 | quota — 3 cặp (user, ngày) vượt 15, cao nhất 30 | impact-table #7 |

## Quy tắc đếm (phần cần soi kỹ)

Toàn bộ quy tắc nằm ở đầu `verify.py` dưới dạng regex có chú thích. Hai điểm quan trọng:

**Bộ HẸP vs bộ RỘNG.** Bộ hẹp chỉ giữ tín hiệu không-truy-xuất-được (`không tìm thấy`, `không thể truy cập`...). Bộ rộng thêm các cách nói khác (`rất tiếc`, `không đề cập`...) nên bắt được nhiều ca hơn **nhưng có false positive** — có câu trả lời thật chứa chữ "rất tiếc" ở phần rào trước. Spec ghi **biên dưới 13,6%** và nói rõ con số thật nằm giữa hai biên. Ca `T0176` là bằng chứng bộ hẹp còn bỏ sót.

**"Có bôi đen" xác định thế nào.** Tin nhắn học viên có dạng `(Trang N, đoạn được chọn: "X")` + câu gõ. Nếu `X` **trùng** câu gõ → UI echo lại câu hỏi, tức học viên **không bôi đen thật**. Nếu `X` **khác** → có bôi đen và text slide được truyền vào context. Đây là cơ sở của con số 21,1% vs 2,0%.

## Giới hạn cần biết trước khi trích

- **Rating rất thưa:** chỉ 70/2.522 tin nhắn có rating (2,8%). Mọi tỷ lệ 👎 đứng trên 70 điểm dữ liệu. So sánh **giữa các nhóm** đáng tin hơn từng số lẻ, vì thiên lệch "ai rate thường là người bực" áp đều cho mọi nhóm.
- **Cột `total_cost_usd` luôn = 0** — không dùng được để phân tích chi phí (data dictionary đã cảnh báo).
- **"Tốn gì mỗi lần" không có trong data.** Chatlog cho biết học viên bấm 👎, không cho biết họ mất bao nhiêu phút. Ô đó lấy từ vòng hỏi 10 người (`../khao-sat.md`).

## Sử dụng các script

### Main script — Verification Report
```bash
python verify.py
```
Chạy full report của tất cả metrics. Output in ra terminal với tất cả các con số.

### Thêm các script hỗ trợ

1. **analyze_revised.py** — Phân tích chi tiết hơn
   - Dùng citations column để phát hiện khi tutor có/không có content
   - Export kết quả ra `analysis_revised.json`
   
2. **analyze_chatlog.py** — Toàn phần phân tích đầy đủ
   - Phân tích ratings, select patterns, failure rates
   - Đầu ra chi tiết 15 examples
   
3. **inspect_patterns.py** — Inspection thấp cấp
   - Kiểm tra quote patterns, trang markers
   - Xem sample messages thực tế
   - Phân tích citations column
   
4. **visualize_report.py** — Tạo HTML report
   - Output: `analysis_report.html` (mở bằng browser)
   - Tóm tắt tất cả metrics dạng visual

### Chạy tất cả trong một lần
```bash
python verify.py                    # View in terminal
python analyze_revised.py           # Get JSON export  
python visualize_report.py          # Generate HTML report
```

## Bảo mật

Script đọc data pack tại `data/vlearn-pack/`. Theo README gốc mục "Bảo mật dữ liệu được cung cấp" điều 3: **không commit data pack vào repo nộp bài** — spec chỉ trích mã turn (`T0769`) và con số.
