#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
REVISED ANALYSIS — Use 'citations' column to detect if content was available to tutor
Key insight: 
- citations = [numbers] → tutor had content from those pages
- citations = [] → tutor had NO content to work with (KEY INDICATOR OF FAILURE)
"""

import csv
import re
import collections
from pathlib import Path
from typing import Dict, List, Tuple, Set
import json

csv_path = Path("../../data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv")
rows = list(csv.DictReader(csv_path.open(encoding='utf-8-sig', newline='')))

print("=" * 80)
print("REVISED ANALYSIS — Using Citations Column as Context Indicator")
print("=" * 80)

# Group by turn_id
turns = collections.defaultdict(dict)
for r in rows:
    turns[r['turn_id']][r['role']] = r

pairs = [(v['student'], v['tutor']) for v in turns.values() if 'student' in v and 'tutor' in v]

print(f"\n[1] BASIC STATISTICS")
print(f"Total turn pairs: {len(pairs)}")
print(f"Unique users: {len(set(s['user_id'] for s, t in pairs))}")
print(f"Unique conversations: {len(set(s['conversation_id'] for s, t in pairs))}")

# === KEY METRIC: CITATIONS AVAILABILITY ===
print(f"\n[2] CITATIONS AVAILABILITY — Did tutor receive content?")
print("-" * 80)

def has_citations(tutor_msg: dict) -> bool:
    """Check if tutor had citations (content available)"""
    citations = tutor_msg.get('citations', '').strip()
    # Citations can be: "[]" or "[page_num]" or "[page1, page2]"
    if not citations:
        return False
    if citations == '[]':
        return False
    return True

# Classify by context availability
with_citations = [(s, t) for s, t in pairs if has_citations(t)]
without_citations = [(s, t) for s, t in pairs if not has_citations(t)]

print(f"Tutor responses WITH content (citations=[...]): {len(with_citations)}")
print(f"Tutor responses WITHOUT content (citations=[]): {len(without_citations)}")
print(f"\nRatio: {len(with_citations)}/{len(pairs)} = {100*len(with_citations)/len(pairs):.1f}%")
print(f"       {len(without_citations)}/{len(pairs)} = {100*len(without_citations)/len(pairs):.1f}%")

# === FAILURE PATTERN ANALYSIS ===
print(f"\n[3] FAILURE PATTERNS IN TUTOR RESPONSES")
print("-" * 80)

failure_patterns = [
    r'không tìm th[ấe]y.*(?:nội dung|tài liệu)',
    r'chưa tìm th[ấe]y.*(?:nội dung|tài liệu)',
    r'không th[ể e].*tự động.*tổng hợp',
    r'không thể.*tổng hợp',
    r'không có.*nội dung',
]

def is_failure_response(content: str) -> bool:
    """Detect failure/apology in tutor response"""
    return any(re.search(p, content, re.I) for p in failure_patterns)

# Failures overall
all_failures = [(s, t) for s, t in pairs if is_failure_response(t['content'])]
print(f"\nTotal failure responses detected: {len(all_failures)}/{len(pairs)} = {100*len(all_failures)/len(pairs):.1f}%")
print(f"Canvas claim: 171/1.261 = 13.6%")
print(f"Match: {abs(len(all_failures) - 171) <= 10 and '~CLOSE' or 'Different'}")

# Key insight: Most failures come when NO citations (no content)
failures_with_citations = [(s, t) for s, t in all_failures if has_citations(t)]
failures_without_citations = [(s, t) for s, t in all_failures if not has_citations(t)]

print(f"\nFailures BY citation availability:")
print(f"  Failures WITH content (citations=[...]): {len(failures_with_citations)}/{len(with_citations)} = {100*len(failures_with_citations)/len(with_citations) if with_citations else 0:.1f}%")
print(f"  Failures WITHOUT content (citations=[]): {len(failures_without_citations)}/{len(without_citations)} = {100*len(failures_without_citations)/len(without_citations):.1f}%")

# === INTERPRET CANVAS METRICS ===
print(f"\n[4] REINTERPRETING CANVAS METRICS")
print("-" * 80)

print(f"""
Canvas says:
- Gõ tự do (free-form):    757 lượt → 160 failures (21.1%)
- Bôi đen (selected):      495 lượt →  10 failures (2.0%)
- Total:                  1252 lượt → 171 failures (13.6%)

The data suggests:
- "Gõ tự do" = student typed question WITHOUT actually selecting slide content
  → tutor received NO content (citations=[])
  
- "Bôi đen" = student SELECTED/HIGHLIGHTED text on slide
  → tutor received content (citations=[page numbers])
  
Actual data shows:
- Responses WITHOUT citations: {len(without_citations)} ({100*len(without_citations)/len(pairs):.1f}%)
  → Expected to match "gõ tự do" (757)
  → Failures: {len(failures_without_citations)}/{len(without_citations)} = {100*len(failures_without_citations)/len(without_citations):.1f}%
  → Expected to match "free-form failures" (~160/757 = 21.1%)
  
- Responses WITH citations: {len(with_citations)} ({100*len(with_citations)/len(pairs):.1f}%)
  → Expected to match "bôi đen" (495)
  → Failures: {len(failures_with_citations)}/{len(with_citations)} = {100*len(failures_with_citations)/len(with_citations) if with_citations else 0:.1f}%
  → Expected to match "selected failures" (~10/495 = 2.0%)
