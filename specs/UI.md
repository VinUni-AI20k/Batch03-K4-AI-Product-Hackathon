# StudyPulse UI — Tài liệu kết nối Backend

## 1. Mục đích

Tài liệu này mô tả ngắn gọn frontend StudyPulse và hợp đồng dữ liệu đề xuất để kết nối với backend.

- Source frontend: `codebase/FE`
- Công nghệ: Vite, React, Tailwind CSS CDN
- Trạng thái hiện tại: toàn bộ dữ liệu và thao tác với dịch vụ ngoài đang được mock
- Backend hiện có: workflow LangGraph trong `codebase/studypulse`

Frontend không nên gọi trực tiếp Gmail, Discord hay Google Calendar. Các quyền truy cập và thao tác với nền tảng ngoài phải đi qua backend.

## 2. Bố cục và chức năng

### Desktop

Màn hình chia thành hai vùng:

- Chat bên trái, khoảng 40% chiều rộng.
- Dashboard bên phải, khoảng 60% chiều rộng.

### Mobile

Hai vùng được tách thành tab:

- `Tổng quan`
- `Trợ lý AI`

### Chức năng hiện có

1. Chat với trợ lý StudyPulse.
2. Hiển thị timeline lịch học, deadline và thông báo.
3. Lọc theo mail quan trọng, Discord, lịch hôm nay và deadline tuần.
4. Tìm kiếm thông báo theo tiêu đề, môn học hoặc nguồn.
5. Hiển thị độ tin cậy và cảnh báo kết quả cần kiểm tra.
6. Chỉnh sửa thời gian AI đã trích xuất.
7. Đánh dấu kết quả sai.
8. Xác nhận thêm sự kiện vào Google Calendar.
9. Hiển thị và quản lý trạng thái kết nối Gmail, Outlook, Discord, Zalo.

## 3. Dữ liệu mock hiện tại

Dữ liệu mock nằm tại:

```text
codebase/FE/src/data.js
```

Các state chính trong `App.jsx`:

| State | Mục đích | Nguồn backend tương lai |
|---|---|---|
| `messages` | Lịch sử chat | `ChatResponse` |
| `events` | Timeline học tập | `ExtractedItem[]` |
| `platforms` | Trạng thái kết nối | API integrations |
| `activeAction` | Bộ lọc đang chọn | Chỉ xử lý ở frontend hoặc query params |
| `editingEvent` | Sự kiện đang được sửa | `ExtractedItem` |
| `toast` | Phản hồi thao tác ngắn | Kết quả API |

Khi nối backend, nên giữ state UI riêng và chuyển toàn bộ truy cập mạng vào thư mục:

```text
codebase/FE/src/api/
```

Gợi ý:

```text
src/api/client.js
src/api/chat.js
src/api/timeline.js
src/api/integrations.js
```

## 4. Mapping schema Backend → UI

Backend đã định nghĩa `ExtractedItem` trong `codebase/studypulse/state.py`.

| Backend `ExtractedItem` | UI hiện tại | Ghi chú |
|---|---|---|
| `id` | `event.id` | Dùng UUID dạng chuỗi |
| `category` | `event.type` | Map theo bảng bên dưới |
| `title` | `event.title` | Bắt buộc |
| `description` | `event.detail` | Có thể rỗng |
| `due_date` | `event.date` | Backend trả ISO 8601, FE format tiếng Việt |
| `due_time` | `event.time` | Định dạng `HH:mm` |
| `source_platform` | `event.source` | FE format tên hiển thị |
| `priority` | `event.priority` | FE format nhãn tiếng Việt |
| `confidence_score` | `event.confidence` | Backend dùng `0..1`, FE hiển thị `%` |
| `requires_clarification` | `event.verified` | `true` tương ứng chưa xác minh |
| `conflict_detected` | trạng thái cảnh báo | Hiện cảnh báo xung đột nguồn |
| `conflicting_sources` | danh sách nguồn | Hiện toàn bộ nguồn, không tự chọn |
| `source_message_id` | link nguồn | Cần thêm `source_url` hoặc endpoint redirect |
| `raw_snippet` | phần đối chiếu nguồn | Không hiển thị dữ liệu nhạy cảm |

### Mapping category

| Backend | UI |
|---|---|
| `deadline` | `deadline` |
| `assignment` | `deadline` |
| `schedule` | `class` |
| `exam` | `class` hoặc loại riêng trong tương lai |
| `announcement` | `announcement` |
| `other` | `review` |

### Mapping priority

| Backend | Nhãn UI |
|---|---|
| `critical` | Khẩn cấp |
| `high` | Sắp tới |
| `medium` | Bình thường |
| `low` | Ưu tiên thấp |

### Quy tắc độ tin cậy

- `confidence_score >= 0.85` và không cần làm rõ: cho phép hiển thị như kết quả đã xác minh.
- `confidence_score < 0.85`: hiển thị trạng thái `Cần kiểm tra`.
- `requires_clarification = true`: yêu cầu người dùng xác nhận.
- `conflict_detected = true`: hiển thị tất cả nguồn xung đột; không tự chọn một kết quả.

