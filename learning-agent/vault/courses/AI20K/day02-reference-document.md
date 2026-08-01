---
course: AI20K
generated: '2026-07-30T17:35:49+00:00'
lang: vi
lesson: day02-reference-document
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/day02-reference-document.pdf
source_hash: sha256:d7fa19a6113d3ab2c33d77c8259a9bdbf7e3a6ee8e3ef48cada11c9b5b35aeb7
type: lesson-note
---

## Slide 1 — Frameworks & Decision Models

| Framework                                   | Mô t ả                                                                                                                               | Ngu ồ n            |
|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| Business-to-AI Translation                  | Dịch yêu cầu mơ hồ ("tôi muốn chatbot") thành bài toán có cấu trúc: Actor, Workflow, Bottleneck, Impact, Metric, Boundary.        | Bài giảng Ngày 2   |
| AI Possibility Spectrum                     | Phân loại 3 mức: Easy / Hard / Impossible cho AI hiện tại. Giúp đặt kỳ vọng đúng đắn.                                              | Bài giảng Ngày 2   |
| AI Fit Matrix                               | Ma trận Ambiguity × Complexity → gợi ý Rule / LLM Feature / Agent.                                                                   | Bài giảng Ngày 2   |
| Escalation Ladder                           | Prompt → Retrieval → Workflow → Agent. Luôn bắt đầu từ đơn giản nhất.                                                               | Bài giảng Ngày 2   |
| Non-AI Baseline                             | Trước khi build AI, lập baseline rule/manual và đo chất lượng. AI phải thắng baseline rõ ràng.                                     | Bài giảng Ngày 2   |
| Buy / Build / Boost                         | Ba lựa chọn: Mua giải pháp có sẵn, Xây từ đầu, hoặc Tăng cường workflow hiện tại bằng AI.                                          | Bài giảng Ngày 2   |
| Problem Statement Template                  | Khung PS có cấu trúc: Actor, Workflow, Bottleneck, Impact, Metric, Boundary.                                                       | Bài giảng Ngày 2   |
| AI Readiness Checklist                      | 5 câu hỏi đánh giá sẵn sàng: data, metric, failure tolerance, user readiness, resource. Dưới 3 YES = chưa nên build.                | Bài giảng Ngày 2   |
| Go / No-Go / Not Yet                        | Quyết định 3 hướng: Go (build), No-Go (không phù hợp), Not Yet (tiềm năng nhưng chưa đủ điều kiện).                               | Bài giảng Ngày 2   |

## Slide 2 — Frameworks bên ngoài (External)

### Google People + AI Research Guidebook
Bộ hướng dẫn thiết kế sản phẩm AI có trách nhiệm từ Google. Chương "User Needs & Defining Success" đặc biệt liên quan đến bài tập AI Suitability và Underspecification trong lab Ngày 2.  
- [Guidebook: pair.withgoogle.com/guidebook](https://pair.withgoogle.com/guidebook/)

### Microsoft HAX Toolkit - Human-AI Interaction Guidelines
18 nguyên tắc thiết kế tương tác người-AI, được validate qua nghiên cứu 20+ năm. Bổ sung cho phần AI UX Patch Pattern trong bài giảng.  
- [microsoft.com/en-us/haxtoolkit](https://www.microsoft.com/en-us/haxtoolkit/)

### NIST AI Risk Management Framework
Khung quản lý rủi ro AI từ NIST. Cung cấp 4 chức năng: Govern, Map, Measure, Manage - phù hợp cho ai muốn tìm hiểu sâu hơn về đánh giá rủi ro AI ở cấp tổ chức.  
- [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)

### Google Rules of Machine Learning
Bộ 43 quy tắc thực tiễn cho ML engineering từ Google. Được tham chiếu trong slide Gate Criteria về heuristic khi nào nên tiếp tục vs. dừng lại.  
- [developers.google.com/machine-learning/guides/rules-of-ml](https://developers.google.com/machine-learning/guides/rules-of-ml)

## Slide 3 — Case Studies

### Google Flu Trends - Sai problem framing & proxy metric
Google Flu Trends dùng dữ liệu tìm kiếm để dự đoán dịch cúm. Ban đầu tương quan 97.5% với CDC, nhưng sau đó sai cho 100/108 tuần, over-predict 50%, và bỏ lỡ H1N1. Bài học: proxy metric tốt ban đầu không đảm bảo đúng mãi; big data không thay thế phương pháp truyền thống.  
- [science.org/doi/10.1126/science.1248506](https://www.science.org/doi/10.1126/science.1248506)

### Google Photos - Quyết định KHÔNG dùng AI
Case study từ Google Photos: team đánh giá dùng AI cho photo filters nhưng quyết định KHÔNG dùng vì rule-based đã đủ tốt. Minh họa nguyên tắc "Non-AI Baseline".  

### Stripe AI - LLM cho internal reporting
Stripe dùng LLM tạo weekly summary tự động; PM review trước khi gửi. Kết quả: giảm 60% thời gian viết báo cáo, 70% adoption sau 3 tháng. Minh họa pattern "AI is Boost, not Replace".  

### GitHub Copilot - AI suggestion UX
GitHub Copilot là ví dụ tiêu biểu cho UX pattern "ghost text" (gợi ý inline). Người dùng giữ quyền chấp nhận/từ chối mỗi gợi ý - minh họa nguyên tắc "AI suggest, human decide".  
- [github.com/features/copilot](https://github.com/features/copilot)

### Grammarly - Inline AI feedback
Grammarly dùng AI để gợi ý sửa lỗi ngữ pháp và văn phong ngay trong lúc viết. Ví dụ về "suggest-only" UX pattern - AI không tự sửa, chỉ highlight và gợi ý.  
- [grammarly.com](https://www.grammarly.com/)

### Gmail Smart Compose - Ghost text pattern
Google dùng neural network để gợi ý hoàn thành câu email. Ví dụ kinh điển về "ghost text" UX pattern với latency cực thấp, phục vụ 1.4 tỷ người dùng.  
- [research.google/blog/smart-compose-using-neural-networks-to-help-writeemails](https://research.google/blog/smart-compose-using-neural-networks-to-help-writeemails)

### ChatGPT - Conversational AI UX patterns
ChatGPT đại diện cho mô hình conversational AI - người dùng nhập câu hỏi tự do, AI trả lời dạng văn bản dài. Minh họa cả điểm mạnh (linh hoạt) và điểm yếu (khó kiểm soát chất lượng output) của UX dạng hội thoại.  
- [chat.openai.com](https://chat.openai.com/)

## Khái niệm chính

- [[business-to-ai-translation]]: Dịch yêu cầu mơ hồ thành bài toán có cấu trúc.
- [[ai-possibility-spectrum]]: Phân loại mức độ khả thi của AI.
- [[ai-fit-matrix]]: Ma trận Ambiguity × Complexity.
- [[escalation-ladder]]: Quy trình từ prompt đến agent.
- [[non-ai-baseline]]: Quy tắc/chuẩn mực không dùng AI để đánh giá trước khi triển khai.
- [[buy-build-boost]]: Các lựa chọn về phát triển giải pháp AI.
- [[problem-statement-template]]: Khung để xác định vấn đề.
- [[ai-readiness-checklist]]: Danh sách kiểm tra tính sẵn sàng cho dự án AI.
- [[go-no-go-not-yet]]: Quyết định về việc có nên xây dựng giải pháp hay không.
