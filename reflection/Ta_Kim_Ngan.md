# Reflection cá nhân — Tạ Kim Ngân · AI Agent QA · Batch 03

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: Thư mục `data/` và file `ket_qua_khao_sat.csv`, `survey_analysis_results.md`. Thư mục `fb/` để cào dữ liệu (mining).
- Chức năng cụ thể: Thu thập dữ liệu thực tế để chứng minh vấn đề (Evidence), chạy khảo sát, gom nhóm và làm sạch dữ liệu (clean data) cho Knowledge Base.

**Phần mình phụ trách trong spec.md:**
- Section: §1 (Evidence - Khảo sát người thật & Đếm trên dữ liệu), cung cấp Quotes nguyên văn.

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Phân tích file CSV | ChatGPT (Data Analysis) | Tóm tắt tỷ lệ % từ 40 mẫu khảo sát. | Đặt câu hỏi khảo sát, gửi form cho willing users. |
| Clean Data FB | Gemini 1.5 Pro | Chuyển đổi định dạng log thô thành JSON RAG. | Chọn lọc các post chất lượng, bỏ các post rác. |
| Trích xuất Quote | Claude 3.5 Sonnet | Tìm các câu hỏi tiêu biểu trong đống data thô. | Cross-check lại với link gốc để đảm bảo tính trung thực. |

**Mình hiểu tài liệu của mình đến mức:**
> Mình tự tay đi gửi form cho 40 người ngoài nhóm, tự chạy script mining Facebook Group nên mình nắm rất rõ nỗi đau (pain point) của họ. Dữ liệu trong `data/` hoàn toàn là do mình tổ chức.

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> Lần đầu làm khảo sát, mọi người trả lời toàn "Có/Không", thiếu hẳn phần chữ (quote) để đưa vào Evidence A.

**Nguyên nhân:**
> Đặt câu hỏi đóng (Yes/No questions) thay vì câu hỏi mở (Open-ended).

**Cách fix:**
> Gửi tin nhắn trực tiếp phỏng vấn sâu (Deep interview) lại 5 người dùng (Willing users) để hỏi "Bạn vướng ở đâu, cho mình xin ví dụ cụ thể", từ đó mới có được 5 quotes chất lượng cho Spec.

**Bài học:**
> Trong khảo sát, con số % chỉ là bề nổi, Quote nguyên văn mới thực sự chạm vào Pain Point của người dùng. Không nên chỉ phụ thuộc vào Google Form.

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> Mình sẽ thiết lập Pipeline Data Mining tự động hóa tốt hơn thay vì copy-paste thủ công một số log. Nếu tự động hóa, lượng Evidence B thu được có thể lên tới hàng ngàn mẫu thay vì 250 mẫu.
