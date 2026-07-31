# Team Context — Mini Hackathon AI

## 📍 1. Hướng đề bài (Track)
* **Hướng C — Làn mở:** Codelab AI Co-Pilot / Trợ lý nhúng Codelab.

## 👤 2. Job Executor
* **Đối tượng:** Học viên đang trực tiếp gõ code và làm bài thực hành trên giao diện Codelab vào buổi chiều.

## ⚠️ 3. Pain Point (Nỗi đau trung tâm)
> Học viên khi làm Codelab liên tục bị văng khỏi luồng tập trung (*context-switching*) vì phải rời màn hình code để tìm lại lý thuyết bên trang web bài giảng sáng, dẫn đến tốn 10-15 phút/lần mò mẫm và dễ trễ deadline Checkpoint do không căn chỉnh được thời gian.

## 📊 4. Bằng chứng ban đầu (Evidence)
* **Data mining:** 85% câu hỏi học viên gõ cho AI Tutor xuất phát từ việc nhắc lại lý thuyết (`review_concept`).
* **Khảo sát thực tế:** 20/21 học viên trong lớp xác nhận phải chuyển tab >5 lần/buổi và tốn 10 phút/lần lật tìm slide.

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
