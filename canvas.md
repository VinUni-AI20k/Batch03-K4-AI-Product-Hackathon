# CP1 CANVAS — VLEARN STUDY FOCUS

**Nhóm LPV**

## 1. Chiến tuyến

**Hướng A — Tối ưu VLearn AI Tutor**

Cải thiện khả năng hỗ trợ học viên hiểu và ôn lại nội dung bài giảng
từ slide và transcript có sẵn trên VLearn.

---

## 2. AI đang làm việc này — một vai cụ thể

**Học viên đang đọc hoặc ôn lại một buổi học trên VLearn**, cần:

- Nắm nhanh những kiến thức quan trọng của toàn bài; hoặc
- Hiểu một bảng, biểu đồ, sơ đồ hay vùng cụ thể trên slide.

---

## 3. Họ vướng gì — ai, đang làm gì, vướng đâu, hậu quả gì

Khi học viên muốn ôn nhanh toàn bài hoặc hỏi về một vùng hình ảnh trên
slide, nhiều lượt trả lời của tutor không xác định được đúng phạm vi cần
đọc, không nhìn được quan hệ thị giác hoặc trả lời mà không chỉ rõ căn cứ.

Học viên bị đẩy sang việc tự bổ sung ngữ cảnh từ slide hoặc hỏi lại để
có câu trả lời dùng được. Rủi ro sản phẩm là học viên mất mạch ôn bài,
ghi nhớ sai kiến thức nếu tin vào câu trả lời thiếu căn cứ, và giảm niềm
tin vào tutor.

---

## 4. 1–2 bằng chứng đầu tiên

Mining sơ bộ trên **1.261 cặp hỏi–đáp** trong chatlog VLearn.
Rule đếm hiện tại:

- **Ý định tóm tắt:** câu hỏi chứa `tóm tắt`, `tóm gọn`, `summary`,
  `nội dung chính`, `cần note`, hoặc `cần học`.
- **Thất bại/từ chối:** câu trả lời chứa `không tìm thấy`, `không thể`,
  `rất tiếc`, `xin lỗi`, hoặc `không đủ thông tin`.

1. **582/1.261 câu trả lời của tutor không có citation** trong field
   `citations`.

2. Với rule trên, chỉ xét câu hỏi thực tế của học viên:
   - Có **134 lượt mang ý định tóm tắt/ôn ý chính**;
   - **86/134 lượt rơi vào nhóm thất bại/từ chối**;
   - **88/134 lượt không có citation**;
   - Có **68 lượt** câu hỏi về hình, bảng, biểu đồ, sơ đồ, vùng khoanh
     hoặc nhánh màu mà câu trả lời rơi vào nhóm thất bại/từ chối.

Một số turn minh hoạ cho lỗi nhìn/xác định vùng hình ảnh:

- `T0399`: hỏi “Giải thích biểu đồ được bôi đỏ”, tutor trả lời không tìm
  thấy thông tin cụ thể về biểu đồ được bôi đỏ.
- `T0950`: hỏi “giải thích phần khoanh vùng”, tutor nói chưa truy cập
  được nội dung cụ thể để thấy phần khoanh vùng.
- `T0601`: hỏi về phần đang khoanh tròn, tutor nói không thể nhìn thấy
  trực tiếp hình ảnh hay vòng khoanh nếu không có dữ liệu văn bản.
- `T1218`: hỏi “giải thích cái hình” ở slide 56, tutor nói không xem được
  nội dung cụ thể của slide đó.
- `T0840`: hỏi “phân tích hình ảnh được khoanh đỏ ở slide 59”, tutor nói
  không tìm thấy thông tin hoặc hình ảnh cụ thể được khoanh đỏ.
- `T0265`: hỏi “CTA trong cùng khoanh tròn có ý nghĩa gì”, tutor nói không
  thể xác định cụ thể CTA trong hình ảnh khoanh tròn.
- `T0393`: hỏi “giải thích phần bảng được khoanh”, tutor nói không thể
  xác định hình ảnh hoặc nội dung cụ thể trong phần bảng được khoanh tròn.
- `T0868`: hỏi “trả lời phần tôi khoanh”, tutor nói không thể nhìn thấy
  hình ảnh hoặc phần khoanh vùng cụ thể.
- `T0135`: hỏi tóm tắt nội dung các giai đoạn trong biểu đồ, tutor nói
  không tìm thấy nội dung liên quan đến các giai đoạn hoặc biểu đồ.
- `T0819`: hỏi trang 24 chia làm 4 nhánh màu là gì, tutor nói không tìm
  thấy thông tin cụ thể về sơ đồ 4 nhánh màu.

Ví dụ pattern:

