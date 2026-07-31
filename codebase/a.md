Đây là bảng mô tả vai trò của từng thư mục/file trong dự án của bạn.

| Đường dẫn                                    | Vai trò                                                                     | Input                   | Output                     |
| -------------------------------------------- | --------------------------------------------------------------------------- | ----------------------- | -------------------------- |
| **app.py**                                   | Entry point của toàn bộ chatbot                                             | User question           | AI response                |
| **data/vlearn-pack/chatlog/**                | Dữ liệu hội thoại học sinh                                                  | CSV chatlog             | Dữ liệu đầu vào            |
| **data/vlearn-pack/transcript/**             | Transcript bài giảng                                                        | Markdown                | Kiến thức nguồn để tạo KC  |
| **dialogue/chatlog_loader.py**               | Đọc và chuẩn hóa chatlog                                                    | CSV                     | Conversation objects       |
| **kc_builder/transcript_parser.py**          | Đọc transcript và chia thành các section/chapter                            | Markdown transcript     | Parsed transcript          |
| **kc_builder/kc_extractor.py**               | Trích xuất Knowledge Components từ transcript (LLM/rule-based)              | Parsed transcript       | Danh sách KC               |
| **kc_builder/kc_dictionary.py**              | Quản lý danh sách KC và ID của từng KC                                      | KC list                 | KC Dictionary              |
| **kc_builder/kc_graph.py**                   | Xây dựng quan hệ giữa các KC (prerequisite, dependency...)                  | KC Dictionary           | Knowledge Graph            |
| **knowledge_tracing/main.py**                | Pipeline chạy thử của repo DialogueKT                                       | Dataset                 | Kết quả train/test         |
| **knowledge_tracing/training.py**            | Huấn luyện mô hình KT                                                       | KT Dataset              | Trained model              |
| **knowledge_tracing/data_loading.py**        | Đọc dataset gốc (COMTA/MathDial)                                            | Dataset                 | Dialogue data              |
| **knowledge_tracing/kt_data_loading.py**     | Chuyển dữ liệu thành format dùng cho KT                                     | Dialogue + Labels       | Tensor/Sequence            |
| **knowledge_tracing/annotate.py**            | Sinh annotation (KC, correctness...)                                        | Dialogue                | Annotated dataset          |
| **knowledge_tracing/prompting.py**           | Quản lý prompt cho LLM                                                      | Prompt template         | Prompt hoàn chỉnh          |
| **knowledge_tracing/openai_api.py**          | Gọi OpenAI API                                                              | Prompt                  | LLM response               |
| **knowledge_tracing/utils.py**               | Hàm tiện ích (load/save, logger...)                                         | -                       | Utility functions          |
| **knowledge_tracing/human_eval.py**          | Đánh giá kết quả bằng con người                                             | Prediction              | Human evaluation           |
| **knowledge_tracing/visualize.py**           | Trực quan hóa kết quả KT                                                    | Prediction              | Biểu đồ/Báo cáo            |
| **knowledge_tracing/models/simplekt.py**     | Mô hình SimpleKT                                                            | KT sequence             | Mastery prediction         |
| **knowledge_tracing/models/dkt_multi_kc.py** | Mô hình DKT hỗ trợ nhiều KC                                                 | KT sequence             | Mastery prediction         |
| **knowledge_tracing/models/dkt_sem.py**      | Mô hình DKT có semantic embedding                                           | KT sequence             | Mastery prediction         |
| **knowledge_tracing/models/lm.py**           | Wrapper kết hợp Language Model                                              | Input text              | Embedding/Prediction       |
| **llm/**                                     | Chứa logic tương tác với LLM (Gemini/OpenAI...)                             | Prompt                  | AI response                |
| **rag/**                                     | Retrieval-Augmented Generation: truy xuất kiến thức từ transcript/vector DB | User query              | Relevant context           |
| **tutor/**                                   | Logic gia sư: lập kế hoạch phản hồi, chọn chiến lược giảng dạy              | Student state + Context | Hướng dẫn học tập          |
| **tham-khao/**                               | Tài liệu tham khảo                                                          | PDF/Markdown            | Không tham gia pipeline    |

## Pipeline tổng thể của dự án

# AI Tutor System Architecture (MVP)

## Offline

```text
                 Transcript                       Chatlog
                      │                              │
                      ▼                              │
               transcript_parser                     │
                      │                              │
                      ▼                              │
                KC Extraction                        │
                      │                              │
                      ▼                              │
                 KC Dictionary                       │
                 ┌──────────────┐                    │
                 │              │                    │
                 ▼              ▼                    │
        RAG Indexing     DialogueKT Model ◄──────────┘
                 │        (Input: KC + Chatlog)
                 ▼              │
          Vector Database       ▼
                 Trained DialogueKT Model
```

---

## Online

```text
                  User Chat
                      │
                      ▼
                    app.py
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
 DialogueKT                RAG Retrieval
 (Inference)                    │
          │                      ▼
          ▼              Relevant Context
 Student Mastery                │
          └───────────┬──────────┘
                      ▼
                Tutor Planner
                      │
                      ▼
               Prompt Builder
                      │
                      ▼
              Gemini/OpenAI API
                      │
                      ▼
              AI Tutor Response
```

Cấu trúc này tách rõ **4 tầng**:

1. **Knowledge Construction** (`kc_builder`) – tạo Knowledge Components từ transcript.
2. **Learning Analytics** (`dialogue`, `knowledge_tracing`) – theo dõi mức độ thành thạo của học sinh.
3. **Reasoning** (`rag`, `tutor`, `llm`) – lấy ngữ cảnh, lập kế hoạch phản hồi và gọi LLM.
4. **Application** (`app.py`) – điểm vào của chatbot, kết nối tất cả các module trên.
