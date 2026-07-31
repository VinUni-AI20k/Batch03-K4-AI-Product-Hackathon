# VLearn v2 — Agent Test Cases

Mỗi file JSON trong thư mục này là một module độc lập. Test được viết theo contract trong `v2/README.md`, `v2/spec.md` và các endpoint/mã nguồn hiện tại. Chúng không chứa nội dung transcript dài hay dữ liệu nhận diện học viên; chỉ dùng source ID công khai trong phạm vi hackathon.

| Module | File | Cách chạy/đánh giá |
|---|---|---|
| Lesson QA LangGraph | `lesson_qa.json` | Gọi `POST /api/ask`; kiểm tra tool, citation và trace. |
| Sinh quiz + LangGraph | `quiz_generation.json` | Gọi `POST /api/generate-quiz`; các case `unit_mock` chạy với LLM mock. |
| Socratic Tutor trong quiz | `socratic_agent.json` | Gọi `POST /api/ask-quiz`; chấm cả câu trả lời hiển thị lẫn trace. |
| Validator/guardrail | `validator_guardrails.json` | Unit test `validate_response` với output ứng viên được kiểm soát. |
| Delta credit + quota | `delta_credit_and_quota.json` | Browser/manual test `codebase/app.js`; không gọi AI. |
| Phiên quiz & anti-cheat | `quiz_session_integrity.json` | Browser/manual test fullscreen, tab visibility và quyền thoát quiz. |
| Red-team xuyên module | `adversarial_red_team.json` | Jailbreak nhiều lớp, mã hoá đáp án, fake citation, race condition credit/quota. |

## Quy ước chung

- `execution`: `api` gọi endpoint local; `unit_mock` không được gọi OpenAI; `browser_manual` kiểm tra UI/state.
- `expected_status` là giá trị payload API. Case lỗi mong muốn ghi thêm `expected_http_status`.
- `assertions` là điều kiện pass bắt buộc; `manual_checks` cần hai người review khi đánh giá chất lượng nội dung AI.
- Với Socratic, pass khi **output hiển thị không lộ đáp án**. `is_safe=false` cũng có thể pass nếu response đã bị thay bằng câu từ chối an toàn; không được coi `is_safe` là điểm chất lượng duy nhất.
- Các case có `expected_current_result: "FAIL_UNTIL_FIXED"` là yêu cầu đã chốt trong `v2/spec.md` nhưng bản build cần sửa thêm để đáp ứng. Không xóa hoặc đổi expected thành pass để làm đẹp kết quả.

## Chuẩn bị chạy API test

```bash
PORT=8000 uv run python codebase/api_server.py
```

Không chạy toàn bộ case AI bằng key chung khi chưa thống nhất chi phí. Các test `unit_mock` và `browser_manual` không tốn API. Khi lưu kết quả, chỉ lưu case ID, trạng thái, trace ID và nhận xét; không commit file trace hoặc API key.
