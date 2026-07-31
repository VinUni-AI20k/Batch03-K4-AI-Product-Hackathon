# Reflection cá nhân — Trần Thanh Bình

- **Mã học viên:** 2A202601174
- **Vai trò:** Full-stack & Demo Lead
- **Dự án:** VLearn Context-Aware AI Tutor

## Phần tôi thực hiện

Tôi xây dựng backend Express kết nối model `openai/gpt-4o-mini` qua OpenRouter. Backend đọc dữ liệu của Slide 5 và Slide 12, nhận câu hỏi cùng slide hiện tại, sau đó trả về giải thích và Micro-Quiz dưới dạng JSON để frontend hiển thị ổn định.

Ở frontend, tôi tích hợp luồng Select-to-Ask: học viên bôi đen nội dung trên slide, bấm **Hỏi AI Tutor**, trả lời Micro-Quiz và nhận card chuyển về Slide 5 khi trả lời sai. Tôi cũng xử lý đồng bộ context khi đổi slide và chuẩn bị luồng demo end-to-end.

## AI đã hỗ trợ tôi như thế nào

Tôi dùng AI để:

- Gợi ý cách chia component React giữa `SlideViewer` và `AiTutorChatPanel`.
- Soạn cấu trúc system prompt, JSON output và mock data cho hai slide.
- Kiểm tra các trường hợp lỗi như thiếu API key, mất kết nối và phản hồi không đúng định dạng.
- Rà soát code, tài liệu chạy dự án và kịch bản demo.

Tôi không sử dụng đầu ra AI nguyên trạng. Tôi kiểm tra lại luồng dữ liệu, giới hạn context gửi lên model, giữ API key ở backend và chạy build/API test trước khi đưa vào repo.

## Bài học từ case fail

Khi kiểm thử, máy chưa có `OPENROUTER_API_KEY`, nên backend không thể thực hiện lời gọi AI thật. Nếu không xử lý trường hợp này, toàn bộ đoạn demo từ giải thích đến Micro-Quiz sẽ bị dừng.

Tôi bổ sung endpoint `/api/health` để kiểm tra trạng thái cấu hình và cơ chế `DEMO_FALLBACK`. Khi OpenRouter chưa sẵn sàng, hệ thống trả về câu giải thích và quiz từ mock data, đồng thời đánh dấu chế độ `mock` thay vì giả vờ đó là kết quả AI thật.

Bài học của tôi là một prototype AI không chỉ cần happy path. Với demo trực tiếp, cần tách rõ phần AI thật và phần mock, thiết kế lỗi có thể phục hồi, đồng thời luôn chuẩn bị một luồng fallback minh bạch.

## Điều tôi có thể giải thích khi demo

- Vì sao API key chỉ nằm trong `.env` của backend.
- Cách frontend gửi `slideId`, đoạn text được chọn và lịch sử chat tới `/api/chat`.
- Cách system prompt giới hạn câu trả lời theo context của slide.
- Cách đáp án sai kích hoạt remediation card và chuyển từ Slide 12 về Slide 5.
- Khác biệt giữa phản hồi `openrouter` và `mock` trong hệ thống.
