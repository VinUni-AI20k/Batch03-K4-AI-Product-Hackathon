---
id: "day2-lab-ai-product-problem-discovery"
title: "Lab 02 — Tìm đúng bài toán cho AI"
duration: 220
author: "VinUni AI Codelab × GDGoC"
updated: "2026-07-31"
category: "AI Product"
description: "Đi từ pain thực tế đến workflow, metric và boundary; kiểm chứng bằng chứng rồi chọn No AI, Rule, Workflow hoặc Agent trước khi đưa ra quyết định."
published: true
collection: "codelabs"
format: "steps"
day: "2"
preparationTipIds: []
level: "beginner"
prerequisites: ["Viết được Markdown cơ bản", "Có trải nghiệm học tập, công việc hoặc hoạt động nhóm để quan sát pain", "Dùng được GitHub để nộp repo cá nhân"]
outcomes: ["Scan ít nhất năm problems có actor và dấu hiệu thật", "Viết ba Problem Card và workflow trước/sau", "Kiểm chứng candidate bằng nguồn hoặc khảo sát nhanh", "Viết Problem Statement có metric và boundary", "Chọn mức No AI, Rule, Workflow hoặc Agent có lý do", "Nộp report nhóm và reflection cá nhân đầy đủ"]
supportedOs: ["Windows", "macOS", "Linux"]
requiredTools: ["Markdown editor", "Git", "Trình duyệt cho research tùy chọn"]
commonErrors: ["Chọn Agent trước khi vẽ workflow", "Chốt Problem Statement trước validation", "Metric không có baseline hoặc cách đo", "Research không có link nguồn", "Để AI viết pitch hoặc reflection thay mình"]
requiresSubmission: true
---
> **220 phút làm việc + 20 phút nghỉ · Day 2 · beginner.** Một AI product tốt giống như sửa đúng chỗ kẹt trong dây chuyền: trước hết nhìn người nào đang mắc ở bước nào, sau đó mới chọn công cụ. Bài này không cần API key và không có test tự động; bằng chứng là artifacts Markdown theo rubric.

Câu hỏi xuyên suốt Lab:

> **Pain nào đáng giải, và mức tự động hóa nào giảm được pain mà không tạo thêm rủi ro?**

| Mốc | Step | Artifact |
|---:|---|---|
| 0–15 | 1. Đọc bài mẫu | Tiêu chuẩn một bài nộp đủ chứng cứ |
| 15–40 | 2. Scan cá nhân | 5+ problems |
| 40–75 | 3. Chọn top 3 | 3 Problem Cards, workflow draft |
| 75–85 | Nghỉ | — |
| 85–115 | 4. Hội tụ nhóm | Shortlist và candidate problem |
| 115–145 | 5. Validate và research | Evidence log, 2–3 nguồn |
| 145–190 | 6. Workflow và PS v0 | Before/after, metric, boundary |
| 190–200 | Nghỉ | — |
| 200–225 | 7. Chọn mức AI | PS v1 và Go/Not Yet/No-Go |
| 225–240 | 8. Reflection và nộp | Ba phần artifact trong repo cá nhân |

> **Khoảng trống trong repo — guide này đã xử lý:** `individual-report.md` và `reflection.md` đang trống, còn `group-report.md` chỉ có bảng thành viên. Các step dưới đây chỉ rõ section phải thêm vào từng file. README nói nhóm 3–4 người nhưng scaffold có 5 dòng; làm theo số thành viên thực tế của lớp.

Mọi path trong guide là relative từ thư mục gốc repo. Giữ `.gitignore` phù hợp với lớp và không commit secret, survey raw data hoặc PII không cần cho rubric.

---

## 1. Đọc worked example trước khi chọn solution

**15 phút · mốc 0–15.**

:::goal{title="Phân biệt được candidate problem và Problem Statement cuối"}
Bạn biết nhóm chỉ chọn một candidate để đào sâu, chưa chốt solution hoặc Problem Statement ở đầu buổi.
:::

**Bạn làm:**

1. Mở [02-deliverable-example.md](../02-deliverable-example.md) và đọc theo thứ tự scan → validation → workflow → decision.
2. Mở [01-worksheet.md](../01-worksheet.md), đánh dấu các Phase 1–7 sẽ làm trong buổi.
3. Mỗi người nói lại một câu: candidate khác Problem Statement ở điểm nào.

Kết quả kỳ vọng: nhóm thống nhất rằng Problem Statement chỉ được viết sau validation, research, workflow, metric và boundary.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Không ai đề xuất chatbot/agent làm điểm xuất phát.
- [ ] Nhóm biết ba file nộp: individual scan, group report, individual reflection.
:::

---

## 2. Scan cá nhân: ít nhất năm problems thật

**25 phút · mốc 15–40.**

