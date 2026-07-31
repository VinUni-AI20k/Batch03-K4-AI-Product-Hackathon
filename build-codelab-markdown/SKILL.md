---
name: build-codelab-markdown
description: Turn a teaching-lab repository into standardized, beginner-friendly codelab Markdown for the VLearn codelabs site — one frontmatter schema, one set of :::goal/:::checkpoint/:::caution directives, one anti-slop pass. Use when a lab coach must publish lab material (repo, README, docs, notes) as a codelab or step-by-step lab guide; when converting an older guide or draft into the house format; when writing a lab's repo README, report template, or team role assignment; or when a draft must be stripped of AI-slop phrasing before publishing. Also triggers on Vietnamese requests such as "viết hướng dẫn lab", "làm codelab cho repo này", "chuẩn hoá markdown lab".
---

# Build Codelab Markdown

Biến repo lab thành codelab Markdown đúng một format. Người dùng là lab coach sở hữu repo; output nộp thẳng cho team codelabs đưa lên web, không ai phải sửa format lại.

Nguyên tắc gốc: repo là bằng chứng, không phải tài liệu đã đúng. Mọi câu trong output phải truy được về một file, một lệnh, hoặc một assertion — hoặc gắn nhãn `Coach inference`.

## Đọc thêm khi cần

- `references/interactive-blocks.md` — Phase 4, khi lab cần learner điền hoặc tương tác trên web. Vocabulary block, luật `target`, spec bàn giao frontend.
- `references/team-roles.md` — Phase 5, chỉ khi lab làm nhóm. Catalog 14 role, cách chọn theo số người, integration gate.
- `references/pedagogy.md` — Phase 2, khi không chắc nên dạy thứ gì trước. Nguyên lý học tập → luật viết.
- `references/worked-example.md` — khi chưa rõ "đúng format" trông thế nào. Một step viết sai và viết đúng.
- `templates/*.md` — khung để điền, không phải luật.

## Output

- `docs/CODELAB.md` — luôn luôn, đây là bản publish. Dùng `templates/CODELAB.template.md`.
- `README.md` — khi repo chưa có, hoặc README không mô tả được bài toán / setup / nộp bài.
- `docs/PHAN_CONG_CONG_VIEC.md` — khi lab làm nhóm.
- `report/TEMPLATE_REPORT.md` — khi lab yêu cầu nộp báo cáo.

Thiếu bằng chứng để điền thì ghi vào khối `Mâu thuẫn trong repo` ở đầu CODELAB.md, không bịa.

## Đối tượng học viên

Mặc định: người mới tiếp cận AI, biết dùng terminal ở mức cơ bản, và trong nhóm có thể có người chưa mạnh lập trình. Coach nói khác thì theo coach.

Giả định này đổi cách viết ở tám chỗ:

- Jargon phải được định nghĩa ngay tại chỗ ở lần dùng đầu, kể cả từ mà người viết thấy hiển nhiên: assertion, deterministic, parser, schema, contract, entrypoint, mock. Dùng glossary tooltip. Một từ không định nghĩa là một người dừng đọc.
- Troubleshooting dán nguyên văn thông báo lỗi, vì người mới tìm theo đúng chuỗi ký tự họ thấy trên màn hình, không tìm theo mô tả.
- Cho khung code để learner điền phần lõi, đừng để họ viết từ đầu. "Viết hàm `call_openai`" là quá rộng; "xoá dòng `raise NotImplementedError`, viết thân hàm theo 3 bước dưới" thì làm được.
- Step đầu phải chạy được mà không cần API key và không cần cài thứ nặng. Đây là chỗ mất người nhiều nhất.
- Bỏ "chỉ cần", "đơn giản là", "rõ ràng là", "dễ thôi". Với người mới thì không có gì là đơn giản, và câu đó chỉ làm người đang tắc cảm thấy mình kém.
- Nhóm yếu lập trình: mỗi người vẫn cần một artifact mang tên mình. Đừng dồn hết code cho một người rồi bốn người ngồi xem. Role không-code có giá trị thật: bộ test case, báo cáo, phân tích trace, dữ liệu, timekeeper.
- Learner được dùng AI để viết code. Chốt là checkpoint loại "nói được" — nộp thứ mình giải thích được, không phải nộp thứ AI sinh ra.
- Ước lượng thời gian tính cho người chậm nhất trong lớp, không tính cho coach.

## Từ vựng skill này dùng

Ba nhãn dưới đây xuất hiện trong output. Định nghĩa rõ để dùng đúng và để coach đọc hiểu.

`Coach inference` — nhãn đặt lên nội dung mà bạn **suy ra** chứ không verify được từ repo. Thường là output kỳ vọng của lệnh cần API key, cần dữ liệu thật, hoặc cần cả lớp mới chạy được. Viết ngay trong dòng dẫn: `Kết quả kỳ vọng (Coach inference — chưa chạy được vì cần API key):`. Nó phục vụ hai người: learner biết chỗ này có thể lệch thực tế nên đừng tưởng mình sai, và coach biết chỗ này cần chạy một lần rồi dán output thật vào. Nhãn này không phải giấy phép để đoán — chỉ dùng khi thứ đó thật sự không chạy được ở đây, và phần suy ra phải dựa trên bằng chứng trong repo (tên test, assertion, code deterministic), không dựa trên cảm giác.