## 5. API contract đề xuất

Prefix đề xuất:

```text
/api/v1
```

Tất cả response JSON nên có cấu trúc chung:

```json
{
  "data": {},
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00"
  }
}
```

Khi lỗi:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": {}
  },
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00"
  }
}
```

### 5.1 Lấy timeline

```http
GET /api/v1/timeline?source=discord&category=deadline&from=2026-07-30&to=2026-08-06
```

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "item_uuid",
        "timestamp": "2026-07-30T08:30:00+07:00",
        "source_platform": "gmail",
        "source_message_id": "gmail_message_id",
        "source_channel": "inbox",
        "source_url": "https://example.invalid/source/item_uuid",
        "category": "deadline",
        "title": "Nộp AI Spec — bản hoàn chỉnh",
        "description": "Nộp spec.md theo template.",
        "due_date": "2026-07-30",
        "due_time": "23:59",
        "time_unspecified": false,
        "priority": "critical",
        "confidence_score": 0.98,
        "requires_clarification": false,
        "conflict_detected": false,
        "conflicting_sources": [],
        "raw_snippet": "Hạn nộp bản AI Spec...",
        "language_detected": "vi"
      }
    ],
    "total": 1
  },
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00"
  }
}
```

Frontend format `due_date` và `due_time` để hiển thị; không yêu cầu backend trả các chuỗi như `Hôm nay` hoặc `Ngày mai`.

### 5.2 Gửi câu hỏi chat

```http
POST /api/v1/chat
Content-Type: application/json
```

Request:

```json
{
  "user_query": "Tuần này tôi còn deadline nào?",
  "language": "vi",
  "conversation_id": "conversation_uuid"
}
```

Response nên bám theo model `ChatResponse`:

```json
{
  "data": {
    "query_id": "query_uuid",
    "conversation_id": "conversation_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00",
    "language": "vi",
    "intent": "query_deadline",
    "response_text": "Bạn còn 2 deadline trong tuần này.",
    "sources_cited": [
      {
        "label": "Email gốc",
        "url": "https://example.invalid/source/item_uuid"
      }
    ],
    "timeline_items_referenced": ["item_uuid"],
    "confidence": 0.94,
    "requires_clarification": false,
    "suggested_actions": ["Mở deadline gần nhất"]
  },
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00"
  }
}
```

Giai đoạn đầu có thể dùng HTTP request thông thường. Nếu backend sinh phản hồi lâu hoặc streaming token, có thể bổ sung SSE:

```text
POST /api/v1/chat/stream
Content-Type: text/event-stream
```

### 5.3 Chỉnh sửa sự kiện

```http
PATCH /api/v1/timeline/{item_id}
Content-Type: application/json
```

Request:

```json
{
  "due_date": "2026-07-31",
  "due_time": "09:00",
  "correction_reason": "AI đọc nhầm 9PM thành 9AM"
}
```

Backend cần:

1. Cập nhật bản ghi.
2. Lưu correction log.
3. Trả về item sau khi cập nhật.
4. Không tự dùng correction của một người để sửa dữ liệu người khác.

### 5.4 Đánh dấu kết quả sai

```http
POST /api/v1/timeline/{item_id}/feedback
Content-Type: application/json
```

Request:

```json
{
  "feedback_type": "incorrect",
  "note": "Thông báo này không phải deadline",
  "client_timestamp": "2026-07-30T15:10:00+07:00"
}
```

Response:

```json
{
  "data": {
    "status": "queued_for_review",
    "item_id": "item_uuid"
  },
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:10:01+07:00"
  }
}
```

Không nên xóa cứng item ngay. Backend chuyển item sang trạng thái ẩn hoặc chờ TA kiểm tra để có thể hoàn tác.

### 5.5 Xác nhận item có độ tin cậy thấp

```http
POST /api/v1/timeline/{item_id}/confirm
Content-Type: application/json
```

Request:

```json
{
  "confirmed": true,
  "due_date": "2026-08-03",
  "due_time": "14:00"
}
```

Backend trả item đã xác nhận với:

```json
{
  "requires_clarification": false,
  "review_status": "user_confirmed"
}
```

### 5.6 Thêm vào Google Calendar

```http
POST /api/v1/timeline/{item_id}/calendar
Content-Type: application/json
```

Request:

```json
{
  "calendar_provider": "google",
  "timezone": "Asia/Bangkok"
}
```

Response:

```json
{
  "data": {
    "calendar_event_id": "calendar_event_id",
    "calendar_url": "https://calendar.google.com/calendar/event?eid=...",
    "status": "created"
  },
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:12:00+07:00"
  }
}
```

Frontend chỉ gọi endpoint sau khi người dùng bấm xác nhận. Backend không tự thêm lịch ngay sau khi AI trích xuất.

