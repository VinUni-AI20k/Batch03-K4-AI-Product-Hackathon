# Problem Definition Report — In-Action Learning Buddy (Hướng B: Personalized Re-teaching)

## 1. Persona

### Persona chính: "Học viên tự học sau giờ lên lớp"

**Chân dung:** Người đang theo một khóa học có cấu trúc (bootcamp, khóa online, lớp offline có slide + ghi âm), tự học lại sau buổi học chính thức để đảm bảo thực sự hiểu bài trước khi qua bài tiếp theo.

**Đặc điểm:**

- Đã tham dự buổi học (có slide và transcript buổi giảng), không phải người học từ zero.
- Trình độ nền tảng không đồng đều — có thể mạnh phần này, yếu phần khác trong cùng một buổi học.
- Có quỹ thời gian tự học giới hạn, không có nhu cầu đọc lại toàn bộ nội dung, chỉ muốn tập trung đúng chỗ mình chưa vững.
- Có xu hướng "nghĩ mình đã hiểu" sau khi nghe giảng, nhưng không có cách nào kiểm chứng khách quan trước khi thi hoặc làm bài tập.
- Không tự tin xác định được chính xác phần nào mình yếu (không biết mình không biết gì).

**Điều persona này KHÔNG cần:** một chatbot hỏi-đáp chung chung ("giải thích lại bài này cho tôi") — vì họ đã có ChatGPT cho việc đó. Họ cần một hệ thống **biết chính xác họ yếu ở đâu trong buổi học cụ thể này** và dạy lại đúng phần đó, bám sát nội dung giảng viên đã dạy chứ không phải kiến thức chung chung từ internet.

---

## 2. Problem Statement

### Pain point thật

> "Sau khi nghe giảng, tôi không biết mình thực sự hiểu bài đến đâu, và nếu phải học lại thì không biết nên tập trung vào phần nào — trong khi bài giảng gốc quá dài để đọc lại toàn bộ, còn hỏi AI chung chung thì mất công diễn đạt lại ngữ cảnh và không chắc câu trả lời có khớp với đúng những gì giảng viên đã dạy."

### Cách người dùng đang giải quyết vấn đề này

| Cách hiện tại                                   | Hạn chế                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Đọc lại toàn bộ slide                           | Tốn thời gian, không biết phần nào cần đọc kỹ hơn, không có kiểm chứng mức hiểu                                                       |
| Tự làm flashcard (Anki/Quizlet)                 | Thủ công, không adaptive theo lỗ hổng thực tế                                                                                         |
| Hỏi ChatGPT "giải thích lại bài X"              | Không có ngữ cảnh buổi học cụ thể, không biết nội dung nào giảng viên đã nhấn mạnh, không phát hiện lỗ hổng cá nhân trước khi trả lời |
| Quiz cuối chương có sẵn (nếu khóa học cung cấp) | Không cá nhân hóa, không chỉ ra chính xác lỗ hổng, không dùng để re-teach                                                             |
| Tự ôn không có công cụ hỗ trợ                   | Rủi ro "ảo tưởng đã hiểu bài" (illusion of competence), không phát hiện được cho đến khi thi/làm bài thất bại                         |

### Vì sao giải pháp hiện tại (MCQ hỗ trợ đơn thuần) chưa đủ

Các giải pháp quiz/MCQ hỗ trợ giải quyết được phần "kiểm tra", nhưng dừng lại ở đó — không đóng được vòng lặp "phát hiện lỗ hổng → dạy lại đúng chỗ đó → kiểm tra lại". Đây chính là khoảng trống mà hướng B nhắm tới.

---

## 3. AI Leverage — AI thực sự tạo giá trị ở đâu

Nguyên tắc dẫn dắt: **chỉ dùng AI ở bước mà con người/rule-based logic làm kém hơn rõ rệt.** Các bước còn lại (chọn level, chọn style học) dùng UI thông thường, không cần AI.