`FILE MỚI` — file mà guide yêu cầu learner tạo, chưa tồn tại trong repo. Kèm đủ: path, mục đích, cách tạo, format, lệnh kiểm, output kỳ vọng.

`KHÔNG COMMIT` — file chỉ được tồn tại trên máy learner: `.env`, credential, model tải về, cache. Kèm lý do và xác nhận nó đã nằm trong `.gitignore`.

## Bất biến

Bảy điều này không lệch được. Lệch là vỡ web render, hoặc vỡ khả năng tự kiểm của học viên — không phải vấn đề thẩm mỹ.

1. Frontmatter đúng 19 field, đúng thứ tự, đúng kiểu. Web parse nó.
2. Chỉ dùng directive có trong vocabulary đã chốt, đúng cú pháp. Renderer là một registry đóng — nó không biết directive bạn tự nghĩ ra, và block lạ thì learner thấy chữ `:::` trần trên trang. Vocabulary: `references/interactive-blocks.md`.
3. Mỗi lệnh có output kỳ vọng ngay bên dưới, hoặc gắn nhãn `Coach inference`. Không có thì học viên không tự biết mình đúng hay sai.
4. Mỗi step đóng bằng checkpoint verify được. "Hiểu được X" không phải checkpoint.
5. Gọi đúng loại lệnh: Setup / Smoke run / Automated test / Validation / Security check.
6. Không path máy cá nhân, không secret, không PII.
7. Mọi fact truy được về file, lệnh, hoặc assertion trong repo — hoặc gắn nhãn `Coach inference`.

## Chỗ bạn tự quyết

Phần dưới là default kèm lý do, không phải luật. Lab nào cũng khác nhau: đọc repo rồi tự quyết. Lệch default thì được, chỉ cần ghi một dòng lý do trong khối `Mâu thuẫn trong repo` để người review thấy đó là chủ ý chứ không phải lỗi.

- Số step 4–8, mỗi step 20–45 phút — vì step là điểm dừng để lớp đồng bộ, và mỗi step nên là một artifact chạy được. Lab 90 phút một mục tiêu duy nhất thì 3 step tốt hơn 4 step cắt vụn.
- Prose trước action đầu tiên ngắn, default ≤ 120 từ — vì tải đọc lấy chỗ của tải làm. Khái niệm thật sự khó thì cứ dạy đủ, nhưng đổi sang bảng hoặc mermaid, đừng kéo prose dài ra.
- Khối `**Bạn làm:**` ≤ 5 bullet, 1 bullet 1 file — vì nhiều hơn thì học viên mất chỗ đang làm. Chuỗi setup tuyến tính 7 dòng vẫn ổn nếu chúng là một lần copy.
- Code block ≤ 20 dòng — vì dài hơn thì học viên copy cả cục rồi không biết sai ở đâu. Contract cần nhìn nguyên khối (schema, docstring mẫu) thì dài hơn được.
- Bảng ≤ 6 cột — vì đọc trên mobile. Cần nhiều chiều hơn thì tách hai bảng.
- Thứ tự goal → hook → kiến thức → làm → output → checkpoint → caution: giữ được thì giữ, vì nó khớp cách người học nạp thông tin. Step chỉ là setup thuần thì bỏ hook, đừng bịa hook cho đủ khuôn.
- Escape hatch "Nếu bị chậm" và "Xong sớm": cần ở step dài. Step 15 phút thì thêm vào chỉ làm loãng.
- Emoji trong heading: 0. Cái này gần như bất biến, và có lý do cụ thể hơn thẩm mỹ: máy nào thiếu font emoji thì nó render thành ô vuông rỗng, nên tiêu đề thành `□ 4 Cấp Độ...`. Ngoài ra directive đã là signal rồi, emoji chỉ thêm tín hiệu giả. Muốn dùng thì chỉ trong bảng, để mã hoá trạng thái, có chú giải.

Cân thế nào: default tồn tại để chống viết dài và viết rỗng. Lệch default vì nó làm guide rõ hơn cho học viên thì lệch. Lệch chỉ để nhét thêm nội dung bạn thấy hay thì đừng.

## Phase 0 — Chốt phạm vi

Repo root bằng `git rev-parse --show-toplevel`; không phải git checkout thì dùng path user đưa. Đọc mọi AGENTS.md / CLAUDE.md áp dụng được trước khi ghi gì. Match ngôn ngữ material: tiếng Việt thì output tiếng Việt, giữ jargon tiếng Anh.

Hỏi tối đa 3 câu, chỉ khi câu trả lời làm đổi nội dung: lab cá nhân hay nhóm mấy người · timebox thật và mốc giờ · `preparationTipIds` nào đã tồn tại trên web. Suy ra được thì tự suy và ghi thành assumption có nhãn; không hỏi thứ repo đã trả lời.

Coach đã có bản nháp / guide cũ / notes: giữ nội dung, đổi hình thức. Nội dung chuyên môn là của coach và đúng theo lớp của coach, chỉ sửa format, thứ tự trình bày, và slop. Vẫn chạy Phase 1 để đối chiếu vì bản nháp cũ hay lệch khi repo đã rename file, đổi flag, đổi tên script.

## Phase 1 — Audit repo, dựng evidence ledger

