---
course: AI20K
generated: '2026-07-30T17:29:38+00:00'
lang: vi
lesson: NeurIPS-2022-training-language-models-to-follow-instructions-with-human-feedback-Paper-Conference
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/NeurIPS-2022-training-language-models-to-follow-instructions-with-human-feedback-Paper-Conference.pdf
source_hash: sha256:dbed978653a086a666a36cb20dfc49224b3b2d9a7baa2752042ac71f568c36d6
type: lesson-note
---

```markdown
## Slide 1 — Huấn luyện mô hình ngôn ngữ để theo dõi hướng dẫn với phản hồi của con người

Trong nghiên cứu này, chúng tôi cho thấy rằng việc mở rộng quy mô mô hình ngôn ngữ không nhất thiết làm cho chúng tốt hơn trong việc theo dõi ý định của người dùng. Mô hình ngôn ngữ lớn có thể tạo ra các đầu ra sai sự thật, độc hại, hoặc không hữu ích với người dùng. Điều này có nghĩa là những mô hình này không được căn chỉnh với người dùng của chúng. Trong bài viết này, chúng tôi giới thiệu một hướng đi cho việc căn chỉnh mô hình ngôn ngữ với ý định của người dùng trên nhiều loại nhiệm vụ bằng cách tinh chỉnh với phản hồi từ con người. Bắt đầu từ một tập hợp các prompts viết bởi người gán nhãn và các prompts được gửi qua API mô hình ngôn ngữ, chúng tôi thu thập một tập dữ liệu từ những minh chứng hành vi mong muốn của mô hình. Chúng tôi đã sử dụng tập dữ liệu này để tinh chỉnh GPT-3 bằng học có giám sát. Tiếp theo, chúng tôi thu thập một tập dữ liệu về xếp hạng đầu ra của mô hình, mà từ đó chúng tôi tinh chỉnh mô hình giám sát này bằng học tăng cường từ phản hồi của con người. Các mô hình kết quả được gọi là [[InstructGPT]].

## Khái niệm chính

- [[InstructGPT]]: Các mô hình ngôn ngữ được tinh chỉnh để theo dõi sự hướng dẫn từ người dùng một cách chính xác và hữu ích.
```
