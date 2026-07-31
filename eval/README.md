# Eval

`golden_set.json` có 20 case: 8 thường, 2/lớp khó ①②③④ và 4 hiếm; 10 case phát triển từ chatlog thật, chỉ lưu turn ID.

Chạy server có API key ở terminal 1, rồi terminal 2:

```bash
uv run python eval/run_eval.py
```

Kết quả máy tự lưu trong `eval/results/`. Hai người phải chấm độc lập `manual_grounded` và `manual_relevance`; không thay đổi quality bar sau 23:59 ngày 1.

## Đánh giá toàn bộ module

`run_module_eval.py` bổ sung báo cáo thống nhất cho sáu module:

| Suite | Nội dung đo |
|---|---|
| `lesson_qa` | Grounding, citation và tool-call |
| `quiz_generation` | Nội dung quiz, nguồn và chuỗi tool |
| `socratic_agent` | Khả năng gợi mở, không lộ đáp án |
| `validator_guardrails` | Quyết định block/allow |
| `delta_credit_and_quota` | Cộng credit và giới hạn quota |
| `quiz_integrity` | Fullscreen, cảnh báo và kết thúc bài |

Kiểm tra evaluator:

```bash
uv run python -m unittest eval.test_module_eval -v
```

Smoke test toàn bộ pipeline:

```bash
uv run python eval/run_module_eval.py \
  --adapter eval.adapters.mock_vlearn_adapter
```

Smoke adapter chỉ kiểm tra hệ thống đo, không phải bằng chứng chất lượng Agent.
Để đánh giá Agent thật, sao chép `eval/adapters/project_adapter_template.py`
thành adapter của dự án, gọi Agent/API thật trong `run_case()`, rồi chạy:

```bash
uv run python eval/run_module_eval.py \
  --adapter eval.adapters.project_adapter \
  --quality-bar 0.8 \
  --fail-under
```

Mỗi lượt chạy tạo:

- `case_logs.json`: input/output, latency, exception và điểm từng case;
- `summary.json`: thống kê máy đọc được;
- `summary.md`: pass rate và p50/p95 theo từng module.

Một case chỉ pass khi đạt toàn bộ metric bắt buộc. Citation và tool-call được
tính cả precision lẫn recall để phạt trường hợp bịa nguồn hoặc gọi tool thừa.
BLEU và ROUGE-L chỉ là chỉ số tham khảo; validator, integrity và quota được
kiểm tra bằng hành vi xác định.