Chưa có ledger thì chưa được viết step nào. Bỏ qua thư mục vendored, generated, cache, model, dependency.

Đọc khi có: `README*` `BRIEF.*` `docs/**` `LAB_GUIDE.md` `*worksheet*.md` `SCORING.md` `grade.py` `requirements.txt` `package.json` `Makefile` CI workflow `template.py` `starter_*/` `src/**` `tests/**` `data/**` `config/*.json` `.env.example` `report/TEMPLATE_*.md` `docs/PHAN_CONG*.md`

Ledger là bảng nội bộ, mỗi fact một nguồn:

- Learning objective ← doc giảng dạy và code path tương ứng
- Lệnh setup ← manifest, rồi script, rồi CI, rồi docs
- Lệnh test tự động ← test config hoặc CI. Không suy từ chữ nghĩa trong README
- Input contract ← parser / loader / schema / fixture
- Output kỳ vọng ← assertion hoặc code deterministic
- Deliverable đã có ← path đã verify tồn tại
- Deliverable phải tạo ← docs nhắc tới nhưng chưa có trên disk, đánh dấu FILE MỚI
- Thời lượng và mốc ← timeline / checklist, ghi lại nếu các nguồn lệch
- Ownership ← file bị sửa và dependency edge

Thứ tự thẩm quyền khi hai nguồn nói khác nhau: `test/assertion → source code → manifest/script/CI → README/docs → coach inference`. Ý định giảng dạy có thể chỉ tồn tại trong tài liệu; giữ nó, nhưng ghi lại mâu thuẫn với hành vi thật của code.

Năm loại lệnh, đừng gọi sai tên — đây là lỗi làm học viên mất niềm tin nhanh nhất, chạy "test" xong xanh hết tưởng đúng, đến lúc chấm thì fail:

- Setup: tạo môi trường, cài dependency
- Smoke run: chạy cho thấy có output, không có assertion
- Automated test: có test runner hoặc assertion
- Validation: kiểm contract, read-only
- Security check: kiểm không lộ secret trước khi push

Repo không có test tự động thì nói thẳng là không có, rồi thêm validation read-only. Đừng bịa bộ test không tồn tại.

Mọi path được nhắc phải thuộc 1 trong 4 loại:

- File đã có cần sửa: path relative + tên hàm hoặc section cần sửa
- FILE MỚI: path + mục đích + lệnh tạo + format + lệnh validate + output kỳ vọng
- KHÔNG COMMIT: path + vì sao + xác nhận đã có trong `.gitignore`
- Generated / optional: path + lệnh sinh ra nó

```bash
# mọi path trong backtick phải tồn tại, hoặc là FILE MỚI đã ghi rõ
grep -oE '`[a-zA-Z0-9_./-]+\.(py|json|md|csv|yaml|txt|env|example)`' docs/CODELAB.md \
  | tr -d '`' | sort -u | while read -r p; do [ -e "$p" ] || echo "KHÔNG TỒN TẠI: $p"; done