### 5.7 Trạng thái kết nối nền tảng

```http
GET /api/v1/integrations
```

Response:

```json
{
  "data": {
    "items": [
      {
        "provider": "gmail",
        "connected": true,
        "status": "active",
        "scopes": ["mail.readonly"],
        "last_sync_at": "2026-07-30T15:00:00+07:00",
        "error_code": null
      },
      {
        "provider": "discord",
        "connected": false,
        "status": "token_expired",
        "scopes": [],
        "last_sync_at": null,
        "error_code": "TOKEN_EXPIRED"
      }
    ]
  },
  "error": null,
  "meta": {
    "request_id": "req_uuid",
    "timestamp": "2026-07-30T15:00:00+07:00"
  }
}
```

Khởi tạo kết nối:

```http
POST /api/v1/integrations/{provider}/connect
```

Backend trả URL OAuth:

```json
{
  "data": {
    "authorization_url": "https://provider.example/oauth/authorize...",
    "expires_at": "2026-07-30T15:10:00+07:00"
  }
}
```

Frontend chuyển hướng người dùng đến `authorization_url`.

Ngắt kết nối:

```http
DELETE /api/v1/integrations/{provider}
```

## 6. Trạng thái UI khi gọi API

Mỗi thao tác cần hỗ trợ các trạng thái:

| Trạng thái | Hành vi UI |
|---|---|
| Idle | Hiển thị dữ liệu hiện tại |
| Loading | Skeleton cho timeline; spinner trong nút thao tác |
| Success | Cập nhật dữ liệu và hiện toast |
| Empty | Thông báo không có kết quả, không coi là lỗi |
| Recoverable error | Giữ dữ liệu cũ, hiện thông báo và nút thử lại |
| Authentication error | Yêu cầu kết nối hoặc cấp lại quyền |
| Low confidence | Cảnh báo màu vàng và nút xác nhận |
| Conflict | Hiện mọi nguồn xung đột, yêu cầu người dùng/TA quyết định |

Trong lúc gửi chat:

1. Thêm tin nhắn người dùng vào danh sách.
2. Hiển thị bubble `StudyPulse đang xử lý...`.
3. Khóa gửi lặp cùng một request.
4. Khi có response, thay bubble loading bằng nội dung thật.
5. Auto-scroll xuống phản hồi mới.
6. Nếu lỗi, giữ nguyên câu hỏi và cho phép thử lại.

## 7. Xác thực và bảo mật

- Ưu tiên session cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Không lưu access token Gmail, Discord hoặc Calendar trong React/localStorage.
- Không đưa raw email/chat nhạy cảm vào URL hoặc client log.
- Backend phải kiểm tra quyền sở hữu `item_id` trên mọi endpoint.
- `source_url` nên là URL redirect được backend kiểm soát hoặc deep link đã được xác thực.
- Backend chịu trách nhiệm mask PII trước khi trả dữ liệu cho frontend.
- Nếu PII masking thất bại, backend phải chặn response thay vì trả nội dung thô.
- CORS chỉ cho phép origin của frontend ở môi trường tương ứng.

## 8. Cấu hình môi trường Frontend

Khi có backend, bổ sung:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Không đưa secret vào biến `VITE_*`, vì các biến này được đóng gói vào JavaScript phía trình duyệt.

Ví dụ client:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTimeline(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/timeline?${query}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Không thể tải timeline");
  }

  return response.json();
}
```

## 9. Các bước thay mock bằng Backend

1. Thêm `VITE_API_BASE_URL`.
2. Tạo API client dùng chung và chuẩn hóa lỗi.
3. Thay `initialEvents` bằng `GET /timeline`.
4. Thay phản hồi chat hard-code bằng `POST /chat`.
5. Nối modal chỉnh sửa với `PATCH /timeline/{id}`.
6. Nối `Đánh dấu sai` với endpoint feedback.
7. Nối `Thêm vào lịch` với endpoint Calendar.
8. Thay `initialPlatforms` bằng `GET /integrations`.
9. Bổ sung OAuth redirect/callback cho từng provider.
10. Thêm loading, retry, unauthorized và optimistic update phù hợp.
11. Chỉ xóa `src/data.js` sau khi mọi luồng demo đã có API hoặc fallback rõ ràng.

## 10. Điểm cần Backend thống nhất trước khi tích hợp

- Cơ chế xác thực người dùng.
- URL frontend/backend cho local, staging và production.
- Quy ước response/error chung.
- Pagination cho timeline.
- Trường `source_url` hoặc endpoint mở nguồn gốc.
- Trạng thái review/HITL của một item.
- Có dùng SSE cho chat hay chỉ HTTP.
- Quy tắc múi giờ; đề xuất backend lưu ISO 8601 và FE hiển thị theo `Asia/Bangkok`.
- Chính sách correction log và hoàn tác.
- OAuth callback và scope tối thiểu cho từng nền tảng.

