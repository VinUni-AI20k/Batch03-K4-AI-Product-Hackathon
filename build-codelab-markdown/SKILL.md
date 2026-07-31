---
name: build-codelab-markdown
description: Chuyển một repo lab thành codelab Markdown chuẩn cho web VLearn codelabs — frontmatter 19 field, bộ directive đóng, guide đi theo mốc thời gian của buổi học, và một lượt cắt AI-slop. Dùng khi lab coach cần xuất tài liệu lab (repo, README, notes, slide) thành codelab hoặc hướng dẫn step-by-step; khi chuyển guide cũ sang format nhà; khi viết README, template báo cáo, hoặc bảng phân công cho repo lab; hoặc khi một bản nháp cần cắt slop trước khi publish. Kích hoạt cả với yêu cầu tiếng Việt như "viết hướng dẫn lab", "làm codelab cho repo này", "chuẩn hoá markdown lab", "review guide lab giúp tôi".
---

# Build Codelab Markdown

Biến một repo lab thành codelab Markdown mà người mới học AI đọc là làm được, và web codelabs render được không cần ai sửa lại format. Người dùng skill này là lab coach sở hữu repo.

Skill này chạy theo chuẩn Codex hiện tại:

- Thư mục skill là thư mục chứa file `SKILL.md` này.
- Tài nguyên chi tiết nằm trong `references/`, script kiểm nằm trong `scripts/`, template output nằm trong `assets/templates/`.
- Khi cần chạy script của skill, dùng path tuyệt đối tới thư mục skill mà Codex cung cấp trong source locator; không dùng biến môi trường của công cụ khác.

Hai nguyên tắc gốc — mọi luật bên dưới là hệ quả của chúng:

1. **Repo là bằng chứng, không phải tài liệu đã đúng.** Mọi câu trong output truy được về một file, một lệnh, hoặc một assertion trong repo — hoặc gắn nhãn `Coach inference`.
2. **Học viên đọc guide một lần, trong lúc đang bối rối, và đang bị đồng hồ đuổi.** Nên guide chạy theo dòng thời gian của buổi học, mỗi lúc chỉ giao một việc, và không có câu nào tồn tại để trang trí.

## Chạy một lượt, không hỏi lại

Coach chỉ nói "làm codelab cho repo này" là ra file. Đừng dừng để hỏi rồi chờ.

Nghĩa là: **suy ra mọi thứ còn thiếu từ repo, gắn nhãn, rồi viết tiếp.** Coach đọc file xong sẽ sửa nhanh hơn nhiều so với việc trả lời câu hỏi trước khi có gì để đọc — và những thứ hay bị hỏi (nhóm mấy người, timebox, `preparationTipIds`) thì repo trả lời được hoặc có default an toàn.

Chỉ hỏi khi repo mâu thuẫn tới mức không suy được và câu trả lời đổi cả cấu trúc bài — kể cả lúc đó, **vẫn giao file** theo giả định đã ghi rõ, rồi hỏi kèm. Không bao giờ trả về một câu hỏi mà không có file.

## Quy trình

Copy checklist này vào câu trả lời và tick dần. Đừng nhảy phase: Phase 4 viết ra nội dung sai nếu Phase 1 chưa có bằng chứng.

```
- [ ] Phase 0 — Chốt phạm vi và ngôn ngữ
- [ ] Phase 1 — Audit repo, dựng evidence ledger
- [ ] Phase 2 — Phân loại dạng lab, dựng timeline
- [ ] Phase 3 — Viết frontmatter
- [ ] Phase 4 — Viết step
- [ ] Phase 5 — Roles, report, README (nếu cần)
- [ ] Phase 6 — Lượt cắt slop
- [ ] Phase 7 — Chạy validator tới khi 0 error, rồi giao
```

## Đọc thêm khi cần

Mỗi file đọc một lần, ở đúng phase. Đừng đọc hết từ đầu.

