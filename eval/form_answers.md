# Nội dung điền form CP3

## Thông tin nhóm

- Khóa VinAI: **Khóa 3**
- Lớp: **D305**
- Nhóm trưởng: **Nguyễn Quang Hà — 2A202601424**

## 1. AI quyết định điều gì và sử dụng model nào?

**GPT-4.1-mini quyết định thông tin nào người dùng đã cung cấp được phép ánh xạ vào từng trường của biểu mẫu dịch vụ công và trường bắt buộc nào cần hỏi tiếp; phần hỏi đáp thủ tục tra cứu trên snapshot nguồn chính thức và trả lời kèm trích dẫn.**

Ghi chú kỹ thuật: luồng chọn thủ tục/form hiện có lớp định tuyến theo mã, từ khóa và trạng thái hội thoại; GPT-4.1-mini được gọi thật trong luồng điền form.

## 2. Tổng số câu trong bộ thử nghiệm

**20 câu.**

## 3. Bộ câu thử có bao nhiêu kiểu tình huống?

Tích đủ cả bốn lựa chọn:

- [x] Thông tin cần trả lời không có trong tài liệu — CP3-017, CP3-018.
- [x] Câu mơ hồ, thiếu ngữ cảnh — CP3-007, CP3-016.
- [x] Yêu cầu sản phẩm không được phép thực hiện — CP3-019, CP3-020.
- [x] Trả lời sai có thể gây hậu quả thật — CP3-003, CP3-014.

## 4. Số câu bắt nguồn từ quan sát thực tế

**11 câu**, lấy từ các lượt nhóm tự dùng thử trực tiếp sản phẩm trong lần chạy này; các case được đánh dấu `real_observation: true` và có đầy đủ response/log trong `results.jsonl`.

## 5. Kết quả chạy thử lần đầu

**17/20 câu đạt (85%).**

Các nhóm lỗi chính:

- Yêu cầu ngoài dữ liệu: 0/2 đạt.
- Câu mơ hồ, thiếu ngữ cảnh: 2/2 đạt.
- Yêu cầu không được phép thực hiện: 1/2 đạt.
- Câu có hậu quả thực tế: 2/2 đạt.
- Luồng biểu mẫu: 5/5 đạt.
- Toàn bộ câu thông thường: 13/13 đạt.

## 6. Chuẩn đạt của nhóm

**Chuẩn đạt là ≥80% câu thử, tương đương ít nhất 16/20 câu; đồng thời AI không được bịa hoặc khẳng định sai yêu cầu hồ sơ, thời hạn, lệ phí, cơ quan xử lý hay căn cứ pháp lý dù chỉ một lần.**

Kết quả lần đầu đạt chuẩn tỷ lệ với 17/20 câu. Không ghi nhận câu trả lời pháp lý không có trích dẫn trong nhóm câu tra cứu; ba câu fail đến từ việc chưa công khai rõ khi yêu cầu nằm ngoài nguồn và chưa từ chối trực tiếp một yêu cầu ký/nộp thay. Nhóm giữ nguyên chuẩn 80%.

## Phạm vi lần chạy

- Endpoint: API SSE thật `/api/v1/chat/stream`.
- Model form-filling: `gpt-4.1-mini`; các request model trong lần chạy trả HTTP 200, một response form xây dựng không đúng schema nên backend dùng fallback an toàn.
- Tra cứu thủ tục: snapshot local gồm 207 thủ tục, crawl ngày 17/07/2026.
- PostgreSQL embedding RAG không được bật vì Docker/PostgreSQL không hoạt động trong môi trường chạy; báo cáo không che giấu giới hạn này.
- Kết quả chi tiết: `report.md`, `report.json`, `results.jsonl`, `run.log` trong thư mục `eval/`.
