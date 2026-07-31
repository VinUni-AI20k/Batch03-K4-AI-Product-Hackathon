# Benchmark prompt — `03-template-ai-spec`

Hãy dùng skill `build-codelab-markdown` để tạo codelab Markdown cho lab đang
được audit.

## Contract nội dung

Đọc `03-template-ai-spec.md` và `04-rubric.md` ở repository root. Guide phải
dạy learner tạo/kiểm chứng các artifact mà chương trình chấm theo R1–R7 và
CP1–CP5: evidence log, impact table, `spec.md`, prototype, `eval/`,
`validation/`, README phân công, changelog và reflection.

Mỗi task phải tách rõ `Knowledge`, `Instructions`, `Expected outcome` và
`Deliverables`. Mọi deliverable được rubric chấm phải có path cụ thể, trạng
thái `FILE MỚI` hoặc `KHÔNG COMMIT` nếu phù hợp, và lệnh kiểm tra tương ứng.

## Quy tắc trung thực về evaluation

Không bịa số liệu khảo sát, quote, feedback, model output, test runner, quality
bar result hoặc file không tồn tại. Khi source không thể chạy do thiếu API key,
repo clone hoặc dữ liệu, ghi `Coach inference`/`Not executed` và nói rõ lý do.

Đặc biệt, phải nói rõ rằng benchmark này **không đủ thời gian chạy trọn bộ 20
testcase trên nhiều repo trong timebox 1,5 ngày**. Guide chỉ được mô tả cách
learner xây golden set và lưu kết quả; không được trình bày phần trăm đo được
nếu chưa có `eval/` run artifact thật.

## Hai fixture phải được đánh giá

1. `Day-3-Lab-Chatbot-vs-react-agent-E402/` — audit source code, config và
   docs; chạy đường mock offline khi phù hợp.
2. `frontend/content/day4-lab-research-agent-tool-eval.md` — nguồn Day 4 hiện
   có; repo clone Day 4 chưa tồn tại trong workspace.

Kết quả benchmark phải phân biệt rõ: source contract đã kiểm, runtime đã chạy,
và phần nào vẫn `Not executed`. Không được biến benchmark này thành tuyên bố
learner đã đạt rubric chương trình.