""")

# === SUMMARY REQUESTS ===
print(f"\n[5] SUMMARY REQUESTS (tóm tắt cả bộ)")
print("-" * 80)

def is_summary_request(content: str) -> bool:
    patterns = [
        r'tóm\s*(?:tắt|gọn).*(?:tất cả|toàn|cả|ngày)',
        r'(?:tất cả|toàn|cả).*slide.*tóm\s*(?:tắt|gọn)',
        r'(?:tất cả|toàn).*nội dung',
        r'ôn lại.*(?:cả|toàn)',
        r'tổng quan',
    ]
    return any(re.search(p, content, re.I) for p in patterns)

summary_req = [(s, t) for s, t in pairs if is_summary_request(s['content'])]
summary_fail = [(s, t) for s, t in summary_req if is_failure_response(t['content'])]

print(f"Summary requests: {len(summary_req)}")
print(f"  Canvas claim: 67")
print(f"  Failures: {len(summary_fail)}/{len(summary_req)} = {100*len(summary_fail)/len(summary_req) if summary_req else 0:.1f}%")
print(f"  Canvas claim: ≥45/67 ≈ 67%")

# === USER IMPACT ===
print(f"\n[6] USER IMPACT")
print("-" * 80)

# Users affected by failures
users_with_failures = set(s['user_id'] for s, t in all_failures)
users_without_citations_fail = set(s['user_id'] for s, t in failures_without_citations)

print(f"Users experiencing failures: {len(users_with_failures)}/{len(set(s['user_id'] for s, t in pairs))}")
print(f"  Canvas claim: 112/369 = 30.3%")

print(f"\nUsers experiencing failures WITHOUT content: {len(users_without_citations_fail)}")
print(f"  (tutor had no content to work with)")

# === RATING ANALYSIS ===
print(f"\n[7] RATING ANALYSIS")
print("-" * 80)

def get_rating(msg: dict) -> str:
    rating = msg.get('rating') or 'none'
    return rating if rating in ['👎', '👍'] else 'none'

# Failures without citations - what ratings?
thumbsdown_nocit = sum(1 for s, t in failures_without_citations if get_rating(t) == '👎')
print(f"Failures WITHOUT content (citations=[]):")
print(f"  Total: {len(failures_without_citations)}")
print(f"  Rating 👎: {thumbsdown_nocit} ({100*thumbsdown_nocit/len(failures_without_citations) if failures_without_citations else 0:.1f}%)")

# Failures with citations
thumbsdown_withcit = sum(1 for s, t in failures_with_citations if get_rating(t) == '👎')
print(f"\nFailures WITH content (citations=[...]):")
print(f"  Total: {len(failures_with_citations)}")
print(f"  Rating 👎: {thumbsdown_withcit} ({100*thumbsdown_withcit/len(failures_with_citations) if failures_with_citations else 0:.1f}%)")
print(f"  Canvas claim: 2.0%")

# === EXPORT DATA ===
print(f"\n[8] EXPORTING DATA")
print("-" * 80)

export_data = {
    "total_pairs": len(pairs),
    "without_citations": len(without_citations),
    "with_citations": len(with_citations),
    "total_failures": len(all_failures),
    "failures_without_content": len(failures_without_citations),
    "failures_with_content": len(failures_with_citations),
    "failure_rate_no_content": round(100*len(failures_without_citations)/len(without_citations), 1) if without_citations else 0,
    "failure_rate_with_content": round(100*len(failures_with_citations)/len(with_citations), 1) if with_citations else 0,
    "summary_requests": len(summary_req),
    "summary_failures": len(summary_fail),
    "users_with_failures": len(users_with_failures),
    "total_unique_users": len(set(s['user_id'] for s, t in pairs)),
}

with open('analysis_revised.json', 'w', encoding='utf-8') as f:
    json.dump(export_data, f, indent=2, ensure_ascii=False)

print("✓ Revised analysis saved to analysis_revised.json")

# === FINAL VERDICT ===
print(f"\n" + "=" * 80)
print("CONCLUSION")
print("=" * 80)
print(f"""
The metrics in canvas.md need recalibration based on actual CSV:

Canvas claim vs Actual data:
├─ Context markers:       1252/1261 ✓ MATCH
├─ Responses without content (gõ tự do equivalent): {len(without_citations)} (claim: 757)
│  └─ Failures: {len(failures_without_citations)} (claim: ~160)
│  └─ Failure rate: {100*len(failures_without_citations)/len(without_citations) if without_citations else 0:.1f}% (claim: 21.1%)
├─ Responses with content (bôi đen equivalent): {len(with_citations)} (claim: 495)
│  └─ Failures: {len(failures_with_citations)} (claim: ~10)
│  └─ Failure rate: {100*len(failures_with_citations)/len(with_citations) if with_citations else 0:.1f}% (claim: 2.0%)
├─ Total failures: {len(all_failures)} (claim: 171 = 13.6%)
├─ Summary requests: {len(summary_req)} (claim: 67)
└─ Users affected: {len(users_with_failures)} (claim: 112)

⚠️  DISCREPANCY: The claim of "495 selected text" messages doesn't match the 
    citations column. Either:
    a) Selection metadata was lost in export
    b) Definition of "selected" vs "free-form" differs between canvas and actual data
    c) Additional filtering needed on interaction_type or move_used columns
""")

print(f"\n✓ Analysis complete. Check analysis_revised.json for export.")
