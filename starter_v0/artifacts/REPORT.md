# Day 04 Lab v2 Report — Research Agent

## Team

- Team: G19
- Members: Cao Minh Quang, Nguyễn Lâm Tùng Bách, Trần Phú Nghĩa, Điền Mạnh Hùng, Trần Minh Quang
- Provider/model: OpenRouter / `openai/gpt-4o-mini`
- Final artifact: `v3.8+p8f50dbdee994+t0e63f2e02ad2`

---

# PHẦN A — Giới thiệu agent

## A1. Agent này làm được gì

Research Agent G19 tìm và tổng hợp tin web, bài đăng X/Twitter theo tài khoản, chủ đề hoặc chế độ random, đọc URL cụ thể, tìm paper arXiv, audit citation và định dạng digest. Agent hỏi lại khi input thật sự bắt buộc bị thiếu và từ chối yêu cầu ngoài scope. Với yêu cầu Twitter/X random/ngẫu nhiên, v3.8 tự chọn một chủ đề discovery an toàn và chạy ngay, không hỏi account/topic. Với Telegram, khi nội dung đã có trong hội thoại và user yêu cầu gửi, agent thực thi đúng một lần, không hỏi xác nhận lại.

Guardrail v3.6 chặn URL sai/không an toàn trước khi gọi mạng. URL không đọc được sẽ được đánh dấu `blocked/skipped`, không được tự chuyển sang web search, Twitter, paper search hay đoán URL thay thế. Ngoài ngữ cảnh URL lỗi đó, Twitter API và hai route `timeline` / `search_social_topic` vẫn hoạt động; v3.8 bổ sung `random_mode` có chủ đích nên không mở đường cho fallback tìm kiếm lung tung.

**Link dùng thử:** https://ice-measuring-mls-specify.trycloudflare.com

Link Cloudflare Tunnel tạm cho showdown; tunnel phải tiếp tục chạy trên máy demo. Local fallback: `http://localhost:8501` (health endpoint: `/_stcore/health`).

## A2. Tool agent có

| Tên tool | Làm được gì | Tool mới nhóm thêm? |
| --- | --- | --- |
| `ask_for_missing_info` | Hỏi một input research bắt buộc đang thiếu | Không |
| `confirm_action` | Hỏi xác nhận yes/no khi thiếu nội dung hoặc user yêu cầu review trước | Không |
| `send` | Gửi ngay nội dung đã có sang Telegram, có exactly-once guard | Không (optional built-in) |
| `timeline` | Lấy bài đăng gần nhất của một tài khoản X cụ thể | Không |
| `search_social_topic` | Tìm bài đăng X theo chủ đề hoặc random có chủ đích; trả cả `selected_topic` | Không |
| `lookup` | Tìm web/news theo query và timeframe | Không |
| `fetch` | Đọc URL cụ thể; chặn/skip URL lỗi và cấm fallback | Không |
| `format` | Định dạng items đã thu thập thành digest | Không |
| `citation_audit` | Audit title/link, HTTPS và URL trùng trên dữ liệu đã có | **Có** |
| `policy` | Tìm trong policy markdown nội bộ | Không (optional built-in) |
| `papers` | Tìm paper arXiv theo chủ đề | Không (optional built-in) |
| `paper_text` | Đọc text của một arXiv ID/URL cụ thể | Không (optional built-in) |

`send` là model-facing từ v3.7. Low-level call vẫn yêu cầu `confirmed=true`, nhưng direct user request có nội dung sẵn được coi là authorization và thực thi ngay.

## A3. Câu hỏi mẫu để thử

1. `Tìm 3 tin tức nổi bật về AI agents trên web hôm nay và tóm tắt ngắn gọn.`
2. `Lấy 3 bài đăng mới nhất trên X giúp mình.` rồi bổ sung `Của Sam Altman, giữ đúng 3 bài.`
3. `Chỉ audit citation, không tìm thêm: [{"title":"AI report","url":"https://example.com/report"}].`
4. `Đăng lên Telegram nội dung: Bản tin AI hôm nay đã sẵn sàng.`
5. `Tóm tắt bài báo tại http://127.0.0.1:8501/missing-article giúp tôi.`
6. `Tìm random 4 bài đăng trên Twitter cho tôi.`

