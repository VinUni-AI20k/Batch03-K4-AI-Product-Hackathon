---
course: packs
generated: '2026-07-30T10:23:52+00:00'
lang: vi
lesson: transcript-03-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/transcript/transcript-03-clean.md
source_hash: sha256:0c43a58ab61e6b03c523dafc7020b792722265e8ac9e0a73c38746eb3e11e80d
type: lesson-note
---

```markdown
# Ghi chú bài học - Day 2 (chiều) - Soi bài toán các nhóm · tự động hoá & ràng buộc

## Slide 1 — Giới thiệu giảng viên và định hướng khoá học
**[T03-001]** Hôm nay mình sẽ bắt đầu bài giảng mà không có điểm danh, và mình sẽ giới thiệu một chút về bản thân mình.

**[T03-002]** Mình là một AI Research Engineer, đang làm việc cho một startup chuyên về AI design platform. Mục tiêu của nền tảng là hỗ trợ người dùng không có kỹ năng thiết kế tạo ra các sản phẩm chất lượng.

**[T03-003]** Với nền tảng xuất phát từ nghiên cứu về [[xe-tự-hành]], mình đã có kinh nghiệm với [[computer-vision]] và một số dự án AI khác.

**[T03-004]** [Hoạt động lớp: khảo sát nhanh về nền tảng học viên.]

**[T03-005]** Mình muốn rằng trong khoá học này, các bạn sẽ tập trung hơn vào việc thực hành và áp dụng các kỹ thuật thực tế vào công việc.

**[T03-006]** Những slide và tài liệu sẽ được cung cấp bởi một nhóm các chuyên gia có kinh nghiệm trong lĩnh vực.

**[T03-007]** AI đã trở thành một công cụ thiết yếu hiện nay. Nên các bạn nên chủ động sử dụng AI trong việc học và làm việc.

**[T03-008]** Sự khác biệt giữa người sử dụng AI hiệu quả và không hiệu quả nằm ở kỹ năng đánh giá chất lượng đầu ra do AI tạo ra.

**[T03-009]** Khoá học này sẽ hướng dẫn phát triển một [[hệ-thống-agent]] trong nội dung của nó.

**[T03-010]** Nhiều học viên có những lo ngại về việc không học chuyên sâu về [[computer-vision]] nhưng mình khẳng định rằng AI hiện nay có rất nhiều sự bùng nổ không chỉ trong lĩnh vực đó.

**[T03-011]** Các bạn nên nghĩ sâu hơn về việc tạo ra một [[hệ-thống-AI]] chuyên biệt, như một bot tương tác cho một số lĩnh vực nhất định.

**[T03-012]** Việc học hiện nay cũng đang thay đổi nhanh chóng; các mô hình như AI sẽ trở nên phổ biến hơn trong tương lai.

## Slide 2 — Ba track nghề nghiệp: AI Engineer, MLOps và AI PM
**[T03-014]** Hôm nay, chúng ta sẽ học về [[product-management]], và cách các bạn có thể lựa chọn satu trong ba track: AI Engineer, MLOps và AI PM.

**[T03-015]** Track AI Engineer hướng đến việc xử lý hệ thống AI và phát triển kỹ thuật.

**[T03-016]** MLOps liên quan đến việc triển khai công việc của kỹ sư trên một nền tảng thực tế, tạo điều kiện để chạy AI hiệu quả.

**[T03-017]** AI PM đòi hỏi bạn phải hiểu yêu cầu của khách hàng và dịch các yêu cầu ấy cho team kỹ sư.

**[T03-018]** Vai trò của PM là nhìn thấu tổng thể để phát hiện rủi ro và tương tác với team kỹ sư để đảm bảo phạm vi công việc.

**[T03-019]** Bạn cũng có thể tạo ra các cách xử lý như tự host hệ thống AI hoặc lưu trữ logs trả lời để cung cấp dịch vụ cho người dùng trong các tình huống khó khăn.

**[T03-020]** Việc tối ưu hệ thống và đảm bảo hoạt động ổn định cho người dùng là chìa khóa trong quản lý dự án.

## Slide 3 — Bài toán nào dùng được LLM: case lập kế hoạch du lịch
**[T03-024]** Cách nào để nhận diện vấn đề mà LLM có thể giải quyết? Một ví dụ liên quan đến một [[AI-agent]] hỗ trợ lập kế hoạch tour cho gia đình ở VN.

**[T03-025]** Một câu hỏi mà các bạn nên xem xét: sử dụng LLM có thể giải quyết được vấn đề này không?

**[T03-026]** [Hoạt động lớp: Các học viên tương tác với câu hỏi.]

**[T03-027]** Có thể nên kết hợp nhiều phương pháp khác nhau cho hệ thống.

**[T03-028]** Có thể sử dụng cơ sở dữ liệu để lưu trữ các yếu tố bên ngoài như thời tiết, nhưng quan trọng là phải có kỹ thuật để truy xuất thông tin chính xác.

**[T03-029]** Kỹ thuật graph có thể hữu ích trong việc này, đặc biệt với các vấn đề liên quan đến [[Markov-model]].

**[T03-030]** LLM mạnh về suy luận, tuy nhiên bạn sẽ cần phải biết cách biểu diễn hệ logic bằng ngôn ngữ.

**[T03-031]** Quan trọng là bạn cần nhận thức rằng không cần giải quyết toàn bộ yêu cầu ngay từ đầu mà chỉ cần giới hạn lại.

## Slide 4 — Giới hạn của LLM, tool calling và RAG
**[T03-034]** Bạn cũng cần hiểu rằng [[LLM]] có những ví dụ gặp sai, như câu hỏi đơn giản về phép tính.

**[T03-035]** Gọi một tool ngoài như Python có thể tăng độ chính xác và đơn giản trong việc xử lý thông tin.

**[T03-036]** Cách thức dùng hiệu quả phụ thuộc vào khả năng xử lý của LLM và cần thiết phải có [[RAG]] để chắc chắn rằng thông tin được trả về là đúng.

## Slide 5 — Chọn dự án: giá trị cạnh tranh, metric và mindset đi làm
**[T03-037]** Khi chọn một dự án AI, bạn cần phải xác định rõ bối cảnh cạnh tranh và những điều mà bạn có thể tạo ra.

**[T03-038]** Lợi ích của sản phẩm cần được người dùng đánh giá, chứ không phải chỉ dựa vào công nghệ bạn cung cấp.

**[T03-039]** Hãy nhớ rằng bạn không chỉ là một sinh viên mà bạn hiện đang tập làm việc trong một môi trường thực tế với các dự án thực tế.

## Khái niệm chính
- [[ai-engineer]]: Chuyên gia kỹ thuật chuyên sâu về phát triển và ứng dụng hệ thống AI.
- [[mlops]]: Kỹ sư đảm bảo việc triển khai hiệu quả và tối ưu hệ thống ML.
- [[ai-pm]]: Quản lý sản phẩm AI, có trách nhiệm liên lạc giữa yêu cầu khách hàng và kỹ thuật.
- [[llm]]: Mô hình ngôn ngữ lớn, mạnh về tiếp nhận và xử lý ngữ nghĩa.
- [[rag]]: Hệ thống retrieval-augmented generation, giúp cải thiện thông tin đầu ra của LLM.
- [[markov-model]]: Mô hình xác suất, sử dụng để mô hình hóa dự đoán trong các hệ thống phức tạp.
- [[hệ-thống-agent]]: Hệ thống tự động hóa mà có thể phục vụ người dùng bằng các tác vụ AI.
```
