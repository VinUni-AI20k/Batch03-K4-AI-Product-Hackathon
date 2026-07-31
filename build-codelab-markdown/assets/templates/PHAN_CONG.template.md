<!--
TEMPLATE — docs/PHAN_CONG_CONG_VIEC.md
Xoá mọi comment HTML trước khi giao. Để trống cột "Người đảm nhận" — nhóm tự điền.
Catalog role và cách chọn theo số người: references/team-roles.md
-->
# Phân công và checklist theo mốc

Mỗi người mở **đúng một file** được phân công. Vì mỗi người một file, `git pull` gần như không bao giờ conflict.

## 1. Bảng phân vai

| Role | File sở hữu | Nhiệm vụ chính | Người đảm nhận |
|---|---|---|---|
| Role 1 — <Product / Test Architect> | `<config/test_cases.json>` | <Chốt bài toán, viết bộ test case> | `________________` |
| Role 2 — <Tool / Data Engineer> | `<src/tools.py>` | <Implement tool + input/output/error contract> | `________________` |
| Role 3 — <Prompt / Policy Engineer> | `<src/prompts.py>` | <System prompt + guardrails> | `________________` |
| Role 4 — <Core Integrator> | `<src/app.py>` | **Gom code nhóm (`git pull`), ghép thành app chạy được** | `________________` |
| Role 5 — <Observability / Reporter> | `<docs/trace_eval.md>` | <Trace log, scoring matrix, báo cáo> | `________________` |

**Nhóm 4 người:** gộp Role 1 và Role 5. Không bao giờ gộp Role 4.
**Nhóm 6 người:** tách Role 5 thành 5A (Trace Analyst) và 5B (Report / Flowchart).

> **Role 4 là đầu mối lắp ráp.** Sau khi Role 1, 2, 3 push, Role 4 `git pull` gom về, ghép vào
> `<entrypoint>` và chạy nghiệm thu cho cả nhóm. Role 4 là người **duy nhất** sửa file entrypoint.

## 2. Ranh giới file — không ai sửa file của người khác

```text
<config/>     → Role 1
<src/tools>   → Role 2
<src/prompts> → Role 3
<src/app>     → Role 4 (chỉ Role 4)
<docs/>       → Role 5
```

Cần đổi file của người khác → nói với owner, không tự sửa.

## 3. Vòng git chuẩn

Trước khi sửa:

```bash
git pull
```

Sau khi xong một mốc:

```bash
git add .
git commit -m "Role <n>: <viec da lam, khong dau>"
git push
```

Push bị chặn vì người khác push trước → `git pull` rồi `git push` lại.

## 4. Checklist theo mốc

<!-- Số mốc khớp số step trong docs/CODELAB.md. Mỗi mốc kết thúc bằng một lần đồng bộ git. -->

### Mốc 1 — <tên> (<N> phút) · <song song | tuần tự>

*Mục tiêu: <một câu>.*

- [ ] **Role 1**: <việc cụ thể trong file của mình>
- [ ] **Role 2**: <...>
- [ ] **Role 3**: <...>
- [ ] **Role 4**: <...>
- [ ] **Role 5**: <...>
- [ ] **Cả nhóm — Gate**: <điều kiện phải đúng trước khi sang mốc sau>
- [ ] **Đồng bộ**: `git add .` → `git commit -m "Moc 1: <...>"` → `git push`

### Mốc 2 — <tên> (<N> phút) · <song song | tuần tự>

*Mục tiêu: <một câu>.*

- [ ] **Role 1**: <...>
- [ ] **Role 2**: <...>
- [ ] **Role 3**: <...>
- [ ] **Role 4 (Integrator)**: `git pull` → ghép `<hàm>` trong `<entrypoint>` → chạy thử
- [ ] **Role 5**: <...>
- [ ] **Cả nhóm — Gate**: <...>
- [ ] **Đồng bộ**: `git add .` → `git commit -m "Moc 2: <...>"` → `git push`

<!-- Lặp cho các mốc còn lại -->

## 5. Integration gate — làm đúng thứ tự

```text
1. Role 1, 2, 3, 5 push xong file của mình
2. Role 4 git pull
3. Role 4 (và chỉ Role 4) ghép vào entrypoint
4. Chạy validation: <lệnh cụ thể>
5. Cả nhóm xem output cùng nhau
6. Pass → sang mốc sau. Fail → sửa ngay, không dồn sang mốc sau
```

## 6. Mỗi người nộp gì

| Role | Artifact mang tên bạn | Bị chấm trên |
|---|---|---|
| Role 1 | `<path>` | <tiêu chí> |
| Role 2 | `<path>` | <tiêu chí> |
| Role 3 | `<path>` | <tiêu chí> |
| Role 4 | `<path>` | <tiêu chí> |
| Role 5 | `<path>` | <tiêu chí> |

> Phần có tên bạn mà bạn không giải thích được khi bị hỏi thì phần đó không tính điểm.
> Dùng AI để build thoải mái — nhưng phải hiểu thứ mình nộp.
