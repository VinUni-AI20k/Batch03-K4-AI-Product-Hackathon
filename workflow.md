# Workflow triển khai VLearn Learning Trace

## 1. Workflow là gì?

Workflow của Learning Trace biến lịch sử tương tác giữa học viên và VLearn Tutor thành kết quả ôn tập có cấu trúc.

```text
AI Tutor logs
    ↓
Data normalizer
    ↓
Lọc theo day_code và conversation
    ↓
Grounding với slide/transcript
    ↓
LLM Analyzer
    ↓
JSON Schema validator
    ↓
Guardrail kiểm tra citation
    ↓
Personalized Note + Mindmap
    ↓
Học viên xác nhận / đánh dấu xem lại
```

| Bước | Mục đích | Kết quả |
|---|---|---|
| AI Tutor logs | Dữ liệu hành vi học tập ban đầu | Lượt hỏi, câu trả lời, trang, ngày học |
| Data normalizer | Chuẩn hóa nhiều định dạng log | `TutorInteraction[]` |
| Lọc ngày/buổi | Không trộn dữ liệu giữa các buổi | Input đúng `day_code` và `conversation_id` |
| Grounding | Tìm slide/transcript hỗ trợ | Source chunks có `source_id` |
| LLM Analyzer | Gom chủ đề và nhận diện signal | Learning Trace JSON |
| JSON validator | Đảm bảo output đúng cấu trúc | JSON hợp lệ hoặc lỗi rõ ràng |
| Citation guardrail | Chặn claim không có căn cứ | Output đạt grounding |
| Note + Mindmap | Hiển thị cho người học | Hai view đồng bộ |

## 2. Trạng thái hiện tại

Đã hoàn thành:

- UI CP2, loading state và flow `Xem Learning Trace`.
- Personalized Note và Mindmap theo Day01/Day02/Day03.
- Xác nhận `Mình đã hiểu` và `Cần xem lại`.
- Mock data có TypeScript type.
- Survey summary và evidence trong `research/`.

Chưa hoàn thành:

- Data normalizer chạy thật.
- Lọc runtime theo `day_code`/`conversation_id`.
- Grounding runtime với slide/transcript.
- LLM Analyzer thật.
- JSON Schema validator và citation guardrail.
- Golden set/eval report và validation log CP5.

Hiện tại:

```text
mockLearningTrace → PersonalizedNote / KnowledgeMindmap
```

Mục tiêu CP3:

```text
POST /api/learning-trace → Learning Trace JSON → PersonalizedNote / KnowledgeMindmap
```

## 3. Contract phải chốt trước khi code

### Input contract

```ts
type LearningTraceInput = {
  learnerId: string;
  dayCode: string;
  conversationId: string;
  interactions: Array<{
    turnId: string;
    question: string;
    tutorAnswer: string;
    page?: string;
  }>;
  sources: Array<{
    sourceId: string;
    label: string;
    title: string;
    excerpt: string;
  }>;
};
```

### Output contract

```ts
type LearningTraceAnalysis = {
  dayCode: string;
  topics: Topic[];
  reviewItems: ReviewItem[];
  unassessableItems: UnassessableItem[];
  relationships: MindmapRelationship[];
  meta: {
    model: string;
    promptVersion: string;
    groundedOnly: boolean;
  };
};
```

Contract chính thức nằm tại:

```text
contracts/learning-trace-output.schema.json
```

Rules bắt buộc:

- Tutor log là signal hành vi, không phải nguồn kiến thức cuối cùng.
- Chỉ dùng slide/transcript được truyền vào để giải thích.
- Claim không có source phải bị loại hoặc chuyển thành `unassessable`.
- Không kết luận người học yếu, thất bại hoặc có “lỗ hổng” chắc chắn.
- Không tự sinh `turnId`, `sourceId`, slide number hoặc transcript ID.
- LLM trả JSON theo schema, không trả markdown tự do.

## 4. Phân công theo file

### Trần Đại Nghĩa — Product Lead & Core LLM Owner

Phụ trách chọn model, system prompt, signal policy và output contract.

```text
canvas.md
spec.md
workflow.md
prompts/learning-trace-system-v1.md
contracts/learning-trace-output.schema.json
src/lib/llm/model.ts
src/lib/llm/analyze-learning-trace.ts
```

Deliverable: model adapter, prompt v1, JSON contract, hàm `analyzeLearningTrace(input)` và chính sách chống hallucination/citation sai.

### Phó Hiếu Anh — Data & Evidence Owner

Phụ trách chuẩn hóa log và source manifest.

