<!--
TEMPLATE — docs/CODELAB.md
Xoá toàn bộ comment HTML này và mọi comment <!-- --> khác trước khi giao.
Thay <...> bằng nội dung thật. Không để lại <...> nào.
Luật đầy đủ: SKILL.md — Phase 3 (frontmatter), Phase 4 (thân bài), Phase 6-7 (anti-slop, tự kiểm)
-->
---
id: "day<N>-<kind>-<topic>"
title: "Lab <NN> — <Tên lab>"
duration: <phút, số nguyên>
author: "<Đơn vị>"
updated: "<YYYY-MM-DD>"
category: "<LLM API | AI Product | AI Agent | Prompt Engineering | Evaluation>"
description: "<1 câu, 120-200 ký tự, bắt đầu bằng động từ, nói learner làm gì>"
published: false
collection: "codelabs"
format: "steps"
day: "<N>"
preparationTipIds: []
level: "<beginner | intermediate | advanced>"
prerequisites: ["<năng lực kiểm được>", "<năng lực kiểm được>", "<năng lực kiểm được>"]
outcomes: ["<Động từ quan sát được> ... trong <file>", "<...>", "<...>"]
supportedOs: ["Windows", "macOS", "Linux"]
requiredTools: ["<Python 3.10+>", "<pip>", "<Git>"]
commonErrors: ["<lỗi thật đã thấy>", "<lỗi thật đã thấy>", "<lỗi thật đã thấy>"]
requiresSubmission: <true | false>
---
<!-- Không viết H1 và không viết dòng meta ở đây: trang web đã render title, day,
     duration, level, category, author, updated từ frontmatter. Viết lại là tiêu đề
     hiện hai lần. Bắt đầu thẳng bằng khối TL;DR dưới đây. -->
> **<duration> phút · Day <N> · <level>.** <2-3 câu learner sẽ xây gì. Tooltip jargon ở lần đầu:
> [<thuật ngữ>](#glossary "<định nghĩa ≤160 ký tự>"). Nói rõ nếu step đầu chưa cần API key.

Câu hỏi trọng tâm xuyên suốt Lab:

> **<Một câu hỏi learner mang xuyên suốt và trả lời được ở step cuối>**

<!-- Khối dưới CHỈ giữ khi audit tìm ra mâu thuẫn thật. Không có mâu thuẫn thì xoá cả khối. -->
> **Mâu thuẫn trong repo — cách guide này xử lý**
>
> - <mâu thuẫn 1 — nguồn A nói gì, nguồn B nói gì, guide này chọn gì và vì sao>
> - <mâu thuẫn 2>

<!-- Bảng định hướng hoặc mermaid kiến trúc — tuỳ chọn, chỉ khi nó thay được prose dài. -->

| <Thành phần> | <Vai trò> | <File phụ trách> |
|---|---|---|
| <...> | <...> | `<path>` (Role <n>) |

---

## 1. <Cụm động từ — việc learner làm> (<N>phút)

:::goal{title="<Trạng thái đạt được, không phải hoạt động>"}
<1-2 câu: xong step này learner có gì chạy được.>
:::

### <Sub-step: hành động đầu tiên>

<Kiến thức ≤ 3 dòng: vì sao step này tồn tại. Không dạy cú pháp.>

**Bạn làm**<!-- (Role <n> — <tên role>) nếu lab nhóm -->:

1. <Động từ> `<path/file>` — <việc cụ thể>.
2. <Động từ> ... .
3. <Động từ> ... .

```bash
<lệnh setup hoặc lệnh chạy>
<lệnh>        # Windows PowerShell: <biến thể>
```

Kết quả đúng:

```text
<output thật, 3-6 dòng có nghĩa>
```

<!-- Ô điền: chỉ khi learner phải viết câu trả lời. `target` bắt buộc — file trong repo mà nội dung này
     cuối cùng phải nằm. Xem references/interactive-blocks.md -->
:::input{id="<kebab-case-duy-nhat>" target="<path>#<anchor>" lines="3"}
<Câu hỏi hoàn chỉnh, đọc được cả khi renderer chưa xử lý block này.>
:::

<!-- Gợi ý ẩn: HTML gốc, đóng mặc định, không lộ nội dung kể cả khi renderer chưa hỗ trợ.
     Giữ dòng trống sau <summary> và trước </details>, nếu không markdown bên trong không parse. -->
<details>
<summary>Gợi ý — bấm để mở</summary>

<Gợi ý hướng đi, không phải đáp án.>

</details>

<!-- Escape hatch cho nhóm chậm — bắt buộc ở step dài -->
**Nếu bị chậm:** làm xong bullet <1-2> là đủ điều kiện sang step sau.

<!-- Extension cho nhóm nhanh — tuỳ chọn, không được chặn checkpoint -->
**Xong sớm:** <việc mở rộng cụ thể, có file để ghi kết quả>.

:::checkpoint{title="Hoàn thành khi"}
[ ] <Chạy được: `<lệnh>` → `<output>`>
[ ] <Nhìn thấy: <trạng thái quan sát được>>
[ ] <Nói được: bạn giải thích được vì sao <...>>
:::

:::caution{title="Troubleshooting — Vấn đề thường gặp"}
<Triệu chứng 1>
→ **Mindset**: <cách nghĩ để tách vấn đề>.
→ <Cách kiểm cụ thể>.

<Triệu chứng 2>
→ **Mindset**: <...>.
→ <...>.
:::

---

## 2. <Cụm động từ> (<N>phút)

<!-- Lặp lại đúng bộ xương của step 1. 4-8 step tổng. -->

:::goal{title="<...>"}
<...>
:::

### Tại sao <...>?

<Kiến thức ≤ 3 dòng.>

**Bạn làm**:

1. <...>

```bash
<...>
```

Kết quả đúng:

```text
<...>
```

:::checkpoint{title="Hoàn thành khi"}
[ ] <...>
[ ] <...>
:::

---

## <N>. Evaluation, report và nộp bài (<N>phút)

<!-- Step này bắt buộc khi requiresSubmission: true -->

:::goal{title="So sánh công bằng, nộp bài đầy đủ"}
<Chạy bộ test case, hoàn thiện báo cáo, push repo sạch.>
:::

### Bộ test case (`<path>`)

| # | Loại | Kiểm gì | Kỳ vọng |
|---|---|---|---|
| 1 | <Đơn giản> | <...> | <...> |
| 2 | <Multi-step> | <...> | <...> |
| 3 | <Edge case — nói rõ đây là bẫy> | <...> | <...> |

### Rubric

| Tiêu chí | 0 điểm | 1 điểm | 2 điểm |
|---|---|---|---|
| <...> | <...> | <...> | <...> |

### Security check trước khi push

```bash
git status --short          # không được thấy .env, __pycache__, hoặc file dữ liệu thật
grep -n 'sk-' *.py          # không được ra kết quả
```

### Push và nộp

```bash
git add .
git commit -m "<Hoan thanh Lab NN: ten lab>"
git push origin main
```

<Quy ước tên repo, nơi nộp link, deadline.>

<!-- Chỉ khi bài có :::input — dựng file để learner commit -->
:::export{targets="<path>, <path>"}
Tải các file này về, đặt vào repo của bạn rồi commit.
:::

### Checklist artifacts bắt buộc

- [ ] [<path>](<relative-link>) — <nội dung>
- [ ] [<path>](<relative-link>) — <nội dung>
- [ ] [<path>](<relative-link>) — <nội dung>

---

> **<Một câu — điều quan trọng nhất learner nên mang ra khỏi lab này.>**