| File | Đọc ở | Nội dung |
|---|---|---|
| `references/render-contract.md` | Phase 3, 4 | Hợp đồng cứng với web: 19 field, 7 directive, ô điền, `<details>`, glossary |
| `references/repo-audit.md` | Phase 1, 2 | Evidence ledger, 6 loại lệnh, phân loại file, 7 dạng lab, timeline |
| `references/writing-steps.md` | Phase 4 | Tiết lộ tới đâu, bộ xương một step, code/bảng/mermaid, escape hatch |
| `references/anti-slop.md` | Phase 6 | Ba test cắt slop, danh sách dấu hiệu, slop đặc thù lab guide |
| `references/team-roles.md` | Phase 5 | 14 role, chọn theo số người, handoff, integration gate |
| `references/pedagogy.md` | Phase 2 | Vì sao thứ tự trong step là thứ tự đó |
| `references/worked-example.md` | Khi chưa rõ "đúng" trông thế nào | Một step viết sai và viết đúng, cạnh nhau |
| `assets/templates/*.md` | Phase 3–5 | Khung để điền, không phải luật |

## Output

- `docs/CODELAB.md` — luôn luôn. Đây là bản publish. Khung: `assets/templates/CODELAB.template.md`.
- `README.md` — khi repo chưa có, hoặc README không nói được bài toán / setup / cách nộp.
- `docs/PHAN_CONG_CONG_VIEC.md` — khi lab làm nhóm.
- `report/TEMPLATE_REPORT.md` — khi lab yêu cầu nộp báo cáo.

Thiếu bằng chứng để điền thì ghi vào khối `Mâu thuẫn trong repo` ở đầu CODELAB.md. Không bịa.

## Guide phải đọc được bởi người mới

Mặc định người học: mới tiếp cận AI, dùng terminal ở mức cơ bản, và trong nhóm có thể có người chưa mạnh lập trình. Coach nói khác thì theo coach.

Sáu luật dưới đây là chỗ giả định này đổi cách viết. Chúng quan trọng ngang hợp đồng render, vì một guide đúng format mà người mới không đọc nổi thì vẫn là guide vô dụng.

1. **Đi theo đồng hồ.** Đầu bài có bảng timeline: mốc phút, step, xong sẽ có gì. Mỗi step mở bằng một dòng `**<N> phút · mốc <a>–<b>.**`. Học viên phải trả lời được "tôi đang ở phút thứ mấy, còn bao nhiêu" mà không cần đếm. Đây cũng là thứ cho họ quyết định bám tiếp hay xin trợ giúp, thay vì im lặng rồi tụt lại.
2. **Một step một khái niệm mới.** Working memory của người mới hết chỗ rất nhanh. Step nào phải dạy hai khái niệm mới thì nó là hai step.
3. **Nhiều nhất 2 jargon mới mỗi step, và định nghĩa ngay tại chỗ.** Kể cả từ bạn thấy hiển nhiên: assertion, deterministic, parser, schema, contract, entrypoint, mock. Dùng glossary tooltip. Một từ không định nghĩa là một người dừng đọc.
4. **Khái niệm khó thì một câu ví dụ đời thường trước, cơ chế sau.** Đúng một câu — dài hơn là nó thành văn tả. Ví dụ: "Tool giống số điện thoại tổng đài: model không tự biết giá vé, nó phải gọi ra ngoài mà hỏi." Rồi mới vào Thought → Action → Observation.
5. **Vào thẳng việc.** Không có đoạn dạo đầu trước hành động đầu tiên của step. Khối `:::goal` đã làm xong việc dẫn nhập. Bỏ "Trước khi bắt đầu, chúng ta cần hiểu rằng...".
6. **Cho khung, đừng cho đề bài rộng.** "Viết hàm `call_openai`" là quá rộng với người mới. "Xoá dòng `raise NotImplementedError`, viết thân hàm theo 3 bước dưới" thì làm được. Ranh giới tiết lộ tới đâu: `references/writing-steps.md`.

Ba điều nữa, ít hiển nhiên hơn:

- Troubleshooting dán **nguyên văn** thông báo lỗi, vì người mới tìm theo đúng chuỗi ký tự họ thấy trên màn hình, không tìm theo mô tả.
- Bỏ "chỉ cần", "đơn giản là", "rõ ràng là". Với người mới không có gì là đơn giản, và câu đó làm người đang tắc cảm thấy mình kém.
- Learner được dùng AI để viết code. Chốt bằng checkpoint loại "nói được" — nộp thứ mình giải thích được, không phải nộp thứ AI sinh ra.

## Ba nhãn skill này sinh ra

`Coach inference` — nội dung bạn **suy ra** chứ không verify được từ repo. Thường là output kỳ vọng của lệnh cần API key hoặc cần cả lớp mới chạy được. Viết ngay trong dòng dẫn: `Kết quả kỳ vọng (Coach inference — chưa chạy được vì cần API key):`. Nó phục vụ hai người: learner biết chỗ này có thể lệch thực tế nên đừng tưởng mình sai, coach biết chỗ này cần chạy một lần rồi dán output thật vào. Nhãn này không phải giấy phép để đoán — chỉ dùng khi thứ đó thật sự không chạy được ở đây, và phần suy ra phải dựa trên bằng chứng trong repo (tên test, assertion, code deterministic).

`FILE MỚI` — file guide yêu cầu learner tạo, chưa có trong repo. Kèm đủ: path, mục đích, cách tạo, format, lệnh kiểm, output kỳ vọng.

`KHÔNG COMMIT` — file chỉ được tồn tại trên máy learner: `.env`, credential, model tải về, cache. Kèm lý do và xác nhận nó đã nằm trong `.gitignore`.

## Bất biến

Bảy điều này không lệch được. Lệch là vỡ web render, hoặc vỡ khả năng tự kiểm của học viên — không phải vấn đề thẩm mỹ. Validator ở Phase 7 kiểm hết.

1. Frontmatter đúng 19 field, đúng thứ tự, đúng kiểu. Web parse nó.
2. Chỉ dùng 7 directive trong vocabulary, đúng cú pháp, mỗi block có dòng `:::` đóng. Renderer là registry đóng — nó không biết directive bạn tự nghĩ ra, và block lạ thì learner thấy chữ `:::` trần trên trang.
3. Mỗi lệnh có output kỳ vọng ngay bên dưới, hoặc nhãn `Coach inference`. Không có thì học viên không tự biết mình đúng hay sai.
4. Mỗi step đóng bằng checkpoint verify được, và khai thời lượng. "Hiểu được X" không phải checkpoint.
5. Gọi đúng loại lệnh: Setup / Smoke run / Automated test / Validation / Manual check / Security check.
6. Không path máy cá nhân, không secret, không PII.
7. Mọi `:::input` khai `target` là file đích trong repo learner, và bài có `:::input` thì phải có `:::export`.

## Chỗ bạn tự quyết

Phần dưới là default kèm lý do, không phải luật. Lab nào cũng khác nhau: đọc repo rồi tự quyết. Lệch default thì được — ghi một dòng lý do trong khối `Mâu thuẫn trong repo` để người review thấy đó là chủ ý.

- **Số step 4–8, mỗi step 20–45 phút.** Step là điểm dừng để cả lớp đồng bộ, và mỗi step nên là một artifact chạy được. Lab 90 phút một mục tiêu duy nhất thì 3 step tốt hơn 4 step cắt vụn.
- **Prose trước action đầu tiên ≤ 120 từ.** Tải đọc lấy chỗ của tải làm. Khái niệm thật khó thì cứ dạy đủ, nhưng đổi sang bảng hoặc mermaid.
- **Khối `**Bạn làm:**` ≤ 5 bullet, 1 bullet 1 file.** Nhiều hơn thì học viên mất chỗ đang làm. Chuỗi setup tuyến tính 7 dòng vẫn ổn nếu chúng là một lần copy.
- **Code block ≤ 20 dòng.** Dài hơn thì học viên copy cả cục rồi không biết sai ở đâu. Contract cần nhìn nguyên khối (schema, docstring mẫu) thì dài hơn được.
- **Bảng ≤ 6 cột**, vì phần lớn lớp đọc trên điện thoại. Cần nhiều chiều hơn thì tách hai bảng.
- **Escape hatch "Nếu bị chậm" / "Xong sớm"** cần ở step dài. Step 15 phút thì thêm vào chỉ làm loãng.
- **Emoji trong heading: 0.** Gần như bất biến, và lý do cụ thể hơn thẩm mỹ: máy thiếu font emoji render nó thành ô vuông rỗng, nên tiêu đề thành `□ 4 Cấp Độ...`. Directive đã là signal rồi. Muốn dùng thì chỉ trong bảng, để mã hoá trạng thái, có chú giải.