- “Tóm gọn những nội dung quan trọng nhất trong Day 04.”
- “Giải thích phần bảng được khoanh.”
- “Phân tích hình ảnh được khoanh đỏ ở slide 59.”
- “Trang 24 đang chia làm bốn nhánh màu khác nhau thì đó là nhánh gì?”

---

## 5. Lát cắt MỘT CÂU

> **Với học viên đang ôn lại một buổi học trên VLearn, khi họ chọn toàn
> bài hoặc khoanh một vùng slide, hệ thống quyết định phạm vi và loại
> bằng chứng cần dùng để tạo một phiếu học tập ngắn, đúng mục tiêu và có
> trích dẫn cho từng ý.**

- **Một người dùng:** Học viên đang ôn lại một buổi học.
- **Một công việc:** Hiểu nhanh đúng phần nội dung đang cần học.
- **Một quyết định AI:** Chọn phạm vi và loại bằng chứng cần sử dụng.
- **Một kết quả:** Phiếu học tập ngắn, có căn cứ đến từng ý.

---

## 6. AI tự làm đến đâu + lý do

**Mức automation: Conditional**

AI tự trả lời khi:

- Xác định chắc phạm vi học viên đang hỏi;
- Tìm đủ nội dung trong slide hoặc transcript;
- Các claim trong đầu ra được bước verifier xác nhận có căn cứ.

AI hỏi lại đúng một câu hoặc từ chối suy đoán khi:

- “Cái này”, “phần này” nhưng không nhận được vùng chọn;
- Crop thiếu tiêu đề, chú giải, trục hoặc phần liên quan;
- Không có đủ nguồn cho toàn bộ bài;
- Một claim không được slide hoặc transcript hỗ trợ.

**Lý do:** trả lời sai có thể khiến học viên học sai kiến thức và mất
niềm tin; chi phí hỏi lại một câu thấp hơn chi phí đưa ra một câu trả lời
nghe hợp lý nhưng sai.

---

## 7. Ba người sẽ thử + phân công có tên

### Người dùng dự kiến thử trước demo

- Chiến
- Phúc
- Kiên

### Phân công ba thành viên

#### 1. Long — Product, Evidence và Integration

- Hoàn thiện canvas, problem statement và product spec.
- Viết script mining chatlog, kiểm tra tay các case và tổng hợp bằng chứng.
- Định nghĩa input/output chung cho hai luồng.
- Xây API orchestration kết nối giao diện với hai pipeline AI.
- Tổng hợp golden set, kết quả evaluation và chuẩn bị demo cuối.
- Chịu trách nhiệm luồng fallback: hỏi lại, thiếu nguồn và từ chối suy đoán.

**Deliverable chính:**

- Canvas và spec.
- Evidence report kèm script tái hiện.
- API tích hợp hoàn chỉnh.
- Evaluation report và demo script.

#### 2. Phú — Goal-aware Summary

- Tách slide/transcript thành các knowledge unit.
- Phân loại phạm vi: vùng chọn, trang hiện tại hoặc toàn bài.
- Chọn knowledge unit theo mục tiêu học và giới hạn thời gian đọc.
- Sinh phiếu ôn tập có cấu trúc và citation theo từng ý.
- Xây claim-level verifier để loại bỏ nội dung không có căn cứ.
- Chuẩn bị và chạy các test case dành cho luồng tóm tắt.

**Deliverable chính:**

- Summary pipeline.
- Knowledge-unit schema và dữ liệu mẫu.
- Citation/verifier module.
- Kết quả evaluation của luồng tóm tắt.

#### 3. Việt — Point-and-Explain và Giao diện

- Xây giao diện hiển thị slide và cho phép học viên khoanh một vùng.
- Gửi crop, toàn bộ slide và câu hỏi sang vision model.
- Phân loại vùng chọn: text, bảng, biểu đồ, sơ đồ hoặc hình minh họa.
- Sinh lời giải thích có căn cứ và xác định khi nào cần yêu cầu mở rộng vùng.
- Hiển thị citation, phạm vi bằng chứng và trạng thái thiếu nguồn.
- Chuẩn bị và chạy các test case dành cho luồng hình ảnh.

**Deliverable chính:**

- Giao diện chọn vùng trên slide.
- Point-and-Explain pipeline.
- Luồng hỏi lại khi crop thiếu thông tin.
- Kết quả evaluation của luồng hình ảnh.

### Trách nhiệm chung

Cả ba thành viên cùng:

- Review prompt và output của hai pipeline.
- Viết test cho phần mình phụ trách.
- Chạy thử end-to-end trước demo.
- Quan sát ít nhất một người dùng thử sản phẩm.
- Sửa các lỗi nghiêm trọng liên quan đến hallucination, citation và trải
  nghiệm hỏi lại.
