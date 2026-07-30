#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Inspect CSV structure in detail to understand selection patterns
"""

import csv
import re
from pathlib import Path
import json

csv_path = Path("../../data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv")
rows = list(csv.DictReader(csv_path.open(encoding='utf-8-sig', newline='')))

print("=" * 80)
print("DETAILED INSPECTION - Selection & Failure Patterns")
print("=" * 80)

# === INSPECT SAMPLE MESSAGES ===
print("\n[1] SAMPLE STUDENT MESSAGES - First 30")
print("-" * 80)

for i, row in enumerate(rows[:60]):
    if row['role'] == 'student':
        content = row['content']
        # Show full content
        print(f"\n[Sample {i}] Turn: {row['turn_id']}")
        print(f"Content length: {len(content)}")
        print(f"Content:\n{repr(content)}\n")
        if i >= 8:
            break

# === CHECK FOR DIFFERENT QUOTE PATTERNS ===
print("\n[2] QUOTE PATTERN ANALYSIS")
print("-" * 80)

quote_patterns = {
    'double_quote': r'""[^"]*""',
    'single_quote_pairs': r"''[^']*''",
    'smart_quote': r'[""«»][^""«»]*[""«»]',
    'parenthesis_content': r'\([^)]{20,}\)',
    'line_with_trang': r'\(Trang\s+\d+[^)]*\)',
}

student_rows = [r for r in rows if r['role'] == 'student']
print(f"Total student messages: {len(student_rows)}\n")

for pattern_name, pattern in quote_patterns.items():
    matches = sum(1 for r in student_rows if re.search(pattern, r['content']))
    print(f"  {pattern_name:25s}: {matches:4d} messages")

# === ANALYZE "TRANG" PATTERN MORE CAREFULLY ===
print("\n[3] 'TRANG X' PATTERN - Extract Page Numbers")
print("-" * 80)

trang_pattern = r'\(Trang\s+(\d+)'
messages_with_trang = [(r['turn_id'], r['content']) for r in student_rows if re.search(trang_pattern, r['content'])]

print(f"Messages with 'Trang X' pattern: {len(messages_with_trang)}")
print(f"\nFirst 20 examples:")
for i, (turn_id, content) in enumerate(messages_with_trang[:20], 1):
    # Extract the (Trang X...) part
    match = re.search(r'\([^)]{0,100}\)', content)
    if match:
        print(f"{i:2d}. {turn_id:8s}: {match.group()[:100]}")

# === CHECK FOR "ĐƯỢC CHỌN" / "BÔI ĐEN" INDICATORS ===
print("\n[4] SELECTION INDICATORS - 'được chọn', 'bôi', etc.")
print("-" * 80)

selection_indicators = {
    'được chọn': r'được\s+chọn',
    'bôi đen': r'bôi\s+đ[ề e]n',
    'highlighted': r'highlight',
    'selected text': r'select',
}

for indicator, pattern in selection_indicators.items():
    matches = sum(1 for r in student_rows if re.search(pattern, r['content'], re.I))
    print(f"  {indicator:20s}: {matches:4d} messages")

# === INSPECT FAILURE PATTERNS IN TUTOR MESSAGES ===
print("\n[5] TUTOR FAILURE RESPONSE PATTERNS")
print("-" * 80)

tutor_rows = [r for r in rows if r['role'] == 'tutor']

failure_phrases = {
    'không tìm thấy': r'không tìm th[ấe]y',
    'chưa tìm thấy': r'ch(ư)?a tìm th[ấe]y',
    'không có nội dung': r'không có\s+(?:nội dung|thông tin)',
    'không thể tổng hợp': r'không th[ể e].*tổng hợp',
    'không tìm được': r'không tìm (?:được|thấy)',
    'chưa có': r'ch(ư)?a có',
    'hiện không': r'hiện\s+không',
}

print(f"Total tutor messages: {len(tutor_rows)}\n")

for phrase, pattern in failure_phrases.items():
    matches = sum(1 for r in tutor_rows if re.search(pattern, r['content'], re.I))
    print(f"  {phrase:25s}: {matches:4d} responses")

# === PAIRED ANALYSIS ===
print("\n[6] PAIR ANALYSIS - Student Q + Tutor A")
print("-" * 80)

turns = {}
for r in rows:
    turn_id = r['turn_id']
    if turn_id not in turns:
        turns[turn_id] = {}
    turns[turn_id][r['role']] = r

pairs = [(v['student'], v['tutor']) for v in turns.values() if 'student' in v and 'tutor' in v]

print(f"Valid pairs: {len(pairs)}\n")

# Classify pairs
def analyze_pair(s, t):
    s_content = s['content']
    t_content = t['content']
    
    has_trang = bool(re.search(r'\(Trang\s+\d+', s_content))
    has_selection_marker = 'được chọn' in s_content
    has_selected_text = bool(re.search(r'""[^"]*""', s_content))
    
    is_failure = bool(re.search(r'không tìm th[ấe]y|không th[ể e].*tổng hợp|không có (?:nội dung|thông tin)', t_content, re.I))
    
    return {
        'has_trang': has_trang,
        'has_selection_marker': has_selection_marker,
        'has_selected_text': has_selected_text,
        'is_failure': is_failure,
    }

pair_types = {}
for s, t in pairs:
    analysis = analyze_pair(s, t)
    key = (analysis['has_selection_marker'], analysis['has_selected_text'], analysis['is_failure'])
    if key not in pair_types:
        pair_types[key] = []
    pair_types[key].append((s, t))

print("Pair classification: (has_selection_marker, has_selected_text, is_failure)")
for key, group in sorted(pair_types.items(), key=lambda x: -len(x[1])):
    sel_marker, sel_text, failure = key
    print(f"\n  Selection marker={sel_marker}, Text={sel_text}, Failure={failure}: {len(group)} pairs")
    
    # Show first 2 examples
    for i, (s, t) in enumerate(group[:2], 1):
        print(f"    Example {i}:")
        print(f"      Q: {s['content'][:100]}")
        print(f"      A: {t['content'][:100]}")

print("\n" + "=" * 80)
print("RECOMMENDATIONS")
print("=" * 80)
print("""
Based on inspection, the issue is likely:
1. The CSV structure may represent "selected text" differently than expected
2. Quote patterns in the data may not be ""...""
3. We need to check if there are columns for selection type vs just content text

