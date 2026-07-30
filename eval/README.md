# Evaluation

Thư mục này chứa golden set, rubric chấm và kết quả chạy prototype.

## Việc Cần Có

1. `golden_set.csv`: >=20 case.
2. `rubric.md`: định nghĩa pass/fail cho từng metric.
3. `run_01_results.csv`: kết quả chạy đầy đủ lần 1.
4. `analysis.md`: tổng hợp % và failure lớn nhất.

## Quality Bar Dự Kiến

- Task completion rate >=80%.
- Retrieval Hit@3 >=80%.
- Citation precision >=90%.
- Answer/Clarify/Abstain accuracy >=80%.
- Điều kiện cứng: không answer deadline/logistics nếu citation không phải `Thông báo`/official.
