# Eval

`golden_set.json` có 20 case: 8 thường, 2/lớp khó ①②③④ và 4 hiếm; 10 case phát triển từ chatlog thật, chỉ lưu turn ID.

Chạy server có API key ở terminal 1, rồi terminal 2:

```bash
uv run python eval/run_eval.py
```

Kết quả máy tự lưu trong `eval/results/`. Hai người phải chấm độc lập `manual_grounded` và `manual_relevance`; không thay đổi quality bar sau 23:59 ngày 1.
