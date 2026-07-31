# build-codelab-markdown

Skill cho AI (Claude Code / Codex / Cursor). Lab coach dùng skill này để viết hướng dẫn lab từ repo của mình. Output là markdown đúng format, gửi thẳng cho team codelabs đưa lên `codelabs.vlearn.dev` mà không ai phải sửa format lại.

Bảy thứ skill giải quyết:

- Mỗi coach ra một format khác nhau → một frontmatter schema 19 field, một vocabulary directive đóng, một bộ xương mặc định.
- Muốn markdown điền được và tương tác được trên web → chốt Markdown + frontmatter + `remark-directive` (không MDX), có `:::input` khai file đích, `:::export` dựng file để commit, `<details>` cho gợi ý ẩn.
- Markdown đọc mệt, học viên không track được mình đang ở đâu → 7 điều bất biến; phần còn lại là default kèm lý do để LLM tự cân theo repo.
- Lab trong khoá không cùng một dạng, và lab mới sẽ thêm về sau → Phase 2 phân loại bằng ba câu hỏi về chính repo trước mắt (deliverable được chấm là gì · có lệnh nào tự kiểm được không · cá nhân hay nhóm) rồi mới chọn xương. Không hardcode tên repo nào, nên lab mới không cần sửa skill.
- Học viên là người mới, nhóm có thể yếu lập trình → skill có section riêng về đối tượng: định nghĩa jargon tại chỗ, dán nguyên văn lỗi, cho khung code thay vì đề bài rộng, và bảo đảm người không code vẫn có artifact mang tên mình.
- Đọc ra mùi AI viết → Phase 6 là anti-slop pass riêng, có luật cắt và lệnh grep kiểm.
- Không biết viết xong đã đủ chưa → Phase 7 tự kiểm hết rồi mới đổi `published: true`, không có bước chờ người review.

```
coach + skill → Phase 0-6 viết → Phase 7 tự kiểm, tự sửa, tự chốt published: true
              → team codelabs nhận file, đưa lên web
```

## Cài

Dùng cho mọi project: `cp -r build-codelab-markdown ~/.claude/skills/`

Chỉ trong một repo: `mkdir -p .claude/skills && cp -r build-codelab-markdown .claude/skills/`

Codex hoặc công cụ khác: trỏ vào `build-codelab-markdown/SKILL.md`. Markdown thuần, không phụ thuộc runtime.

## Dùng

Mở terminal ở repo lab, rồi:

```
Dùng skill build-codelab-markdown, sinh docs/CODELAB.md cho repo này. Lab 4 tiếng, nhóm 5 người.
```

Đã có notes hoặc guide cũ:

```
Dùng skill build-codelab-markdown: chuyển LAB_GUIDE.md của tôi sang docs/CODELAB.md đúng format.
Đối chiếu với repo, chỗ nào không verify được thì đưa vào khối "Mâu thuẫn trong repo" kèm cách
bạn chọn, đừng đoán.
```

Kiểm lại một bản đã có:

```
Chạy Phase 7 của skill build-codelab-markdown trên docs/CODELAB.md, sửa mọi chỗ fail.
```

## Cấu trúc

Theo chuẩn Agent Skills: `SKILL.md` lean, phần còn lại load khi cần, có pointer rõ trong SKILL.md.

```
SKILL.md                        435 dòng — luôn load. Đối tượng, 7 bất biến, default có lý do, Phase 0-7
references/
  interactive-blocks.md         135 dòng — Phase 4, khi cần điền/tương tác. Vocabulary + spec cho frontend
  team-roles.md                  93 dòng — Phase 5, chỉ khi lab nhóm
  pedagogy.md                    55 dòng — Phase 2, khi không chắc dạy thứ gì trước
  worked-example.md              79 dòng — khi chưa rõ "đúng format" trông thế nào
templates/
  CODELAB.template.md           bản publish lên web
  README.template.md            README repo: bài toán, setup, chấm điểm, nộp bài
  REPORT.template.md            báo cáo nhóm + reflection cá nhân
  PHAN_CONG.template.md         phân vai + checklist theo mốc
```

Anthropic quy định SKILL.md dưới 500 dòng, chạm mốc thì thêm một tầng hierarchy có pointer. 435 dòng còn 65 dòng headroom; thêm luật mới thì cân nhắc đẩy sang `references/`.

Coach muốn xem nhanh "đúng format" là thế nào: đọc `references/worked-example.md`.

## Nguồn của format

Schema và directive không tự đặt ra, lấy từ các bản đang publish thật tại thời điểm viết skill. Danh sách này là provenance để người sau truy được, không phải dependency — `SKILL.md` không trỏ vào path nào trong đây:

- `repos/K4-Day03-Lab-Chatbot-vs-react-agent-E403/docs/CODELAB.md` — frontmatter 19 field, `:::goal/:::checkpoint/:::caution`, glossary tooltip, mermaid
- `repos/K4-Day01-LLM-API-Exploration/{README,LAB_GUIDE}.md` — mốc giờ và checkpoint theo block, luồng thay thế khi không có API key
- `repos/K4-Day03-.../docs/PHAN_CONG_CONG_VIEC.md` — quy tắc 1 role = 1 file, integrator giữ entrypoint
- `repos/Day04-C401-.../starter_v0/artifacts/REPORT.md` — report chia phần A/B theo deadline, mỗi ô trỏ về evidence file
- `repos/K4-Day02-AI-Product-Labs/README.md` — rubric trỏ về từng file, worked example trước task độc lập
- `repos/Day04-Assignment-AgentTriage/README.md` — "ba điều dễ mất điểm nhất", dạy bằng failure mode
- `Spiderman/build-repo-lab-guide/SKILL.md` — bốn khối mỗi task, thứ tự thẩm quyền, 5 loại lệnh

## Ba thứ đo được sau khi áp

1. Diff giữa hai codelab của hai coach đọc được, vì frontmatter cố định 19 field đúng thứ tự và directive chỉ có 3 loại. Xương step thì tuỳ dạng lab — cái được thống nhất là hợp đồng, không phải khuôn.
2. Học viên tự biết mình đúng hay sai, vì mọi lệnh có output kỳ vọng và mọi step có checkpoint verify được.
3. Không có bước chờ người: Phase 7 chạy grep, chạy step 1 trên môi trường sạch, map rubric về step, rồi tự chốt.

## Quyết định kiến trúc đã chốt

Định dạng output: **Markdown + YAML frontmatter + `remark-directive`**, render qua registry component đóng. Không MDX, vì file này còn nằm ở `docs/CODELAB.md` trong repo lab và learner mở nó trên GitHub — directive ở đó vẫn đọc được, JSX thì thành rác; và pipeline nhận file từ nhiều labcoach thì vocabulary đóng an toàn hơn React tuỳ ý.

Thứ tự implement đề xuất cho frontend, chi tiết trong `references/interactive-blocks.md`: (1) bật `rehype-raw` cho `<details>` — rẻ nhất, mở ngay gợi ý và đáp án ẩn; (2) `:::input` + `:::export` cùng lúc, vì `:::input` không có đường ra file nếu thiếu `:::export`; (3) `:::os` cho lớp ba hệ điều hành; (4) `:::quiz`.

## Còn cần xác nhận

Trang listing Next.js `Spiderman/frontend/src/data/codelabs.ts` đang dùng `slug` khác `id` trong frontmatter (`lab-01-nen-tang-llm-api` so với `day1-lab-llm-api-foundation`). Cần team codelabs chốt: hai giá trị phải trùng, hay map qua bảng riêng. Skill để ngỏ và không tự suy, vì đoán sai thì card listing trỏ vào 404.
