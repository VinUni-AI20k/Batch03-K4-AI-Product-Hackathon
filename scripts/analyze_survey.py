"""Convert a Google Forms CSV into reproducible pain/impact evidence."""
from __future__ import annotations
import argparse, csv
from collections import Counter
from pathlib import Path


def find_column(headers: list[str], number: int) -> str:
    prefix = f"{number}."
    matches = [h for h in headers if h.strip().startswith(prefix)]
    if len(matches) != 1:
        raise ValueError(f"Cần đúng một cột bắt đầu bằng '{prefix}', tìm thấy: {matches}")
    return matches[0]


parser = argparse.ArgumentParser()
parser.add_argument("csv_path", type=Path)
parser.add_argument("--output", type=Path, default=Path("evidence/survey-summary.md"))
parser.add_argument("--exclude-name", action="append", default=[], help="Tên thành viên nhóm cần loại; dùng nhiều lần được")
args = parser.parse_args()

with args.csv_path.open(encoding="utf-8-sig", newline="") as file:
    rows = list(csv.DictReader(file))
if not rows:
    raise SystemExit("CSV không có phản hồi")
headers = list(rows[0])
columns = {number: find_column(headers, number) for number in range(1, 11)}
excluded = {name.casefold().strip() for name in args.exclude_name}
outside = [r for r in rows if not any(name in r[columns[1]].casefold() for name in excluded)]
valid = [r for r in outside if r[columns[5]].strip().casefold() not in {"", "không gặp khó khăn"} and "không hậu quả" not in r[columns[8]].casefold()]
pain = Counter(r[columns[5]].strip() for r in valid)
frequency = Counter(r[columns[6]].strip() for r in valid)
time_cost = Counter(r[columns[7]].strip() for r in valid)
consequences = Counter(item.strip() for r in valid for item in r[columns[8]].split(",") if item.strip())
denominator = len(outside)

lines = ["# Survey evidence summary", "", f"- Tổng phản hồi: **{len(rows)}**", f"- Phản hồi ngoài nhóm sau loại tên: **{len(outside)}**", f"- Phản hồi xác nhận một pain + hậu quả: **{len(valid)}**", "", "## Primary pain", "", "| Pain | Số người | % mẫu ngoài nhóm |", "|---|---:|---:|"]
for label, count in pain.most_common():
    lines.append(f"| {label} | {count} | {count / denominator:.1%} |")
for title, values in [("Tần suất", frequency), ("Thời gian/lần", time_cost), ("Hậu quả", consequences)]:
    lines += ["", f"## {title}", "", "| Giá trị | Số lượt |", "|---|---:|"]
    lines += [f"| {label} | {count} |" for label, count in values.most_common()]
lines += ["", "## Quote gần nhất", ""]
for row in valid[:5]:
    lines.append(f"- **{row[columns[1]]}:** “{row[columns[4]].strip()}”")
lines += ["", "> Kiểm tra tay tên người ngoài nhóm, consent và quote trước khi đưa vào spec/slide."]
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(args.output)
