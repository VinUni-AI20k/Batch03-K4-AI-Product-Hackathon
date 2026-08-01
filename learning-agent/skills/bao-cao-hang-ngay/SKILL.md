---
name: bao-cao-hang-ngay
description: >
  Báo cáo học tập định kỳ do cron kích hoạt: dựa trên lộ trình chương trình học và hồ sơ
  học viên, tổng kết tiến độ và giao mục tiêu hôm nay. Dùng khi công việc định kỳ được
  scheduler giao, hoặc học viên chủ động hỏi "hôm nay học gì", "tiến độ của tôi thế nào".
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Báo cáo học tập hằng ngày

## Quy trình
- [ ] 1. `get_lesson('lo-trinh')` đọc lộ trình chương trình học — xác định hôm nay thuộc tuần/module nào, mục tiêu giai đoạn là gì.
- [ ] 2. Đọc hồ sơ học viên (trong system prompt): lộ trình ôn tập đã giao, điểm yếu, hoạt động gần đây.
- [ ] 3. Viết báo cáo NGẮN (dưới 15 dòng) đúng cấu trúc:
      **📅 Hôm nay trong chương trình** (bài/module theo lộ trình) →
      **✅ Tiến độ** (đã làm gì, còn nợ gì so với lộ trình đã giao) →
      **🎯 Mục tiêu hôm nay** (1–3 việc cụ thể, kèm bài/khái niệm liên quan) →
      **💡 Gợi ý** (1 câu quiz nhanh hoặc khái niệm nên ôn).
- [ ] 4. Có việc được giao mới → `update_student_memory` ghi lại để mai đối chiếu.

## Lưu ý
- Không có note 'lo-trinh' trong vault → báo cáo dựa trên hồ sơ học viên + các bài mới ingest gần đây, và nhắc học viên tạo lộ trình.
- Đây là tin nhắn chủ động gửi tới học viên — giọng thân thiện, đi thẳng vào việc.
