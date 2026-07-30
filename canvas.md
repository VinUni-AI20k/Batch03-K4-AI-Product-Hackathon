# CP1 CANVAS — VLearn Learning Trace

**Tên đề tài:** VLearn Learning Trace — Bản đồ ôn tập cá nhân sau mỗi buổi học

| # | Thành phần | Nội dung |
|---:|---|---|
| 1 | **Hướng** | **Hướng A — VLearn · Tính năng AI mới.** Tạo learning trace cá nhân từ lịch sử tương tác với AI Tutor, thể hiện dưới hai dạng đồng bộ: personalized note và personalized mindmap. |
| 2 | **Job executor** | Học viên vừa kết thúc một buổi học trên VLearn và đã có một hoặc nhiều lượt trao đổi với AI Tutor trong buổi đó. |
| 3 | **Pain** | Sau mỗi buổi học, các câu hỏi và kiến thức học viên đã tìm hiểu đang nằm rời rạc trong lịch sử chat; học viên khó nhận ra mình đã tìm hiểu gì, phần nào có thể cần xem lại và nên ưu tiên ôn nội dung nào. |
| 4 | **Evidence ban đầu** | Data pack có **1.261 lượt hỏi–đáp của 369 học viên**, cho thấy lịch sử Tutor có lượng learning signal đủ lớn để khảo sát. Hai trường `misconceptions` và `follow_ups` luôn rỗng; chỉ có **3 lượt** Tutor đặt câu hỏi kiểm tra hiểu bài (`asked_check_question=True`). Hệ thống hiện chưa tạo learning trace hoặc kết quả kiểm tra hiểu bài có cấu trúc. Nguồn: `data/vlearn-pack/chatlog/DATA_DICTIONARY.md` và kết quả ghép dữ liệu theo `turn_id`. |
| 5 | **Lát cắt MỘT CÂU** | **Khi một học viên vừa kết thúc buổi học muốn biết mình nên ôn lại gì, hệ thống phân tích lịch sử hỏi–đáp để quyết định các chủ đề đã tìm hiểu và các điểm có khả năng chưa vững, rồi tạo note cùng mindmap có căn cứ để học viên xem lại, xác nhận và chỉnh sửa.** |
| 6 | **Automation + willing users** | **Conditional automation:** hệ thống tự sinh note/mindmap khi đủ log và nguồn chính thức; khi signal yếu thì ghi “chưa đủ dữ liệu”, không kết luận học viên hổng kiến thức. Lý do: suy luận sai có thể khiến học viên ôn sai trọng tâm và mất niềm tin, nên học viên phải được xem căn cứ, xác nhận, sửa hoặc gạt bỏ kết quả. **Willing users ngoài nhóm:** (1) `[BỔ SUNG TÊN]`; (2) `[BỔ SUNG TÊN]`; (3) `[BỔ SUNG TÊN]`. |
| 7 | **Phân công có tên** | **Trần Đại Nghĩa — Product Lead & Spec Owner:** Canvas, JTBD, scope, spec và demo script.<br>**Phó Hiếu Anh — Data & Evidence:** mining chatlog, khảo sát, bảng impact và evidence log.<br>**Nguyễn Xuân Đức — AI & Evaluation:** signal taxonomy, prompt, golden set và eval.<br>**Trần Tuấn Anh — Backend/Integration:** data pipeline, AI call, grounding, citation và trace.<br>**Hoàng Trọng Đại — UX/Frontend & Validation:** note/mindmap UI, bốn đường trải nghiệm, user test và feedback log. |

## Giới hạn phạm vi tại CP1

- Chưa phát triển quiz, chấm điểm hoặc xếp loại năng lực.
- Không kết luận học viên hổng kiến thức chỉ vì họ đặt câu hỏi hoặc Tutor trả lời không tốt.
- Không xây bản đồ lỗ hổng cấp lớp cho giảng viên trong lát cắt prototype hiện tại.
- Pain và hậu quả đối với học viên được kiểm chứng sơ bộ bằng mining và khảo sát; nhóm tiếp tục xác minh khả năng sử dụng prototype ở CP5.

## Bổ sung evidence khảo sát sau CP1

- **Nguồn:** khảo sát người học về lần gần nhất sử dụng AI Tutor; log ẩn danh tại `research/survey-log.csv`, tổng hợp tại `research/survey-summary.md`.
- **Số dòng hiện có:** 34. Nhóm cần kiểm tra lại export vì ban đầu ghi nhận khoảng 31 người; chỉ chốt một con số sau khi loại dòng test/trùng nếu có.
- **Tín hiệu pain chính:** 25/34 người từng muốn ôn lại nhưng khó xác định nên bắt đầu từ đâu; 20/34 gặp việc này trong ít nhất 2 buổi.
- **Hành vi hiện tại:** 10 người mở lại slide/tài liệu, 7 người dùng công cụ AI khác, 6 người không ôn lại; việc ôn tập đang bị phân tán.
- **Nhu cầu output:** các chủ đề đã tìm hiểu (17/34), phần có thể cần xem lại (15/34), giải thích ngắn và mindmap (mỗi loại 14/34).
- **Tác động đến quyết định:** giữ Personalized Note + mindmap theo ngày, citation và quyền xác nhận/chỉnh sửa trong CP2; quiz để backlog.
