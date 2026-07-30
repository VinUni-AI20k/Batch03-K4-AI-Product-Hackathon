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
  "query": "Cho mình link bài hướng dẫn viết AI spec?",
  "mode": "find_resource"
}
```

## Source Schema

```json
{
  "source_id": "D001",
  "channel": "thong-bao",
  "source_type": "official",
  "title": "Hướng dẫn viết AI Spec",
  "content": "Nội dung post...",
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
  "answer": "Bạn cần xem post Hướng dẫn viết AI Spec...",
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