| Bước                                                                     | AI Leverage                                                                                                       | Vì sao AI cần thiết ở đây                                                                                                                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phân loại transcript** (teaching content vs. hoạt động lớp)            | AI phân loại ngữ nghĩa từng đoạn                                                                                  | Rule-based (regex, keyword) không đủ để phân biệt "giảng viên đang giải thích khái niệm" với "giảng viên đang chấm bài học viên"                                                                          |
| **Trích xuất outline từ slide**                                          | AI đọc và tóm tắt cấu trúc                                                                                        | Nhanh hơn thủ công, nhưng rủi ro thấp vì slide đã có structure sẵn                                                                                                                                        |
| **Phát hiện lỗ hổng kiến thức** (weakness detection)                     | AI phân tích câu trả lời quiz + câu trả lời tự do "phần nào khó nhất" để suy ra khoảng trống hiểu biết            | Đây là **leverage cốt lõi nhất**: con người tự đánh giá rất kém việc "mình không biết gì" (unknown unknowns); AI có thể đối chiếu pattern sai để suy luận lỗ hổng khái niệm, không chỉ đơn thuần đếm điểm |
| **Alignment nội dung** (map outline section ↔ đoạn transcript liên quan) | AI đọc toàn bộ transcript đã lọc và tìm đoạn giải thích liên quan đến từng mục outline                            | Không có timestamp thời gian thực để map cơ học; cần hiểu ngữ nghĩa để nối đúng đoạn giảng viên nói với đúng khái niệm trong slide                                                                        |
| **Grounded rewrite** (viết lại nội dung cá nhân hóa)                     | AI tổng hợp slide + transcript liên quan thành nội dung mới, điều chỉnh theo level/style, nhấn mạnh đúng phần yếu | **Leverage cốt lõi thứ hai**: đây là việc không ai có thời gian làm thủ công cho từng học viên — biến nội dung buổi học chung thành tài liệu cá nhân hóa theo đúng lỗ hổng của từng người                 |
| **Chat trong lúc tự học (grounded Q&A + bôi đen hỏi nhanh)**             | AI trả lời có trích dẫn nguồn (slide/transcript) theo đúng ngữ cảnh đang đọc                                      | Nhanh hơn tra cứu thủ công, và có ngữ cảnh chính xác về buổi học thay vì trả lời chung chung                                                                                                              |
| **Chấm quiz retest + trỏ nguồn cho câu sai**                             | AI đối chiếu câu trả lời với nội dung gốc để chỉ ra chính xác đoạn chứa đáp án đúng                               | Tăng độ tin cậy, biến việc chấm điểm thành cơ hội học tiếp thay vì chỉ báo đúng/sai                                                                                                                       |

**Ranh giới rõ ràng — nơi KHÔNG dùng AI:** chọn trình độ bản thân (dropdown), chọn style học intuitive/mathematical/both (dropdown), chọn thời gian học (dropdown/slider). Đây là input trực tiếp từ người dùng, dùng AI ở đây chỉ làm chậm và tăng rủi ro parse sai mà không tạo thêm giá trị.

---

## 4. MVP

### Luồng MVP

flowchart TD

%% =========================
%% Phase 1 - Knowledge Preparation
%% =========================
subgraph P1["Phase 1 - Knowledge Preparation"]

U1[Upload PDF Slides + Transcript]

A1[AI Classify Transcript<br/>Teaching Content / Noise]

A2[AI Extract Outline<br/>section_id + key_points]

A1, A2 should be triggered right after slide and transcript was uploaded, not synchronize with mong muốn ôn bài của học viên.

A3[AI Generate Initial Quiz<br/>20 Questions]

KP[(Knowledge Package)]

U1 --> A1
A1 --> A2
A2 --> A3
A3 --> KP

end

%% =========================
%% Phase 2 - Learning Diagnosis
%% =========================

subgraph P2["Phase 2 - Learning Diagnosis"]

Q1[User Takes Quiz]

G1[Rule-based Quiz Grading]

D1[AI Learning Diagnosis<br/>Weak Sections]

DEC1{Need Personalized<br/>Re-teaching?}

STYLE[User Selects<br/>Learning Style<br/>Study Time]

KP --> Q1
Q1 --> G1
G1 --> D1
D1 --> DEC1

end

%% =========================
%% Phase 3 - Adaptive Re-teaching
%% =========================

subgraph P3["Phase 3 - Adaptive Re-teaching"]

    CONFIG[User Config: Level, Style, Time, Active Mode]
    AL[Align Weak Sections with Transcript & Slides]
    PROMPT[Construct Single Context-Aware Prompt]
    STREAM[AI Stream Dynamic Markdown Lecture]
    FINISH[User Finishes Learning]

    CONFIG --> PROMPT
    AL --> PROMPT
    PROMPT --> STREAM
    STREAM --> FINISH

end

%% =========================
%% Phase 4 - Learning Validation
%% =========================

subgraph P4["Phase 4 - Learning Validation"]

RET[AI Generate Retest]

GRADE[Rule-based Retest Grading]

DEC2{Mastery Achieved?}

REPORT[Before / After Report]