Cân thế nào: default tồn tại để chống viết dài và viết rỗng. Lệch vì nó làm guide rõ hơn cho học viên thì lệch. Lệch chỉ để nhét thêm nội dung bạn thấy hay thì đừng.

## Phase 0 — Chốt phạm vi

Repo root bằng `git rev-parse --show-toplevel`; không phải git checkout thì dùng path user đưa. Đọc mọi `AGENTS.md` áp dụng được trước khi ghi gì. Nếu repo cũ chỉ có `CLAUDE.md` thì đọc như tài liệu legacy, nhưng ưu tiên `AGENTS.md` khi có cả hai. Match ngôn ngữ material: tiếng Việt thì output tiếng Việt, giữ jargon tiếng Anh.

Hỏi tối đa 3 câu, chỉ khi câu trả lời làm đổi nội dung: lab cá nhân hay nhóm mấy người · timebox thật và mốc giờ trong buổi · `preparationTipIds` nào đã tồn tại trên web. Suy ra được thì tự suy và ghi thành assumption có nhãn; không hỏi thứ repo đã trả lời.

Coach đã có bản nháp hoặc guide cũ: giữ nội dung, đổi hình thức. Nội dung chuyên môn là của coach và đúng theo lớp của coach — chỉ sửa format, thứ tự trình bày, và slop. Vẫn chạy Phase 1 để đối chiếu, vì bản nháp cũ hay lệch khi repo đã rename file hoặc đổi flag.

## Phase 1 — Audit repo

Chưa có evidence ledger thì chưa được viết step nào. Đọc `references/repo-audit.md`, dựng ledger, phân loại mọi file được nhắc, ghi lại mâu thuẫn giữa docs và code.

Điểm dễ bỏ qua nhất: xác định lệnh nào **thật sự** chạy được ở đây và lệnh nào không. Cái không chạy được sẽ thành `Coach inference` ở Phase 4, và nó chặn `published: true` ở Phase 7 — nên biết sớm thì đỡ phải sửa lại.

## Phase 2 — Phân loại dạng lab, dựng timeline

Bộ xương ở Phase 4 là default cho lab build-code. Repo không phải dạng đó thì đổi xương, đừng bẻ lab cho vừa khuôn. Ba câu hỏi phân loại và 7 dạng thường gặp: `references/repo-audit.md`.

Xong phân loại thì dựng timeline **trước khi viết chữ nào**: liệt kê deliverable cuối cùng, đi ngược ra các step, gán phút cho từng step, cộng lại phải khớp `duration`. Timeline này lên đầu bài dưới dạng bảng, và là thứ đầu tiên học viên đọc sau TL;DR.

Vì sao thứ tự trong mỗi step là thứ tự đó: `references/pedagogy.md`.

## Phase 3 — Frontmatter

19 field, thứ tự cố định, kiểu cố định. Schema đầy đủ kèm chỗ dễ sai: `references/render-contract.md`.

## Phase 4 — Viết step

Đọc `references/render-contract.md` (cú pháp directive, ô điền, glossary) và `references/writing-steps.md` (tiết lộ tới đâu, bộ xương một step, code/bảng/mermaid, step nộp bài). Chưa rõ "đúng" trông thế nào thì xem `references/worked-example.md`.

## Phase 5 — Roles, report, README

Lab nhóm thì đọc `references/team-roles.md`. Mục tiêu phân vai không phải chia đều việc, mà là mỗi người một file để không đè code nhau, và mỗi người một artifact mang tên mình để chấm được.