:::goal{title="Có danh sách pain đủ cụ thể để đem ra so sánh"}
Mỗi người ghi ít nhất năm problems, mỗi dòng có actor và một dấu hiệu thật thay vì ý tưởng sản phẩm.
:::

**Bạn làm:**

1. Tạo section `## Phase 1 — Problem scan` trong `01-individual-problem-scan/individual-report.md`.
2. Điền bảng gồm `Problem`, `Actor`, `Workflow hiện tại`, `Dấu hiệu thật`; dùng các lăng kính lặp lại, tốn thời gian, AI có thể hỗ trợ, pain từ người khác.
3. Chỉ sau khi tự scan, dùng AI/search để hỏi thêm góc nhìn; kiểm tra lại mọi claim bằng trải nghiệm hoặc nguồn của bạn.

Kết quả kỳ vọng: ít nhất 5 dòng, không có dòng chỉ ghi tên solution như “làm chatbot học tập”.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Có 5+ problems, mỗi problem có actor.
- [ ] Mỗi problem có dấu hiệu: thời gian, tần suất, log, ticket hoặc phản hồi thật.
- [ ] Danh sách nằm trong `01-individual-problem-scan/individual-report.md`.
:::

---

## 3. Viết top 3 Problem Cards và workflow draft

**35 phút · mốc 40–75.**

:::goal{title="Ba candidate có đủ ngữ cảnh để pitch và challenge"}
Bạn chọn ba problems mạnh nhất, mô tả bottleneck và vẽ flow trước/sau ở mức draft.
:::

**Bạn làm:**

1. Thêm ba section `## Problem Card 1` đến `## Problem Card 3` vào `01-individual-problem-scan/individual-report.md`.
2. Mỗi card ghi actor, trigger, workflow hiện tại, bottleneck, impact, dấu hiệu và giả định cần kiểm chứng.
3. Thêm workflow before/after cho mỗi card bằng Markdown list hoặc Mermaid. Chưa cần chọn AI solution.

Kết quả kỳ vọng: một người khác đọc card có thể hỏi đúng điểm chưa rõ mà không cần bạn giải thích lại bối cảnh.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Có đúng 3 Problem Cards, không phải 3 solution proposals.
- [ ] Mỗi card chỉ ra một bottleneck cụ thể trong workflow.
- [ ] Mỗi thành viên chuẩn bị pitch ngắn và một câu challenge cho card của bạn khác.
:::

**Nếu bị chậm:** hoàn thiện một card tốt trước, hai card còn lại có thể ngắn hơn nhưng vẫn phải có actor và dấu hiệu.

---

## 4. Hội tụ nhóm vào một candidate

**30 phút · mốc 85–115.**

:::goal{title="Nhóm chọn được một candidate có lý do, chưa chốt solution"}
Group report lưu shortlist, tiêu chí chọn và candidate sẽ đi vào validation.
:::

**Bạn làm:**

1. Điền thành viên và role vào [docs/PHAN_CONG_CONG_VIEC.md](PHAN_CONG_CONG_VIEC.md).
2. Thêm `## 1. Convergence log` và `## 2. Candidate problem` vào `02-group-problem-statement/group-report.md`.
3. Ghi 2–3 candidates, score theo pain, frequency, impact, evidence và risk; chọn một candidate để validate.

Kết quả kỳ vọng: group report giải thích được vì sao các candidates còn lại chưa được chọn, không chỉ ghi “nhóm thích ý tưởng này”.

:::checkpoint{title="Hoàn thành khi"}
- [ ] `group-report.md` có shortlist, tiêu chí và candidate được chọn.
- [ ] Mỗi role có owner, một người làm Integrator cho `group-report.md`.
- [ ] Candidate chưa được gọi là Problem Statement cuối.
:::

---

## 5. Validate pain và research phương án có sẵn

**30 phút · mốc 115–145.**

:::goal{title="Candidate được kiểm bằng evidence thay vì trực giác"}
Nhóm có 2–3 nguồn hoặc quan sát, ghi rõ điều gì được xác nhận và điều gì vẫn là giả định.
:::

**Bạn làm:**

1. Thêm `## 3. Validation and research` vào `02-group-problem-statement/group-report.md`.
2. Ghi evidence: phỏng vấn nhanh, survey, log, quan sát hoặc nguồn chính thức; mỗi nguồn có link và kết luận liên quan đến candidate.
3. Ghi các existing solutions và constraint; không dùng số liệu do AI tạo mà không kiểm nguồn.

Kết quả kỳ vọng: có bảng `Evidence | Nguồn | Điều nó xác nhận | Giới hạn` với ít nhất 2 entries.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Có 2–3 nguồn/quan sát truy ngược được.
- [ ] Một evidence làm rõ hoặc buộc nhóm sửa giả định ban đầu.
- [ ] Claim chưa chắc được gắn là giả định.
:::

