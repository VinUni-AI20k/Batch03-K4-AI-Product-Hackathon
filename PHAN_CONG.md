# Phân Công Chi Tiết

## Nhận Xét Về Chia Role Hiện Tại

Chia role hiện tại hợp lý: Đức nắm product architecture + AI engine, Phong nắm prompt/guardrail, Dũng nắm tools, Quang Anh nắm eval. Điểm cần bổ sung là rubric chấm rất nặng evidence, validation và demo, nên không nên để các phần này "rồi ai cũng làm". Đề xuất:

- Đức owner `spec.md`, product decision và demo story.
- Phong owner guardrail + risk scenarios, đồng owner validation script.
- Dũng owner data snapshot + retrieval, đồng owner evidence mining từ Discord.
- Quang Anh owner golden set + eval, đồng owner baseline benchmark với Discord Search.
- Cả nhóm phải tham gia thu evidence/validation vì cần người thật ngoài nhóm.

## Nguyễn Tuấn Đức - 2A202601380

Vai trò: Nhóm trưởng, Product Architect, AI Engine.

### Việc Cần Làm

1. Chốt lát cắt sản phẩm thành một câu:
   `Học viên [bối cảnh] cần tìm lại [loại nguồn] trên Discord; AI quyết định answer/clarify/abstain dựa trên nguồn whitelist; kết quả là học viên mở đúng post/thread có citation trong dưới X phút.`
2. Hoàn thiện `spec.md` các mục:
   - §1 User & Job.
   - §2 Impact & quyết định chọn.
   - §4 Thiết kế.
   - §8 Phân công & kế hoạch.
   - §9 Changelog.
3. Thiết kế architecture AI engine:
   - Input normalizer.
   - Intent classifier.
   - Retriever.
   - Evidence scorer.
   - Decision maker: answer/clarify/abstain.
   - Answer generator with citation.
   - Trace logger.
4. Chốt product non-goals:
   - Không làm bot Discord realtime trong MVP.
   - Không trả lời deadline/logistics nếu không có nguồn chính thức.
   - Không crawl toàn bộ Discord.
   - Không generate câu trả lời không có citation.
5. Chuẩn bị demo narrative:
   - 1 happy path.
   - 1 hard path: câu mơ hồ hoặc không đủ nguồn.
   - 1 câu trả lời vì sao chọn Conditional automation.

### Đầu Ra Cần Nộp

- `spec.md` bản chốt.
- `codebase/src/ARCHITECTURE.md` cập nhật.
- Demo script trong `demo-slides-outline.md`.
- Phần reflection cá nhân `reflection/nguyen-tuan-duc.md`.

## Nguyễn Việt Phong - 2A202601975

Vai trò: Prompt, Guardrail.

### Việc Cần Làm

1. Viết prompt cho các bước:
   - Classify intent: find_resource / summarize_thread / unclear / out_of_scope.
   - Decide: answer / clarify / abstain.
   - Generate answer: ngắn, có citation, tách nguồn chính thức và nguồn cộng đồng.
2. Định nghĩa guardrail:
   - Không trả lời nếu không có citation.
   - Nếu nguồn chính thức và cộng đồng mâu thuẫn, ưu tiên nguồn chính thức và nói rõ mâu thuẫn.
   - Nếu câu hỏi mơ hồ, chỉ hỏi lại một câu cần thiết nhất.
   - Nếu ngoài phạm vi, từ chối ngắn gọn và gợi ý cách tìm nguồn liên quan.
3. Viết §5 và §6 trong `spec.md`:
   - 4 lớp chỗ khó.
   - >=8 risk scenarios.
   - 4 đường đi trải nghiệm: happy, low-confidence, failure, correction.
4. Phối hợp với Quang Anh để biến risk scenarios thành testcase.
5. Phối hợp validation:
   - Viết 3 câu hỏi user test.
   - Ghi nhận quote về độ tin cậy của câu trả lời.

### Đầu Ra Cần Nộp

- Bảng prompt/guardrail trong `codebase/README.md` hoặc file riêng khi code bắt đầu.
- Mục §5-§6 trong `spec.md`.
- Các testcase guardrail thêm vào `eval/golden_set.csv`.
- Reflection `reflection/nguyen-viet-phong.md`.

