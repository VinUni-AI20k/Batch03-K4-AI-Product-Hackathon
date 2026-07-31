---
name: thiet-lap-lan-dau
description: >
  Buổi gặp ĐẦU TIÊN với một học viên mới (hồ sơ trống) — giới thiệu bản thân, hỏi gọn
  để bắt đầu làm việc cá nhân hoá ngay: trình độ/mục tiêu học viên, có kiến thức nào cần
  cài không, muốn tự chỉnh tính cách (persona) không, và có muốn lịch nhắc/báo cáo đều
  đặn (hằng ngày/hằng tuần) không. BẮT BUỘC chạy khi hồ sơ học viên còn trống ("Học viên
  mới: ... — chưa có hồ sơ" trong context) — KHÔNG chạy lại khi đã có hồ sơ.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Gặp gỡ lần đầu — thiết lập nhanh

Mục tiêu: sau buổi này agent đủ dữ liệu để cá nhân hoá NGAY. Đây là một cuộc trò chuyện
tự nhiên, ngắn, TỪNG BƯỚC MỘT (đợi học viên trả lời rồi mới hỏi tiếp) — không phải bảng
câu hỏi dồn hết vào 1 tin nhắn, và không ép học viên trả lời đủ mọi mục.

## Quy trình

- [ ] 1. **Chào & giới thiệu ngắn** (2-3 câu, theo đúng giọng trong SOUL.md): bạn là ai,
      làm được gì (trả lời có trích nguồn từ tài liệu, quiz, flashcard ôn lặp lại, vẽ
      mindmap, lộ trình cá nhân hoá theo mức nắm vững). Đừng liệt kê hết mọi tính năng.
- [ ] 2. **Hồ sơ & mục tiêu** (BẮT BUỘC — bước duy nhất không được bỏ qua): hỏi gộp 1 câu
      tự nhiên — "bạn đang ở trình độ nào/đã biết gì rồi, và mục tiêu lần này là gì (thi
      gì, làm được gì, có deadline không)?" Trả lời xong -> `update_student_memory` ghi
      NGAY (trình độ + mục tiêu, 2-3 dòng). Bước này làm hồ sơ hết trống -> skill này sẽ
      không tự kích hoạt lại ở lượt sau, nên KHÔNG được bỏ qua.
- [ ] 3. **Kiến thức**: `list_knowledge_packs` xem có bộ nào khớp mục tiêu học viên vừa
      nói không. Có bộ khớp -> gợi ý ĐÚNG bộ đó (không liệt kê hết danh sách), hỏi có
      muốn cài; đồng ý mới `install_knowledge_pack`. Không có bộ nào khớp hoặc kho đã đủ
      -> bỏ qua bước này, đừng hỏi thừa.
- [ ] 4. **Tính cách (tuỳ chọn, hỏi NHẸ)**: `read_soul` xem hiện đang mặc định hay đã
      được cá nhân hoá. CHỈ hỏi nếu còn mặc định: "bạn muốn mình nói chuyện kiểu nào —
      thân thiện, nghiêm túc, hay hài hước?" Học viên trả lời -> soạn bản SOUL.md mới
      NGẮN theo đúng cấu trúc hiện có (Bạn là ai / Tính cách / Cách dạy / Giới hạn), GIỮ
      NGUYÊN các nguyên tắc cứng (thật thà, trích nguồn, không làm hộ bài thi) — xác nhận
      với học viên rồi mới `update_soul`. Học viên lướt qua/nói "mặc định cũng được" ->
      bỏ qua ngay, đừng ép.
- [ ] 5. **Nhịp làm việc (tuỳ chọn)**: hỏi "muốn mình chủ động nhắc bạn học không — mỗi
      ngày hay mỗi tuần?" Chọn hằng ngày -> `schedule_task` when='daily HH:MM' (giờ học
      viên nói; mặc định 07:30 nếu họ không nói giờ cụ thể). Chọn hằng tuần -> `schedule_task`
      when='weekly <thứ> HH:MM' với prompt gợi ý dùng skill tu-danh-gia-tuan (tự đánh giá
      cuối tuần). Không muốn -> nói có thể bật sau bất cứ lúc nào, không ép.
- [ ] 6. **Chốt**: tóm tắt 1 dòng những gì vừa thiết lập xong, mời học viên hỏi bài hoặc
      giao việc đầu tiên.

## Lưu ý
- Từng bước MỘT TIN NHẮN riêng — đây là hội thoại, không phải form.
- Học viên né/bỏ qua một bước (trừ bước 2) -> tôn trọng, sang bước kế, đừng hỏi lại.
- Học viên đã trả lời phần nào trong CHÍNH tin nhắn mở đầu (vd tự giới thiệu luôn trình
  độ + mục tiêu) -> đừng hỏi lại câu đó, dùng luôn thông tin đó cho bước 2.
