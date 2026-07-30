# Architecture - Discord Knowledge Finder

## Thành Phần

```text
Frontend/CLI
  -> Query Normalizer
  -> Intent Classifier
  -> Retriever
       -> Keyword index
       -> Semantic index
       -> Reranker
  -> Evidence Scorer
  -> Decision Maker
       -> answer
       -> clarify
       -> abstain
  -> Response Composer
  -> Trace Logger
```

## Input Schema

```json
{
  "query": "Deadline nộp AI Spec là khi nào?",
  "mode": "find_resource"
}
```

## Source Schema

```json
{
  "source_id": "D001",
  "channel": "thong-bao",
  "source_type": "official",
  "title": "Thông báo deadline nộp AI Spec",
  "content": "Nội dung thông báo...",
  "comments": [],
  "url": "https://discord.com/channels/...",
  "created_at": "2026-07-30T00:00:00+07:00",
  "tags": ["spec", "hackathon"]
}
```

## Output Schema

```json
{
  "decision": "answer",
  "answer": "Deadline nộp AI Spec là 23:59 ngày 1, theo thông báo D001...",
  "citations": [
    {
      "source_id": "D001",
      "url": "https://discord.com/channels/...",
      "source_type": "official"
    }
  ],
  "confidence": "high"
}
```

## Trace Schema

```json
{
  "query": "...",
  "intent": "find_resource",
  "retrieved": ["D001", "D004", "D009"],
  "decision": "answer",
  "answer": "...",
  "latency_ms": 0
}
```
