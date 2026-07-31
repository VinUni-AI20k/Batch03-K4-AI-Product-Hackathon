# Pedagogy

Đọc ở Phase 2, khi không chắc nên dạy thứ gì trước, hoặc khi muốn biết vì sao thứ tự trong một step là thứ tự đó.

Mỗi dòng là một nguyên lý học tập đã được nghiên cứu rộng, kèm luật cụ thể áp vào CODELAB.md.

- **Cognitive Load Theory (Sweller)** — working memory giữ được rất ít thứ cùng lúc, và tải không liên quan sẽ ăn hết chỗ của tải học tập → ≤ 120 từ prose trước action đầu tiên, **một step một khái niệm mới**, nhiều nhất 2 jargon mới mỗi step, không nội dung trang trí. Step nào phải dạy hai khái niệm mới thì nó là hai step.
- **Segmenting (Mayer)** — chia nội dung thành đoạn learner tự kiểm soát được nhịp → 4–8 step, mỗi step 20–45 phút, ngăn bằng `---`, và mỗi step khai thời lượng.
- **Time-on-task visibility** — người học không tự đo được mình đang chậm; họ chỉ biết lúc hết giờ, và lúc đó thì im lặng bỏ dở → bảng timeline đầu bài, dòng `**<N> phút · mốc <a>–<b>.**` mở mỗi step. Đây là thứ cho họ quyết định xin trợ giúp **trong lúc còn kịp**.
- **Split-attention effect** — phải ghép hai nguồn thông tin cách nhau trên trang là tải phụ vô ích → output kỳ vọng đặt ngay dưới lệnh, sơ đồ kèm tên file, không "xem bảng ở mục 3".
- **Worked example effect** — người mới học nhanh hơn khi thấy một ví dụ hoàn chỉnh trước khi tự làm → step 0 hoặc đầu step 1 có ví dụ đã giải xong. Cách làm tốt đã thấy: dành riêng 15 phút đầu để learner đọc một file deliverable mẫu đã hoàn thiện, trước khi tự làm bản của mình.
- **Concrete-before-abstract** — khái niệm trừu tượng bám vào một hình ảnh cụ thể thì dễ nhớ hơn → khái niệm thật khó thì **một câu** ví dụ đời thường trước cơ chế. Một câu, vì câu thứ hai bắt đầu thành văn tả.
- **Scaffolding fade / ZPD (Vygotsky)** — hỗ trợ phải giảm dần, nếu không learner không bao giờ tự đi được → V1 cho khung có TODO, V2 chỉ gợi ý, bonus không hướng dẫn.
- **Productive failure (Kapur)** — thử và thất bại trước khi được dạy giải pháp làm learner hiểu sâu hơn → cho chatbot bịa câu trả lời trước, rồi mới dạy tool. Hook trước mechanism.
- **Retrieval practice (Roediger)** — nhớ lại chủ động củng cố mạnh hơn đọc lại → checkpoint có ít nhất 1 dòng "giải thích được", không chỉ "chạy được". `:::quiz` hỏi lại điều vừa làm.
- **Feedback loop latency (Hattie)** — feedback càng gần thời điểm làm càng hiệu quả → mỗi step có ít nhất 1 lệnh self-check chạy dưới 60s, không dồn hết test xuống cuối bài.
- **Pre-training (Mayer)** — biết tên và khái niệm chính trước khi vào quy trình sẽ đỡ tải hơn → glossary tooltip ở lần xuất hiện đầu, `prerequisites` trong frontmatter, bảng định hướng đầu bài.
- **Signaling (Mayer)** — tín hiệu hình thức nhất quán giúp mắt tìm đúng loại thông tin → vocabulary directive đóng, mỗi loại một chức năng cố định. Emoji rải rác phá signaling vì tạo tín hiệu giả.
- **Goal-first** — nói rõ đích trước làm giảm mò mẫm → `:::goal` mở mỗi step, viết bằng trạng thái đạt được.
- **Bloom's taxonomy** — động từ mục tiêu quyết định mức nhận thức được kiểm tra → `outcomes` chỉ dùng động từ quan sát được, cấm "hiểu" và "nắm được".
- **Desirable difficulty (Bjork)** — khó vừa đủ thì học được, khó vì tài liệu mù mờ thì chỉ bỏ cuộc → khó nằm ở bài toán (câu bẫy, edge case), không nằm ở việc đoán xem coach muốn gì.
- **Zeigarnik / progress visibility** — việc dở dang mà thấy được tiến độ thì dễ quay lại hoàn thành → checkbox trống, đánh số step, thời lượng mỗi step.

