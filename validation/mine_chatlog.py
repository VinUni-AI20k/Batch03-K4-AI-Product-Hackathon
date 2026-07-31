#!/usr/bin/env python3
"""
Script đếm bằng chứng từ chatlog VLearn tutor — Đường B (mining).

Mục đích: mọi con số trong `validation/evidence-log.md` phải chạy lại được.
Người chấm chỉ cần chạy file này và đối chiếu output với evidence-log.

Cách chạy (từ thư mục gốc repo):
    python validation/mine_chatlog.py

Lưu ý: script CHỈ đọc data pack, không ghi/không sửa gì trong data/.
Data pack không được commit lên repo nộp bài — script này giả định
data/ tồn tại trên máy người chạy.
"""

import csv
import os
import re
import sys
from collections import Counter

CSV_PATH = os.path.join(
    "data", "vlearn-pack", "chatlog", "chat_history_anonymized_for_hackathon.csv"
)

# Cụm từ cho thấy tutor KHÔNG trả lời được / không tìm ra căn cứ trong tài liệu.
# Quy tắc: khớp không phân biệt hoa thường, chỉ cần xuất hiện 1 cụm là tính.
FAIL_PHRASES = re.compile(
    r"(không tìm thấy|rất tiếc|xin lỗi|không thấy|không tồn tại|nằm ngoài phạm vi)",
    re.IGNORECASE,
)


def load(path):
    if not os.path.exists(path):
        sys.exit(
            f"Không tìm thấy {path}\n"
            "Chạy script từ thư mục gốc repo, và đảm bảo data pack có trên máy."
        )
    with open(path, encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main():
    rows = load(CSV_PATH)

    students = [r for r in rows if r["role"] == "student"]
    tutors = [r for r in rows if r["role"] == "tutor"]

    # --- Quy mô dataset ---
    n_users = len({r["user_id"] for r in rows})
    n_convs = len({r["conversation_id"] for r in rows})
    n_turns = len({(r["conversation_id"], r["turn_id"]) for r in rows})

    print("=" * 62)
    print("QUY MÔ DATASET")
    print("=" * 62)
    print(f"  Tổng dòng           : {len(rows)}")
    print(f"  Dòng student        : {len(students)}")
    print(f"  Dòng tutor          : {len(tutors)}")
    print(f"  Turn (cặp hỏi-đáp)  : {n_turns}")
    print(f"  Học viên (user_id)  : {n_users}")
    print(f"  Hội thoại           : {n_convs}")

    # --- Số 1: tỷ lệ intent review_concept ---
    # Đếm trên DÒNG TUTOR, vì cột move_used chỉ được gán cho lượt trả lời của tutor.
    # (Dòng student luôn để trống move_used — nếu đếm cả 2 vai thì mẫu số sai gấp đôi.)
    moves = Counter(r.get("move_used", "") for r in tutors)
    rc = [r for r in tutors if r.get("move_used") == "review_concept"]

    print()
    print("=" * 62)
    print("SỐ 1 — Intent review_concept (nhắc lại lý thuyết)")
    print("=" * 62)
    print("  Phân bố move_used trên dòng tutor:")
    for move, cnt in moves.most_common():
        label = move if move else "(trống)"
        print(f"    {label:<24} {cnt:>5}  ({100 * cnt / len(tutors):.1f}%)")
    print()
    print(f"  >>> review_concept: {len(rc)}/{len(tutors)} = {100 * len(rc) / len(tutors):.1f}%")
    print(f"      Học viên có ≥1 turn review_concept : {len({r['user_id'] for r in rc})}/{n_users}")
    print(f"      Hội thoại có ≥1 turn review_concept: {len({r['conversation_id'] for r in rc})}/{n_convs}")

    # --- Số 2: tutor trả lời KHÔNG kèm trích dẫn ---
    # Quy tắc: cột citations == "[]" (mảng rỗng) nghĩa là câu trả lời không gắn
    # được về trang tài liệu nào.
    no_cit = [r for r in tutors if r.get("citations", "").strip() == "[]"]
    rc_no_cit = [r for r in rc if r.get("citations", "").strip() == "[]"]

    print()
    print("=" * 62)
    print("SỐ 2 — Câu trả lời KHÔNG có trích dẫn nguồn")
    print("=" * 62)
    print(f"  citations == []  : {len(no_cit)}/{len(tutors)} = {100 * len(no_cit) / len(tutors):.1f}%")
    print(f"  riêng review_concept: {len(rc_no_cit)}/{len(rc)} = {100 * len(rc_no_cit) / len(rc):.1f}%")

    # --- Số 3: tutor báo không tìm được căn cứ ---
    failed = [r for r in tutors if FAIL_PHRASES.search(r["content"])]
    rc_failed = [r for r in rc if FAIL_PHRASES.search(r["content"])]

    print()
    print("=" * 62)
    print("SỐ 3 — Tutor báo không tìm được nội dung trong tài liệu")
    print("=" * 62)
    print(f"  (khớp cụm: {FAIL_PHRASES.pattern})")
    print(f"  Toàn bộ tutor turn  : {len(failed)}/{len(tutors)} = {100 * len(failed) / len(tutors):.1f}%")
    print(f"  Riêng review_concept: {len(rc_failed)}/{len(rc)} = {100 * len(rc_failed) / len(rc):.1f}%")

    # --- Số 4: tín hiệu phụ ---
    ratings = Counter(r.get("rating", "") for r in rows if r.get("rating"))
    checks = Counter(r.get("asked_check_question", "") for r in rows)

    print()
    print("=" * 62)
    print("SỐ 4 — Tín hiệu phụ")
    print("=" * 62)
    print(f"  Rating có gắn nhãn  : {dict(ratings)}")
    print(f"  asked_check_question: {dict(checks)}")


if __name__ == "__main__":
    main()