```text
research/
src/data/learning-trace-fixtures.ts
src/lib/trace/normalize.ts
src/lib/grounding/source-manifest.ts
```

Deliverable: fixture Day02, normalizer, filter theo ngày/conversation và ánh xạ slide/transcript.

### Nguyễn Xuân Đức — AI Evaluation Owner

Phụ trách signal taxonomy, golden set và quality bar.

```text
eval/golden-set.jsonl
eval/README.md
eval/runs/
```

Deliverable: tối thiểu 20 case, report lượt chạy, review prompt/schema và ghi nhận cả case fail.

### Trần Tuấn Anh — Backend & Integration Owner

Phụ trách API, gọi model theo contract và validation runtime.

```text
src/app/api/learning-trace/route.ts
src/lib/api/
src/lib/validation/json-schema.ts
src/lib/validation/citation-guard.ts
.env.example
```

Deliverable: `POST /api/learning-trace`, JSON validator, citation guardrail, error/timeout/API-key handling. Không tự sửa prompt hoặc output contract.

### Hoàng Trọng Đại — Frontend & Validation Owner

Phụ trách nối API vào UI và user test.

```text
src/components/
src/app/page.tsx
src/lib/ui/learning-trace-adapter.ts
validation/
```

Deliverable: API adapter, loading/error/empty state, Note/Mindmap đồng bộ và feedback log CP5.

## 5. Thứ tự thực hiện

### Phase 0 — Contract freeze

Trần Đại Nghĩa tạo input/output schema; Nguyễn Xuân Đức review. Chưa commit API trước khi contract được chốt.

### Phase 1 — Làm song song

- Phó Hiếu Anh: normalizer và source manifest.
- Trần Đại Nghĩa: model adapter và system prompt.
- Nguyễn Xuân Đức: golden set.
- Trần Tuấn Anh: khung API và validator.
- Hoàng Trọng Đại: giữ UI chạy bằng mock adapter.

### Phase 2 — Integration

Trần Tuấn Anh gọi `analyzeLearningTrace()`; Phó Hiếu Anh cung cấp fixture; Hoàng Trọng Đại nối response vào UI.

### Phase 3 — Evaluation

Nguyễn Xuân Đức chạy toàn bộ golden set. Mỗi case fail phải ghi input, output, nguyên nhân và owner sửa.

### Phase 4 — Validation

Hoàng Trọng Đại test với ít nhất 5 người ngoài nhóm. Trần Đại Nghĩa cập nhật spec/changelog theo feedback, không sửa số liệu để làm đẹp kết quả.

## 6. Git branch và quy tắc không conflict

### Branch

```text
main
feat/contract-llm-core
feat/data-normalizer
feat/golden-set-eval
feat/api-integration
feat/ui-api-adapter
```

### Quy tắc

1. Merge `feat/contract-llm-core` trước để khóa schema.
2. Các branch khác lấy code mới nhất từ `main` sau khi contract được merge.
3. Mỗi branch chỉ sửa file thuộc ownership của mình.
4. Không sửa cùng lúc `src/types/learning-trace.ts`, `src/components/LearningTraceApp.tsx` hoặc `package.json`.
5. Muốn đổi output phải cập nhật schema trước, sau đó sửa API/UI.
6. Pull request phải ghi file đã sửa, input mẫu, output mẫu và lệnh kiểm tra.
7. Trần Tuấn Anh merge integration; Trần Đại Nghĩa duyệt prompt/contract; Nguyễn Xuân Đức duyệt thay đổi ảnh hưởng eval.

### Commit convention

```text
feat(llm): add structured learning trace analyzer
feat(data): normalize tutor interactions by day
feat(eval): add low-confidence golden cases
feat(api): validate grounded trace response
feat(ui): connect learning trace API adapter
docs(workflow): define CP3 ownership and branch rules
```

## 7. Definition of done

### CP3

- `POST /api/learning-trace` chạy được với fixture Day02.
- Có ít nhất một lời gọi LLM thật.
- Output parse được theo JSON Schema hoặc trả lỗi rõ ràng.
- Topic/review item có evidence turn và source citation.
- Case thiếu nguồn trả `unassessable`, không bịa nội dung.
- UI hiển thị được output thật ở Note và Mindmap.
- Golden set có tối thiểu 20 case và report lượt chạy đầu.
- `npm run lint` và `npm run build` thành công.

### CP5

- Có feedback log từ ít nhất 5 người ngoài nhóm.
- Có quote nguyên văn và tên/vai theo quy định lớp.
- Có thay đổi từ feedback được ghi trong changelog.
- Có dry run demo dưới 5 phút.
- Mỗi thành viên giải thích được module mình sở hữu.

