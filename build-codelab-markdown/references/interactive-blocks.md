# Interactive blocks

Đọc ở Phase 4 khi lab cần learner điền hoặc tương tác trên web.

## Quyết định kiến trúc: Markdown + directive, không MDX

Định dạng chốt cho codelab: **YAML frontmatter + Markdown + `remark-directive`**, render qua một registry component đóng do team codelabs sở hữu.

Không dùng MDX, vì ba lý do theo thứ tự quan trọng:

1. **File này sống ở hai nơi.** Nó publish lên web, và nó cũng nằm ở `docs/CODELAB.md` trong repo lab — nơi learner mở bằng GitHub. Markdown + directive ở GitHub thì `:::goal` hiện ra như một dòng chữ lạ nhưng toàn bộ nội dung vẫn đọc được. MDX ở GitHub là một trang rác.
2. **Directive là data, JSX là code.** Coach và LLM gõ sai một dấu trong directive thì ra chữ; gõ sai trong JSX thì trắng trang hoặc vỡ build.
3. **Pipeline nhận file từ nhiều labcoach.** MDX nghĩa là React tuỳ ý chạy trên site. Directive là vocabulary đóng, team codelabs kiểm soát được nó render thành gì. Đây là khác biệt về attack surface, không phải khác biệt về tiện tay.

Đánh đổi phải nhận: mỗi block tương tác cần frontend implement một lần. Bù lại nó implement một lần cho mọi lab về sau.

## Nguyên tắc thiết kế: hỏng thì hỏng nhẹ

Chọn cơ chế rẻ nhất mà vẫn đạt mục tiêu, và viết sao cho khi renderer chưa hỗ trợ thì nội dung vẫn dùng được.

| Nhu cầu | Cơ chế chốt | Khi renderer chưa hỗ trợ |
|---|---|---|
| Mục tiêu, checkpoint, cảnh báo | `:::goal` `:::checkpoint` `:::caution` | đã chạy |
| Định nghĩa jargon tại chỗ | `[từ](#glossary "…")` | đã chạy |
| Sơ đồ | ```` ```mermaid ```` | đã chạy |
| Gợi ý, đáp án ẩn | `<details><summary>` HTML gốc | **chạy được ngay**, cả trên GitHub |
| Ô điền | `:::input` | câu hỏi vẫn đọc được; learner điền vào file `target` |
| Dựng file để commit | `:::export` | learner tự tạo file theo `target` |
| Lệnh theo OS | `:::os` | hai code block có nhãn, vẫn copy được |
| Câu tự kiểm | `:::quiz` | list phương án + `<details>` đáp án |

Hai dòng cần chú ý:

**Gợi ý và đáp án dùng `<details>` HTML gốc, không dùng directive riêng.** Markdown hỗ trợ nó sẵn, GitHub render nó sẵn, và nó đóng mặc định ở cả hai nơi — nên đáp án không bị lộ khi renderer chưa làm gì. Directive `:::solution` sẽ *lộ đáp án* nếu chưa implement, tức là hỏng nặng chứ không hỏng nhẹ. Yêu cầu duy nhất phía renderer: bật `rehype-raw` để HTML gốc đi qua được pipeline; nhiều pipeline mặc định strip nó.

```markdown
<details>
<summary>Gợi ý — bấm để mở</summary>

Bộ test thay thế `openai.OpenAI`. Nghĩ xem `import` đặt ở đâu thì hàm giữ tham chiếu tới class nào.

</details>
```

Để một dòng trống sau `<summary>` và trước `</details>`, nếu không markdown bên trong không được parse.

**`:::input` khi chưa render vẫn phải đọc được**, nên thân block viết là câu hỏi hoàn chỉnh, không viết kiểu nhãn cụt như "Nhận xét:".

## Luật: mọi input phải có file đích

Luật quan trọng nhất của cả trang tương tác, và nó đến từ cách khoá chấm bài — **learner nộp bằng repo GitHub, không nộp bằng cách điền form.**

Ô điền trên web là tầng tiện lợi phủ lên một deliverable dạng file, không phải nơi câu trả lời sống. Mỗi `:::input` khai `target`: file và anchor mà nội dung đó cuối cùng phải nằm trong repo learner.

Thiếu `target` thì hỏng ba đường: learner điền xong không biết đưa đi đâu · mất state là mất bài · coach không có gì để chấm.

## Spec từng block

Phần này là tài liệu cú pháp cho coach, đồng thời là spec bàn giao cho frontend.

### `:::input`

```markdown
:::input{id="q2-temperature" target="exercises.md#câu-2" lines="4"}
So sánh output ở `temperature=0` và `temperature=1.5` trên cùng prompt. Khác nhau ở đâu?
:::
```

- `id` bắt buộc, kebab-case, duy nhất trong file. Đây là key lưu state — đổi `id` là learner mất nội dung đã điền, nên đặt xong thì giữ.
- `target` bắt buộc, dạng `<path>` hoặc `<path>#<anchor>`.
- `lines` mặc định 3; `lines="1"` render một dòng.
- Persist cục bộ theo `id` + slug bài, không gửi server, vì nội dung learner viết có thể là thứ họ không muốn public.

