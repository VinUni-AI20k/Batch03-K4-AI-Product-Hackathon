# Render contract

Hợp đồng cứng giữa file Markdown và web codelabs. Đọc ở Phase 3 (frontmatter) và Phase 4 (directive, ô điền).

Lệch hợp đồng này không phải lỗi thẩm mỹ — nó là trang hỏng: tiêu đề hiện hai lần, chữ `:::` trần giữa bài, hoặc card listing trỏ vào 404.

## Nội dung

1. Web render bằng gì
2. Frontmatter — 19 field
3. Bốn field dễ sai nhất
4. Directive — vocabulary đóng
5. Ba directive có ở mọi lab
6. Điền được và tương tác được
7. Gợi ý và đáp án ẩn
8. Glossary tooltip
9. Thân bài mở đầu thế nào

## Web render bằng gì

Markdown + YAML frontmatter, chạy qua `react-markdown` với `remark-gfm` + `remark-directive`, cộng một plugin nhỏ đổi `:::goal` thành React component (namespace `d-*`), rồi `rehype-raw` + `rehype-slug`. Frontmatter parse bằng `gray-matter`. Mermaid render client-side. Web đọc file từ `frontend/content/<id>.md`.

**Không dùng MDX.** Ba lý do, theo thứ tự quan trọng:

1. **File này sống ở hai nơi.** Nó publish lên web, và nó cũng nằm ở `docs/CODELAB.md` trong repo lab — nơi learner mở bằng GitHub. Markdown + directive trên GitHub thì `:::goal` hiện ra như một dòng chữ lạ nhưng toàn bộ nội dung vẫn đọc được. MDX trên GitHub là một trang rác.
2. **Directive là data, JSX là code.** Gõ sai một dấu trong directive thì ra chữ; gõ sai trong JSX thì trắng trang hoặc vỡ build.
3. **Pipeline nhận file từ nhiều lab coach.** MDX nghĩa là React tuỳ ý chạy trên site. Directive là vocabulary đóng, team codelabs kiểm soát được nó render thành gì.

Đánh đổi phải nhận: mỗi block tương tác cần frontend implement một lần. Bù lại nó implement một lần cho mọi lab về sau. Cần block mới thì nói với team codelabs, sửa vocabulary một chỗ — đừng tự nghĩ ra loại thứ tám.

## Frontmatter — 19 field

Đúng thứ tự này. Thứ tự cố định là điều kiện để diff giữa hai coach đọc được. Schema rút từ codelab đang publish thật, không phải tự đặt ra — web đổi schema thì sửa ở đây trước, đừng sửa lẻ trong từng bài.

```yaml
---
id: "day3-lab-chatbot-vs-react-agent-e402"   # slug URL, ASCII kebab-case không dấu, day<N>-<kind>-<topic>[-<room>]
title: "Lab 03 — Chatbot vs ReAct Agent"      # em dash, không dùng -
duration: 240                                  # PHÚT, số nguyên, không phải "4h"
author: "VinUni AI Codelab × GDGoC"
updated: "2026-07-27"                          # ngày sửa nội dung, không phải ngày dạy
category: "AI Agent"                           # LLM API | AI Product | AI Agent | Prompt Engineering | Evaluation
description: "<1 câu, 120-200 ký tự, bắt đầu bằng động từ>"
published: false                               # Phase 7 đổi true khi validator sạch
collection: "codelabs"                         # "presentations" cho slide coach
format: "steps"                                # lab luôn là "steps"
day: "3"                                       # CHUỖI, không phải số
preparationTipIds: []                          # chỉ ID đã tồn tại trên web; không chắc thì để rỗng
level: "intermediate"                          # beginner | intermediate | advanced, theo prerequisite khắt khe nhất
prerequisites: ["<năng lực kiểm được>"]        # 3-6 mục, không phải tên môn học
outcomes: ["<động từ quan sát được> ... trong <file>"]   # 3-6 mục
supportedOs: ["Windows", "macOS", "Linux"]     # chỉ OS thật sự có lệnh trong bài
requiredTools: ["Python 3.10+", "pip", "Git"]  # kèm version khi version ảnh hưởng kết quả
commonErrors: ["<lỗi thật>"]                   # 3-6, từ test / docstring / lớp trước
requiresSubmission: true                       # true thì phải có step nộp bài + checklist artifact
---
```