## A4. Kịch bản demo đã rehearse

| Scenario | Tool trace cần thấy | Câu chuyện cải thiện version | Fallback run/transcript |
| --- | --- | --- | --- |
| News research bình thường | `lookup(query="AI agents", topic="news", timeframe="day", max_results=3)` → `format` | v0 thiếu contract args; v3.6 giữ routing/args 100% và trả digest có link | `transcripts/v3.6_openrouter_20260729T162326402733.transcript.json` |
| Thiếu account rồi bổ sung | `ask_for_missing_info(response_type="text")` → turn sau `timeline(screenname="sama", limit=3)` | v0 tự đoán `sama`; từ v1 trở đi hỏi đúng input bắt buộc | `transcripts/v3.6_openrouter_20260729T162421996909.transcript.json` |
| Confirmation boundary | `confirm_action(response_type="yes_no")`; không có `send` | v0 gọi `send` ngay; v3.6 dừng an toàn để chờ xác nhận | `transcripts/v3.6_openrouter_20260729T162548668202.transcript.json` |
| Direct Telegram send | `send(text=<full prior content>, confirmed=true)` → `status=sent`; agent dừng ngay | v3.7 loại bỏ vòng xác nhận lặp nhưng vẫn không gửi khi chưa có nội dung thật | `tests/test_telegram_send.py`; Telegram message ID 9 |
| Random Twitter discovery | `search_social_topic(query="random", random_mode=true, limit=4)` | v3.8 chạy ngay không hỏi account/topic; tool chỉ chọn trong danh sách chủ đề giới hạn | `transcripts/v3.8_openrouter_20260729T171034705856.transcript.json` |
| URL lỗi/không an toàn | `fetch(url=...)` → `status=blocked`, `skipped=true`, `fallback_allowed=false`; round cuối có 0 tool | v3.6 thêm guardrail code-level, không chỉ dựa vào prompt | `transcripts/v3.6_openrouter_20260729T162643268140.transcript.json` |
| Cùng scenario qua nhiều version | UI tab **Version Evolution** hiển thị request, expected/actual, pass/fail, run và artifact hash | Quan sát trực tiếp v0 70% → v1 95% → v2 80% → v3.5/v3.8 100% | `runs/v0_B_base_openrouter_20260729T143720380260.json`; `runs/v3.8_B_base_openrouter_20260729T171027579679.json` |

---

# PHẦN B — Chi tiết / Bằng chứng

Điều kiện metric cuối đều đạt: `provider_error_cases=0`, `measured_cases=total_cases`, và không có tool result error trong hai run v3.8 được report.

## B1. Version evidence

| Version | Prompt/tool change | Hypothesis | Metric | Before | After | Run File |
| --- | --- | --- | --- | ---: | ---: | --- |
| v0 | Baseline starter | Tool contract mơ hồ sẽ lộ lỗi routing, missing-info và safety | Case accuracy | — | 70% | `runs/v0_B_base_openrouter_20260729T143720380260.json` |
| v1 | Prompt: bắt buộc hỏi account/URL bị thiếu | Không đoán input sẽ sửa R10/R11 | Case accuracy | 70% | 95% | `runs/v1_B_base_openrouter_20260729T145004979406.json` |
| v2 | Prompt + tools: confirmation boundary; thêm `citation_audit`; 10 group cases | Tách research clarification khỏi xác nhận write | Case accuracy | 95% | 80% | `runs/v2_B_base_openrouter_20260729T150309049961.json` |
| v3 | Ordered decision contract cho intent, safety, scope và args | Thứ tự quyết định rõ sẽ sửa regression v2 | Case accuracy | 80% | 85% | `runs/v3_B_base_openrouter_20260729T151906741120.json` |
| v3.5 | Intent-aligned tool names, correction precedence, Twitter retry | Giảm replay source đã hủy và lỗi transient | Case accuracy | 95% | 100% | `runs/v3.5_B_base_openrouter_20260729T154428559680.json` |
| v3.6 | URL guardrail trong tool + agent loop + UI trace + regression tests | Thu hồi tool sau terminal skip sẽ cấm mọi fallback ngẫu nhiên | Case accuracy | 100% | 100% | `runs/v3.6_B_base_openrouter_20260729T162140563244.json` |
| v3.7 | Model-facing Telegram `send`, exactly-once action stop, bounded model output | Direct request có nội dung sẵn sẽ gửi ngay, không hỏi lần hai và không làm giảm routing | Case accuracy | 100% | 100% | `runs/v3.7_B_base_openrouter_20260729T165306646275.json` |
| v3.8 | Explicit random Twitter contract + bounded topic selection + regression tests | Random/ngẫu nhiên chạy ngay nhưng generic latest tweet vẫn hỏi account | Case accuracy | 100% | 100% | `runs/v3.8_B_base_openrouter_20260729T171027579679.json` |