```

Truy input contract từ entrypoint, không từ mô tả. Ghi: path, encoding, container (JSON array hay object), field required và kiểu, chính xác item hoặc index nào được dùng, hành vi khi input sai. Mâu thuẫn hay gặp: README nói "chạy toàn bộ 20 case", `main()` có `for case in cases[:1]`.

Mâu thuẫn đưa lên đầu CODELAB.md ngay sau khối TL;DR, không nhét footnote:

```markdown
> **Mâu thuẫn trong repo — cách guide này xử lý**
>
> - `README.md` ghi 180 phút; bảng mốc cộng lại 150 phút. Guide dùng 150 phút theo bảng chi tiết.
> - `README.md` nhắc `docs/hybrid_flowchart.mermaid` nhưng file chưa có → FILE MỚI ở step 5.
> - Không có test tự động cho `src/tools.py`. Step 3 dùng smoke run + validation thay thế.
```

Loại phải nêu: thời lượng lệch · file bắt buộc không có trên disk · README nói chạy hết case mà code chạy một phần · output kỳ vọng code không thể sinh ra · rubric chấm file repo không có chỗ tạo · lệnh trong docs đã chết.

An toàn: không echo hoặc commit secret. Step đầu tiên phải chạy được không cần key (mock / local / deterministic) — đây là điều kiện để cả lớp qua được step 1. Không cài thêm package, không sửa code app, không "sửa hộ" lab; thấy bug thì ghi vào khối `Mâu thuẫn trong repo`.

## Phase 2 — Xác định dạng lab, rồi thiết kế xương step

Bộ xương ở Phase 4 là default cho lab build-code. Repo không phải dạng đó thì đổi xương, đừng bẻ lab cho vừa khuôn.

Phân loại bằng ba câu hỏi về chính repo trước mắt, không bằng cách so với lab cũ:

1. Deliverable được chấm là gì — code chạy được, file cấu hình hoặc prompt, tài liệu, hay số đo?
2. Có lệnh nào learner chạy được để tự biết mình đúng chưa? Có bộ chấm tự động không?
3. Làm cá nhân hay nhóm? Nếu nhóm thì repo có tách file theo vai chưa?

Ba câu đó quyết định bốn thứ: **step là gì · checkpoint đo bằng gì · có cần phân vai không · có code block hay không.** Bảy điều bất biến giữ nguyên ở mọi dạng.

Các dạng thường gặp, mô tả theo tính chất — lab mới có thể không thuộc dạng nào ở đây, lúc đó quay lại ba câu hỏi trên:

- Deliverable là code trong một file có sẵn TODO, kèm bộ test theo phần: step là một phần của bộ test; checkpoint là lệnh test và số test pass. Thường làm cá nhân, không cần phân vai. Escape hatch quan trọng nhất ở dạng này vì lớp lệch nhịp lộ ra rõ nhất.
- Deliverable là tài liệu, không có gì để chạy: bỏ luật "mỗi lệnh có output kỳ vọng" vì không có lệnh; thay bằng một mẫu đã điền để learner đối chiếu ở mỗi phase. Step là một bước suy nghĩ. Checkpoint là section đã điền đủ cộng một câu tự giải thích. Worked example gần như bắt buộc, vì learner không có cách nào khác để biết "xong" trông thế nào.
- Deliverable là hệ thống nhiều file, làm nhóm: step là một thành phần chạy được. Cần phân vai theo file và integration gate ở cuối mỗi mốc.
- Deliverable là một file nộp, máy chấm: không có gì để build theo bước. Guide xoay quanh contract của file nộp, các cách mất điểm, và luật của bộ chấm. Step là từng chiều bị chấm. Checkpoint là chạy bộ chấm trên tập public.
- Deliverable là chuỗi phiên bản có đo: mỗi version một giả thuyết và một metric. Step là một vòng cải tiến. Checkpoint là before/after trên metric có trong log. Báo cáo là trung tâm, không phải code.
- Deliverable chốt theo mốc giờ (hackathon, sprint): step là checkpoint trên đồng hồ. Rubric trỏ về artifact, không trỏ về test.
- Repo chỉ để đọc hoặc demo, không có bài nộp: cân nhắc `format: "prose"` thay vì `"steps"`, hoặc hỏi coach mục đích trước khi viết.

Lab lai hai dạng thì chọn theo deliverable được chấm, không chọn theo phần code nhiều nhất.

Sau khi chốt dạng, thiết kế xương: liệt kê deliverable cuối cùng rồi đi ngược ra các step. Mỗi step là một artifact chạy được, không phải một chủ đề lý thuyết; tên step là cụm động từ (`Lắp ReAct Agent V1`), không phải chủ đề (`Về ReAct Agent`). Sắp theo dependency thật, không theo thứ tự chương sách. Đánh dấu song song (khác file, không ăn output của nhau) / tuần tự (chung file, hoặc cần output bước trước) / gate (cả nhóm phải có mặt). Đặt một câu hỏi trọng tâm cho cả bài, học viên trả lời được ở step cuối.

Thứ tự trong mỗi step, không phải quy ước tuỳ ý — đảo là mất tác dụng:

```
:::goal            → biết đích trước
hook / failure     → thấy vấn đề thật trước khi có giải pháp
kiến thức ≤3 dòng  → vừa đủ để hành động
**Bạn làm:**       → hành động, mỗi bullet 1 file
lệnh + output      → feedback ngay
:::checkpoint      → nhớ lại chủ động và verify
:::caution         → xử lý lỗi, sau khi học viên đã gặp lỗi thật
```

Sai phổ biến: đưa troubleshooting lên trước khi học viên làm. Lúc đó chưa gặp lỗi, đọc xong quên ngay.

Lớp luôn lệch nhịp. Mỗi step dài cần cả hai, và cả hai không được chặn checkpoint:

```markdown
**Nếu bị chậm:** làm xong bullet 1–2 là đủ điều kiện sang step sau.
**Xong sớm:** thêm 1 case bẫy vào `config/test_cases.json`, ghi trace vào `docs/trace_eval.md`.
```

Extension mà người khác cần để đi tiếp thì nó không phải extension, nó là step bị bỏ sót.

Lý do đằng sau thứ tự này: `references/pedagogy.md`.

## Phase 3 — Frontmatter

19 field, giữ đúng thứ tự này. Thứ tự cố định là điều kiện để diff giữa hai coach đọc được. Schema này rút từ codelab đang publish thật trên web, không phải tự đặt ra — nếu web đổi schema thì sửa ở đây trước, đừng sửa lẻ trong từng bài.

```yaml
---
id: "day3-lab-chatbot-vs-react-agent-e402"   # slug URL, ASCII kebab-case không dấu, day<N>-<kind>-<topic>[-<room>]
title: "Lab 03 — Chatbot vs ReAct Agent"      # em dash, không dùng -
duration: 240                                  # PHÚT, số nguyên, không phải "4h"
author: "VinUni AI Codelab × GDGoC"
updated: "2026-07-27"                          # ngày sửa nội dung, không phải ngày dạy
category: "AI Agent"                           # LLM API | AI Product | AI Agent | Prompt Engineering | Evaluation
description: "<1 câu, 120-200 ký tự, bắt đầu bằng động từ>"
published: false                               # Phase 7 tự đổi true khi mọi check sạch
collection: "codelabs"                         # "presentations" cho slide coach
format: "steps"                                # lab luôn là "steps"
day: "3"                                       # chuỗi, không phải số
preparationTipIds: []                          # chỉ ID đã tồn tại trên web; không chắc thì để rỗng
level: "intermediate"                          # theo prerequisite khắt khe nhất
prerequisites: ["<năng lực kiểm được>"]        # 3-6 mục, không phải tên môn học
outcomes: ["<động từ quan sát được> ... trong <file>"]   # 3-6 mục
supportedOs: ["Windows", "macOS", "Linux"]     # chỉ OS thật sự có lệnh trong bài
requiredTools: ["Python 3.10+", "pip", "Git"]  # kèm version khi version ảnh hưởng kết quả
commonErrors: ["<lỗi thật>"]                   # 3-6, từ test / docstring / lớp trước
requiresSubmission: true                       # true thì phải có step nộp bài + checklist artifact
---
```

Bốn field dễ sai nhất:

- `duration` bằng tổng thời lượng các step. Lệch nhiều thì coach xếp buổi sai và lớp bị cắt giữa bài, nên sai số nên giữ trong khoảng 15 phút.
- `description` nói learner làm gì, không nói lab hay thế nào. Cấm tính từ marketing.
- `outcomes` phải qua được test "learner nói đã đạt, tôi kiểm bằng cách nào trong 2 phút?". Động từ quan sát được thì qua: Giải thích, Thiết kế, So sánh, Phân tích, Sửa. Động từ chỉ trạng thái trong đầu thì không: hiểu, nắm được, làm quen, biết về, tìm hiểu — không ai kiểm được, nên chúng biến outcome thành câu trang trí.
- `preparationTipIds` bịa ID thì tạo link 404 trên trang lab.

```yaml
# tốt: 4 việc cụ thể, có con số
description: "Xây Chatbot baseline, thiết kế Tool Specs, lắp ReAct Agent Loop với Guardrails và đánh giá trên bộ 5 Test Cases."
outcomes: ["Thiết kế tool contract và khai báo trong src/tools.py"]

