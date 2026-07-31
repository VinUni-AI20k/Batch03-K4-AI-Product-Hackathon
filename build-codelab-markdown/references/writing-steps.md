# Viết step

Đọc ở Phase 4. Ba phần: tiết lộ tới đâu, bộ xương một step, và luật trình bày.

## Nội dung

1. Tiết lộ tới đâu — nguyên tắc
2. Bảng quyết định mức tiết lộ
3. Mẫu câu cho file đã có và FILE MỚI
4. Bộ xương file
5. Bộ xương một step
6. Bốn khối, thứ tự cố định
7. Escape hatch
8. Code, bảng, mermaid, ký hiệu, link
9. Step cuối, nộp bài

## Tiết lộ tới đâu — nguyên tắc

Dạy **contract và đường verify**. Đừng đưa cái implementation mà learner được kỳ vọng tự tìm ra.

Nhưng cân nó theo đúng đối tượng: người mới tiếp cận AI, có thể chưa mạnh lập trình. Với họ, "tự thiết kế đi" không phải là thử thách — nó là bế tắc, và họ sẽ đi copy code từ AI mà không hiểu gì, tức là mất đúng thứ lab muốn dạy. Nên ranh giới ở đây **rộng hơn** so với lab dành cho người đã biết lập trình:

- Cho **khung** (function signature, docstring, comment `# TODO 1/2/3` chia thân hàm thành các bước) — giữ lại.
- Cho **một dòng mấu chốt** khi dòng đó là cú pháp chứ không phải ý tưởng (cách gọi SDK, cách đọc file JSON) — giữ lại.
- Cho **cả thân hàm hoàn chỉnh** của phần đang được chấm — bỏ.

Nói cách khác: learner không phải đoán xem coach muốn gì (đó là khó vô ích), nhưng vẫn phải tự nghĩ ra cái được chấm (đó là khó có ích).

## Bảng quyết định mức tiết lộ

| Tình huống | Cho learner | Không cho |
|---|---|---|
| Setup môi trường | lệnh copy được + kết quả đúng | — |
| File đã có cần sửa | path, trách nhiệm cần hoàn thiện, interface phải giữ, lệnh verify | số dòng, patch, diff |
| FILE MỚI là code | path, format, symbol bắt buộc, khung có TODO, lệnh verify | thân hàm hoàn chỉnh của phần được chấm |
| File config bắt buộc | path, schema, giá trị mẫu an toàn | secret thật |
| Tài liệu / báo cáo phải viết | path, các section bắt buộc, rubric | câu trả lời đã viết xong |
| Test contract công khai | tên hàm, input, output mà test yêu cầu | implementation chọn chỉ để lách test |
| Sơ đồ phải vẽ | node bắt buộc, tiêu chí quyết định | sơ đồ Mermaid hoàn chỉnh |

Ba thứ không bao giờ đưa vào: số dòng cụ thể để thay ("sửa dòng 42"), unified diff, và đáp án của câu hỏi phân tích hoặc thiết kế.

Code block được dùng cho: lệnh shell, output kỳ vọng, schema, khung signature, config mẫu an toàn. Khi cần một ví dụ code để giải thích *hình dạng dữ liệu*, dùng ví dụ nhỏ nhất và nói rõ đó là ví dụ, không phải đáp án.

## Mẫu câu cho file đã có và FILE MỚI

Với file đã có, viết theo dạng này:

> Hoàn thiện `get_weather` trong `src/tools.py`: nhận tên thành phố, trả về dict có `temp` và `condition`. Giữ nguyên tên hàm và thứ tự tham số vì `tests/test_tools.py` gọi nó. Tự chọn cách lấy dữ liệu. Chạy `pytest tests/test_tools.py -v`; đạt là `2 passed`.

Đừng viết theo dạng này — nó vừa dài vừa làm learner chỉ gõ lại:

> Trong hàm X, import Y, tạo Z, gọi method A với tham số B và C, bọc trong try/except rồi trả dictionary gồm năm key.

Với `FILE MỚI`, nêu đủ bảy thứ: path · mục đích · thư mục cha đã có chưa · lệnh tạo · format bắt buộc · ai đọc file này · lệnh verify và output đạt.

Nếu chính artifact đó là mục tiêu học tập (sơ đồ, báo cáo phân tích) thì đưa yêu cầu và tiêu chí, không đưa bản hoàn chỉnh.

## Bộ xương file

```
frontmatter
→ khối TL;DR → câu hỏi trọng tâm → bảng timeline
→ [khối Mâu thuẫn trong repo, nếu có]
→ ---
→ ## 1..N  (mỗi step: dòng thời lượng → goal → nội dung → checkpoint → caution)
→ ## N. Nộp bài + Checklist artifacts bắt buộc
→ blockquote đóng bài, 1–2 câu, không lời chúc
```

Không `# H1`, không dòng meta, không heading H4+. Lý do và cú pháp mở đầu: `references/render-contract.md`.

## Bộ xương một step

Thứ tự này không phải quy ước tuỳ ý — đảo là mất tác dụng.