Group v3.8: 10/10, case/routing/argument/multi-turn accuracy đều 100% tại `runs/v3.8_B_group_openrouter_20260729T170947338652.json`.

## B2. Failure analysis

| Case ID | Failure Type | Actual Tool Calls | What Failed | Fix |
| --- | --- | --- | --- | --- |
| v0/R10 | Missing info | `timeline(screenname="sama")` | Tự đoán account khi user chỉ yêu cầu tweet mới | Rule bắt buộc `ask_for_missing_info`; tool name/schema riêng |
| v0/R11 | Missing info | `fetch(url="https://example.com/article")` | Tự bịa URL | Cấm invent URL; URL vắng phải hỏi lại |
| v0/R12 | Wrong boundary | `send(...)` | Gửi trước khi xác nhận | Ẩn `send` khỏi model-facing tools; dùng `confirm_action(yes_no)` |
| v0/R14 | Out of scope | `send(text=<code>)` | Dùng send để trả lời coding ngoài scope | Decision order có scope gate trước tool routing |
| v2/R04 | Wrong tool | `clarify(yes_no)` | Đọc URL public bị hỏi xác nhận thừa | Ghi rõ read-only URL không cần confirmation |
| v2/M06 | Wrong tool | `social_search(OpenAI)` | Không tôn trọng turn sau chuyển Twitter sang web | Latest-intent/source-switch override; đổi tên thành `search_social_topic` |
| v3/R10 | Missing info | `social_search(query="")` | Gọi social search với query rỗng | `minLength: 1`, mô tả NEVER empty, tách `ask_for_missing_info` |

Manual review quan trọng: routing PASS không đủ để chứng minh tool chạy thật. Hai run cuối được scan toàn bộ `tool_results`; không có `error`. Guardrail URL lỗi được review riêng qua transcript, nơi lỗi chủ đích xuất hiện dưới trạng thái `blocked/skipped`, không phải success giả.

## B3. Team eval cases

| Case ID | What It Tests | Expected Tool/Behavior | Result |
| --- | --- | --- | --- |
| G01 | Bỏ `@`, giữ limit=7 | `timeline(ylecun, 7)` | PASS |
| G02 | News + month mapping | `lookup(AI safety, news, month)` | PASS |
| G03 | Audit dữ liệu đã có, không search | `citation_audit` | PASS |
| G04 | Thiếu hai comparison URL | `ask_for_missing_info(text)` | PASS |
| G05 | Marketing copy ngoài scope | No tool / refuse | PASS |
| G06 | Multi-turn topic → account | `timeline(demishassabis, 4)` | PASS |
| G07 | Carry correction topic + timeframe | `lookup(quantum computing, news, month)` | PASS |
| G08 | Approval draft không phải send confirmation | `confirm_action(yes_no)` | PASS |
| G09 | Multi-turn audit existing links | `citation_audit`, không live research | PASS |
| G10 | Cancel task và cấm tool | No tool / acknowledge cancellation | PASS |

Evidence: `data/eval_group.json` và `runs/v3.8_B_group_openrouter_20260729T170947338652.json`.

## B4. Live chat evidence

