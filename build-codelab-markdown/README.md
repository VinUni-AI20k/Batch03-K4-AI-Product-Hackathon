# build-codelab-markdown

Skill (định dạng Anthropic Agent Skills) để một AI agent biến repo lab thành codelab Markdown chuẩn cho web VLearn codelabs.

Người dùng là **lab coach sở hữu repo**. Coach chạy skill trên repo của mình, nhận về `docs/CODELAB.md` đúng format, team codelabs đưa thẳng lên web — không ai phải sửa lại format.

```
coach + skill → Phase 0-6 viết → Phase 7 chạy validator, tự sửa tới 0 error, tự chốt published
              → team codelabs nhận file, sync vào frontend/content/
```

## Bảy thứ skill giải quyết

- **Mỗi coach ra một format khác nhau** → một frontmatter schema 19 field, một vocabulary directive đóng, một bộ xương mặc định.
- **Markdown phải điền được và tương tác được trên web** → Markdown + frontmatter + `remark-directive` (không MDX), `:::input` khai file đích, `:::export` dựng file để commit, `<details>` cho gợi ý ẩn.
- **Học viên không track được mình đang ở đâu** → guide chạy theo đồng hồ: bảng timeline đầu bài, mỗi step khai `**<N> phút · mốc <a>–<b>.**`, tổng khớp `duration`.
- **Lab trong khoá không cùng một dạng, và lab mới sẽ thêm về sau** → Phase 2 phân loại bằng ba câu hỏi về chính repo trước mắt (deliverable được chấm là gì · có lệnh nào tự kiểm được không · cá nhân hay nhóm) rồi mới chọn xương. Không hardcode tên repo nào.
- **Học viên là người mới, nhóm có thể yếu lập trình** → một step một khái niệm mới, tối đa 2 jargon mới mỗi step có định nghĩa tại chỗ, khái niệm khó thì một câu ví dụ đời thường trước cơ chế, cho khung code thay vì đề bài rộng, và người không code vẫn có artifact mang tên mình.
- **Đọc ra mùi AI viết** → Phase 6 là một lượt cắt slop riêng, có ba test và bảng sửa cụ thể.
- **Không biết viết xong đã đủ chưa** → Phase 7 chạy validator tới 0 error rồi mới đổi `published: true`. Không có bước chờ người review.

## Cài và dùng

```bash
# dùng cho mọi project
cp -r build-codelab-markdown ~/.claude/skills/

# chỉ trong một repo
mkdir -p .claude/skills && cp -r build-codelab-markdown .claude/skills/
```

Codex hoặc công cụ khác: trỏ vào `build-codelab-markdown/SKILL.md`. Markdown thuần, không phụ thuộc runtime.

Mở terminal ở repo lab, rồi một trong ba cách:

```
Dùng skill build-codelab-markdown, sinh docs/CODELAB.md cho repo này. Lab 4 tiếng, nhóm 5 người.

Dùng skill build-codelab-markdown: chuyển LAB_GUIDE.md của tôi sang docs/CODELAB.md đúng format.
Đối chiếu với repo, chỗ nào không verify được thì đưa vào khối "Mâu thuẫn trong repo" kèm cách
bạn chọn, đừng đoán.

Chạy Phase 7 của skill build-codelab-markdown trên docs/CODELAB.md, sửa mọi chỗ fail.
```

Tự kiểm bất cứ lúc nào:

```bash
python3 scripts/validate_codelab.py docs/CODELAB.md --repo-root .
```

Exit 0 là sạch. Còn ERROR thì chưa giao được. WARN thì đọc rồi tự quyết.

## Cấu trúc

