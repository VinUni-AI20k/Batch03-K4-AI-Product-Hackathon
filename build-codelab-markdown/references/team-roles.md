# Team roles

Đọc ở Phase 5, chỉ khi lab làm nhóm.

Mục tiêu phân vai không phải chia đều việc. Mục tiêu là mỗi người một file để không đè code nhau, và mỗi người một artifact mang tên mình để chấm được. Nguyên tắc: 1 role = 1 file owner; Integrator là người duy nhất sửa entrypoint.

## Năm role cốt lõi

Áp cho hầu hết lab AI trong khoá. Đổi tên role theo repo cụ thể nhưng giữ nguyên ranh giới file.

1. Product / Test Architect — `config/test_cases.json`. Chốt bài toán, viết bộ test case đơn giản / multi-step / bẫy. Chấm: bộ case đủ 3 loại, case bẫy thật sự bẫy được.
2. Tool / Data Engineer — `src/tools.py`. Implement tool, docstring, input/output/error contract. Chấm: tool chạy độc lập không crash, contract rõ.
3. Prompt / Policy Engineer — `src/prompts.py`. System prompt, guardrails, `MAX_ITERATIONS`. Chấm: prompt ép được format, guardrail ngắt được lặp.
4. Core Integrator — `src/app.py`. `git pull` gom code, ghép vòng lặp, chạy nghiệm thu. Chấm: app chạy end-to-end trên toàn bộ test case.
5. Observability / Reporter — `docs/trace_eval.md`. Trace log, scoring matrix, báo cáo so sánh. Chấm: trace có thật, số liệu khớp log, có phân tích root cause.

Role 4 nặng nhất và dễ thành nút cổ chai. Chọn người quen git nhất, và chỉ giao đúng một file entrypoint, đừng giao thêm việc khác.

## Catalog mở rộng

Nhóm nên đọc hết để biết bài lab này thật ra cần năng lực gì, rồi mới chọn.

6. Eval / Metrics Engineer — `data/eval_group.json`, output của `run_eval.py`. Khi lab có bộ eval riêng, cần đo before/after nhiều version.
7. Red-teamer / Guardrails Reviewer — `tests/adversarial.json`. Khi lab chấm prompt-injection, jailbreak, data leak.
8. DevEx / Environment Wrangler — `.env.example`, `requirements.txt`, `TOOL-SETUP.md`. Khi lớp chạy 3 OS, hoặc lab có nhiều provider.
9. UI / Demo Builder — `app_streamlit.py`, `frontend/`. Khi deliverable có UI hoặc phải cho nhóm khác test.
10. Data Curator — `data/`, golden set. Khi lab dùng dataset thật, cần trích mẫu và ẩn danh.
11. Docs Editor / Format Keeper — `docs/CODELAB.md`, `README.md`. Khi deliverable có nhiều file markdown, người này giữ format thống nhất.
12. Scribe / Timekeeper — `docs/checkpoint-log.md`. Khi lab có mốc giờ cứng; người này gọi checkpoint và ghi quyết định.
13. Cost / Latency Analyst — `artifacts/version_log.csv`. Khi lab đo token, chi phí, p50/p99 latency.
14. Cross-team Auditor — `docs/cross_review.md`. Khi có vòng chấm chéo giữa các nhóm.

## Chọn theo số người

4 người: gộp Role 1 và Role 5 vì người viết test case cũng là người đọc trace, hai việc bổ nhau. Giữ nguyên Role 2, 3, 4. Không bao giờ gộp Role 4.

5 người: dùng đúng bộ cốt lõi.

6 người: tách Role 5 thành 5A Trace Analyst và 5B Report / Flowchart, hoặc thêm Role 7 nếu lab chấm security.

7 người trở lên: thêm từ catalog theo deliverable thật, không thêm cho đủ đầu người. Không có file để sở hữu thì role đó là role ảo và người đó sẽ không có gì để chấm.

## Chống merge conflict

Ranh giới file là cơ chế kỹ thuật, không phải thoả thuận lịch sự.

```
config/     → Role 1
src/tools   → Role 2
src/prompts → Role 3
src/app     → Role 4 (chỉ Role 4)
docs/       → Role 5
```

Vòng làm việc: `git pull` trước khi sửa; xong một mốc thì `git add .` → `git commit -m "Role 2: them get_weather"` → `git push`. Push bị chặn vì người khác push trước thì `git pull` rồi `git push` lại. Vì mỗi người một file, pull gần như không bao giờ conflict.

Cấm hai việc: sửa file của người khác "cho nhanh" (cần đổi thì nói với owner), và ai cũng sửa entrypoint (nguồn conflict duy nhất trong repo kiểu này).

## Integration gate

Mỗi mốc kết thúc bằng gate này. Bỏ gate thì nhóm phát hiện lỗi tích hợp lúc còn 10 phút trước demo.

```
1. Role 1,2,3,5 push xong file của mình
2. Role 4 git pull
3. Role 4 (và chỉ Role 4) ghép vào entrypoint
4. Chạy validation — lệnh cụ thể, không phải "chạy thử xem sao"
5. Cả nhóm xem output cùng nhau
6. Pass thì sang mốc sau. Fail thì sửa ngay, không dồn
```

Trong CODELAB.md, gate này hiện ra dưới dạng `:::checkpoint` cuối mỗi step.

## Song song hay tuần tự

- Song song: khác file, không ăn output của nhau. Ví dụ Role 1 viết test case, Role 2 viết tool, Role 3 viết prompt.
- Tuần tự: chung file, hoặc cần output bước trước. Ví dụ Role 4 ghép app sau khi Role 2 và 3 push.
- Gate: cả nhóm phải có mặt. Chạy validation cuối mốc, chấm chéo, demo.

Sai phổ biến: đánh dấu song song cho hai việc cùng sửa `src/app.py`. Đó là tuần tự, dù hai người làm hai chức năng khác nhau.

## Bảng phân vai trong file

Ghi vào `docs/PHAN_CONG_CONG_VIEC.md` với cột tên để trống. Nhóm tự điền, đó là hành động cam kết.

```markdown
| Role | File sở hữu | Nhiệm vụ chính | Người đảm nhận |
|---|---|---|---|
| Role 1 — Product / Test Architect | `config/test_cases.json` | Chốt bài toán, viết bộ test case | `________________` |
| Role 2 — Tool Engineer | `src/tools.py` | Implement tool + contract | `________________` |
```

Đừng điền sẵn tên giả. Đừng bỏ cột này, nhóm không ký tên thì không ai chịu trách nhiệm file nào.
