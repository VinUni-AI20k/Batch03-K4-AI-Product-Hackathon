"""
Tool 8: check_deadline
Tra cứu deadline và lịch trình Mini Hackathon AI Batch 03.
Trả về thông tin chính xác, không phụ thuộc LLM.
"""
import json
from datetime import datetime, timezone, timedelta

SCHEMA = {
    "type": "function",
    "function": {
        "name": "check_deadline",
        "description": (
            "Tra cứu deadline, lịch trình, mốc thời gian của Mini Hackathon AI Batch 03. "
            "Dùng khi hỏi về checkpoint, hạn nộp, lịch demo, lịch chấm điểm."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": "Từ khóa tìm kiếm (ví dụ: 'CP4', 'spec', 'demo', 'chấm điểm', 'ngày 1')."
                }
            },
            "required": ["keyword"]
        }
    }
}

SCHEDULE = [
    {"id": "cp1",    "name": "CP1 – Check-in nhóm",             "time": "Ngày 1, 09:00",        "detail": "Xác nhận thành viên nhóm, bắt đầu brainstorm ý tưởng."},
    {"id": "cp2",    "name": "CP2 – Chốt vấn đề & JTBD",        "time": "Ngày 1, 11:00",        "detail": "Trình bày vấn đề, Job-to-be-Done, đối tượng người dùng."},
    {"id": "cp3",    "name": "CP3 – Phác thảo giải pháp",       "time": "Ngày 1, 13:30",        "detail": "Demo wireframe / prototype sơ bộ, kiến trúc hệ thống."},
    {"id": "cp4",    "name": "CP4 – Chốt spec.md (on-class)",   "time": "Ngày 1, 17:30",        "detail": "Chốt tiến độ trên lớp. Hard deadline nộp spec.md: 23:59 Ngày 1."},
    {"id": "spec",   "name": "Hard Deadline – Nộp spec.md",     "time": "Ngày 1, 23:59",        "detail": "Nộp spec.md hoàn chỉnh lên repo GitHub. Sau thời điểm này không nhận thêm."},
    {"id": "cp5",    "name": "CP5 – Demo prototype",             "time": "Ngày 2, 08:30–10:00",  "detail": "Demo working prototype, giải thích từng phần code (Vibe-coding rule)."},
    {"id": "cp6",    "name": "CP6 – Demo & Chấm điểm cuối",     "time": "Ngày 2, 10:00–15:00",  "detail": "Demo hoàn chỉnh trước Ban giám khảo. Chấm điểm theo rubric."},
    {"id": "result", "name": "Công bố kết quả",                  "time": "Ngày 2, 15:30",        "detail": "Trao giải, tổng kết khóa học."},
]


def run(keyword: str = "", **_) -> str:
    kw = keyword.lower().strip()
    if not kw:
        return json.dumps({"schedule": SCHEDULE, "note": "Lịch đầy đủ Mini Hackathon AI Batch 03."}, ensure_ascii=False, indent=2)

    matched = [
        s for s in SCHEDULE
        if kw in s["id"].lower()
        or kw in s["name"].lower()
        or kw in s["detail"].lower()
        or kw in s["time"].lower()
    ]

    if not matched:
        return json.dumps({
            "found": 0,
            "keyword": keyword,
            "message": "Không tìm thấy mốc thời gian phù hợp.",
            "all_ids": [s["id"] for s in SCHEDULE],
        }, ensure_ascii=False)

    return json.dumps({"found": len(matched), "results": matched}, ensure_ascii=False, indent=2)