Next steps:
- Check CSV columns: show all column names
- Look for a 'selection_type' or 'message_type' column
- Check if citations column indicates selection
- Re-examine the actual data structure
""")

# === SHOW CSV COLUMNS ===
print("\n[7] CSV COLUMN NAMES")
print("-" * 80)
if rows:
    print("Columns:")
    for i, col in enumerate(rows[0].keys(), 1):
        print(f"  {i:2d}. {col}")

# === CHECK CITATIONS COLUMN ===
print("\n[8] CITATIONS COLUMN ANALYSIS")
print("-" * 80)
citations_dist = {}
for r in rows:
    citations = r.get('citations', '') or ''
    key = 'has_citations' if citations.strip() else 'no_citations'
    citations_dist[key] = citations_dist.get(key, 0) + 1

for key, count in citations_dist.items():
    print(f"  {key}: {count}")

# Show examples with citations
print("\nSample responses WITH citations:")
with_citations = [r for r in tutor_rows if r.get('citations', '').strip()]
for r in with_citations[:5]:
    print(f"  Turn {r['turn_id']}: citations={r.get('citations')}")
    print(f"    Content: {r['content'][:80]}...")

print("\nSample responses WITHOUT citations:")
without_citations = [r for r in tutor_rows if not r.get('citations', '').strip()]
for r in without_citations[:5]:
    print(f"  Turn {r['turn_id']}: citations={r.get('citations')}")
    print(f"    Content: {r['content'][:80]}...")