## Lê Trọng Việt Dũng - 2A202601746

Vai trò: Tools, Data Pipeline.

### Việc Cần Làm

1. Tạo snapshot JSON từ các post/thread Discord được phép dùng:
   - `source_id`.
   - `channel`.
   - `source_type`: official / community.
   - `title`.
   - `content`.
   - `comments`.
   - `url`.
   - `created_at`.
   - `tags`.
2. Làm pipeline ingest:
   - Clean text.
   - Chunk post/thread nếu dài.
   - Gắn citation id.
   - Index keyword và semantic.
3. Làm retriever:
   - Keyword search.
   - Semantic search.
   - Merge/rerank top candidates.
   - Trả về top 3-5 nguồn kèm score.
4. Làm fallback khi LLM lỗi:
   - Hiện top bài liên quan.
   - Không generate câu trả lời.
5. Log trace:
   - Query.
   - Retrieved sources.
   - Decision.
   - Final answer.
   - Latency nếu có.
6. Đồng owner evidence mining:
   - Đếm số câu hỏi lặp/số lần học viên phải hỏi lại nếu có thể.
   - Ghi phương pháp đếm để đưa vào `spec.md` §1.

### Đầu Ra Cần Nộp

- `codebase/data/discord_snapshot_sample.json`.
- Retriever/tool code trong `codebase/src/`.
- Trace sample trong `codebase/traces/`.
- Evidence mining note nếu có.
- Reflection `reflection/le-trong-viet-dung.md`.

## Ngô Quang Anh - 2A202601106

Vai trò: Testcase, Evaluation.

### Việc Cần Làm

1. Thiết kế golden set >=20 case:
   - 8-10 case thường.
   - >=2 case cho mỗi lớp chỗ khó.
   - 2-4 case hiếm.
   - Mỗi case có expected decision: answer / clarify / abstain.
   - Nếu answer, có expected source/citation.
2. Định nghĩa quality dimensions:
   - Retrieval Hit@3.
   - Citation precision.
   - Decision accuracy.
   - Task completion proxy.
   - Answer groundedness.
3. Chốt quality bar trước hạn spec:
   - Task completion >=80%.
   - Retrieval Hit@3 >=80%.
   - Citation precision >=90%.
   - Answer/Clarify/Abstain accuracy >=80%.
4. Chạy eval tối thiểu 1 lượt đầy đủ:
   - Ghi kết quả từng case.
   - Không xóa case fail.
   - Tính % và so với quality bar.
5. Nếu kịp, đo baseline với Discord Search:
   - 5-10 task tìm nguồn.
   - Đo thời gian median.
   - So sánh với prototype.

### Đầu Ra Cần Nộp

- `eval/golden_set.csv`.
- `eval/rubric.md`.
- `eval/run_01_results.csv`.
- `eval/analysis.md`.
- Reflection `reflection/ngo-quang-anh.md`.

## Việc Cả Nhóm Cần Cùng Làm

1. Evidence:
   - Khảo sát >=20 người ngoài nhóm hoặc mining Discord có số đếm.
   - Lưu log câu hỏi + từng câu trả lời.
   - Giữ >=5 quote/vụ việc nguyên văn có nguồn.
2. Validation:
   - Mời tối thiểu 5 người ngoài nhóm test.
   - Mỗi phiên 10 phút.
   - Giao task thật, không gợi ý.
   - Ghi lại quan sát và quote nguyên văn.
3. Demo:
   - Mỗi thành viên nói ít nhất một phần.
   - Có live happy path và hard path.
   - Có % eval so với quality bar.

## Timeline Để Bám Checkpoint

| Mốc | Mục tiêu | Owner chính |
|---|---|---|
| CP1 | Canvas 7 dòng, lát cắt, willing users | Đức |
| CP2 | Flow prototype bấm/chạy được với data mẫu | Dũng + Đức |
| CP3 | AI call thật + golden set + eval lần 1 | Đức + Quang Anh |
| CP4 | Spec gần cuối, quality bar chốt | Đức + Phong + Quang Anh |
| CP5 | Validation >=5 người, changelog, dry run | Cả nhóm |
| CP6 | Demo 5 phút + Q&A | Cả nhóm |
