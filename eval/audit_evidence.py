#!/usr/bin/env python3
"""Reproduce the evidence counts cited by spec.md."""

import csv
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "vlearn-pack" / "chatlog" / "chat_history_anonymized_for_hackathon.csv"
OUT_PATH = ROOT / "eval" / "evidence_audit.md"

SUMMARY = re.compile(r"tóm tắt|tóm gọn|tổng hợp|khái quát|ý chính|đầu mục", re.IGNORECASE)
EXPLICIT_VISUAL = re.compile(r"khoanh|bôi đỏ|vùng chọn|crop", re.IGNORECASE)
REFUSAL = re.compile(
    r"rất tiếc|không tìm thấy|không thể (?:xác định|truy cập|nhìn|thấy)|"
    r"chưa (?:thể|truy cập)|không có (?:đủ )?thông tin",
    re.IGNORECASE,
)


def main() -> None:
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    turns = {}
    for row in rows:
        turns.setdefault(row["turn_id"], {})[row["role"]] = row
    pairs = [pair for pair in turns.values() if {"student", "tutor"} <= pair.keys()]

    def measure(pattern):
        found = [pair for pair in pairs if pattern.search(pair["student"]["content"])]
        no_cite = [pair for pair in found if (pair["tutor"]["citations"] or "").strip() in {"", "[]", "null"}]
        refusals = [pair for pair in found if REFUSAL.search(pair["tutor"]["content"])]
        return found, no_cite, refusals

    summaries, summary_no_cite, summary_refusals = measure(SUMMARY)
    visuals, visual_no_cite, visual_refusals = measure(EXPLICIT_VISUAL)
    all_tutor = [pair["tutor"] for pair in pairs]
    all_no_cite = [row for row in all_tutor if (row["citations"] or "").strip() in {"", "[]", "null"}]

    lines = [
        "# Evidence audit — chatlog VLearn",
        "",
        "## Kết quả tái lập",
        "",
        f"- **{len(rows):,} messages = {len(pairs):,} cặp student–tutor**, {len(set(r['conversation_id'] for r in rows))} hội thoại.",
        f"- **{len(all_no_cite)}/{len(all_tutor)}** câu tutor có `citations` rỗng.",
        f"- Ý định tóm tắt: **{len(summaries)} lượt**; **{len(summary_refusals)}** có ngôn ngữ từ chối/không tìm thấy; **{len(summary_no_cite)}** không citation.",
        f"- Yêu cầu vùng ảnh rõ ràng (`khoanh|bôi đỏ|vùng chọn|crop`): **{len(visuals)} lượt**; **{len(visual_refusals)}** bị từ chối/không tìm thấy; **{len(visual_no_cite)}** không citation.",
        "",
        "## Phương pháp",
        "",
        "- Ghép đúng một message `student` với một message `tutor` theo `turn_id`.",
        "- Summary regex: `tóm tắt|tóm gọn|tổng hợp|khái quát|ý chính|đầu mục`.",
        "- Visual regex (cố ý hẹp): `khoanh|bôi đỏ|vùng chọn|crop`.",
        "- Refusal regex nhận các cụm như `rất tiếc`, `không tìm thấy`, `không thể truy cập/nhìn thấy`, `không có thông tin`.",
        "- Đây là phép đếm keyword có thể tái lập, không phải phân loại semantic hoàn hảo.",
        "",
        "## Ví dụ visual bị từ chối",
        "",
    ]
    for pair in visual_refusals[:5]:
        student = " ".join(pair["student"]["content"].split())[:180]
        lines.append(f"- `{pair['student']['turn_id']}` — {student}")
    OUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(OUT_PATH.relative_to(ROOT))


if __name__ == "__main__":
    main()
