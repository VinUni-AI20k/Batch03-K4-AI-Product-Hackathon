# Golden set — quyết định AI trung tâm: sinh MCQ từ transcript thật

**Quyết định được test:** `backend/app/pipeline/quiz_bank.py::generate_quiz()` — gọi OpenAI thật
(model `gpt-4o-mini`), sinh MCQ từ nội dung transcript đã lọc (chỉ lời giảng viên), gắn `section_id`
+ `segment_id` để trích dẫn.

## Cấu trúc — 22 case (`cases.py`)

| Nhóm | Số lượng | Nguồn |
|---|---|---|
| Case thường | 11 | Mỗi section thật trong `transcript-01-clean.md` (11 section, 79 đoạn thật) |
| Lớp ① Nguồn sự thật | 2 | Input rỗng / chỉ 1 đoạn cực ngắn |
| Lớp ② Mơ hồ | 2 | Section thật ngắn nhất (S4, 4 đoạn) yêu cầu quá nhiều câu / section không có đoạn nào |
| Lớp ③ Ngoài phạm vi | 2 | Nội dung hoàn toàn ngoài chủ đề (công thức nấu ăn) / yêu cầu 50 câu trên 6 đoạn thật |
| Lớp ④ Đặc thù domain | 2 | Section có số liệu cụ thể / section có tên framework dễ nhầm |
| Case hiếm | 3 | Nhiều section cùng lúc, kiểm tra lời học viên đã bị lọc, ngưỡng biên n=1 |

→ 14/22 case dùng trực tiếp nội dung thật từ `data/vlearn-pack/transcript/transcript-01-clean.md`
(vượt yêu cầu ≥10 case từ data thật).

## Định nghĩa "đạt" — kiểm chứng được, không cảm tính

Mỗi case được chấm tự động trên 2 chiều cứng + 1 chiều theo kỳ vọng riêng:

1. **Grounding** (pass/fail): mọi câu hỏi còn lại sau lọc phải có `segment_id` nằm trong đúng tập đoạn
   đã đưa vào — nếu model tự bịa `segment_id`/`section_id` không có thật, câu đó bị đếm là
   `hallucinated_*` và loại khỏi kết quả.
2. **Format hợp lệ** (pass/fail): đúng 4 lựa chọn, `correct_index` trong khoảng 0-3.
3. **Kỳ vọng riêng theo case** (xem cột "Kỳ vọng" trong `results-round1.md`) — ví dụ: input rỗng phải
   từ chối, input ít đoạn hơn số câu yêu cầu phải trả về ít câu hơn (không ép đủ số bằng cách bịa).

4 case ở lớp ③④ + 1 case hiếm (R1) được đánh dấu **cần chấm tay** thêm — bot không tự đánh giá được
ngữ nghĩa (đúng framework, đúng số liệu) chỉ bằng so khớp ID, cần người đọc xác nhận nội dung.

## Quality bar (chốt trước khi đo)

**Đạt khi ≥ 85% case qua được cả 3 chiều, VÀ 0 case ở lớp ①③ được phép fail vì lý do grounding**
(bịa nguồn ở đúng 2 lớp rủi ro cao nhất tuyệt đối không được chấp nhận, kể cả khi tỷ lệ tổng thể
vẫn qua bar).

## Cách chạy lại

```bash
cd backend && .venv/Scripts/pip install -r requirements.txt   # lần đầu
cd eval && ../backend/.venv/Scripts/python run_golden_set.py
```

Ghi đè `eval/results-round1.md` + `eval/results-round1.json`. Muốn giữ lịch sử nhiều lượt chạy,
đổi tên file trước khi chạy lại (`results-round2.md`, ...).