# tệ: không nói làm gì, không verify được
description: "Một lab thú vị và toàn diện giúp bạn khám phá thế giới AI Agent đầy tiềm năng."
outcomes: ["Hiểu sâu về cách hoạt động của AI Agent"]
```

Cần xác nhận với team codelabs: trang listing `frontend/src/data/codelabs.ts` hiện dùng `slug` khác `id` trong frontmatter (`lab-01-nen-tang-llm-api` so với `day1-lab-llm-api-foundation`). Không tự suy, đoán sai thì card listing trỏ vào 404. Đổi `id` là đổi URL và vỡ link cũ, nên bản cập nhật phải giữ nguyên `id`.

## Phase 4 — Viết step

Bộ xương dưới đây là default cho lab build-code. Dạng lab khác (Phase 2) thì đổi phần step, giữ phần mở đầu và phần nộp bài.

Bộ xương file:

```
frontmatter → khối TL;DR → câu hỏi trọng tâm
→ [khối Mâu thuẫn trong repo, nếu có] → [bảng định hướng hoặc mermaid, tuỳ chọn]
→ --- → ## 1..N (goal → sub-step → 4 khối → checkpoint → caution)
→ ## N. nộp bài + checklist artifacts → blockquote đóng bài
```

**Thân bài không mở bằng H1, và không có dòng meta.** Trang web đã render title, day, duration, level, category, author, updated từ frontmatter rồi — viết lại chúng trong thân bài thì learner thấy tiêu đề hiện hai lần. Bắt đầu thẳng bằng khối TL;DR. Heading cấp cao nhất trong thân bài là `##` của step.

Phần mở đầu:

```markdown
> **240 phút · Day 3 · intermediate.** Bạn sẽ xây chatbot baseline, thiết kế tool contract, lắp
> [ReAct Agent](#glossary "Reasoning + Acting — agent luân phiên Thought, Action, Observation cho đến khi đủ bằng chứng.")
> và so sánh hai hệ thống trên cùng bộ test case. Phần lớn bài chạy deterministic, chưa cần API key ngay.

Câu hỏi trọng tâm xuyên suốt Lab:

> **Chatbot trả lời được — nhưng nó có thật sự "biết" không? Khi nào chi phí orchestration của Agent đáng giá?**
```

TL;DR mở đầu bằng `**<duration> · Day <N> · <level>.**`. Một câu hỏi trọng tâm; hai câu là chưa chốt được trọng tâm. Nếu step đầu chưa cần key thì nói ngay ở đây, đây là rào cản bỏ cuộc số một.

Glossary tooltip `[thuật ngữ](#glossary "định nghĩa")`: 1 câu, không chứa `"` vì nó phá cú pháp, và ngắn khoảng 160 ký tự vì nó render trong một tooltip nhỏ — dài hơn thì bị cắt giữa câu. Đặt ở lần xuất hiện đầu tiên, cho mọi jargon mà `prerequisites` chưa yêu cầu learner biết trước.

### Directive — vocabulary đóng

Định dạng chốt là Markdown + YAML frontmatter + `remark-directive`, **không phải MDX**: file này còn nằm ở `docs/CODELAB.md` trong repo lab và learner mở nó trên GitHub, nơi directive vẫn đọc được còn JSX thì thành rác. Đầy đủ vocabulary, cơ chế cho ô điền và đáp án ẩn, luật `target`: `references/interactive-blocks.md`.