### `:::export`

```markdown
:::export{targets="exercises.md, docs/trace_eval.md"}
Tải hai file này về, đặt vào repo của bạn rồi commit.
:::
```

Đặt ở step nộp bài. Thu mọi `:::input` có `target` khớp, dựng file theo anchor, cho tải về hoặc copy. File dựng ra phải giống file trong repo learner đến mức commit thẳng được. Đây là mảnh nối web với GitHub; thiếu nó thì trang tương tác là đường cụt.

### `:::os`

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

Chọn OS một lần thì cả trang đổi theo và nhớ lựa chọn. Đáng làm sớm vì lớp chạy ba OS, và comment `# Windows: ...` nhét trong block bash là chỗ người mới đọc sai nhiều nhất.

Chỉ dùng khi lệnh thật sự khác nhau. Lệnh giống nhau mà bọc `:::os` thì chỉ thêm một cú click vô nghĩa.

### `:::quiz`

```markdown
:::quiz{id="q-grounded" answer="b"}
Chatbot trả lời trôi chảy về giá vé. Vì sao chưa gọi là grounded?

- a) Vì câu trả lời quá dài
- b) Vì không có Observation nào từ tool
- c) Vì temperature quá cao
:::
```

Dùng cho retrieval practice: hỏi lại điều learner vừa làm, không hỏi mẹo. Feedback ngay khi chọn, kèm một câu vì sao — chọn sai mà không biết vì sao thì không học được gì.

## Ảnh hưởng tới cách viết step

Có ô điền thì `:::checkpoint` đổi cách diễn đạt: thay vì "mở `exercises.md` và trả lời câu 2", viết "ô điền câu 2 đã có nội dung của bạn". Dòng checkpoint vẫn phải verify được, và vẫn nên có một dòng loại "nói được".

Đừng để tương tác thay việc chạy thật. Learner bấm nút trên web không chứng minh code của họ chạy được, nên lệnh và output kỳ vọng giữ nguyên vai trò.

Mật độ: một step nhiều nhất khoảng 2 ô `:::input` và 1 `:::quiz`. Nhiều hơn thì trang biến thành form, và learner chuyển sang chế độ điền cho xong thay vì chế độ làm.

Gợi ý và đáp án: `<details>` gợi ý thì mở thoải mái; `<details>` đáp án chỉ đặt ở step mà learner có thể tự kiểm được mình đúng sai bằng cách khác (có test, có output đối chiếu). Step mà đáp án là thứ duy nhất phải tự nghĩ ra thì chỉ cho gợi ý.

## Thứ tự implement, đề xuất cho frontend

1. `rehype-raw` để `<details>` đi qua pipeline. Rẻ nhất, mở ngay được gợi ý và đáp án ẩn, và đồng thời làm file đọc tốt hơn trên GitHub.
2. `:::input` + `:::export` cùng lúc. Hai cái này mở ra dạng lab điền-và-nộp, là thứ đổi cách học nhiều nhất. Tách ra làm riêng thì `:::input` không có đường ra file.
3. `:::os`. Giảm lỗi setup của lớp ba hệ điều hành.
4. `:::quiz`. Tốt cho học nhưng không chặn deliverable nào.

## Hai câu hỏi còn để ngỏ

1. State lưu localStorage hay theo tài khoản vlearn? Theo tài khoản thì learner đổi máy không mất bài, nhưng phải trả lời được câu nội dung có đi lên server không.
2. Có cần một field frontmatter khai bài này tương tác, hay renderer tự phát hiện block? Skill hiện không sinh field mới, vì thêm field là phá hợp đồng 19 field. Cần thì team codelabs chốt rồi cập nhật schema ở một chỗ duy nhất.
