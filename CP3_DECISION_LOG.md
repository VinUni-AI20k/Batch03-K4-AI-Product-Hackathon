# Checkpoint 3 — Decision log và hướng dẫn triển khai

Ngày cập nhật: 2026-07-30
Phạm vi: VLearn Study Focus — trợ lý học tập theo đoạn bôi đen, vùng ảnh và yêu cầu tóm tắt slide.

> Tài liệu này ghi lại bằng chứng, các quyết định kỹ thuật, lý do và cách triển khai có thể kiểm chứng. Đây không phải bản ghi chain-of-thought nội bộ của AI.

## 1. Mục tiêu được kiểm tra

Sản phẩm cần hỗ trợ ba luồng chính:

1. Người học bôi đen một đoạn trong slide và hỏi về đúng đoạn đó.
2. Người học crop/chụp một vùng hình ảnh trong slide và hỏi VLM về vùng đó.
3. Người học yêu cầu tóm tắt toàn bộ slide theo đối tượng, trọng tâm và độ dài mong muốn.

Checkpoint 3 được xem xét theo các artifact có thể kiểm chứng trong repo:

- Ít nhất một lời gọi AI thật tại quyết định trung tâm.
- Golden set có ít nhất 20 case, gồm normal, hard và rare.
- Có output, trace và bảng đánh giá đủ mọi case.
- Quality bar đã chốt trước khi chạy: ít nhất 85%.
- Các trường hợp thiếu nguồn, mơ hồ và ngoài phạm vi không được bịa câu trả lời/citation.

## 2. Cách audit ban đầu

Audit không dựa vào mô tả trong README mà đối chiếu trực tiếp code, dữ liệu và artifact:

1. Đếm trang hai PDF thật bằng `pypdf`.
2. So sánh `golden_set`, output và report cũ theo từng case ID.
3. Tìm dấu hiệu mock, hardcode và request ID thật trong output/trace.
4. Kiểm tra frontend có chạy tới cuối hay dừng vì DOM element bị thiếu.
5. Kiểm tra API key có xuất hiện trong HTML/JavaScript hay Git history.
6. Chạy lại phép đếm evidence bằng script thay vì tin các số liệu đã viết sẵn.
7. Mở UI, tải PDF, thử summary và crop để đối chiếu hành vi runtime.

## 3. Các phát hiện quan trọng

### 3.1 Run 1 không phải bằng chứng AI thật

- 18/20 output chứa `[MOCK]`.
- Hai output còn lại đến từ guard/hardcode cục bộ.
- Report cũ ghi Gemini và 12/20 nhưng không khớp nội dung output.

Quyết định: giữ Run 1 để audit lịch sử, nhưng đánh dấu **không hợp lệ**; không sửa số cho đẹp và không dùng nó làm kết quả CP3.

### 3.2 Golden set cũ dùng sai nguồn

- Cả hai PDF hiện có đều chỉ có 29 trang.
- Golden cũ tham chiếu các trang như 37, 45, 67 nên citation không thể xác minh.
- Case ảnh cũ chỉ chứa mô tả text, không chứa pixel ảnh thật.

Quyết định: xây lại golden set từ PDF hiện có, giữ nguồn/adaptation từ chatlog khi có thể, và render bốn fixture ảnh thật từ PDF.

### 3.3 Frontend và credential có vấn đề

- JavaScript truy cập một số DOM ID không tồn tại nên app có thể dừng khi mở.
- API key từng được hardcode ở frontend.
- Mock có khả năng che lỗi provider nếu fallback im lặng.

Quyết định:

- Bổ sung DOM còn thiếu và dùng backend cùng origin.
- Chỉ đọc key ở server từ `.env`.
- Chỉ bật mock khi URL có `?mock=1`; lỗi AI thật phải hiện rõ.
- Xem key từng nằm trong Git history là đã lộ và yêu cầu con người revoke.

### 3.4 Evidence cũ không tái lập

Các con số evidence trước đó không khớp chatlog. Script `eval/audit_evidence.py` cho kết quả có thể chạy lại:

- 1.261 cặp hỏi–đáp.
- 582 câu trả lời không có citation trong field `citations`.
- 144 lượt có ý định summary; 69 có ngôn ngữ từ chối/không tìm thấy, 90 không citation.
- 14 lượt nhắc rõ crop/vùng chọn; 9 bị từ chối/không tìm thấy, 9 không citation.