Tên file trong `frontend/content/` phải bằng `id`. Đổi `id` là đổi URL và vỡ link cũ, nên bản cập nhật giữ nguyên `id`.

## Bốn field dễ sai nhất

- **`duration`** bằng tổng thời lượng các step. Lệch nhiều thì coach xếp buổi sai và lớp bị cắt giữa bài, nên sai số giữ trong 15 phút. Validator kiểm phép cộng này.
- **`description`** nói learner làm gì, không nói lab hay thế nào. Cấm tính từ marketing.
- **`outcomes`** phải qua được test "learner nói đã đạt, tôi kiểm bằng cách nào trong 2 phút?". Động từ quan sát được thì qua: Giải thích, Thiết kế, So sánh, Phân tích, Sửa. Động từ chỉ trạng thái trong đầu thì không: hiểu, nắm được, làm quen, biết về, tìm hiểu — không ai kiểm được, nên chúng biến outcome thành câu trang trí.
- **`preparationTipIds`** bịa ID thì tạo link 404 trên trang lab. Không chắc thì `[]`.

```yaml
# tốt: việc cụ thể, có con số
description: "Xây Chatbot baseline, thiết kế Tool Specs, lắp ReAct Agent Loop với Guardrails và đánh giá trên bộ 5 Test Cases."
outcomes: ["Thiết kế tool contract và khai báo trong src/tools.py"]

# tệ: không nói làm gì, không verify được
description: "Một lab thú vị và toàn diện giúp bạn khám phá thế giới AI Agent đầy tiềm năng."
outcomes: ["Hiểu sâu về cách hoạt động của AI Agent"]
```

**Còn để ngỏ:** trang listing từng dùng `slug` khác `id` trong frontmatter. Hiện web quét `frontend/content/` nên `id` là nguồn duy nhất, nhưng nếu thấy một map `replaces` trong code listing thì đừng tự suy — hỏi team codelabs.

## Directive — vocabulary đóng

Bảy tên, không hơn: `goal` `checkpoint` `caution` `input` `export` `os` `quiz`.

Cú pháp: `:::name{attr="value"}` trên một dòng riêng, nội dung, rồi `:::` trên một dòng riêng. Thiếu dòng đóng thì phần còn lại của bài bị hút vào trong block.

Bảng dưới đây là để bạn chọn cơ chế rẻ nhất mà vẫn đạt mục tiêu, và biết trước chuyện gì xảy ra khi renderer chưa hỗ trợ:

