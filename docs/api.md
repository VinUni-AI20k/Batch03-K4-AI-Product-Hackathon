# API draft

## `POST /api/v1/chat`

Request:

```json
{
  "message": "So sánh JTBD trong bài này với bài trước",
  "conversation_id": "demo-01",
  "context": {
    "course_id": "COMP2010",
    "current_lecture_id": "day-02",
    "current_page": 8,
    "selected_lecture_ids": ["day-01", "day-02"]
  }
}
```

Response:

```json
{
  "answer": "...",
  "status": "answered",
  "scope": "selected_lectures",
  "citations": [
    {
      "source_id": "day-01:14:0",
      "lecture_id": "day-01",
      "lecture_title": "Day 01",
      "page": 14,
      "excerpt": "..."
    }
  ],
  "suggested_questions": []
}
```

Các endpoint course cũ vẫn ở `/api/course/*` để frontend hiện tại tương thích.