Quyết định: dùng số liệu và regex công bố trong `eval/evidence_audit.md`; loại các số không tái lập khỏi spec.

## 4. Kiến trúc được chọn

### 4.1 Backend cùng origin

Frontend gọi `POST /api/agent`; `codebase/server.py` phục vụ cả static app và API.

Lý do:

- API key không đi qua trình duyệt.
- Tránh CORS và cấu hình endpoint rời rạc trong prototype.
- UI và eval có thể dùng cùng một pipeline `codebase/agent_core.py`.

### 4.2 Pipeline quyết định

`run_agent(payload)` thực hiện:

1. `classify`: phân loại `summary`, `selection`, `image`, `clarify`, `refuse` hoặc câu hỏi thường.
2. `document_pages` và `gather_evidence`: đọc PDF, kiểm số trang, chọn evidence.
3. `_provider_config`: chọn text model hoặc VLM theo intent.
4. `_call_model`: gửi prompt grounded và ảnh nếu có.
5. `_normalize_answer`: chuẩn hoá body, loại source sai trang và thay quote không khớp bằng excerpt thật.
6. `_trace`: ghi intent, model, request ID, latency, usage và các bước kiểm chứng.

### 4.3 Guardrail

- Trang không tồn tại: trả `clarify` cùng số trang thật.
- Crop nhỏ hơn 40×40: yêu cầu crop lại, không gọi model.
- Câu hỏi deadline/link nộp hoặc ngoài phạm vi: từ chối và hướng người dùng tới LMS/Discord.
- Câu trả lời `answered` không có source hợp lệ: hạ confidence và cảnh báo chưa xác minh citation.
- Quote do model sinh không khớp PDF: thay bằng excerpt trích trực tiếp từ trang tương ứng.

## 5. Triển khai ba luồng sản phẩm

### 5.1 Bôi đen

- Frontend theo dõi selection trong vùng đọc PDF.
- Khi hỏi, payload gửi `selected_text`, `document`, `page` và câu hỏi.
- Backend ưu tiên đoạn được chọn, sau đó bổ sung các trang liên quan theo query.

Mục tiêu: model không phải đoán “đoạn này” là đoạn nào.

### 5.2 Crop ảnh

- UI lấy pixel từ PDF canvas, không gửi mô tả giả lập.
- Payload gồm data URL, bounding box và trang hiện tại.
- Crop quá nhỏ được chặn cục bộ.
- Crop hợp lệ đi qua intent `image` và VLM.

VLM được cấu hình:

```env
OPENROUTER_API_KEY=...
VISION_BASE_URL=https://openrouter.ai/api/v1
VISION_MODEL=google/gemma-4-31b-it
```

Backend cũng cho phép `VISION_API_KEY` override nếu đổi provider. `.env` bị Git ignore và không được đưa vào commit.

### 5.3 Tóm tắt toàn bộ slide

- Summary dùng evidence của toàn bộ 29 trang.
- Khi câu hỏi chứa “tập trung/riêng về”, các trang khớp query được đặt vào vùng priority nhưng toàn deck vẫn được giữ.
- Summary mặc định tối đa 5 ý; nếu người dùng yêu cầu con số khác thì tôn trọng trong giới hạn schema 8 ý.
- Prompt yêu cầu bao phủ đầu, giữa và cuối deck để tránh dùng hết bullet cho một chủ đề.

## 6. Lựa chọn model

### Text

- Model: `deepseek-v4-flash`.
- Dùng cho selection, summary và câu hỏi text.

### Vision

- Provider: OpenRouter, OpenAI-compatible API.
- Model: `google/gemma-4-31b-it`.
- Dùng khi payload có ảnh crop hợp lệ.

Lý do tách provider theo intent: text model hiện hữu vẫn đủ cho các luồng text, còn Gemma 4 31B bổ sung khả năng hiểu pixel mà không buộc thay toàn bộ pipeline.

## 7. Thiết kế eval

Golden set cuối có 20 case:

- 8 normal.
- 8 hard: hai case cho mỗi nhóm source-of-truth, ambiguity, out-of-scope và domain-specificity.
- 4 rare.
- 15 case ghi nguồn hoặc adaptation từ chatlog.
- 4 fixture ảnh thật.

Pre-score kiểm:

- `kind` đúng.
- Khái niệm bắt buộc xuất hiện.
- Citation giao với trang kỳ vọng.
- Số item đáp ứng format.

