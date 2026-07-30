# Reflection cá nhân — Trần Đức Bảo

- **Họ và tên:** Trần Đức Bảo
- **Mã học viên:** 2A202601472
- **Vai trò trong nhóm 5tuat:** Prompt Engineering & Eval Lead (Rubric R4 — Kiểm thử)
- **Trạng thái file:** Đang cập nhật — đây là bản ghi theo tiến độ thực tế, sẽ bổ sung tiếp mỗi khi hoàn thành thêm việc (không viết lại từ đầu).

---

## 1. Phần việc phụ trách

- Viết **Prompt A** — sinh 3 câu hỏi tình huống bám sát transcript bài giảng, bắt buộc đính kèm mã trích dẫn `[Txx-xxx]`, từ chối bịa thêm nội dung khi transcript không đủ.
- Viết **Prompt B** — chấm câu trả lời tự luận của học viên, kiểm tra theo đúng thứ tự 4 lớp chỗ khó (① nguồn sự thật → ② mơ hồ/thiếu thông tin → ③ ngoài phạm vi → ④ đặc thù domain), trả về verdict + misconception + citation có cấu trúc JSON.
- Test tay 5 case (đóng vai model bằng Claude) trước khi nối API thật, gồm 1 case stress-test chống bịa nguồn (hỏi thông tin ngoài phạm vi bài giảng) — đây là case tôi coi là quan trọng nhất vì đúng lớp ① rủi ro cao nhất khi demo.
- Đối chiếu `eval/golden_set.json` với transcript gốc trong `data/vlearn-pack/transcript/` và phát hiện chính golden set (bộ chuẩn dùng để chấm AI có bịa nguồn hay không) đang bịa/trích sai nguồn — đã sửa 4/4 mã trích dẫn sai (v1.0 → v1.1), ghi changelog ngay trong file.
- Đang mở rộng golden set theo hướng Day 01 (đã chốt cùng nhóm) và chuẩn bị chạy trọn bộ qua Gemini API để ghi bảng kết quả thật vào `spec.md` §7.

## 2. AI hỗ trợ thế nào trong quá trình làm việc

- Dùng Claude để đóng vai "model" chạy thử Prompt A/B trước khi có API key thật, giúp phát hiện sớm các lỗ hổng của prompt (ví dụ: cần thêm ràng buộc "không thêm số liệu ngoài transcript khi giải thích feedback") mà không tốn quota API.
- Dùng AI để rà từng mã trích dẫn `[Txx-xxx]` trong golden set và trong `codebase/index.html` đối chiếu trực tiếp với nội dung transcript gốc — việc mà nếu đọc tay từng file rất dễ bỏ sót vì mã trích dẫn "nhìn có vẻ hợp lệ" nhưng không có nghĩa là đúng nội dung.

## 3. Bài học lớn nhất từ case fail của nhóm

- **Case fail:** Golden set v1.0 (bộ chuẩn để chấm AI Tutor có bịa nguồn hay không) tự nó lại chứa 4 mã trích dẫn sai — 2 mã không tồn tại trong transcript (`T02-045`, `T02-088`), 2 mã tồn tại nhưng nội dung không khớp case. Cùng lỗi này cũng xuất hiện ở 2 slide demo trong `codebase/index.html` (`[T01-022]`/`[T01-023]` gắn cho nội dung Self-Attention/scaling trong khi transcript thật ở 2 mã đó nói về việc học viên đổi công cụ AI).
- **Bài học rút ra:** Không thể tin một trích dẫn chỉ vì nó *đúng định dạng* `[Txx-xxx]` — phải tự đối chiếu ngược lại với nguồn gốc (transcript thật) trước khi coi là bằng chứng, kể cả khi trích dẫn đó nằm trong chính bộ dữ liệu "chuẩn" hoặc trong bản demo đã có vẻ hoàn thiện. Đây đúng là lớp chỗ khó ① mà cả spec cam kết phòng tránh, nên nếu không tự kiểm tra kỹ phần eval của mình thì rủi ro bịa nguồn sẽ lọt ngay vào chỗ được cho là "chuẩn để chấm" — hỏng cả hệ quy chiếu của R4.

## 4. Việc còn lại (cập nhật tiếp khi xong)

- [ ] Mở rộng `eval/golden_set.json` lên ≥20 case theo Day 01: ≥2 case/lớp (①②③④), 8-10 case thường + 2-4 case hiếm.
- [ ] Bổ sung ≥10 case lấy/phát triển từ `chat_history_anonymized_for_hackathon.csv` thật.
- [ ] Viết định nghĩa kiểm chứng được cho từng chiều chất lượng (để người ngoài nhóm chấm ra cùng kết quả).
- [ ] Chạy trọn bộ golden set qua Gemini API thật, ghi bảng kết quả %, đối chiếu quality bar ≥85% trong `spec.md` §7, phân tích nguyên nhân case chưa đạt.