## Ba loại nội dung, đừng trộn

- **Declarative** (khái niệm, định nghĩa) — learner đọc và nhớ → glossary tooltip, bảng, ≤ 3 dòng prose.
- **Procedural** (quy trình, cú pháp) — learner làm theo → `**Bạn làm:**`, code block.
- **Conditional** (khi nào dùng cái nào) — learner quyết định → bảng so sánh, `:::caution`, câu hỏi trọng tâm.

Lab thường viết dày declarative và mỏng conditional. Nhưng conditional mới là thứ learner thiếu: họ biết ReAct là gì, không biết khi nào đáng dùng. Mỗi lab nên có ít nhất một bảng so sánh conditional, và bảng đó phải có cột "khi nào chọn" — bảng chỉ có "cách hoạt động" thì learner vẫn không biết chọn gì.

```markdown
| Cấp độ | Cách hoạt động | Khi nào chọn |
|---|---|---|
| Rule-based | if/else theo keyword | Input hữu hạn, cần deterministic tuyệt đối |
| LLM chatbot | 1 LLM call, không tool | Q&A lý thuyết, không cần dữ liệu thật |
| ReAct agent | Thought → Action → Observation | Cần dữ liệu ngoài, nhiều bước phụ thuộc |
| Autonomous agent | Planning + memory | Mục tiêu dài, chấp nhận chi phí orchestration |
```

## Checkpoint viết thế nào

Checkpoint là công cụ đánh giá, không phải lời chúc. Mỗi dòng thuộc một trong ba loại:

- **Chạy được:** `[ ] pytest tests/test_part1.py -v → 2 passed`. Dùng khi có test tự động.
- **Nhìn thấy:** `[ ] Terminal hiện (.venv) ở đầu dòng lệnh`. Dùng cho trạng thái quan sát được.
- **Nói được:** `[ ] Bạn giải thích được vì sao Observation phải do application chèn, không phải model tự sinh`. Dùng để kiểm hiểu.

Mỗi step cần ít nhất một dòng loại nói được. Đây là chốt chống trường hợp learner để AI viết hết mà không hiểu gì, cùng tinh thần với vibe-coding rule mà nhiều lab trong khoá áp: dùng AI để build thoải mái, nhưng không giải thích được phần có tên mình thì phần đó không tính điểm.

## Sai lầm pedagogy thường gặp trong lab AI

- Dạy lý thuyết 40 phút trước khi cho chạy dòng lệnh đầu tiên → learner mất mạch, không nhớ gì. Chạy được thứ gì đó trong 10 phút đầu.
- Bắt cài API key ngay step 1 → một phần lớp tắc ở đây và không ai qua được step 2. Step đầu chạy deterministic hoặc mock, key vào sau.
- Tất cả test ở cuối bài → learner sai từ step 1, biết lúc step 6. Test theo từng step.
- Không có worked example → learner không biết "xong" trông thế nào.
- Chỉ chấm output cuối → thưởng vibe-coding không hiểu. Chấm cả trace và checkpoint nói được.
- Câu bẫy không được báo trước là bẫy → learner tưởng mình sai, mất tự tin. Nói rõ "case 5 là edge case, agent nên từ chối".
- Guide dài 5000 từ → không ai đọc, mọi người hỏi coach. Cắt xuống, đẩy chi tiết vào file trong repo.
- Không khai thời lượng từng step → learner không biết mình chậm, và coach không biết cắt đâu khi hết giờ.