REVIEW[Show Wrong Answers<br/>with Source References]

GRADE --> DEC2

DEC2 -->|Yes| REPORT

DEC2 -->|No| REVIEW

REVIEW --> STYLE

end

%% =========================
%% Connections
%% =========================

DEC1 -->|Yes| STYLE

DEC1 -->|No| RET

FINISH --> RET

RET --> GRADE

### Chủ động cắt khỏi ý tưởng gốc (và lý do)

| Cắt                                                | Lý do                                                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Chứng nhận / certify hoàn thành lecture            | Overclaim rủi ro, không cần thiết cho demo, dễ bị chất vấn về độ tin cậy                 |
| Mô tả trình độ bản thân dạng tự do (P0 hội thoại)  | Dropdown nhanh hơn, đáng tin hơn, không cần AI parse                                     |
| Hỏi style/thời gian học dạng hội thoại (P2b/P2c)   | Tương tự — dropdown đơn giản, tiết kiệm thời gian dev                                    |
| Quiz ngắn + quiz dài tách biệt                     | Gộp thành 1 vòng quiz retest ngắn, đủ để demo rõ ràng                                    |
| Vector DB / semantic search phức tạp cho alignment | Transcript 1 buổi học fit gọn trong context window — feed toàn bộ, không cần hạ tầng RAG |

### Phân công 4 người (song song ngay từ đầu)

- **Person A:** Transcript classification + Outline extraction + Quiz generation + Weakness analysis (phần "chẩn đoán")
- **Person B:** Alignment (outline ↔ transcript) + Grounded rewrite engine (phần khó và giá trị nhất — "dạy lại")
- **Person C:** Frontend — split-screen UI, quiz UI, upload flow, highlight-to-ask
- **Person D:** Integration, chọn và chuẩn bị kỹ 1 bộ dữ liệu demo cụ thể, kịch bản demo, backup phòng lỗi live

---

## 5. Metrics

### Metrics cho demo (đo được ngay trong ngày hackathon)

| Metric                                                | Cách đo                                                                     | Mục tiêu demo                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **End-to-end completion rate**                        | % lần chạy thử pipeline từ upload → study note → quiz retest không lỗi      | 100% trên bộ dữ liệu demo đã chọn                                                      |
| **Weakness detection precision (quan sát định tính)** | Đối chiếu thủ công: AI có xác định đúng phần user cố tình trả lời sai không | Test với ít nhất 3 kịch bản "cố tình sai ở section X" trước demo                       |
| **Grounding rate của Study Note**                     | % câu trong Study Note có thể truy ngược về đoạn slide/transcript cụ thể    | ≥ 90% — đây là chỉ số quan trọng nhất để chứng minh "không bịa"                        |
| **Latency toàn luồng**                                | Thời gian từ lúc bấm "sinh Study Note" đến khi hiển thị                     | Dưới 30 giây để demo mượt (nếu lâu hơn, cần loading state rõ ràng, chia nhỏ streaming) |
| **Retest improvement (nếu kịp làm)**                  | So sánh điểm quiz đầu vs. quiz retest sau khi đọc Study Note                | Tăng rõ rệt trên kịch bản demo đã chuẩn bị                                             |

### Metrics cho sản phẩm thật (nếu phát triển tiếp sau hackathon — không cần đo trong MVP)

- Time-to-mastery: thời gian trung bình để đạt ngưỡng hiểu bài chấp nhận được, so với tự học không có công cụ
- Retention: % học viên quay lại dùng cho buổi học tiếp theo
- Trust score: % nội dung rewrite bị user gắn cờ "không khớp với bài giảng gốc"
- Reduction in support/mentor questions: nếu triển khai trong 1 khóa học thật, đo giảm số câu hỏi lặp lại gửi cho giảng viên/TA

---

## Ghi chú về Guardrails (liên quan trực tiếp đến độ tin cậy của metrics ở trên)

- Mọi đoạn trong Study Note nên có thể trace về nguồn (slide section hoặc transcript ID) — đây vừa là feature vừa là cơ chế tự kiểm chứng.
- Transcript đã được anonymize từ nguồn (không phải làm trong scope MVP), nhưng bước lọc TEACHING_CONTENT vẫn cần giữ để đảm bảo chất lượng nội dung (loại bỏ nhiễu từ hoạt động lớp/đùa giỡn).
- Tránh ngôn ngữ overclaim ("chứng nhận", "đảm bảo hiểu bài 100%") — dùng ngôn ngữ nhẹ hơn như "mức độ tự tin" (confidence indicator).
