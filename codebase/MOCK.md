# Codelab AI Co-Pilot — Ghi chú Mock & Real

## Phần THẬT (đã có lời gọi AI thật)

| Component | Trạng thái | Ghi chú |
|---|---|---|
| `getGeminiResponse()` trong `app.js` |  **Real AI call** | Gọi `gemini-2.0-flash` qua REST API với system prompt + conversation history |
| System prompt |  Real | Định nghĩa vai trò, ngữ cảnh khoá học, quy tắc trích dẫn [Txx-NNN] |
| Auto-detect lỗi Python |  Working | Phân tích code editor để detect NameError, NameError phổ biến |

## Phần MOCK (cần hoàn thiện lên CP3)

| Component | Trạng thái | Sẽ thay bằng gì |
|---|---|---|
| Giao diện Codelab |  Mock | UI giả lập, không kết nối VLearn thật |
| Dữ liệu transcript trong `KNOWLEDGE_BASE` |  Partial mock | Trích thật từ transcript khoá học, nhưng chỉ 6 entries — cần expand |
| Checkpoint timer |  Mock | Đồng hồ demo, không đồng bộ deadline thật |
| Tab utils.py |  Mock | Chưa có nội dung thật |
| "Chạy" code |  Simulated | Không chạy Python thật, chỉ show error message giả |

## Cách chạy Prototype

1. Mở file `index.html` trực tiếp trong trình duyệt (double-click)
2. Nhập Gemini API key để dùng AI thật, hoặc bấm "Dùng Mock"
3. Lấy key miễn phí tại: https://aistudio.google.com/

## Luồng chính (Happy Path — CP2)

```
Học viên thấy lỗi NameError: plt is not defined
  → Bấm quick-btn "Giải thích lỗi này"
  → AI Co-Pilot giải thích nguyên nhân
  → Hiển thị citation card [T02-015] từ transcript khoá học
  → Học viên hiểu và tự sửa import vào đầu file
  → Bấm "Chạy" → error biến mất
```

## Luồng lỗi đã xử lý (Edge Cases — CP3 prep)

| Tình huống | Xử lý |
|---|---|
| Câu hỏi ngoài phạm vi | Mock: "Mình chưa chắc phần này, hỏi TA nhé" |
| API key sai / hết quota | Hiện toast lỗi + fallback về mock |
| Code editor trống | Không gửi request |
| Kết nối mạng lỗi | Catch error + hiển thị message lỗi |
