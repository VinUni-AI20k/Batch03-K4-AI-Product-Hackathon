# Phương pháp mining chatlog

## Mục tiêu

Kiểm tra mức độ xuất hiện của nhu cầu tổng hợp xuyên tài liệu, hỏi xuyên ngày và
đứt mạch ngữ cảnh. Không dùng phép lọc keyword đơn thuần làm kết luận cuối.

## Đơn vị và phạm vi

- Đơn vị đếm: một student turn.
- Phạm vi dự kiến: toàn bộ 1.261 student turns trong data pack.
- Không copy nguyên data pack vào repo nộp.

## Codebook

| Nhãn | Điều kiện đưa vào | Điều kiện loại |
|---|---|---|
| `WHOLE_LESSON` | User muốn tổng hợp toàn bài/buổi/deck | Chỉ giải thích một đoạn/trang |
| `CROSS_DAY` | Câu hỏi cần dùng nguồn thuộc ngày khác ngày hiện tại | Tên “Day 1” chỉ xuất hiện trong đoạn được chọn |
| `CONTEXT_BREAK` | User phải nhắc lại/sửa phạm vi hoặc tutor nói thiếu ngữ cảnh | Tutor hỏi gợi mở về nội dung học |
| `LONG_CONTEXT_RISK` | Hội thoại ≥6 turn hoặc input token tăng mạnh | Không diễn giải thành lỗi nếu turn vẫn completed |

## Quy trình

1. Hai người đọc độc lập 50 mẫu đầu và gán nhãn.
2. So sánh, thảo luận mọi mẫu lệch và sửa codebook.
3. Dùng rule/keyword tạo candidate set trên toàn bộ dữ liệu.
4. Một người audit toàn bộ candidate; người thứ hai audit ngẫu nhiên ≥20%.
5. Ghi số đếm, denominator, tỷ lệ và mã turn minh họa.
6. Báo riêng “quan sát được” và “giả thuyết cần khảo sát”.

## Giới hạn

Data pack chỉ chứa turn `completed`; không được dùng nó để khẳng định trực tiếp
rằng hệ thống đã báo lỗi hoặc dừng trả lời.

