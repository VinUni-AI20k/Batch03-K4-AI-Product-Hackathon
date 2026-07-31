# Baseline eval — 2026-07-31

Đây là kết quả chạy trên artifact hiện có trong workspace, không phải kết quả
của một model/API mới.

## Day 3

Lệnh smoke đã chạy thành công ở mock mode:

```powershell
$env:LLM_PROVIDER='mock'; python src/app.py
```

Output xác nhận `MockProvider`, tải 5 test case, chạy baseline và ReAct trên
`tests[2]`, gọi `get_weather('Hà Nội')`, nhận Observation và dừng ở vòng 2
trong giới hạn `MAX_ITERATIONS = 3`.

Source contract pass. Guide hiện có fail **36 expectation** vì nó chưa dạy theo
đầy đủ contract R1–R7/CP1–CP5: thiếu claim runtime `tests[2]`, bốn lớp nội dung,
các yêu cầu evidence/impact, MỘT CÂU, HAX/PAIR, failure paths, golden set,
validation và artifact submission.

## Day 4

Source contract pass trên
`frontend/content/day4-lab-research-agent-tool-eval.md`.

Guide hiện có fail **34 expectation** vì thiếu phần AI Spec/R1–R7 và hai path
repo-relative:

- `starter_v0/data/eval_base.json`;
- `starter_v0/tools/__init__.py`.

Artifact có nhiều hướng dẫn tool-eval hợp lệ, nhưng chưa đủ để learner hoàn
thiện spec theo rubric chương trình. Không được biến kết quả này thành claim
guide hoặc learner đạt 100 điểm.

## Giới hạn thực thi

Không đủ thời gian thực hiện trọn bộ 20 testcase trên nhiều repo trong timebox
1,5 ngày. Việc clone, setup, chạy, đọc output và lưu `eval/` artifact cho từng
repo tốn rất nhiều thời gian. Vì vậy R4 golden set được ghi là
`Not executed / scope limitation`; không báo cáo phần trăm quality bar giả.

R6 user validation và R5 provider thật cũng không được claim đạt từ benchmark
này. Chỉ source contract và Day 3 mock smoke đã được chạy thật.
