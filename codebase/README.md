# ĐềTài+ — prototype

Prototype cho luồng **“Agent hỗ trợ học viên lựa chọn đề tài dựa trên hồ sơ và hội thoại”**. Recommendation engine retrieval ứng viên từ toàn bộ catalogue, sau đó model AI quyết định top 3, lý do phù hợp và cảnh báo rủi ro. Tin nhắn mới trong chat cập nhật preference và kích hoạt xếp hạng lại.

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
3. Xem ba đề tài được model xếp hạng từ `../mock-data.json`.
4. Chuyển sang **Kho đề tài** để tìm kiếm, lọc lĩnh vực/quy mô nhóm và sắp xếp toàn bộ dữ liệu.
5. Bấm bất kỳ đề tài nào để xem lý do phù hợp và hướng dẫn setup bốn bước.
6. Nhập preference mới trong chat, ví dụ “ưu tiên scope nhỏ, dùng React, không dùng machine learning”, để model xếp hạng lại.
7. Chọn **Góp ý đề tài** để gửi một đề xuất mới trong phiên demo.

## Cài đặt giao diện

- Nút **Giao diện** ở thanh trên cùng và **Cài đặt giao diện** ở thanh bên mở bảng cá nhân hóa.
- Có ba chế độ màu: theo thiết bị, sáng và tối.
- Mặc định dùng **Be Vietnam Pro** để hiển thị dấu tiếng Việt rõ ràng; người dùng vẫn có thể chọn phông hệ thống.
- Tùy chọn giảm chuyển động hỗ trợ người dùng nhạy cảm với hiệu ứng.
- Các lựa chọn chỉ được lưu trong `localStorage` của trình duyệt, không gửi ra ngoài.

## Phần chạy thật vs. phần mô phỏng

- **AI thật**: quyết định trung tâm — xếp hạng tối đa 3 đề tài + sinh lý do/cảnh báo rủi ro — gọi model qua `codebase/server/main.py` (`POST /recommend`).
- **Retrieval cá nhân hóa**: trước lời gọi model, backend tìm trong toàn bộ catalogue bằng lĩnh vực, kỹ năng, chuyên ngành, kinh nghiệm, dự án đã làm, quy mô nhóm và preference mới nhất trong chat. Không còn lấy 15 đề tài đầu tiên theo thứ tự file.
- **Chat thật**: tin nhắn tự do sau khi có hồ sơ được gửi tới `/recommend`; model nhận lịch sử preference gần nhất và trả ranking mới. Các lệnh UI rõ ràng như “hướng dẫn bắt đầu” vẫn mở drawer cục bộ.
- **Đọc hồ sơ thật, local-first**: `POST /api/ocr/parse` ở `backend/` kiểm tra
  signature/MIME, đọc PDF/DOCX, OCR ảnh bằng Tesseract, redact PII và trả form có
  evidence để người dùng sửa/xác nhận. Chỉ các tín hiệu đã xác nhận như kỹ năng,
  interest, dự án và mức kinh nghiệm được dùng để gợi ý; tên và CV gốc không gửi
  tới recommendation model. Xem [`backend/README.md`](../backend/README.md).
- **Không dùng phần trăm giả**: model trả ranking, lý do và `confidence=high|low`;
  UI hiển thị nhãn `AI`. Điểm rule nội bộ chỉ dùng để sắp xếp Kho đề tài/fallback,
  không được trình bày như xác suất phù hợp.
- **Log hạn chế dữ liệu**: `codebase/server/logs/recommend_calls.jsonl` chỉ ghi tóm
  tắt số lượng tín hiệu, candidate code, output model và latency; không ghi raw CV,
  tên người dùng hoặc toàn bộ nội dung hồ sơ.
- **Mô phỏng còn lại**:
  - Nút **Dùng hồ sơ mẫu** vẫn điền dữ liệu giả, không gọi OCR.
  - Nếu backend AI không phản hồi (lỗi mạng, thiếu key), UI rơi về xếp hạng dự phòng và **nói rõ trong chat** đây không phải kết quả model.
  - Form đề xuất đề tài chỉ tồn tại trong bộ nhớ phiên trình duyệt.
  - Nếu không tải được `mock-data.json`, giao diện dùng bốn đề tài fallback để flow vẫn bấm được đến cuối.