Ba directive dưới đây có ở mọi lab. Đừng tự nghĩ ra loại thứ tư — thêm block mới là việc của team codelabs, sửa trong vocabulary một lần.

```markdown
:::goal{title="Agent V1 chạy đúng tool path, dừng đúng lúc"}
Hiểu vòng lặp ReAct, lắp system prompt → parser → executor → loop.
:::
```

`title` là trạng thái đạt được, không phải hoạt động: `"Tool chạy đúng, test pass"` chứ không phải `"Viết tool"`.

```markdown
:::checkpoint{title="Hoàn thành khi"}
[ ] `pytest tests/test_part1.py -v` → `3 passed`
[ ] Terminal hiện `(.venv)` ở đầu dòng lệnh
[ ] Bạn giải thích được vì sao Observation phải do application chèn, không phải model tự sinh
:::
```

`title` luôn là `"Hoàn thành khi"`, đồng nhất cả bộ codelab. Checkbox luôn để trống `[ ]`; tick sẵn `[X]` là lỗi chặn publish. Ba loại dòng: chạy được / nhìn thấy / nói được. Mỗi step cần ít nhất một dòng nói được — đây là chốt chống trường hợp học viên để AI viết hết mà không hiểu gì. Cấm "Hiểu được X", "Nắm vững Y".

```markdown
:::caution{title="Troubleshooting — Vấn đề thường gặp"}
Agent lặp lại cùng một tool + cùng tham số
→ **Mindset**: Agent không tự nhận ra mình bị kẹt lặp.
→ Kiểm tra: đã đặt `MAX_ITERATIONS` chưa? Prompt có dạy cách xử lý khi tool báo lỗi chưa?
:::
```

Mỗi vấn đề: 1 dòng triệu chứng, 1 dòng `→ **Mindset**:` dạy cách nghĩ, 1–2 dòng cách kiểm. Dòng Mindset là phần có giá trị nhất; bỏ nó thì block này chỉ là FAQ. Cách dùng thứ hai của `:::caution` là cảnh báo tư duy giữa step, khi học viên sắp kết luận sai.

### Điền được và tương tác được

Lab có chỗ learner phải viết câu trả lời thì cho họ điền ngay trên trang bằng `:::input`, thay vì bắt mở file khác. Lab có chỗ dễ tắc thì cho gợi ý ẩn bằng `<details>` — HTML gốc, đóng mặc định, và không lộ đáp án kể cả khi renderer chưa xử lý gì.

Một luật không lệch: **mọi `:::input` phải khai `target`** — file và anchor mà nội dung đó cuối cùng nằm trong repo learner. Learner nộp bằng repo GitHub, không nộp bằng cách điền form; ô điền là tầng tiện lợi phủ lên deliverable dạng file, không phải nơi câu trả lời sống. Thiếu `target` thì mất state là mất bài và coach không có gì để chấm. Step nộp bài đặt `:::export` để dựng đúng các file đó cho learner commit.

Mật độ và cú pháp đầy đủ: `references/interactive-blocks.md`.

### Bốn khối, thứ tự cố định, không trộn

- Kiến thức, prose dưới `### Tại sao...?`: ≤ 3 dòng, vì sao step này tồn tại, không dạy cú pháp. Cần dài hơn thì dùng bảng hoặc mermaid, đừng thêm prose.
- Hướng dẫn, `**Bạn làm:**` + code block: bullet mở đầu bằng động từ, 1 bullet 1 file, path relative trong backtick. Có phân vai thì ghi role ngay trên bullet.
- Kết quả kỳ vọng, fenced block ngay sau lệnh: output thật; dài thì cắt còn 3–6 dòng có nghĩa và đánh `...`; chưa chạy được thì ghi `Kết quả kỳ vọng (Coach inference — chưa chạy được vì cần API key):`.
- Deliverable, `:::checkpoint`: chỉ thứ nộp được hoặc verify được, không nhắc lại hướng dẫn, đánh dấu FILE MỚI và KHÔNG COMMIT.

### Code, bảng, mermaid, ký hiệu, link

Code block luôn có language tag. Một block là một lần copy; đừng gộp setup + run + test rồi bắt học viên tự tách. Đừng dán code học viên phải tự viết, dán khung hoặc một dòng mấu chốt. Lệnh khác nhau giữa OS thì comment cùng dòng (`source .venv/bin/activate    # Windows PowerShell: .venv\Scripts\Activate.ps1`); tách block `powershell` riêng chỉ khi lệch hơn một dòng.

Bảng: alignment nhất quán (`:---` text, `---:` số, `:---:` chỉ cột trạng thái ngắn). Không pad khoảng trắng cho thẳng cột vì renderer không cần và diff bị nhiễu. Không bold cả cột. Emoji chỉ khi mã hoá trạng thái và có chú giải (✅ ❌ 🟡).

Mermaid: node label bọc `["..."]` khi có dấu cách; kèm tên file trong label để learner map sơ đồ với repo; node id không dấu, label thì được. Khoảng 12 node là ngưỡng đọc được trên màn hình điện thoại — nhiều hơn thì tách hai sơ đồ, mỗi cái một câu chuyện.

Ký hiệu, chọn một dùng xuyên suốt: mũi tên trong prose là `→`, không `->` `➔` `=>`; trong code block giữ nguyên như code thật; dash nối mệnh đề là `—`; phân tách dòng meta là ` · `; ngăn step là một `---` trên dòng riêng.