```
**<N> phút · mốc <a>–<b>.**   → biết mình đang ở đâu trên đồng hồ
:::goal                        → biết đích trước
hook / failure                 → thấy vấn đề thật trước khi có giải pháp
ví dụ đời thường 1 câu         → chỉ khi khái niệm thật khó
kiến thức ≤3 dòng              → vừa đủ để hành động
**Bạn làm:**                   → hành động, mỗi bullet 1 file
lệnh + output kỳ vọng          → feedback ngay
:::checkpoint                  → nhớ lại chủ động và verify
:::caution                     → xử lý lỗi, sau khi đã gặp lỗi thật
```

Sai phổ biến nhất: đưa troubleshooting lên trước khi learner làm. Lúc đó chưa gặp lỗi, đọc xong quên ngay.

Sai thứ hai: `:::goal` chỉ nhắc lại tiêu đề step bằng từ khác. Goal là trạng thái đạt được, tiêu đề là việc phải làm — hai thứ khác nhau.

Step chỉ là setup thuần thì bỏ hook, đừng bịa hook cho đủ khuôn.

## Bốn khối, thứ tự cố định, không trộn

- **Kiến thức** — prose dưới `### Tại sao...?`: ≤ 3 dòng, nói vì sao step này tồn tại, không dạy cú pháp. Cần dài hơn thì dùng bảng hoặc mermaid, đừng thêm prose.
- **Hướng dẫn** — `**Bạn làm:**` + code block: bullet mở đầu bằng động từ, 1 bullet 1 file, path relative trong backtick. Có phân vai thì ghi role ngay trên bullet.
- **Kết quả kỳ vọng** — fenced block **ngay sau lệnh**: output thật; dài thì cắt còn 3–6 dòng có nghĩa và đánh `...`; chưa chạy được thì ghi `Kết quả kỳ vọng (Coach inference — chưa chạy được vì cần API key):`.
- **Deliverable** — `:::checkpoint`: chỉ thứ nộp được hoặc verify được, không nhắc lại hướng dẫn, đánh dấu `FILE MỚI` và `KHÔNG COMMIT`.

Bốn khối này phải có đủ trong mọi step. Thiếu "Kết quả kỳ vọng" là lỗi hay gặp nhất và cũng là lỗi tệ nhất, vì nó bỏ learner lại một mình không biết mình đúng hay sai.

Đặt output ngay dưới lệnh, không đặt ở mục khác rồi bảo "xem bảng ở mục 3" — phải ghép hai nguồn thông tin cách nhau trên trang là tải phụ vô ích.

## Escape hatch

Lớp luôn lệch nhịp. Mỗi step dài cần cả hai, và cả hai không được chặn checkpoint:

```markdown
**Nếu bị chậm:** làm xong bullet 1–2 là đủ điều kiện sang step sau.
**Xong sớm:** thêm 1 case bẫy vào `config/test_cases.json`, ghi trace vào `docs/trace_eval.md`.
```

Nếu phần "Xong sớm" là thứ người khác cần để đi tiếp thì nó không phải extension — nó là step bị bỏ sót.

## Code, bảng, mermaid, ký hiệu, link

**Code block** luôn có language tag. Một block là **một lần copy** — đừng gộp setup + run + test rồi bắt học viên tự tách. Lệnh khác nhau giữa OS thì dùng `:::os`; comment `# Windows: ...` nhét trong block bash là chỗ người mới đọc sai nhiều nhất.

**Bảng**: alignment nhất quán (`:---` text, `---:` số, `:---:` chỉ cột trạng thái ngắn). Không pad khoảng trắng cho thẳng cột vì renderer không cần và diff bị nhiễu. Không bold cả cột. Emoji chỉ khi mã hoá trạng thái và có chú giải (✅ ❌ 🟡).

Bảng có giá trị nhất là **bảng conditional** — cột "khi nào chọn cái này". Lab thường viết dày phần "cái này là gì" và mỏng phần "khi nào dùng", nhưng cái sau mới là thứ learner thiếu.

**Mermaid**: node label bọc `["..."]` khi có dấu cách; kèm tên file trong label để learner map sơ đồ với repo; node id không dấu, label thì được. Khoảng 12 node là ngưỡng đọc được trên điện thoại — nhiều hơn thì tách hai sơ đồ, mỗi cái một câu chuyện.

**Ký hiệu**, chọn một dùng xuyên suốt: mũi tên trong prose là `→` (không `->` `=>` `➔`); trong code block giữ nguyên như code thật; dash nối mệnh đề là `—`; phân tách dòng meta là ` · `; ngăn step là một `---` trên dòng riêng.

**Link**: file trong repo dùng path relative từ `docs/CODELAB.md`; anchor `#slug-tiếng-việt-giữ-dấu`; link ngoài dùng `https://` đầy đủ. Cấm `file:///`, `C:\Users\`, `/home/<user>/`.

## Step cuối, nộp bài

Khi `requiresSubmission: true`, step cuối phải có đủ:

- Bảng test case hoặc rubric, để học viên biết bị chấm bằng gì
- Security check: `.gitignore` đã chặn `.env`, không commit secret hoặc PII
- Lệnh git push và quy ước tên repo
- `:::export` nếu bài có `:::input`, để dựng file cho learner commit
- `### Checklist artifacts bắt buộc` — link relative, checkbox trống

Đóng bài bằng một blockquote 1–2 câu. Không lời chúc.