| Nhu cầu | Cơ chế | Khi renderer chưa hỗ trợ |
|---|---|---|
| Mục tiêu, checkpoint, cảnh báo | `:::goal` `:::checkpoint` `:::caution` | đã chạy |
| Định nghĩa jargon tại chỗ | `[từ](#glossary "…")` | đã chạy |
| Sơ đồ | ```` ```mermaid ```` | đã chạy |
| Gợi ý, đáp án ẩn | `<details><summary>` HTML gốc | **chạy được ngay**, cả trên GitHub |
| Ô điền | `:::input` | câu hỏi vẫn đọc được; learner điền vào file `target` |
| Dựng file để commit | `:::export` | learner tự tạo file theo `target` |
| Lệnh theo OS | `:::os` | hai code block có nhãn, vẫn copy được |
| Câu tự kiểm | `:::quiz` | list phương án + `<details>` đáp án |

## Ba directive có ở mọi lab

```markdown
:::goal{title="Agent V1 chạy đúng tool path, dừng đúng lúc"}
Hiểu vòng lặp ReAct, lắp system prompt → parser → executor → loop.
:::
```

`title` là **trạng thái đạt được**, không phải hoạt động: `"Tool chạy đúng, test pass"` chứ không phải `"Viết tool"`. Học viên cần biết đích trước khi làm.

```markdown
:::checkpoint{title="Hoàn thành khi"}
[ ] `pytest tests/test_part1.py -v` → `3 passed`
[ ] Terminal hiện `(.venv)` ở đầu dòng lệnh
[ ] Bạn giải thích được vì sao Observation phải do application chèn, không phải model tự sinh
:::
```

`title` luôn là `"Hoàn thành khi"`, đồng nhất cả bộ codelab để learner nhận ra khối này ngay. Checkbox luôn để trống `[ ]` — tick sẵn thì checkpoint mất tác dụng, và validator chặn. Ba loại dòng: **chạy được / nhìn thấy / nói được**. Mỗi step cần ít nhất một dòng nói được — đây là chốt chống trường hợp học viên để AI viết hết mà không hiểu gì. Cấm "Hiểu được X", "Nắm vững Y".

```markdown
:::caution{title="Troubleshooting — Vấn đề thường gặp"}
Agent lặp lại cùng một tool + cùng tham số
→ **Mindset**: Agent không tự nhận ra mình bị kẹt lặp.
→ Kiểm tra: đã đặt `MAX_ITERATIONS` chưa? Prompt có dạy cách xử lý khi tool báo lỗi chưa?
:::
```

Mỗi vấn đề: 1 dòng triệu chứng (nguyên văn thông báo lỗi nếu có), 1 dòng `→ **Mindset**:` dạy cách nghĩ, 1–2 dòng cách kiểm. Dòng Mindset là phần có giá trị nhất; bỏ nó thì block này chỉ là FAQ. Cách dùng thứ hai của `:::caution` là cảnh báo tư duy giữa step, khi học viên sắp kết luận sai.

Đặt `:::caution` **sau** khi learner đã làm, không phải trước. Đọc troubleshooting lúc chưa gặp lỗi thì quên ngay.

## Điền được và tương tác được

Luật quan trọng nhất của cả trang tương tác, và nó đến từ cách chấm bài: **learner nộp bằng repo GitHub, không nộp bằng cách điền form.**

Ô điền trên web là tầng tiện lợi phủ lên một deliverable dạng file, không phải nơi câu trả lời sống. Mỗi `:::input` khai `target`: file và anchor mà nội dung đó cuối cùng phải nằm trong repo learner. Thiếu `target` thì hỏng ba đường: learner điền xong không biết đưa đi đâu, mất state là mất bài, và coach không có gì để chấm.

```markdown
:::input{id="q2-temperature" target="artifacts/REPORT.md#câu-2" lines="4"}
So sánh output ở `temperature=0` và `temperature=1.5` trên cùng prompt. Khác nhau ở đâu?
:::
```

- `id` bắt buộc, kebab-case, duy nhất trong file. Đây là key lưu state — đổi `id` là learner mất nội dung đã điền, nên đặt xong thì giữ.
- `target` bắt buộc, dạng `<path>` hoặc `<path>#<anchor>`.
- `lines` mặc định 3; `lines="1"` render một dòng.
- Thân block viết là **câu hỏi hoàn chỉnh**, không viết nhãn cụt kiểu "Nhận xét:" — vì khi renderer chưa xử lý thì nó vẫn phải đọc được.

```markdown
:::export{targets="artifacts/REPORT.md, docs/trace_eval.md"}
Tải hai file này về, đặt vào repo của bạn rồi commit.
:::
```

Đặt ở step nộp bài. Nó thu mọi `:::input` có `target` khớp, dựng file theo anchor, cho tải về hoặc copy. Đây là mảnh nối web với GitHub — bài có `:::input` mà thiếu `:::export` thì trang tương tác là đường cụt, và validator chặn.

````markdown
:::os
```bash tab="macOS / Linux"
python3 -m venv .venv && source .venv/bin/activate
```
```powershell tab="Windows"
python -m venv .venv; .venv\Scripts\Activate.ps1
```
:::
````

Chọn OS một lần thì cả trang đổi theo. Chỉ dùng khi lệnh **thật sự** khác nhau; lệnh giống nhau mà bọc `:::os` thì chỉ thêm một cú click vô nghĩa.

```markdown
:::quiz{id="q-grounded" answer="b"}
Chatbot trả lời trôi chảy về giá vé. Vì sao chưa gọi là grounded?

- a) Vì câu trả lời quá dài
- b) Vì không có Observation nào từ tool
- c) Vì temperature quá cao
:::
```

Dùng cho retrieval practice: hỏi lại điều learner **vừa làm**, không hỏi mẹo.

