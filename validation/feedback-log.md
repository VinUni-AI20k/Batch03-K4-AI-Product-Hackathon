# Feedback Log — Vòng validation với user thật

> Format theo `02-guide.md` §4.2: mỗi người thử 1 dòng, quote nguyên văn + tên/vai. Task/quan sát
> chi tiết dưới đây **cần nhóm bổ sung** (chỉ mới có quote tổng hợp, chưa có log quan sát "họ bấm gì,
> kẹt đâu" theo đúng scaffold — xem TODO cuối file).

## Bảng log

| Người thử (tên/vai) | Willing user (CP1)? | Task giao | Quan sát (bấm gì, kẹt đâu) | Quote nguyên văn | Mức nghiêm trọng |
|---|---|---|---|---|---|
| Hoàng Thị Thuyên | *(cần xác nhận)* | *(TODO — chưa log task cụ thể đã giao)* | *(TODO)* | "Ý tưởng hay, học bằng animation và chatbot dễ hiểu hơn nhiều." | Thấp (khen chung, chưa chỉ ra chỗ khó) |
| Dương Tiến Dũng | *(cần xác nhận)* | *(TODO)* | *(TODO)* | "Tính năng AI tự tạo outline và quiz khá hữu ích cho việc ôn tập." | Thấp |
| Đặng Quang Trung | *(cần xác nhận)* | *(TODO)* | Đã xác nhận với nhóm (2026-07-31): tại thời điểm test, tính năng này mới ở dạng **ý tưởng/mô tả bằng lời (chưa có code)** — Trung phản hồi trên concept, không phải trên prototype chạy thật | "Chatbot trả lời theo từng Section giúp tìm kiến thức nhanh hơn." | Trung bình — cần build thật trước demo nếu muốn giữ non-goal này thành tính năng chính thức, xem TODO cuối file |
| Phạm Thanh Hưng | *(cần xác nhận)* | *(TODO)* | *(TODO)* | "Mind Map và Outline giúp mình nắm được cấu trúc bài học rất nhanh." | Thấp |
| Trương Công Cường | *(cần xác nhận)* | *(TODO)* | *(TODO)* | "Nếu tích hợp vào VLearn thật thì sẽ hỗ trợ việc tự học hiệu quả hơn." | Thấp (feedback định hướng dài hạn, không phải lỗi cần sửa ngay) |

## Tổng hợp (bắt buộc theo scaffold guide §4.2)

- **Chủ đề lặp nhiều nhất:** Cả 5 người đều phản hồi tích cực về việc *đa dạng hoá định dạng ôn tập* (outline/mindmap/animation/quiz) giúp nắm bài nhanh hơn so với đọc tài liệu gốc — khớp đúng pain đã đo ở `spec.md` §1.
- **1-2 thay đổi làm trước demo (từ feedback này):**
  1. Bổ sung **Mind Map và Animation hiển thị trực tiếp trong Outline** (không phải nhấn thêm bước mới xem) — phản hồi Phạm Thanh Hưng, Hoàng Thị Thuyên.
  2. **Chatbot trả lời theo từng Section** thay vì toàn bộ tài liệu, để tăng độ chính xác — phản hồi Đặng Quang Trung. ⚠️ **Cần đối chiếu với code:** hiện `app/agents/` chưa có endpoint chatbot hỏi-đáp theo Section (chỉ có `debate_agent.py` — chế độ thảo luận nhóm). Nếu đây là tính năng mới đã/đang thêm sau feedback, cần cập nhật lại `spec.md` §4 (bỏ dòng "Non-goal #1") và bổ sung agent + endpoint tương ứng trước khi ghi là "đã sửa" — nếu chưa build xong, ghi rõ trong slide demo là "đang làm" chứ không phải "đã xong", tránh bị trừ điểm R5 (khai báo không khớp thực tế).
  3. Bổ sung **Quiz sau mỗi bài học + Completion Screen** hiển thị điểm/tiến độ — phản hồi Dương Tiến Dũng (gián tiếp, qua nhu cầu ôn tập).
- **Giữ nguyên có lý do:** Automation mức "Automate" cho outline/slide/quiz/mindmap/animation — không có phản hồi nào đòi hỏi bước duyệt thủ công trước khi xem, giữ nguyên theo cost-of-error đã phân tích ở `spec.md` §4.
- **Đưa vào backlog:** Tích hợp thẳng vào VLearn production (Trương Công Cường) — ngoài phạm vi lát cắt sự kiện, ghi backlog.

## TODO trước khi tính đủ điểm R6 (8đ)

1. **Log lại "willing user" từ CP1** — rubric yêu cầu ≥2/5 người thử là willing user đã khai tên ở CP1 Canvas; xác nhận 5 người trên có nằm trong danh sách đó không (đối chiếu `spec.md` §8).
2. **Bổ sung cột Task/Quan sát thật** — hiện chỉ có quote tổng hợp, chưa có "task giao là gì, họ bấm gì, kẹt ở đâu" theo đúng phiên 10 phút/người ở guide §4.2. Không có quan sát cụ thể thì log này mới tính là *lời khen*, chưa đủ chuẩn *validation*.
3. **Xác nhận trạng thái thật của "chatbot trả lời theo Section"** trước khi cập nhật `spec.md` §4 — xem ghi chú ⚠️ ở trên.
4. Ghi rõ **vai trò** của từng người thử (học viên khoá nào, có phải willing user hay là "user thật ngoài nhóm" khác) — rubric R6 yêu cầu ≥5 người **ngoài nhóm**.
