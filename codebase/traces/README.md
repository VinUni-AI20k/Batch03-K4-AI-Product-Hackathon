# Trace Logs

Lưu log mỗi lượt AI call/prototype run tại đây.

Khuyến nghị format: JSONL, mỗi dòng một run.

```json
{"query":"...","intent":"find_resource","retrieved":["D001"],"decision":"answer","answer":"...","citations":["D001"]}
```

Không log API key, token, thông tin cá nhân, hoặc nội dung Discord không được phép.
