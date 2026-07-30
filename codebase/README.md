# CP2 Mock — Quiz củng cố cuối buổi

## Chạy prototype

Không cần cài dependency. Tại thư mục gốc repo:

```bash
python3 -m http.server 8000 --directory codebase
```

Mở `http://localhost:8000`.

## Flow CP2

1. Nhấn **Làm quiz củng cố**.
2. Chọn đáp án cho 3 câu mock.
3. Nhấn **Nộp quiz**.
4. Xem điểm, nội dung cần ôn và practice credit tăng từ 7/20 lên 8/20 khi đạt ≥2/3.

## Phần mock và phần CP3

| Phần | CP2 | CP3 |
|---|---|---|
| Quiz, đáp án, feedback | Dữ liệu giả trong `app.js` | AI sinh từ đoạn học liệu hợp lệ |
| Chấm MCQ | Logic deterministic | Giữ nguyên |
| Credits 0–20 | State phía trình duyệt | Có thể tích hợp backend sau hackathon |
| AI call | Chưa có | Bắt buộc có ít nhất một call thật, log/trace lưu trong repo |

Không dùng API key, không dùng dữ liệu cá nhân và không dùng credit trong bài thi/kiểm tra chính thức.
