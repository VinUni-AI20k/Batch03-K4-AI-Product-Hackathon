---
name: nhat-ky-loi-sai
description: >
  Nhật ký lỗi sai: ghi lại và phân loại các lỗi học viên mắc khi làm quiz/vấn đáp,
  định kỳ lôi ra ôn đúng chỗ hay sai. Dùng khi học viên vừa làm sai bài, muốn xem
  "mình hay sai chỗ nào", ôn lại lỗi cũ trước giờ thi, hoặc sau mỗi lần quiz có câu sai.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Nhật ký lỗi sai

Cơ sở: error analysis — lỗi được gọi tên và hiểu nguyên nhân thì gần như không lặp lại; lỗi bỏ qua thì lặp mãi.

## Quy trình ghi (sau quiz/vấn đáp có câu sai)
- [ ] 1. Với MỖI câu sai: xác định loại lỗi — (a) chưa học tới, (b) hiểu nhầm khái niệm,
      (c) nhầm giữa 2 thứ giống nhau, (d) bất cẩn.
- [ ] 2. `update_student_memory` ghi ngắn gọn: "LỖI [loại]: <mô tả> — bài <tên>, khái niệm [[x]]".
- [ ] 3. Với lỗi loại (b)/(c): giải thích lại đúng bản chất ngay lúc đó, trích nguồn slide.

## Quy trình ôn (khi học viên hỏi "mình hay sai gì" / trước giờ thi)
- [ ] 1. Đọc hồ sơ học viên, gom các dòng LỖI; `search_sessions` bổ sung nếu cần.
- [ ] 2. Nhóm theo khái niệm; chỉ ra pattern ("3/5 lỗi của bạn là nhầm X với Y").
- [ ] 3. Ra 3–5 câu hỏi MỚI nhắm đúng các lỗi cũ (không lặp nguyên văn câu đã hỏi).
- [ ] 4. Trả lời đúng hết → ghi nhận "đã khắc phục" vào hồ sơ.

## Lưu ý
- Giọng điệu: lỗi là dữ liệu quý, không phải thất bại. Không liệt kê lỗi để chì chiết.
