# Kiến trúc VLearn Context Tutor

## Mục tiêu

Chatbot hỗ trợ hỏi đáp và tóm tắt slide hiện tại, đồng thời có thể tìm kiến thức
trong bài giảng khác khi nguồn hiện tại không đủ. Mọi kết luận kiến thức phải có
citation hợp lệ.

## Luồng phụ thuộc

```text
Frontend
   |
FastAPI endpoint
   |
Application service
   |
Tutor agent
   +--> scope router
   +--> retrieval tools --> retrieval pipeline --> vector store / embeddings
   +--> tutoring tools  --> LLM provider
   +--> validation tools
   |
Chat response + citations + suggested questions
```

## Ranh giới module

- `api`: HTTP contract, validation và dependency injection.
- `services`: use case của ứng dụng.
- `agents`: điều phối quyết định và thứ tự gọi tools.
- `tools`: năng lực agent có thể gọi.
- `retrieval`: chunk, index, filter, search và rerank.
- `providers`: tích hợp LLM, embedding và storage có thể thay thế.
- `domain`: khái niệm nghiệp vụ không phụ thuộc framework.
- `artifacts`: output runtime, không phải source code.

## Chính sách phạm vi

1. Tóm tắt không chỉ rõ phạm vi dùng bài đang mở.
2. Hỏi “trang/slide này” dùng trang hiện tại.
3. Tìm trong bài hiện tại trước với câu hỏi kiến thức.
4. Có thể mở rộng toàn khóa khi nguồn không đủ, trừ khi user yêu cầu chỉ dùng
   bài hiện tại.
5. Khi mở rộng, câu trả lời phải hiển thị rõ nguồn đến từ bài khác.