**Mật độ:** một step nhiều nhất khoảng 2 ô `:::input` và 1 `:::quiz`. Nhiều hơn thì trang biến thành form, và learner chuyển sang chế độ điền cho xong thay vì chế độ làm.

Có ô điền thì `:::checkpoint` đổi cách diễn đạt: thay vì "mở `artifacts/REPORT.md` và trả lời câu 2", viết "ô điền câu 2 đã có nội dung của bạn". Và đừng để tương tác thay việc chạy thật — learner bấm nút trên web không chứng minh code của họ chạy được.

## Gợi ý và đáp án ẩn

Dùng `<details>` HTML gốc, **không** directive riêng. Markdown hỗ trợ sẵn, GitHub render sẵn, và nó đóng mặc định ở cả hai nơi — nên đáp án không bị lộ khi renderer chưa làm gì. Một directive `:::solution` sẽ *lộ đáp án* nếu chưa implement, tức là hỏng nặng chứ không hỏng nhẹ.

```markdown
<details>
<summary>Gợi ý — bấm để mở</summary>

Bộ test thay thế `openai.OpenAI`. Nghĩ xem `import` đặt ở đâu thì hàm giữ tham chiếu tới class nào.

</details>
```

Để một dòng trống sau `<summary>` và trước `</details>`, nếu không markdown bên trong không được parse.

Gợi ý thì mở thoải mái. Đáp án thì chỉ đặt ở step mà learner có cách khác để tự kiểm đúng sai (có test, có output đối chiếu). Step mà đáp án là thứ duy nhất phải tự nghĩ ra thì chỉ cho gợi ý.

## Glossary tooltip

```markdown
[ReAct Agent](#glossary "Reasoning + Acting — agent luân phiên Thought, Action, Observation cho đến khi đủ bằng chứng.")
```

Một câu. Không chứa `"` vì nó phá cú pháp. Khoảng 160 ký tự — nó render trong một tooltip nhỏ nên dài hơn thì bị cắt giữa câu. Đặt ở **lần xuất hiện đầu tiên**, cho mọi jargon mà `prerequisites` chưa yêu cầu learner biết trước.

## Thân bài mở đầu thế nào

**Không mở bằng `# H1`, và không có dòng meta.** Trang web đã render title, day, duration, level, category, author, updated từ frontmatter — viết lại trong thân bài thì learner thấy tiêu đề hiện hai lần. Heading cấp cao nhất trong thân bài là `##` của step. Không có heading H4+.

Thứ tự mở đầu:

```markdown
> **240 phút · Day 3 · intermediate.** Bạn sẽ xây chatbot baseline, thiết kế tool contract, lắp
> [ReAct Agent](#glossary "Reasoning + Acting — agent luân phiên Thought, Action, Observation cho đến khi đủ bằng chứng.")
> và so sánh hai hệ thống trên cùng bộ test case. Phần lớn bài chạy deterministic, chưa cần API key ngay.

Câu hỏi trọng tâm xuyên suốt Lab:

> **Chatbot trả lời được — nhưng nó có thật sự "biết" không? Khi nào chi phí orchestration của Agent đáng giá?**

| Mốc | Step | Xong sẽ có gì |
|---:|---|---|
| 0–20 | 1. Chạy được môi trường | `.venv` hoạt động, smoke test in ra 3 dòng |
| 20–70 | 2. Chatbot baseline | `src/chatbot.py` trả lời 5 câu, có case bịa |
| 70–140 | 3. Lắp ReAct Agent V1 | `src/app.py` gọi đúng tool, dừng đúng lúc |
```

TL;DR mở đầu bằng `**<duration> phút · Day <N> · <level>.**`. Đúng một câu hỏi trọng tâm — hai câu là chưa chốt được trọng tâm. Nếu step đầu chưa cần API key thì nói ngay ở đây, đây là rào cản bỏ cuộc số một.

Bảng timeline là bắt buộc, và cột cuối viết bằng **artifact quan sát được**, không viết bằng chủ đề. Nó cho học viên biết mình đang ở đâu trên đồng hồ mà không phải đếm, và cho người đến muộn biết nhảy vào đâu.

Sau đó là khối `Mâu thuẫn trong repo` nếu có, rồi `---`, rồi các step.
