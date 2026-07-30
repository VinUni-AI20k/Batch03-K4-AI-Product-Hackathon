# ĐềTài+ — prototype

Prototype cho luồng **“Agent hỗ trợ học viên lựa chọn đề tài dựa trên sở thích và kỹ năng”**. Từ CP3, quyết định xếp hạng + lý do phù hợp được gọi thật qua model AI (`codebase/server/`) — không còn hardcode.

## Chạy demo

**1. Backend AI** (bắt buộc để có kết quả AI thật; không chạy thì UI tự rơi về fallback rule-based có ghi rõ):

```bash
cd codebase/server
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # điền OPENROUTER_API_KEY, KHÔNG commit .env
uvicorn main:app --port 8001
```

**2. Frontend** — từ thư mục gốc của repository:

```bash
python3 -m http.server 8000
```

Mở:

```text
http://localhost:8000/codebase/
```

## Luồng có thể trình diễn

1. Hoàn tất popup ba bước: hồ sơ, sở thích/kỹ năng và cách thực hiện.
2. Có thể chọn **Dùng hồ sơ mẫu** hoặc tải PDF/DOCX/PNG/JPG để agent đọc thật qua
   service OCR cục bộ ở cổng `8080`.
3. Xem ba đề tài được xếp hạng từ `../mock-data.json`.
4. Chuyển sang **Kho đề tài** để tìm kiếm, lọc lĩnh vực/quy mô nhóm và sắp xếp toàn bộ dữ liệu.
5. Bấm bất kỳ đề tài nào để xem lý do phù hợp và hướng dẫn setup bốn bước.
6. Chọn **Góp ý đề tài** để gửi một đề xuất mới trong phiên demo.

## Cài đặt giao diện

- Nút **Giao diện** ở thanh trên cùng và **Cài đặt giao diện** ở thanh bên mở bảng cá nhân hóa.
- Có ba chế độ màu: theo thiết bị, sáng và tối.
- Mặc định dùng **Be Vietnam Pro** để hiển thị dấu tiếng Việt rõ ràng; người dùng vẫn có thể chọn phông hệ thống.
- Tùy chọn giảm chuyển động hỗ trợ người dùng nhạy cảm với hiệu ứng.
- Các lựa chọn chỉ được lưu trong `localStorage` của trình duyệt, không gửi ra ngoài.

## Phần chạy thật vs. phần mô phỏng

- **AI thật**: quyết định trung tâm — xếp hạng 3 đề tài + sinh lý do/cảnh báo rủi ro — gọi model qua `codebase/server/main.py` (`POST /recommend`), log đầy đủ request/response/latency vào `codebase/server/logs/recommend_calls.jsonl` (không commit, xem `.gitignore`).
- **Đọc hồ sơ thật, local-first**: `POST /api/ocr/parse` ở `backend/` kiểm tra
  signature/MIME, đọc PDF/DOCX, OCR ảnh bằng Tesseract, redact PII và trả form có
  evidence để người dùng sửa/xác nhận. Xem [`backend/README.md`](../backend/README.md).
- **Mô phỏng còn lại**:
  - Nút **Dùng hồ sơ mẫu** vẫn điền dữ liệu giả, không gọi OCR.
  - Điểm số `%` trong Kho đề tài (catalog search) vẫn dùng quy tắc cố định (`scoreCatalogProject`) — chỉ luồng advisor 3 bước gọi AI.
  - Nếu backend AI không phản hồi (lỗi mạng, thiếu key), UI tự rơi về xếp hạng quy tắc cố định và **nói rõ trong chat** đây là fallback, không giả vờ là kết quả AI.
  - Form đề xuất đề tài chỉ tồn tại trong bộ nhớ phiên trình duyệt.
  - Nếu không tải được `mock-data.json`, giao diện dùng bốn đề tài fallback để flow vẫn bấm được đến cuối.
