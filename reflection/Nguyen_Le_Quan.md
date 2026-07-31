# Bản Thu Hoạch Cá Nhân (Reflection)

**Họ và tên:** Nguyễn Lê Quân
**Mã HV:** 2A2026
**Vai trò trong nhóm:** Làm prompt

## 1. Công việc đã thực hiện
- Thiết kế System Prompt lõi cho Bot.
- Tạo ra bộ quy tắc Guardrails chặt chẽ (Censor, Chống xin xỏ ngoài thẩm quyền).
- Đưa ra định dạng đầu ra (Markdown, Bullet point) và cơ chế tự động tag `[ESCALATE_TA]`.
- Cập nhật prompt dựa trên Feedback log từ bộ phận Validation.

## 2. Bài học rút ra (Learnings)
- **Sức mạnh của Guardrails:** Chỉ cần vài dòng prompt rào trước, LLM có thể từ chối rất khéo léo các câu hỏi lắt léo (như đòi API key hay chửi bậy) mà không cần code logic if-else phức tạp.
- **Cấu trúc Prompt:** Prompt càng có cấu trúc rõ ràng (Dùng Heading, Bullet, Phân tầng kiến thức Tier 1/Tier 2) thì Model (Gemini 2.5 Flash) càng tuân thủ tốt.

## 3. Điều muốn làm tốt hơn
- Muốn thử nghiệm kỹ thuật "Few-Shot Prompting" (đưa sẵn vài ví dụ mẫu vào Prompt) để giúp Bot trả lời với giọng điệu giống TA thật (hài hước, gần gũi) hơn nữa.
