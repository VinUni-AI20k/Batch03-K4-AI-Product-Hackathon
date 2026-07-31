# 📊 Hệ thống Đánh giá AI Quiz Generator

Thư mục này chứa golden set và evaluation system để đánh giá chất lượng AI Quiz Generator theo spec §7.

## 📁 Cấu trúc

```
eval/
├── README.md                    # File này
├── golden-set.json              # 20 test cases theo taxonomy 4 lớp
├── evaluator.py                 # Python script tự động đánh giá
├── evaluation-results.json      # Kết quả đánh giá (sau khi chạy)
└── run-*.json                   # Các lượt chạy (timestamp)
```

## 🎯 Golden Set

**20 test cases** được thiết kế theo:

### Phân bố theo Category:
- **Happy path**: 6 cases (30%)
- **Lớp ① Nguồn sự thật**: 3 cases (15%)
- **Lớp ② Mơ hồ/thiếu thông tin**: 2 cases (10%)
- **Lớp ③ Ngoài phạm vi**: 2 cases (10%)
- **Lớp ④ Đặc thù domain**: 2 cases (10%)
- **Edge cases**: 5 cases (25%)

### Phân bố theo Difficulty:
- **Easy**: 6 cases
- **Medium**: 9 cases
- **Hard**: 5 cases

## 📏 3 Chiều Chất Lượng

### 1. **Grounding** (Bám nguồn)
- **Pass/Fail**: `source_snippet` phải trace được về PDF gốc
- **Cách kiểm tra**:
  - Khớp trực tiếp chuỗi con
  - Khớp ≥50% prefix
  - Khớp ≥40% từ khóa có nghĩa

### 2. **Application Level** (Mức độ ứng dụng)
- **Scale 1-5**:
  - 1 = Ghi nhớ thuần (BAD)
  - 3 = Có tình huống nhưng vẫn hỏi ghi nhớ
  - 5 = Ứng dụng thật vào tình huống (GOOD)
- **Quality bar**: ≥80% cases đạt mức ≥4

### 3. **Correctness** (Đáp án đúng)
- **Pass/Fail**: 
  - `correct_index` hợp lệ
  - `explanation` nhất quán với đáp án
  - Không có mâu thuẫn rõ ràng
- **Quality bar**: 100% phải đạt

## 🎯 Quality Bar (đã chốt từ 23:59 N1)

```
Đạt khi:
  ✅ Grounding:    ≥90% cases pass
  ✅ Application:  ≥80% cases đạt mức ≥4/5
  ✅ Correctness:  100% cases pass
```

## 🚀 Cách chạy Evaluation

### Option 1: Chạy simulation (test evaluator)

```bash
cd eval
python evaluator.py
```

Output:
```
📊 Loaded 20 test cases
🎯 Quality Bar: ...

[1/20] Testing TC001 (happy_path)...
  ✓ Grounding: 100.0%
  ✓ App Level: 100.0% (≥4), avg=5.0
  ✓ Correctness: 100.0%

...

OVERALL RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣  Grounding: 18/20 (90%)     ✅ ĐẠT
2️⃣  Application: 17/20 (85%)   ✅ ĐẠT
3️⃣  Correctness: 20/20 (100%)  ✅ ĐẠT

🎉 OVERALL: ✅ ĐẠT QUALITY BAR
```

### Option 2: Chạy với API thật (TODO)

**Bước 1**: Start Flask server

```bash
cd ../codebase/quiz-app
python app.py
```

**Bước 2**: Uncomment phần gọi API trong `evaluator.py`

Tìm dòng:
```python
# TODO: Thay bằng gọi API thật
simulated_output = simulate_quiz_generation(test_case)
```

Thay bằng:
```python
import requests
response = requests.post('http://localhost:5000/api/generate-quiz', 
                        data=test_case['input'])
quiz_output = response.json()
```

**Bước 3**: Chạy evaluator

```bash
python evaluator.py --golden-set golden-set.json --output evaluation-results.json
```

## 📈 Kết quả mẫu

File `evaluation-results.json` chứa:

```json
{
  "meta": {
    "evaluation_time": "2026-07-31T09:00:00",
    "total_test_cases": 20,
    "total_questions": 22
  },
  "overall_scores": {
    "grounding": {
      "passed": 20,
      "total": 22,
      "percentage": 90.9,
      "達成": true
    },
    "application_level": {
      "level_4_or_above": 19,
      "total": 22,
      "percentage": 86.4,
      "達成": true
    },
    "correctness": {
      "passed": 22,
      "total": 22,
      "percentage": 100.0,
      "達成": true
    }
  },
  "overall_pass": true,
  "per_test_case_results": [...]
}
```

## 🔍 Phân tích Failure Cases

Khi có cases fail, xem chi tiết trong `per_test_case_results`:

```json
{
  "test_case_id": "TC002",
  "per_question_results": [
    {
      "grounding": {
        "pass": false,
        "reason": "Chỉ khớp 30% từ khóa - dưới ngưỡng 40%",
        "source_snippet": "RAG được dùng tại công ty X..."
      }
    }
  ]
}
```

→ Phát hiện: AI bịa thêm "công ty X" không có trong PDF

## 📊 Lưu lại các lượt chạy

Mỗi lần chạy, nên lưu với timestamp:

```bash
python evaluator.py --output run-$(date +%Y%m%d-%H%M%S).json
```

Để so sánh cải thiện qua các lượt:
- `run-20260731-090000.json` (lượt 1, sau fix prompt)
- `run-20260731-140000.json` (lượt 2, sau thêm validation)
- ...

## 🎓 Best Practices

### 1. **Chạy trọn bộ mỗi lần sửa**
```
Sửa prompt → Chạy trọn bộ → Ghi kết quả → So sánh với lượt trước
```

### 2. **Phân tích failure đau nhất trước**
```
100% correctness failed → Ưu tiên cao nhất (cost-of-error)
90% grounding failed    → Ưu tiên trung bình
85% application failed  → Có thể chấp nhận nếu ≥80%
```

### 3. **Không đổi quality bar sau khi chốt**
Quality bar đã chốt từ 23:59 N1 trong spec.md. Nếu không đạt, phân tích nguyên nhân chứ không hạ bar.

## 📝 TODO trước CP3

- [ ] Chạy lượt đầu với API thật (không simulation)
- [ ] Ghi kết quả vào spec.md §7
- [ ] Chụp màn hình output để demo
- [ ] Thêm ≥10 cases từ transcript thật (hiện toàn synthetic)

## 🔗 Liên kết

- **Spec §7**: `../spec.md` (phần Kiểm thử)
- **Guide §2.6**: `../02-guide.md` (Định nghĩa "tốt" + golden set)
- **Rubric R4**: `../04-rubric.md` (15 điểm Kiểm thử)
