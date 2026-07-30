#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyze chatlog CSV and verify all metrics from canvas.md
Verify metrics:
- Total messages and context rates
- Failure rates by input method (selected vs free-form)
- Summary request failures
- User impact
- Rating distributions
"""

import csv
import re
import collections
from pathlib import Path
from typing import Dict, List, Tuple, Set
import json

# Load CSV
csv_path = Path("../../data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv")
rows = list(csv.DictReader(csv_path.open(encoding='utf-8-sig', newline='')))

print("=" * 80)
print("CHATLOG ANALYSIS — Verify Canvas.md Metrics")
print("=" * 80)

# === SECTION 1: BASIC STATISTICS ===
print("\n[1] BASIC STATISTICS")
print("-" * 80)
total_rows = len(rows)
print(f"Total rows: {total_rows}")

# Group by turn_id to create (student_msg, tutor_msg) pairs
turns = collections.defaultdict(dict)
for r in rows:
    turns[r['turn_id']][r['role']] = r

# Filter valid pairs (have both student and tutor)
pairs = []
for turn_id, messages in turns.items():
    if 'student' in messages and 'tutor' in messages:
        pairs.append((messages['student'], messages['tutor']))

print(f"Valid turn pairs: {len(pairs)}")

# Extract metadata
unique_users = set(r['user_id'] for r in rows)
unique_conversations = set(r['conversation_id'] for r in rows)
print(f"Unique users: {len(unique_users)}")
print(f"Unique conversations: {len(unique_conversations)}")

in_class_messages = [r for r in rows if r.get('conversation_mode') == 'in_class']
print(f"In-class messages: {len(in_class_messages)} ({100*len(in_class_messages)/len(rows):.1f}%)")

# === SECTION 2: CONTEXT & SELECTION TYPE ===
print("\n[2] CONTEXT & SELECTION TYPE")
print("-" * 80)

# Check if student message has context marker (đoạn được chọn / trang)
def has_selection_marker(content: str) -> bool:
    """Check if message has '(Trang X' or 'đoạn được chọn' pattern"""
    return bool(re.search(r'\(Trang\s+\d+', content)) or "đoạn được chọn" in content

with_context = sum(1 for s, t in pairs if has_selection_marker(s['content']))
print(f"Messages with context marker (Trang X, đoạn được chọn): {with_context}/{len(pairs)}")
print(f"  → Canvas claim: 1.252/1.261")
print(f"  → Match: {with_context == 1252 or 'CLOSE' if abs(with_context - 1252) < 5 else 'DIFFERENT'}")

# Extract selection vs free-form
def is_selected_text(content: str) -> bool:
    """Check if student has selected/highlighted text"""
    return "đoạn được chọn" in content and bool(re.search(r'""[^"]*""', content))

def is_free_form(content: str) -> bool:
    """Check if student just typed a question without selection"""
    return bool(re.search(r'\(Trang\s+\d+', content)) and not is_selected_text(content)

selected_pairs = [(s, t) for s, t in pairs if is_selected_text(s['content'])]
freeform_pairs = [(s, t) for s, t in pairs if is_free_form(s['content'])]
other_pairs = [(s, t) for s, t in pairs if not (is_selected_text(s['content']) or is_free_form(s['content']))]

print(f"\nMessage type breakdown:")
print(f"  Selected text (bôi đen):    {len(selected_pairs)}")
print(f"  Free-form question:          {len(freeform_pairs)}")
print(f"  Other (no page context):     {len(other_pairs)}")
print(f"  Total:                       {len(selected_pairs) + len(freeform_pairs) + len(other_pairs)}")

print(f"\n  Canvas claims:")
print(f"  - Gõ tự do (free-form): 757")
print(f"  - Bôi đen (selected):    495")
print(f"  → Match free-form: {len(freeform_pairs) == 757 or f'Got {len(freeform_pairs)}'}")
print(f"  → Match selected:  {len(selected_pairs) == 495 or f'Got {len(selected_pairs)}'}")

# === SECTION 3: FAILURE DETECTION ===
print("\n[3] FAILURE DETECTION - Tutor Says 'Cannot Find/Summarize'")
print("-" * 80)

# Define failure patterns
failure_patterns = [
    r'không tìm th[ấe]y.*nội dung|chưa tìm th[ấe]y.*nội dung',
    r'không th[ể e].*tự động.*tổng hợp|không tìm th[ấe]y.*tài liệu.*tổng hợp',
    r'không có thông tin|không có nội dung cụ thể'
]

def is_failure(tutor_content: str) -> bool:
    """Check if tutor response indicates failure to find content"""
    for pattern in failure_patterns:
        if re.search(pattern, tutor_content, re.I | re.IGNORECASE):
            return True
    return False

# Count failures overall
all_failures = [(s, t) for s, t in pairs if is_failure(t['content'])]
print(f"Total failures (tutor says 'cannot find/summarize'): {len(all_failures)}/{len(pairs)}")
print(f"  → Canvas claim: 171/1.261 = 13.6%")
print(f"  → Actual: {len(all_failures)}/{len(pairs)} = {100*len(all_failures)/len(pairs):.1f}%")
print(f"  → Match: {abs(len(all_failures) - 171) <= 5 and 'YES' or 'INVESTIGATE'}")

# Failures by type
selected_failures = [(s, t) for s, t in selected_pairs if is_failure(t['content'])]
freeform_failures = [(s, t) for s, t in freeform_pairs if is_failure(t['content'])]

print(f"\nFailures by input type:")
print(f"  Selected text:  {len(selected_failures)}/{len(selected_pairs)} = {100*len(selected_failures)/len(selected_pairs):.1f}%")
print(f"    → Canvas claim: 10/495 = 2.0%")
print(f"    → Match: {abs(len(selected_failures) - 10) <= 2 and 'YES' or 'INVESTIGATE'}")

print(f"  Free-form:      {len(freeform_failures)}/{len(freeform_pairs)} = {100*len(freeform_failures)/len(freeform_pairs):.1f}%")
print(f"    → Canvas claim: 160/757 = 21.1%")
print(f"    → Match: {abs(len(freeform_failures) - 160) <= 5 and 'YES' or 'INVESTIGATE'}")

# === SECTION 4: SUMMARY REQUESTS ===
print("\n[4] SUMMARY REQUESTS (tóm tắt cả bộ / cả ngày)")
print("-" * 80)

def is_summary_request(content: str) -> bool:
    """Detect if student is asking for full/day summary"""
    patterns = [
        r'tóm\s*(?:tắt|gọn).*(?:tất cả|toàn|cả|ngày)',
        r'(?:tất cả|toàn|cả).*slide.*tóm\s*(?:tắt|gọn)',
        r'tóm\s*(?:tắt|gọn).*(?:nội dung|kiến thức)',
        r'ôn lại.*(?:cả|toàn)',
        r'tổng quan',
    ]
    return any(re.search(p, content, re.I) for p in patterns)

summary_requests = [(s, t) for s, t in pairs if is_summary_request(s['content'])]
summary_failures = [(s, t) for s, t in summary_requests if is_failure(t['content'])]

unique_summary_users = len(set(s['user_id'] for s, t in summary_requests))

print(f"Total summary requests: {len(summary_requests)}")
print(f"  → Canvas claim: 67")
print(f"  → Match: {abs(len(summary_requests) - 67) <= 5 and 'CLOSE' or f'Got {len(summary_requests)}'}")

print(f"\nUnique users asking for summary: {unique_summary_users}")
print(f"  → Canvas claim: 53")

print(f"\nSummary request failures: {len(summary_failures)}/{len(summary_requests)}")
if len(summary_requests) > 0:
    print(f"  → Canvas claim: ≥45/67 ≈ 67%")
    print(f"  → Match: {100*len(summary_failures)/len(summary_requests):.1f}%")

# === SECTION 5: USER IMPACT ===
print("\n[5] USER IMPACT")
print("-" * 80)

users_with_failures = set(s['user_id'] for s, t in all_failures)
print(f"Unique users experiencing failures: {len(users_with_failures)}/{len(unique_users)}")
print(f"  → Canvas claim: 112/369 = 30.3%")
print(f"  → Match: {abs(len(users_with_failures) - 112) <= 10 and 'CLOSE' or f'Got {len(users_with_failures)}'}")

# === SECTION 6: RATINGS ===
print("\n[6] RATING DISTRIBUTIONS")
print("-" * 80)

# Overall rating distribution
all_ratings = collections.Counter(t.get('rating') or 'none' for s, t in pairs)
print("All pairs rating distribution:")
for rating, count in sorted(all_ratings.items()):
    print(f"  {rating}: {count} ({100*count/len(pairs):.1f}%)")

# Failure responses rating
failure_ratings = collections.Counter(t.get('rating') or 'none' for s, t in all_failures)
print(f"\nFailure responses rating distribution: ({len(all_failures)} total)")
for rating, count in sorted(failure_ratings.items()):
    print(f"  {rating}: {count} ({100*count/len(all_failures):.1f}%)")

# Selected text responses rating
selected_ratings = collections.Counter(t.get('rating') or 'none' for s, t in selected_pairs)
selected_thumbsdown = selected_ratings.get('👎', 0)
print(f"\nSelected text responses (bôi đen): {len(selected_pairs)} total")
print(f"  👎 : {selected_thumbsdown} ({100*selected_thumbsdown/len(selected_pairs) if selected_pairs else 0:.1f}%)")
print(f"  → Canvas claim: 26% 👎")

# Free-form responses rating
freeform_ratings = collections.Counter(t.get('rating') or 'none' for s, t in freeform_pairs)
freeform_thumbsdown = freeform_ratings.get('👎', 0)
print(f"\nFree-form responses (gõ tự do): {len(freeform_pairs)} total")
print(f"  👎 : {freeform_thumbsdown} ({100*freeform_thumbsdown/len(freeform_pairs) if freeform_pairs else 0:.1f}%)")
print(f"  → Canvas claim: 63% 👎")

# === SECTION 7: EXAMPLES ===
print("\n[7] EXAMPLES OF FAILURE CASES")
print("-" * 80)

print("\nFirst 15 failure cases:")
for i, (s, t) in enumerate(all_failures[:15], 1):
    student_text = s['content'].split('\n')[-1][:80].replace('\n', ' ')
    tutor_text = t['content'][:140].replace('\n', ' ')
    print(f"\n{i}. Turn: {s['turn_id']} | User: {s['user_id']}")
    print(f"   Q: {student_text}...")
    print(f"   A: {tutor_text}...")

# === SECTION 8: EDGE CASES & ANOMALIES ===
print("\n[8] DATA QUALITY CHECK")
print("-" * 80)

# Messages with "selected text" but no actual quotes
suspicious_selected = []
for s, t in selected_pairs:
    if "đoạn được chọn" in s['content'] and not re.search(r'""[^"]+""', s['content']):
        suspicious_selected.append(s)

if suspicious_selected:
    print(f"⚠️  Messages marked 'selected' but no quotes found: {len(suspicious_selected)}")
    print(f"   First 3 examples:")
    for ex in suspicious_selected[:3]:
        print(f"     - {ex['turn_id']}: {ex['content'][:80]}")
else:
    print("✓ All 'selected text' messages have quotes")

# Check for empty tutor responses
empty_tutors = [t for s, t in pairs if not t['content'].strip()]
if empty_tutors:
    print(f"⚠️  Empty tutor responses: {len(empty_tutors)}")
else:
    print("✓ No empty tutor responses")

print("\n" + "=" * 80)
print("END OF ANALYSIS")
print("=" * 80)

# === EXPORT SUMMARY ===
summary = {
    "total_pairs": len(pairs),
    "with_context_marker": with_context,
    "selected_pairs": len(selected_pairs),
    "freeform_pairs": len(freeform_pairs),
    "total_failures": len(all_failures),
    "selected_failures": len(selected_failures),
    "freeform_failures": len(freeform_failures),
    "summary_requests": len(summary_requests),
    "summary_failures": len(summary_failures),
    "users_with_failures": len(users_with_failures),
    "unique_users": len(unique_users),
    "freeform_failure_rate": round(100*len(freeform_failures)/len(freeform_pairs), 1) if freeform_pairs else None,
    "selected_failure_rate": round(100*len(selected_failures)/len(selected_pairs), 1) if selected_pairs else None,
}

# Save to JSON
output_file = Path("analysis_summary.json")
with output_file.open('w', encoding='utf-8') as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)

print(f"\n✓ Summary exported to: {output_file}")
print("\nKey metrics comparison with canvas.md:")
print(f"  Context markers (canvas: 1252/1261): {with_context}/1261")
print(f"  Total failures (canvas: 171/1261): {len(all_failures)}/1261")
print(f"  Selected failures (canvas: 10/495): {len(selected_failures)}/495")
print(f"  Free-form failures (canvas: 160/757): {len(freeform_failures)}/757")
print(f"  User impact (canvas: 112/369): {len(users_with_failures)}/369")
