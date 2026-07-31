# Team Context — Mini Hackathon AI

## 📍 1. Hướng đề bài (Track)
* **Hướng C — Làn mở:** Codelab AI Co-Pilot / Trợ lý nhúng Codelab.

## 👤 2. Job Executor
* **Đối tượng:** Học viên đang trực tiếp gõ code và làm bài thực hành trên giao diện Codelab vào buổi chiều.

## ⚠️ 3. Pain Point (Nỗi đau trung tâm)
> Học viên khi làm Codelab liên tục bị văng khỏi luồng tập trung (*context-switching*) vì phải rời màn hình code để tìm lại lý thuyết bên trang bài giảng sáng (100% học viên chuyển tab ≥3 lần/buổi, 61,9% chuyển ≥6 lần), dẫn đến đứt mạch tư duy và 81% thường xuyên bị trễ hoặc nộp sát giờ Checkpoint.

## 📊 4. Bằng chứng ban đầu (Evidence)
* **Data mining (Chuẩn B — 1.261 turn tutor, 369 học viên):** 85,2% lượt trả lời của AI Tutor có intent `review_concept` (nhắc lại lý thuyết đã học), trong đó 46,2% lượt không kèm trích dẫn nguồn và 25,0% tutor báo không tìm được nội dung.
* **Khảo sát thực tế (Chuẩn A — n = 21 học viên ngoài nhóm):** 100% (21/21) học viên phải chuyển tab ≥3 lần/buổi (61,9% chuyển ≥6 lần), 95,2% (20/21) chọn giải pháp quay lại VLearn lật lý thuyết, và 81,0% (17/21) rất hay bị trễ hoặc nộp sát giờ Checkpoint.

## 🎯 5. Lát cắt MỘT CÂU (Core Slice)
> **1 học viên đang gõ code bị kẹt lỗi/logic trên giao diện Codelab** $\rightarrow$ **AI Agent ngay tại góc Codelab tự động trích ra đúng 2 dòng lý thuyết liên quan từ bài giảng sáng kèm mã trích dẫn `[Txx-NNN]`** $\rightarrow$ **Học viên hiểu ngay nguyên lý để tự sửa code mà không cần rời trang Codelab.**

## 🤖 6. Mức độ Automation & Lý do
* **Mức độ chọn:** **Augment / Conditional** (AI gợi ý trích dẫn lý thuyết và nhắc nhở thời gian, học viên là người tự sửa code).
* **Lý do (theo Cost-of-Error):** Cost-of-error thấp. Nếu AI gợi ý chưa chuẩn thì học viên tự nhận ra khi gõ code thử nghiệm, dễ thử lại mà không gây hậu quả đắt.

## 👥 7. Phân công công việc & Willing Users
* **Thảo Tiên:** Bằng chứng (Evidence & Data Mining)
* **Xuân Kiên:** Prompt Engineering
* **Bảo Phúc:** Build (Codebase & Prototype)
* **Duy Chiến:** AI Spec (`spec.md`)
* **Duy Hưng:** Validation & User Feedback Log
