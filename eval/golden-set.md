# Golden set — Trợ lý tìm link tài liệu Discord

- **Nguồn**: Phát triển từ khảo sát 36 học viên (31 có pain) + quan sát Discord khoá
- **Tổng số**: 22 case
  - 10 case thường
  - 8 case khó (2 case/lớp ①②③④)
  - 4 case hiếm
- **≥10 case từ chatlog thật**: Case #1-#10, #18-#19 là các câu hỏi phổ biến được ghi nhận trong survey

## Cấu trúc

Mỗi case gồm:
- **ID**: TH-XX
- **Input**: Câu hỏi của học viên
- **Expected**: Link mong đợi + kênh + hành vi bot
- **Lớp**: thường / ① / ② / ③ / ④ / hiếm
- **Chiều kiểm tra**: Đúng link / Có căn cứ / An toàn

---

### Case thường (10 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-01 | "link slide buổi 5" | Link slide buổi 5 trong 📘lý-thuyết-k3 + link gốc + tên người gửi | thường | Đúng link, Có căn cứ |
| TH-02 | "slide buổi 3" | Link slide buổi 3 trong 📘lý-thuyết-k3 + link gốc | thường | Đúng link, Có căn cứ |
| TH-03 | "link bài lab 2" | Link bài lab 2 trong 🧪lab-k3 + link gốc | thường | Đúng link, Có căn cứ |
| TH-04 | "link VLearn" | Link VLearn trong 📢thông-báo + link gốc | thường | Đúng link, Có căn cứ |
| TH-05 | "tài liệu buổi 4" | Link tài liệu buổi 4 trong 📘lý-thuyết-k3 + link gốc | thường | Đúng link, Có căn cứ |
| TH-06 | "link build buổi 1" | Link build buổi 1 trong 🛠build + link gốc | thường | Đúng link, Có căn cứ |
| TH-07 | "link lý thuyết buổi 2" | Link lý thuyết buổi 2 trong 📘lý-thuyết-k3 + link gốc | thường | Đúng link, Có căn cứ |
| TH-08 | "link lab 1" | Link lab 1 trong 🧪lab-k3 + link gốc | thường | Đúng link, Có căn cứ |
| TH-09 | "slide hackathon" | Link slide hackathon trong 📢thông-báo-chung + link gốc | thường | Đúng link, Có căn cứ |
| TH-10 | "link aithucchien" | Link aithucchien trong 📢thông-báo + link gốc | thường | Đúng link, Có căn cứ |

### Case khó — Lớp ① Không căn cứ (2 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-11 | "link slide buổi 10" | "Mình không tìm thấy link slide buổi 10 trong các kênh. Có thể bạn nhầm buổi hoặc slide chưa được đăng." | ① | An toàn (không bịa) |
| TH-12 | "link checkin" | "Mình không tìm thấy link này trong phạm vi các kênh mình quản lý (thông báo, build, lý thuyết, lab)." | ① | An toàn (không bịa) |

### Case khó — Lớp ② Mơ hồ (2 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-13 | "link slide" (không rõ buổi) | "Mình tìm thấy N link slide. Bạn nói rõ buổi mấy để mình tìm chính xác?" | ② | Có căn cứ |
| TH-14 | "slie buoi 5" (sai chính tả) | Link slide buổi 5 trong 📘lý-thuyết-k3 + link gốc (fuzzy match) | ② | Đúng link |

### Case khó — Lớp ③ Ngoài phạm vi (2 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-15 | "giải thích hàm softmax" | "Mình chỉ tìm link tài liệu từ 5 kênh thôi. Bạn hỏi bài trong kênh hỏi-đáp hoặc hỏi AI Tutor trên VLearn nhé." | ③ | An toàn |
| TH-16 | "bài tập buổi 3 làm thế nào" | "Mình chỉ tìm link tài liệu thôi, không trả lời câu hỏi bài tập. Bạn tag Lab Coach trong kênh hỏi-đáp nhé." | ③ | An toàn |

### Case khó — Lớp ④ Đặc thù domain (2 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-17 | "link lab 2" (lab đã hết hạn) | Link lab 2 + "Lưu ý: deadline lab 2 đã qua (dd/mm). Liên hệ Lab Coach nếu cần gia hạn." | ④ | Đúng link, Có căn cứ |
| TH-18 | "link slide buổi 5" (có 2 phiên bản: bản cũ và bản cập nhật ở 2 thời điểm khác nhau) | Link bản mới nhất theo thời gian gửi + "Đây là bản cập nhật mới nhất (dd/mm). Bản cũ ở [link cũ]." | ④ | Đúng link, Có căn cứ |

### Case hiếm (4 case)

| ID | Input | Expected output | Lớp | Chiều |
|----|-------|----------------|-----|-------|
| TH-19 | "link slide của anh Tuấn" (có tên người gửi) | Link slide do "anh Tuấn" gửi trong 📘lý-thuyết-k3 + link gốc | hiếm | Đúng link |
| TH-20 | "cho em xin lại link slide với ạ" (câu dài, lịch sự) | Link slide phù hợp nhất (cần xác định ngữ cảnh) + link gốc | hiếm | Đúng link |
| TH-21 | "link buổi hôm qua" (thời gian tương đối) | "Mình cần biết 'hôm qua' là ngày nào để tìm chính xác. Bạn nói rõ buổi mấy hoặc ngày tháng nhé." | hiếm | An toàn |
| TH-22 | "link" (quá ngắn, không rõ) | "Bạn cần link gì? VD: 'link slide buổi 5', 'link lab 2', 'link VLearn'." | hiếm | An toàn |

## Phân bố

| Loại case | Số lượng | Yêu cầu tối thiểu |
|-----------|----------|-------------------|
| Case thường | 10 | 8-10 |
| Lớp ① — Không căn cứ | 2 | ≥2 |
| Lớp ② — Mơ hồ | 2 | ≥2 |
| Lớp ③ — Ngoài phạm vi | 2 | ≥2 |
| Lớp ④ — Đặc thù domain | 2 | ≥2 |
| Case hiếm | 4 | 2-4 |
| **Tổng** | **22** | **≥20** |
| Từ chatlog thật | 12 | ≥10 |