| Scenario/Turn | Version | Tool Calls + Args | Transcript/Run | Outcome |
| --- | --- | --- | --- | --- |
| Normal web research | v3.6 | `lookup(max_results=3, query="AI agents", timeframe="day", topic="news")` → `format` | `transcripts/v3.6_openrouter_20260729T162326402733.transcript.json` | Answered, 3 linked items |
| Missing account | v3.6 | `ask_for_missing_info(response_type="text")` | `transcripts/v3.6_openrouter_20260729T162421996909.transcript.json`, turn 1 | `waiting_for_user` |
| Fill account | v3.6 | `timeline(screenname="sama", limit=3)` | Same transcript, turn 2 | Answered with exactly 3 X posts; Twitter API retained |
| Sensitive action | v3.6 | `confirm_action(response_type="yes_no")` | `transcripts/v3.6_openrouter_20260729T162548668202.transcript.json` | Paused; no external send |
| Invalid/private article URL | v3.6 | `fetch(url="http://127.0.0.1:8501/missing-article")` | `transcripts/v3.6_openrouter_20260729T162643268140.transcript.json` | `guardrail_skipped`; final round had no tools; no fallback |
| Direct VetClaw send | v3.7 | `send(text=<full VetClaw summary>, confirmed=true)` | Source: `transcripts/v3.6_openrouter_20260729T164133985415.transcript.json` | Telegram API returned `sent`, one message, message ID 9 |
| Random Twitter request | v3.8 | `search_social_topic(query="random", random_mode=true, limit=4)` | `transcripts/v3.8_openrouter_20260729T171034705856.transcript.json` | Answered immediately with 4 live X posts and links; no clarification |

## B5. Tool capability evidence

| Category | Evidence File | What Worked | Risk / Guardrail |
| --- | --- | --- | --- |
| Must-have: `citation_audit` | `tools/citation_audit/tool.py`; `transcripts/v3.5_openrouter_20260729T160315142156.transcript.json` | Audit local citation metadata without live search | Không xác minh factual claim; chỉ kiểm tra metadata/link |
| Optional built-in: `papers` | `transcripts/v3.5_openrouter_20260729T160639254069.transcript.json` | Tìm paper transformer qua arXiv | Rate limit + network failure được report; không claim bonus |
| Optional built-in: `send` | `tools/send/tool.py`; `tests/test_telegram_send.py` | Gửi Telegram ngay sau direct request; tự chia message dài và dừng exactly once | Không log token; missing content/low-level unconfirmed call vẫn bị chặn |
| URL guardrail extension | `tests/test_url_guardrails.py`; v3.6 invalid-URL transcript | Chặn URL invalid/private, skip unreadable URL, thu hồi tool fallback | Không xóa hoặc vô hiệu hóa Twitter API; chỉ cấm fallback cho URL đang lỗi |
| Twitter random extension | `tests/test_social_random.py`; v3.8 live transcript | Nhận diện `random`/`ngẫu nhiên`, chọn topic giới hạn và gọi Twitter API ngay | Chỉ bật khi user nói rõ random; request generic vẫn hỏi account |
| Bonus tool thứ 4 trở đi | Không claim | Nhóm chỉ claim một tool mới bắt buộc | Không phóng đại optional starter tools thành tool mới |

## B6. Reflection

- `system_prompt.md` phù hợp cho decision order, latest-intent precedence, scope và policy “không fallback”.
- `tools.yaml` phù hợp cho ranh giới từng tool, required args, enum, missing-info và confirmation semantics ngay cạnh schema.
- URL lỗi cần guardrail code-level trong `fetch`/`paper_text` và `run_model_tool_loop`; prompt một mình không thể bảo đảm model không đổi route ở round sau.
- Tool execution errors cần review thủ công. Eval grader chủ yếu chấm selection/args nên một case PASS vẫn có thể có API error.
- Cải thiện tiếp theo: cache/dedupe formatter call, thêm DNS/rebinding defense nếu chuyển từ Firecrawl sang fetch trực tiếp, authentication/rate limit cho public demo và CI chạy regression tests.

## Final gate

- Provider preflight: PASS (`openai/gpt-4o-mini`, OpenRouter).
- Base eval v3.8: 20/20; provider errors 0; tool-result errors 0.
- Group eval v3.8: 10/10; provider errors 0; tool-result errors 0.
- URL + Telegram + Twitter random unit/regression tests: 11/11 PASS.
- UI health: HTTP 200 / `ok`; Streamlit hiển thị artifact v3.8 và System/Light/Dark.
- Live scenarios: đủ normal research, missing-info follow-up, sensitive confirmation, invalid-URL skip và direct Telegram send.
- Secrets: `.env` được git-ignore; không đưa raw key/token vào report, transcript hoặc model-visible UI.
