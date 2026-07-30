# Codebase Prototype

MVP: Discord Knowledge Finder chạy trên snapshot JSON của các post/thread được whitelist.

## Luồng Chạy Dự Kiến

```text
user query
  -> normalize
  -> classify intent
  -> keyword + semantic retrieval
  -> evidence scoring
  -> AI decision: answer / clarify / abstain
  -> answer with citations OR clarify question OR fallback sources
  -> trace log
```

## Module Dự Kiến

| Module | Owner | Mô tả |
|---|---|---|
| `ingest` | Lê Trọng Việt Dũng | Đọc snapshot, clean text, tạo chunk/citation |
| `retriever` | Lê Trọng Việt Dũng | Keyword + semantic search, merge/rerank |
| `classifier` | Nguyễn Việt Phong + Nguyễn Tuấn Đức | Phân loại intent và độ mơ hồ |
| `answerer` | Nguyễn Việt Phong + Nguyễn Tuấn Đức | Prompt answer/clarify/abstain |
| `trace_logger` | Nguyễn Tuấn Đức | Lưu query, sources, decision, answer |
| `eval_runner` | Ngô Quang Anh | Chạy golden set và tính metric |

## AI Decision Policy

- `answer`: chỉ khi có nguồn đủ căn cứ và citation rõ.
- `clarify`: khi query mơ hồ nhưng có thể thu hẹp bằng một câu hỏi.
- `abstain`: khi không có nguồn, ngoài whitelist, hoặc nguồn không đủ để trả lời.

## Data

Snapshot mẫu nằm tại `codebase/data/discord_snapshot_sample.json`.

Lưu ý: không đưa dữ liệu thật/nhạy cảm vào repo public. Chỉ dùng post/thread được phép và có thể redact.