:::caution{title="AI chỉ hỗ trợ research"}
AI có thể giúp tìm từ khóa hoặc phản biện, nhưng pitch, challenge và kết luận phải do nhóm tự viết và tự chịu trách nhiệm.
:::

---

## 6. Vẽ workflow, metric, boundary và Problem Statement v0

**45 phút · mốc 145–190.**

:::goal{title="Problem được đóng khung bằng workflow đo được"}
Nhóm có flow before/after, metric với baseline/cách đo, boundary và một PS v0 để review.
:::

**Bạn làm:**

1. Thêm `## 4. Workflow before and after` vào `02-group-problem-statement/group-report.md`; chỉ actor, handoff, bottleneck và điểm human review.
2. Thêm `## 5. Metric and boundary`; mỗi metric có baseline, target và cách đo, còn boundary nêu dữ liệu/rủi ro/rollback ngoài phạm vi.
3. Thêm `## 6. Problem Statement v0`; nêu actor, workflow, bottleneck, impact, metric và boundary trong một đoạn ngắn.

Kết quả kỳ vọng: flow cho thấy rõ bước nào thay đổi, ai vẫn chịu trách nhiệm khi output sai và quay lại bước nào.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Workflow before/after có bottleneck và human review.
- [ ] Metric không chỉ nói “nhanh hơn” hay “tốt hơn”.
- [ ] Boundary nêu rõ không làm gì và rollback thế nào.
:::

---

## 7. Chọn No AI, Rule, Workflow hoặc Agent

**25 phút · mốc 200–225.**

:::goal{title="Quyết định mức AI phù hợp với bằng chứng và rủi ro"}
Nhóm so sánh các phương án, chỉnh PS v1 khi cần và chọn Go, Not Yet hoặc No-Go có lý do.
:::

**Bạn làm:**

1. Thêm `## 7. Options and decision` vào `02-group-problem-statement/group-report.md`.
2. So sánh No AI, Rule, Workflow, Agent theo input, biến thiên, risk, human review và effort vận hành.
3. Thêm `## 8. Problem Statement v1` và `## 9. Final decision`; ghi thay đổi từ v0, quyết định và điều kiện để đổi quyết định.

Kết quả kỳ vọng: Rule hoặc Workflow có thể thắng Agent nếu giảm pain với rủi ro và chi phí thấp hơn.

:::checkpoint{title="Hoàn thành khi"}
- [ ] Có lý do chọn một phương án và không chọn các phương án khác.
- [ ] PS v1 phản ánh evidence/workflow, không chỉ đổi câu chữ.
- [ ] Final decision là Go, Not Yet hoặc No-Go kèm điều kiện.
:::

---

## 8. Reflection cá nhân và nộp ba artifacts

**15 phút · mốc 225–240.**

:::goal{title="Repo cá nhân có đủ phần cá nhân và bản nhóm cuối"}
Mỗi người ghi reflection thật, copy group report cuối vào repo cá nhân và kiểm tra rubric trước khi push.
:::

**Bạn làm:**

1. Viết `03-individual-reflection/reflection.md`: role, đóng góp, AI đã hỗ trợ gì, bạn đã kiểm/chỉnh gì, bài học và điều sẽ làm khác đi.
2. Đồng bộ bản cuối `02-group-problem-statement/group-report.md` vào repo cá nhân của từng thành viên.
3. Kiểm tra ba folder rồi commit và push theo quy ước lớp.

```bash
git status --short
git add 01-individual-problem-scan 02-group-problem-statement 03-individual-reflection
git commit -m "Nop bai Day 02"
git push
```

Kết quả kỳ vọng: Git chỉ stage ba phần bài nộp và file phụ có prefix đúng; không có secret hoặc PII không cần thiết.

### Checklist artifacts bắt buộc

:::checkpoint{title="Hoàn thành khi"}
- [ ] [01-individual-problem-scan/individual-report.md](../01-individual-problem-scan/individual-report.md): 5+ scan, 3 cards, workflow drafts.
- [ ] [02-group-problem-statement/group-report.md](../02-group-problem-statement/group-report.md): convergence, evidence, workflow, PS v0/v1, options, decision.
- [ ] [03-individual-reflection/reflection.md](../03-individual-reflection/reflection.md): đóng góp và reflection do chính bạn viết.
- [ ] Group rubric đạt: workflow 15, PS/metric/boundary 20, options 15, decision 10.
- [ ] Cá nhân rubric đạt: scan/cards 12, pitch/challenge 12, reflection 10, giải thích mạch reasoning 6.
:::

> Bài mạnh không phải bài có Agent. Bài mạnh chỉ ra đúng pain, bằng chứng, giới hạn và mức tự động hóa phù hợp.
