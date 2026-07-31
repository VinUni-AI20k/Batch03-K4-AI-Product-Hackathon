import csv
from collections import Counter
import json
import re

file_path = 'ket_qua_khao_sat.csv'

with open(file_path, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    data = list(reader)

total_responses = len(data)

cau1 = Counter([row[3] for row in data])
cau2 = Counter([row[4] for row in data])
cau3 = Counter([row[5] for row in data])
cau4 = Counter([row[6] for row in data])
cau5 = Counter([row[7] for row in data])

def get_percentage(count, total):
    return round((count / total) * 100, 2)

report = f"""# Phân tích kết quả khảo sát (Tổng số: {total_responses} phản hồi)

## 1. Khó khăn khi tìm kiếm thông tin ban đầu (Câu 1)
"""
for k, v in cau1.items():
    report += f"- {k}: {v} ({get_percentage(v, total_responses)}%)\n"

report += f"\n## 2. Nền tảng tìm kiếm phổ biến (Câu 2)\n"
for k, v in cau2.items():
    report += f"- {k}: {v} ({get_percentage(v, total_responses)}%)\n"

report += f"\n## 3. Hành động khi không tìm thấy thông tin (Câu 3)\n"
for k, v in cau3.items():
    report += f"- {k}: {v} ({get_percentage(v, total_responses)}%)\n"

report += f"\n## 4. Thời gian mất đi để tìm câu trả lời (Câu 4)\n"
for k, v in cau4.items():
    report += f"- {k}: {v} ({get_percentage(v, total_responses)}%)\n"

report += f"\n## 5. Mức độ bất tiện (Câu 5)\n"
for k, v in cau5.items():
    report += f"- {k}: {v} ({get_percentage(v, total_responses)}%)\n"

# Calculate specific impact numbers for the Spec
# percentage of people who couldn't find info in handbook (A. Có in Câu 1)
not_found_pct = get_percentage(cau1.get('A. Có', 0), total_responses)
# percentage using Facebook/Zalo (sum of Facebook and Zalo in Câu 2)
fb_zalo_count = sum(v for k, v in cau2.items() if 'Facebook' in k or 'Zalo' in k)
fb_zalo_pct = get_percentage(fb_zalo_count, total_responses)
# percentage of people who spent > 15 mins (B. Từ 15 phút đến vài giờ + C. Hơn 1 ngày)
time_wasted_count = cau4.get('B. Từ 15 phút đến vài giờ.', 0) + cau4.get('C. Hơn 1 ngày.', 0)
time_wasted_pct = get_percentage(time_wasted_count, total_responses)
# percentage feeling inconvenient (A. Có, rất bất tiện + B. Có, hơi bất tiện)
inconvenient_count = cau5.get('A. Có, rất bất tiện.', 0) + cau5.get('B. Có, hơi bất tiện.', 0)
inconvenient_pct = get_percentage(inconvenient_count, total_responses)

report += f"""
---
## Tổng hợp chỉ số cho AI Spec
- Tỷ lệ từng không tìm thấy thông tin trong sổ tay: {not_found_pct}%
- Tỷ lệ tìm kiếm trên các nền tảng mạng xã hội (Facebook/Zalo): {fb_zalo_pct}%
- Tỷ lệ tốn hơn 15 phút đến hơn 1 ngày để tìm câu trả lời: {time_wasted_pct}%
- Tỷ lệ cảm thấy bất tiện khi phải tìm ngoài sổ tay: {inconvenient_pct}%
"""

with open('survey_analysis_results.md', 'w', encoding='utf-8') as f:
    f.write(report)

print("Phân tích thành công, kết quả đã được lưu ra file survey_analysis_results.md")
