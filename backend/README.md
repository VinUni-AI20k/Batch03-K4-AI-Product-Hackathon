# ĐềTài+ Profile Reader

Backend này là dịch vụ độc lập để đọc CV/portfolio và tạo `StudentProfile`. Dịch vụ
chạy ở cổng `8080`; recommendation backend hiện có vẫn chạy ở cổng `8001` và không
bị thay đổi.

## Cài đặt

Yêu cầu Python 3.11+ và Tesseract. Trên Ubuntu:

```bash
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-eng tesseract-ocr-vie
```

Cài môi trường Python từ thư mục gốc repository:

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
```

Không commit `.env` hoặc API key. Tesseract chỉ cần cho PDF scan và ảnh; PDF có
text dùng PyMuPDF, còn DOCX dùng `python-docx`.

## Chạy ứng dụng

Mở ba terminal từ thư mục gốc repository:

```bash
# Terminal 1: dịch vụ đọc hồ sơ
cd backend
.venv/bin/uvicorn app.main:app --reload --port 8080
```

```bash
# Terminal 2: recommendation backend hiện có
cd codebase/server
.venv/bin/uvicorn main:app --port 8001
```

```bash
# Terminal 3: frontend
python3 -m http.server 8000
```

Mở `http://localhost:8000/codebase/`. Frontend có thể cấu hình URL bằng
`window.DETAI_OCR_API_BASE`; mặc định là `http://localhost:8080`.

## API

Đọc một hồ sơ bằng xử lý cục bộ:

```bash
curl -X POST http://localhost:8080/api/ocr/parse \
  -F "file=@/duong-dan/portfolio.pdf;type=application/pdf" \
  -F "use_llm=false" \
  -F "language_hint=vie+eng" \
  -F "consent_external_processing=false"
```

Các endpoint:

- `POST /api/ocr/parse`: nhận PDF, DOCX, PNG, JPG hoặc JPEG, tối đa 5 MB và 10
  trang theo cấu hình mặc định.
- `GET /api/ocr/runs/{run_id}`: chỉ trả metadata và báo cáo đã sanitize.
- `DELETE /api/ocr/runs/{run_id}`: xóa runtime liên quan; không xóa event log hoặc
  báo cáo tổng hợp.
- `GET /health`: health check.

Kết quả luôn có `requires_user_confirmation=true`. Frontend không cho dùng hồ sơ
đã đọc cho đến khi người dùng xem, sửa và bấm xác nhận.

## Cấu hình

Xem [`.env.example`](.env.example). Các biến chính:

- `OCR_MAX_UPLOAD_MB`, `OCR_MAX_PAGES`, `OCR_LANGUAGES`
- `OCR_TEMP_TTL_SECONDS`
- `OCR_REPORT_DIR`, `OCR_LOG_FILE`, `OCR_RUNTIME_DIR`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `CORS_ALLOWED_ORIGINS`

`use_llm=false` là mặc định. Chỉ khi request đồng thời đặt `use_llm=true`,
`consent_external_processing=true` và server có `GEMINI_API_KEY`, bộ parser tùy
chọn mới gửi text đã redact PII tới Gemini. CV gốc và ảnh gốc không được gửi.

## Test

```bash
cd backend
.venv/bin/pytest -q
.venv/bin/python -m compileall -q app tests
```

Test tạo toàn bộ PDF, DOCX và ảnh giả trong bộ nhớ; không dùng CV thật.

## Log, báo cáo và runtime

- Event JSONL đã sanitize:
  `artifacts/ocr/logs/ocr-events.jsonl`
- Báo cáo Markdown đã sanitize:
  `artifacts/ocr/reports/ocr-report-YYYYMMDD-HHMMSS-<run-id-ngắn>.md`
- Tệp tạm:
  `runtime/ocr/{uploads,temp,runs}/`

Log chỉ dùng allowlist metadata như SHA-256, MIME, kích thước, số trang, confidence,
số lượng PII và warning code. Log và báo cáo không chứa raw CV, toàn bộ OCR text,
tên file gốc, email, số điện thoại hoặc secret. Runtime được xóa ngay sau mỗi run;
TTL dọn phần còn sót khi service khởi tạo pipeline.

## Chính sách bảo mật

- Tài liệu được coi là dữ liệu không tin cậy; câu lệnh bên trong tài liệu không
  được thực thi.
- PII được redact trước structured parsing và trước khi ghi báo cáo.
- Evidence có giới hạn độ dài và assertion confidence cao bắt buộc có evidence.
- Không suy luận năng lực từ tuổi, giới tính, địa chỉ, ảnh hoặc danh tiếng trường.
- Không lưu CV thật hay raw OCR output trong repository.

## Hạn chế hiện tại

- Gemini Vision fallback đang cố ý đóng: OCR cục bộ có thể bỏ sót PII trong ảnh,
  nên chưa thể chứng minh ảnh gửi ra ngoài đã được che an toàn.
- Registry của `GET /runs/{run_id}` nằm trong bộ nhớ. Metadata này mất khi restart
  và không dùng chung giữa nhiều worker; báo cáo/log trên đĩa vẫn còn.
- Rule parser chỉ nhận diện một danh sách kỹ năng/công cụ phổ biến. Người dùng cần
  sửa các trường bị thiếu trong form xác nhận.
- Muốn OCR ảnh/PDF scan, máy chạy service phải cài binary Tesseract và language
  pack tương ứng.
