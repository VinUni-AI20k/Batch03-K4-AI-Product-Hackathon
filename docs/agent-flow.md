# Tutor agent flow

```text
Nhận message + learning context
        |
        v
Phát hiện integrity / ngoài phạm vi
        |
        v
Xác định scope
        |
        v
Tìm nguồn trong scope ưu tiên
        |
        +-- không đủ --> được phép mở rộng? --> tìm bài khác
        |
        +-- mơ hồ --> hỏi lại user
        |
        v
Chọn tutoring tool
  QA / summary / explain / compare / learning
        |
        v
Build context trong budget
        |
        v
Sinh câu trả lời
        |
        v
Validate grounding + citation
        |
        +-- fail --> graceful failure
        |
        v
Trả answer + sources + suggested questions
```

Agent không gọi trực tiếp SDK của một hãng. Mọi tích hợp đi qua provider
interface để mock trong test và thay đổi cấu hình khi deploy.