Link: file trong repo relative từ `docs/CODELAB.md`, anchor `#slug-tiếng-việt-giữ-dấu`, ngoài dùng `https://` đầy đủ. Cấm `file:///`, `C:\Users\`, `/home/<user>/`.

### Step cuối, nộp bài

Khi `requiresSubmission: true` phải có đủ: bảng test case hoặc rubric để học viên biết bị chấm bằng gì · security check (`.gitignore`, không commit `.env` hoặc PII) · lệnh git push và quy ước tên repo · `### Checklist artifacts bắt buộc` với link relative và checkbox trống. Đóng bài bằng một blockquote 1–2 câu, không lời chúc.

## Phase 5 — Roles, report, README

Lab nhóm: mục tiêu phân vai không phải chia đều việc, mà là mỗi người một file để không đè code nhau và mỗi người một artifact mang tên mình để chấm được. Quy tắc 1 role = 1 file owner; Integrator là người duy nhất sửa entrypoint. Năm role cốt lõi:

1. Product / Test Architect — `config/test_cases.json`
2. Tool / Data Engineer — `src/tools.py`
3. Prompt / Policy Engineer — `src/prompts.py`
4. Core Integrator — `src/app.py`
5. Observability / Reporter — `docs/trace_eval.md`

Catalog 14 role, cách chọn cho nhóm 4 / 5 / 6 / 7+ người, integration gate, và tiêu chí chấm từng role: `references/team-roles.md`.

Report: mỗi ô phải trỏ về một file bằng chứng trong repo; report không có evidence file là report tự khai.

README: bài toán, yêu cầu, xong sẽ có gì, setup, chấm điểm, nộp bài. Mỗi ô điểm trong rubric phải trỏ về một file học viên tạo được; ô nào không có chỗ tạo trong CODELAB.md là lỗi.

## Phase 6 — Anti-slop pass

Chạy sau khi viết xong, như một lượt riêng. Không vừa viết vừa sửa, sẽ bỏ sót.

Slop không phải văn dở, nó là văn trôi qua mắt mà không để lại thông tin. Ba test:

1. Không có tham chiếu — câu này trỏ về file, lệnh, hay số nào? Không có thì cắt.
2. Không kiểm chứng được — học viên làm sao biết đã đạt? Chuyển thành checkpoint.
3. Đảo được mà vẫn đúng — viết ngược nghĩa mà câu vẫn nghe hợp lý thì câu đó không mang thông tin. Test này mạnh nhất: "Prompt engineering là kỹ năng quan trọng trong thời đại AI" đảo thành "không quan trọng" vẫn nghe được như một ý kiến. Cắt.

Ba test trên là luật. Hai danh sách dưới đây chỉ là dấu hiệu thường gặp, **không phải blacklist** — mục tiêu là bỏ sự rỗng, không phải bỏ từ. "Hiệu quả" kèm con số thì giữ; đổi "tối ưu" thành từ khác mà câu vẫn rỗng thì vẫn cắt.

Mở đầu và chuyển ý hay rỗng: "Trong thế giới AI ngày nay" · "Hãy cùng nhau khám phá" · "Trước khi bắt đầu, chúng ta cần hiểu rằng" · "Điều quan trọng cần lưu ý là" · "Như bạn có thể thấy" · "Bây giờ đã xong X, hãy chuyển sang Y" · "Chúc bạn thành công".

Từ định tính hay rỗng khi đứng một mình: mạnh mẽ · hiệu quả · tối ưu · linh hoạt · toàn diện · dễ dàng · chuyên nghiệp · sâu sắc · đột phá. Sửa bằng cách thay bằng số: "hiệu quả" → "chạy 20 case trong 45s, trước là 3 phút"; "tối ưu" → "giảm token mỗi task từ 350 xuống 210".

Cấu trúc câu: bỏ "không chỉ X mà còn Y" (nhồi hai ý cho câu dài ra) · bỏ triad tính từ (thường có một cái sai) · bỏ "Điều này giúp bạn hiểu rõ hơn về" (mô tả lợi ích thay vì đưa nội dung) · câu dài hơn 40 từ thì tách · câu kết thúc bằng `!` đổi thành `.` · bullet không có động từ thì không phải hành động.

Slop đặc thù lab guide, loại nguy hiểm nhất vì nó trông giống hướng dẫn thật:

- Lệnh không có output kỳ vọng → thêm block `Kết quả đúng:`
- "Chạy file và kiểm tra kết quả" → dán output cụ thể
- "Cài các thư viện cần thiết" → `pip install -r requirements.txt`
- "Mở file config" → `config/test_cases.json`
- "Sửa lại prompt cho tốt hơn" → "Thêm luật: chỉ trả Final Answer khi đã có Observation"
- Gọi smoke run là "test" → gọi đúng loại
- Bịa output không chạy được → gắn nhãn `Coach inference`
- Trỏ tới file không tồn tại → kiểm bằng `ls`, hoặc đánh dấu FILE MỚI và cách tạo
- Copy nguyên đoạn README vào guide → guide nói cách làm, README nói tổng quan, link qua nhau