```
build-codelab-markdown/
├── SKILL.md                  184 dòng — router: 8 phase, 7 bất biến, chỗ tự quyết
├── references/                          đọc theo phase, mỗi file một lần
│   ├── render-contract.md    Phase 3-4 · hợp đồng cứng với web: 19 field, 7 directive, ô điền
│   ├── repo-audit.md         Phase 1-2 · evidence ledger, 6 loại lệnh, 7 dạng lab, dựng timeline
│   ├── writing-steps.md      Phase 4   · tiết lộ tới đâu, bộ xương step, code/bảng/mermaid
│   ├── anti-slop.md          Phase 6   · ba test cắt slop, bảng sửa
│   ├── team-roles.md         Phase 5   · 14 role, handoff, integration gate, commit đề xuất
│   ├── pedagogy.md           Phase 2   · vì sao thứ tự trong step là thứ tự đó
│   └── worked-example.md     tuỳ lúc   · một step viết sai và viết đúng, cạnh nhau
├── scripts/
│   └── validate_codelab.py              gate deterministic, thay cho một loạt lệnh grep
└── templates/
    ├── CODELAB.template.md              bản publish lên web
    ├── README.template.md               README repo: bài toán, setup, chấm điểm, nộp bài
    ├── REPORT.template.md               báo cáo nhóm + reflection cá nhân
    └── PHAN_CONG.template.md            phân vai + checklist theo mốc
```

Theo progressive disclosure của Agent Skills: metadata (`name` + `description`) luôn ở trong context, `SKILL.md` đọc khi skill kích hoạt, `references/` chỉ đọc khi tới đúng phase. Anthropic quy định SKILL.md dưới 500 dòng; bản này 184 dòng, phần chi tiết nằm ở references.

Mọi reference link **trực tiếp** từ SKILL.md, không lồng nhau — file lồng nhau hay bị đọc thiếu vì agent chỉ preview một phần.

## Web render bằng gì

`react-markdown` + `remark-gfm` + `remark-directive` + một plugin nhỏ đổi directive thành React component (namespace `d-*`) + `rehype-raw` + `rehype-slug`. Frontmatter parse bằng `gray-matter`. Mermaid render client-side.

**Không MDX** — vì file này còn nằm ở `docs/CODELAB.md` trong repo lab và learner mở nó trên GitHub, nơi directive vẫn đọc được còn JSX thì thành rác. Và pipeline nhận file từ nhiều lab coach thì vocabulary đóng an toàn hơn React tuỳ ý.

Web đọc content từ `frontend/content/<id>.md`, sync bằng `npm run sync:content`. Hợp đồng đầy đủ: `references/render-contract.md`.

## Nguồn của format

Schema và directive không tự đặt ra, lấy từ các bản đang publish thật tại thời điểm viết skill. Đây là provenance để người sau truy được, không phải dependency — `SKILL.md` không trỏ vào path nào trong đây:

- `repos/K4-Day03-Lab-Chatbot-vs-react-agent-E403/docs/CODELAB.md` — frontmatter 19 field, `:::goal/:::checkpoint/:::caution`, glossary tooltip, mermaid
- `repos/K4-Day01-LLM-API-Exploration/{README,LAB_GUIDE}.md` — mốc giờ và checkpoint theo block, luồng thay thế khi không có API key
- `repos/K4-Day03-.../docs/PHAN_CONG_CONG_VIEC.md` — quy tắc 1 role = 1 file, integrator giữ entrypoint
- `repos/Day04-C401-.../starter_v0/artifacts/REPORT.md` — report chia phần theo deadline, mỗi ô trỏ về evidence file
- `repos/K4-Day02-AI-Product-Labs/README.md` — rubric trỏ về từng file, worked example trước task độc lập
- `repos/Day04-Assignment-AgentTriage/README.md` — "ba điều dễ mất điểm nhất", dạy bằng failure mode
- `Spiderman/build-repo-lab-guide/SKILL.md` (skill của đồng đội) — bốn khối mỗi task, thứ tự thẩm quyền cho evidence, taxonomy loại lệnh, ranh giới tiết lộ, handoff bắt buộc, và ý tưởng dùng script làm gate thay vì để agent tự kiểm bằng mắt
- Google Codelabs `claat` — convention khai thời lượng ngay dưới mỗi step title

## Còn để ngỏ

- Ô điền lưu state ở `localStorage` hay theo tài khoản VLearn. Theo tài khoản thì learner đổi máy không mất bài, nhưng phải trả lời được câu nội dung có đi lên server không.
- Trang listing từng dùng `slug` khác `id` trong frontmatter. Hiện web quét `frontend/content/` nên `id` là nguồn duy nhất, nhưng cách làm chính thức vẫn cần team codelabs chốt.
