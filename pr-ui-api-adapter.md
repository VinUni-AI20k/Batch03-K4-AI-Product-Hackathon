# feat(ui): connect learning trace API adapter (Phase 1)

## Bối cảnh

Phase 1 giao cho Frontend & Validation Owner: "giữ UI chạy bằng mock adapter"
trong lúc chờ contract chốt (Phase 0) và API thật (`POST /api/learning-trace`,
Phase 2) chưa có. PR này thêm lớp adapter + nối nó vào UI, thay cho việc UI
đọc thẳng mock data như trước.

## Đã làm

- **`src/lib/ui/learning-trace-adapter.ts` (mới)**
  - Định nghĩa tạm `LearningTraceAnalysis`, `AnalysisTopic`, `AnalysisReviewItem`,
    `AnalysisUnassessableItem`, `MindmapRelationship` — phản chiếu contract
    output ở workflow.md §3 (`dayCode/topics/reviewItems/unassessableItems/relationships/meta`).
    Đánh dấu rõ là **provisional**, chờ Trần Đại Nghĩa chốt
    `contracts/learning-trace-output.schema.json`.
  - `mapAnalysisToDay()` / `mapAnalysisToTrace()`: hàm thuần map output phân
    tích (per day) → `LearningDay` / `LearningTrace` mà UI đang render — tự
    resolve `sourceIds` thành label slide/transcript, gộp `unassessableItems`
    thành `unassessableNote`, suy `mindmapChild` từ `relationships`.
  - `fetchLearningTraceAnalysis()`: gọi thật `POST /api/learning-trace`, viết
    sẵn cho Phase 2, **chưa được gọi ở đâu** vì route đó chưa tồn tại.
  - `mockDay02Analysis` + `mockDay02Shell/Sources/InteractionCount`: fixture
    Day02 viết tay từ đúng dữ liệu trong `mock-learning-trace.ts`, dùng để
    chạy thử pipeline map trước khi có LLM/API thật.

- **`src/components/LearningTraceApp.tsx` (sửa)**
  - `AppPhase`: `"preview" | "analyzing" | "ready"` → thêm `"empty" | "error"`.
  - `trace` chuyển từ hằng số module-level sang `useState` (vì nội dung Day02
    giờ được adapter tính ra, không còn là object tĩnh).
  - `startAnalysis()`: bọc `mapAnalysisToDay(mockDay02Analysis, ...)` trong
    `try/catch` → cập nhật `trace` qua `setTrace`; tự chuyển sang `"empty"`
    nếu kết quả không có topic/review item nào, `"error"` nếu mapping ném lỗi.
  - Thêm 2 section UI mới cùng phong cách với section "analyzing" có sẵn:
    trạng thái lỗi (icon `AlertTriangle`, nút "Thử lại") và trạng thái rỗng
    (icon `Inbox`).

## Chưa làm (nằm ngoài scope PR này)

- Chưa nối `fetchLearningTraceAnalysis()` vào UI — chờ Trần Tuấn Anh có route
  `POST /api/learning-trace` chạy được (Phase 2).
- Chưa có `contracts/learning-trace-output.schema.json` chính thức — type
  trong adapter là suy đoán theo workflow.md §3, cần cập nhật lại khi
  Trần Đại Nghĩa chốt.
- Chỉ có fixture cho Day02; Day01/Day03 vẫn hiển thị mock gốc (chưa qua adapter).
- Chưa test click-through thật trên trình duyệt (môi trường hiện tại không
  có sẵn Playwright/chromium-cli). Đã verify bằng type-check, lint, build,
  và curl vào dev server — chưa xác nhận bằng screenshot tương tác thật.
- Chưa tạo `validation/` và feedback log (thuộc Phase 4/CP5, chưa tới lúc).

## Input mẫu

Fixture `mockDay02Analysis` (trong `learning-trace-adapter.ts`), ví dụ một topic:

```json
{
  "dayCode": "day-02",
  "topics": [
    {
      "id": "automation",
      "title": "Mức độ tự động hóa",
      "summary": "Chọn augment, conditional hay automate dựa trên hậu quả khi hệ thống đưa ra quyết định sai.",
      "sourceIds": ["day02-slide-18"]
    }
  ],
  "reviewItems": [ /* ... */ ],
  "unassessableItems": [ /* ... */ ],
  "relationships": [ /* ... */ ],
  "meta": { "model": "mock-fixture", "promptVersion": "v1", "groundedOnly": true }
}
```

## Output mẫu

`mapAnalysisToDay(mockDay02Analysis, { shell: mockDay02Shell, sources: mockDay02Sources, interactionCount: mockDay02InteractionCount })` trả về đúng shape `LearningDay` hiện tại, ví dụ topic ở trên map thành:

```json
{
  "id": "automation",
  "title": "Mức độ tự động hóa",
  "summary": "Chọn augment, conditional hay automate dựa trên hậu quả khi hệ thống đưa ra quyết định sai.",
  "slide": "Slide 18",
  "transcript": "Không có transcript tham chiếu",
  "learnedLabel": "Đã tìm hiểu",
  "mindmapChild": "Augment · Conditional · Automate"
}
```

## Lệnh kiểm tra

```bash
cd codebase
npx tsc --noEmit -p tsconfig.json   # pass, không lỗi
npm run lint                        # pass, không lỗi
npm run build                       # pass, build production thành công
npm run dev                         # curl http://localhost:3000 trả HTTP 200,
                                     # có text "Xem Learning Trace", không có
                                     # marker lỗi (__next_error__/Internal Server Error)
```