Để tránh phạt câu tiếng Việt chỉ vì model dịch nhãn slide, runner công bố trước alias semantic như `metric ↔ measurement/chỉ số` và `compute ↔ chi phí tính toán`. Điểm exact-label vẫn được báo riêng để không che việc model làm rơi thuật ngữ gốc.

## 8. Các lượt chạy và bài học

| Run | Kết quả | Ý nghĩa |
|---|---:|---|
| 1 | Không hợp lệ | Chủ yếu là mock; không được dùng làm bằng chứng AI thật. |
| 2 | 16/20 = 80% | Text model và guard chạy thật; bốn case ảnh fail do chưa có vision credential. |
| 3 | 14/20 = 70% | Gemma đã được gọi thật nhưng lộ lỗi thuật ngữ, JSON và focused-summary. |
| 12 | 19/20 = 95% | Mã cuối; đủ 20 output/20 trace, bốn call Gemma có request ID, không API error. |

Những thay đổi phát sinh từ các lượt regression:

- Parser chấp nhận literal newline trong JSON string.
- Một retry có giới hạn khi JSON sai hoặc body rỗng; retry được ghi trong trace.
- Tăng output budget cho full-deck summary để giảm JSON bị cắt.
- Focused retrieval chỉ bật khi câu hỏi thật sự yêu cầu tập trung.
- Giới hạn summary theo yêu cầu người dùng.
- Ghi trace cả lỗi parse lẫn lỗi normalize.

Run 12 còn một FAIL: câu trả lời GS-17 đúng nội dung, có Agent và citation `[tr.23]`, nhưng runner chỉ nhận dạng `[trang 23]`. Không nới regex sau khi xem output để tránh làm đẹp số. Quality bar 85% vẫn đạt với 95%.

## 9. Kiểm chứng cuối

Các kiểm tra đã chạy:

```bash
node --check codebase/app.js
python3 -m py_compile codebase/agent_core.py codebase/server.py eval/run_eval.py
python3 eval/run_eval.py --run-id run_12_final
git diff --check
```

Đối chiếu artifact Run 12:

- 20 record trong `eval/actual_outputs_run_12_final.json`.
- 20 event trong `eval/agent_traces_run_12_final.jsonl`.
- 19/20 pass theo semantic, 18/20 pass theo exact-label.
- 4 intent `image` dùng `google/gemma-4-31b-it`, đều có request ID.
- 0 API error.
- 0 câu `answered` thiếu bước `verify_citations` với source hợp lệ.
- Secret scan working tree sạch; `.env` được ignore.

## 10. Việc agent đã làm và việc con người còn phải làm

### Agent đã làm

- Audit và bác bỏ bằng chứng mock/sai nguồn.
- Sửa frontend/backend và bảo vệ credential.
- Xây lại golden set, fixture ảnh và runner.
- Cấu hình OpenRouter Gemma 4 31B.
- Chạy regression và giữ trace/output thật.
- Cập nhật spec, README và báo cáo audit.

### Cần con người tương tác trực tiếp

1. Hai thành viên chấm độc lập ít nhất 5 case khó; ghi tên, chênh lệch và quyết định cuối.
2. Trên trình duyệt thật, bôi đen đoạn Attention trang 15, hỏi AI và kiểm citation.
3. Crop hình bác sĩ/bệnh viện trang 17, kiểm câu trả lời có MoE/chuyên gia/compute.
4. Chạy một yêu cầu summary có đối tượng và giới hạn bullet do người dùng nhập.
5. Revoke key cũ từng nằm trong Git history; chỉ rewrite history sau khi thống nhất cả nhóm.
6. Từng thành viên tự nộp checkpoint và chuẩn bị giải thích code, golden set, trace với TA.

## 11. File tham chiếu

- `spec.md`: đặc tả và quality bar.
- `CHECKPOINT_3_AUDIT.md`: kết luận tiến độ và checklist con người.
- `codebase/agent_core.py`: pipeline agent dùng chung cho UI/eval.
- `codebase/server.py`: HTTP server và API cùng origin.
- `codebase/app.js`: selection, crop và summary UI.
- `eval/golden_set.json`: 20 case.
- `eval/evaluation_run_12_final.md`: bảng kết quả cuối.
- `eval/actual_outputs_run_12_final.json`: output thật.
- `eval/agent_traces_run_12_final.jsonl`: trace thật.
- `eval/evidence_audit.md`: số liệu evidence tái lập.
