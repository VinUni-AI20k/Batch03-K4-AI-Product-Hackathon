Tôi đang dựng Bot Discord Assistant cho một Mini Hackathon AI bằng `discord.js` (Node.js). Tôi đã có file mẫu dự án ban đầu. Hãy giúp tôi hoàn thiện codebase theo các yêu cầu sau:

### 1. MỤC TIÊU CẦN CODE

Viết luồng xử lý tin nhắn trong bot Discord:

- Khi có học viên nhắn tin hoặc tag bot (messageCreate event).
- Đọc dữ liệu mock từ các file JSON trong thư mục `./data/`:
  + `announcements.json` (Tier 1)
  + `course_docs.json` (Tier 1)
  + `forum_posts.json` (Tier 2)
- Gom nội dung các file JSON này làm `{context_data}` và chèn vào System Prompt.
- Gửi tin nhắn của user + System Prompt sang LLM API để lấy câu trả lời.
- Gửi lại phản hồi của AI vào channel Discord.

### 2. CẤU HÌNH API AI (OPENROUTER PRIMARY + GEMINI FALLBACK)

Hãy tạo một helper function `callLLM(systemPrompt, userMessage)` xử lý luồng gọi API:

- Primary API: Gọi OpenRouter API (Sử dụng OpenAI SDK hoặc `fetch` tới endpoint `https://openrouter.ai/api/v1/chat/completions` với model như `google/gemini-2.0-flash-001` hoặc `openai/gpt-4o-mini`). Lấy API Key từ `process.env.OPENROUTER_API_KEY`.
- Fallback API: Nếu OpenRouter bị lỗi hoặc hết credit (status != 200 hoặc catch error), tự động fallback chuyển sang gọi trực tiếp Google Gemini API (dùng `@google/genai` hoặc `fetch` tới Gemini API) với `process.env.GEMINI_API_KEY`.
- Log rõ ràng ra console khi nào gọi thành công OpenRouter và khi nào phải kích hoạt Fallback Gemini.

### 3. XỬ LÝ LOGIC TRÊN DISCORD (`discord.js`)

- Lọc tin nhắn: Bỏ qua tin nhắn từ Bot (`message.author.bot`).
- Chỉ phản hồi khi:
  + Tin nhắn thuộc một channel cấu hình sẵn HOẶC
  + Bot được tag tên (@bot) HOẶC
  + Tin nhắn bắt đầu bằng prefix (VD: `!ask`).
- Xử lý trạng thái: Bật hiệu ứng `message.channel.sendTyping()` trong lúc chờ AI phản hồi.
- Xử lý Tag TA: Nếu response từ AI có chứa từ khóa `[ESCALATE_TA]`, hãy xóa tag này khỏi nội dung gửi ra Discord, đồng thời đính kèm tag role TA (sử dụng ID role trong `.env` dạng `<@&TA_ROLE_ID>`) hoặc gửi một alert thông báo câu hỏi tồn.

### 4. CẤU TRÚC FILE MONG MUỐN

- Đọc file mẫu hiện có của tôi, giữ lại các phần cấu hình bot/intents cơ bản.
- Tổ chức code sạch sẻ, tách file nếu cần (`src/services/ai.js`, `src/utils/dataLoader.js`, `src/index.js`).
- Tạo sẵn file `.env.example` chứa các biến:
  `DISCORD_TOKEN`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `TA_ROLE_ID`.

Hãy bắt đầu phân tích file mẫu của tôi và tiến hành bổ sung code chi tiết!