Trình bày: bỏ emoji trong heading vì directive đã là signal và emoji rải rác phá signaling bằng cách tạo tín hiệu giả · bold ≤ 3 chỗ mỗi step · `**Lưu ý:**` rải rác thì gom vào `:::caution` · bỏ heading H4+ · `[X]` đổi thành `[ ]`.

## Phase 7 — Tự kiểm và chốt

```bash
F=docs/CODELAB.md
echo "— path máy cá nhân"  ; grep -nE 'file:///|[A-Z]:\\Users|/home/[a-z]+/' "$F"
echo "— placeholder"       ; grep -nE 'TODO|TBD|FIXME|XXX|\[Name\]|\[Member' "$F"
echo "— checkbox tick sẵn" ; grep -nE '^\s*-? ?\[[xX]\]' "$F"
echo "— dấu chấm than"     ; grep -nE '![[:space:]]*$' "$F"
echo "— mũi tên lạ"        ; grep -nE '(->|➔|=>)' "$F"
echo "— emoji heading"     ; grep -nP '^#{1,4} .*[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]' "$F"
echo "— heading H4+"       ; grep -nE '^#{4,} ' "$F"
echo "— directive sai tên" ; grep -nE '^:::[a-z]' "$F" | grep -vE ':::(goal|checkpoint|caution|input|export|os|quiz)\{'
echo "— từ rỗng"           ; grep -niE 'mạnh mẽ|hiệu quả|tối ưu|linh hoạt|toàn diện|dễ dàng|đột phá' "$F"
echo "— mở đầu sáo"        ; grep -niE 'hãy cùng|trong thế giới|ngày nay|điều quan trọng cần|chúc bạn' "$F"
echo "— đếm goal/cp/step"  ; grep -c ':::goal' "$F"; grep -c ':::checkpoint' "$F"; grep -cE '^## [0-9]' "$F"
```

Trừ hai lệnh cuối, mọi lệnh phải ra rỗng. Ba số cuối phải bằng nhau và bằng số step. Mũi tên lạ trong code block là hợp lệ.

Năm check còn lại tự làm, không chờ ai review. Đây là kết quả cần đạt, không phải script — cách kiểm tuỳ bạn. Fail thì sửa rồi chạy lại từ đầu Phase 7.

- Step tự đóng: với mỗi step, liệt mọi file / hàm / biến được nhắc, xác nhận từng cái được giới thiệu trong step đó, hoặc nằm trong `prerequisites`, hoặc là output của step trước đã nêu tên. Fail thì thêm một dòng điều kiện đầu vào ở đầu step.
- Step 1 chạy thật: clone repo vào thư mục tạm, chạy đúng block lệnh trong guide, không thêm bước nào. Fail thì sửa lệnh trong guide theo cái thật sự chạy được, không sửa ngược lại.
- Cắt 20%: đọc lại từng step, cắt mọi câu không trỏ về file, lệnh, hay số.
- Câu hỏi trọng tâm: tìm step có checkpoint trả lời được nó. Fail thì thêm bảng so sánh conditional (khi nào dùng cái nào).
- Rubric map step: map từng ô điểm về step dạy cách tạo file đó. Fail thì thêm step, hoặc bỏ ô khỏi rubric.

```bash
# check "Step 1 chạy thật" — môi trường sạch, đúng lệnh trong guide
TMP=$(mktemp -d) && git clone -q "$(git rev-parse --show-toplevel)" "$TMP/lab" && cd "$TMP/lab"
python3 -m venv .venv && . .venv/bin/activate && pip install -q -r requirements.txt
# rồi chạy đúng lệnh smoke test mà guide ghi ở step 1
```

Hai thứ không chạy được thì gắn nhãn, không chờ người: output cần API key thì chạy phần không cần key và phần còn lại ghi `Coach inference`; `preparationTipIds` không verify được thì để `[]`.

Mọi check sạch thì đổi `published: true` và giao — **trừ một trường hợp**: còn `Coach inference` nào đặt trên **output của một lệnh** thì giữ `published: false`. Lý do: đó chính là thứ học viên dán mắt vào để so xem mình làm đúng chưa, và một con số suy đoán ở đó làm họ tưởng mình sai. Nhãn giải thích được vì sao chưa chạy, nhưng nó không làm con số đúng lên.

Lúc đó, giao kèm danh sách số dòng cần coach chạy một lần rồi dán output thật:

```bash
grep -n 'Coach inference' docs/CODELAB.md
```

`Coach inference` trên thứ khác — mức Python tối thiểu, số người mỗi nhóm — không chặn publish, vì học viên không đối chiếu kết quả với chúng.

Bàn giao: mở đầu bằng danh sách file đã tạo, rồi tóm gọn số step và tổng thời lượng và mô hình nhóm · mâu thuẫn repo đã xử lý thế nào · phần nào gắn `Coach inference`. Không dán lại quá trình audit.

## Điều dễ làm sai nhất

- Viết guide từ README thay vì từ code. README hay nói lab chạy hết test case trong khi source chỉ chạy một case.
- Bắt cài API key ngay step 1. Một phần lớp tắc ở đó và không ai qua được step 2.
- Dồn hết test xuống cuối bài. Học viên sai từ step 1, biết lúc step 6.
- Checkpoint kiểu "Hiểu được ReAct loop", và `:::goal` chỉ nhắc lại tiêu đề step bằng từ khác.