Report: mỗi ô phải trỏ về một file bằng chứng trong repo. Report không có evidence file là report tự khai.

README: bài toán, yêu cầu, xong sẽ có gì, setup, chấm điểm, nộp bài. Mỗi ô điểm trong rubric phải trỏ về một file học viên tạo được; ô nào không có chỗ tạo trong CODELAB.md là lỗi.

## Phase 6 — Lượt cắt slop

Chạy sau khi viết xong, như một lượt riêng. Không vừa viết vừa sửa, sẽ bỏ sót. Ba test và danh sách dấu hiệu: `references/anti-slop.md`.

## Phase 7 — Validator, rồi giao

```bash
python3 /absolute/path/to/build-codelab-markdown/scripts/validate_codelab.py docs/CODELAB.md --repo-root .
```

Vòng lặp: chạy → sửa hết ERROR → chạy lại. Không giao khi còn ERROR. WARN thì đọc từng dòng rồi tự quyết giữ hay sửa, và nói rõ trong bàn giao cái nào cố ý giữ.

Validator kiểm được cấu trúc. Bốn thứ nó không kiểm được thì bạn tự làm:

- **Step tự đóng.** Với mỗi step, liệt mọi file / hàm / biến được nhắc, xác nhận từng cái được giới thiệu trong step đó, hoặc nằm trong `prerequisites`, hoặc là output của step trước đã nêu tên. Fail thì thêm một dòng điều kiện đầu vào ở đầu step.
- **Step 1 chạy thật.** Clone repo vào thư mục tạm, chạy đúng block lệnh trong guide, không thêm bước nào. Fail thì sửa lệnh trong guide theo cái thật sự chạy được, không sửa ngược lại.
- **Câu hỏi trọng tâm có chỗ trả lời.** Tìm step có checkpoint trả lời được nó. Fail thì thêm bảng so sánh conditional.
- **Rubric map được về step.** Map từng ô điểm về step dạy cách tạo file đó. Fail thì thêm step, hoặc bỏ ô khỏi rubric.

```bash
# check "Step 1 chạy thật" — môi trường sạch, đúng lệnh trong guide
TMP=$(mktemp -d) && git clone -q "$(git rev-parse --show-toplevel)" "$TMP/lab" && cd "$TMP/lab"
# rồi chạy đúng block setup + smoke test mà guide ghi ở step 1
```

Hai thứ không chạy được thì gắn nhãn, không chờ người: output cần API key thì chạy phần không cần key, phần còn lại ghi `Coach inference`; `preparationTipIds` không verify được thì để `[]`.

Sạch hết thì đổi `published: true` — **trừ một trường hợp**: còn `Coach inference` nào đặt trên **output của một lệnh** thì giữ `published: false`. Lý do: đó chính là thứ học viên dán mắt vào để so xem mình làm đúng chưa, và một con số suy đoán ở đó làm họ tưởng mình sai. Nhãn giải thích được vì sao chưa chạy, nhưng không làm con số đúng lên. Validator tự chặn trường hợp này.

Bàn giao: mở đầu bằng danh sách file đã tạo · số step và tổng thời lượng và mô hình nhóm · mâu thuẫn repo đã xử lý thế nào · dòng nào còn `Coach inference` cần coach chạy một lần · WARN nào cố ý giữ và vì sao. Không dán lại quá trình audit.

## Điều dễ làm sai nhất

- Viết guide từ README thay vì từ code. README hay nói lab chạy hết test case trong khi source chỉ chạy một case.
- Bắt cài API key ngay step 1. Một phần lớp tắc ở đó và không ai qua được step 2.
- Dồn hết test xuống cuối bài. Học viên sai từ step 1, biết lúc step 6.
- Step không khai thời lượng. Học viên không biết mình đang chậm cho tới lúc hết giờ.
- Checkpoint kiểu "Hiểu được ReAct loop", và `:::goal` chỉ nhắc lại tiêu đề step bằng từ khác.
- Nhồi hai khái niệm mới vào một step vì chúng "liên quan nhau".
