# Eval `03-template-ai-spec`

Bộ eval kiểm tra skill `build-codelab-markdown` khi biến đề bài AI Spec thành
codelab Markdown theo đúng R1–R7 và CP1–CP5 trong `04-rubric.md`.

Hai fixture được dùng:

- **Day 3** — repo Python có code chạy offline ở chế độ mock.
- **Day 4** — codelab research-agent hiện có trong
  `frontend/content/day4-lab-research-agent-tool-eval.md`; repo clone Day 4
  chưa có trong workspace.

## Chạy eval

Từ repository root, chạy source contract cho cả hai fixture:

```powershell
python build-codelab-markdown/evals/03-template-ai-spec/run_eval.py
```

Khi đã có output, truyền path cả hai file để kiểm tra thêm nội dung output:

```powershell
python build-codelab-markdown/evals/03-template-ai-spec/run_eval.py --day3-output <path-to-day3-CODELAB.md> --day4-output <path-to-day4-CODELAB.md>
```

Sau semantic eval, chạy validator cấu trúc của skill:

```powershell
python build-codelab-markdown/scripts/validate_codelab.py <path-to-CODELAB.md> --repo-root <student-repo-root>
```

## Contract được kiểm

`prompt.md` dùng `03-template-ai-spec.md` và `04-rubric.md` làm contract. Mỗi
task phải tách rõ `Knowledge`, `Instructions`, `Expected outcome` và
`Deliverables`; mọi artifact được rubric chấm phải có path cụ thể.

`cases/day3.json` và `cases/day4.json` chứa source checks, output terms,
required paths và các claim bị cấm. `program_rubric.json` lưu mapping R1–R7,
CP1–CP5 và giới hạn thực thi. `rubric.md` giải thích sub-criteria nguyên bản
của chương trình.

## Giới hạn thực thi

Không đủ thời gian thực hiện trọn bộ 20 testcase trên nhiều repo trong timebox
1,5 ngày. Việc clone, setup, chạy, đọc output và lưu artifact `eval/` cho từng
repo tốn rất nhiều thời gian. Vì vậy phần golden set 20 case được ghi rõ là
`Not executed / scope limitation`; không báo cáo phần trăm quality bar giả.

Benchmark chỉ xác nhận source contract, grounding và Day 3 mock smoke. `PASS`
của benchmark không đồng nghĩa learner đạt 100 điểm chương trình.
