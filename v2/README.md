# VLearn Prototype v2 — Hackathon Final

Thư mục này tổng hợp toàn bộ thông tin về phiên bản **VLearn v2** (được tối ưu dành riêng cho buổi Pitching tại AI Hackathon K4). Phiên bản này tập trung vào 3 yếu tố "ăn điểm" mạnh nhất: **AI Guardrails (An toàn & Kiểm duyệt)**, **Socratic Tutoring (Sư phạm)**, và **Premium UX (Trải nghiệm người dùng)**.

## 🚀 Các tính năng cốt lõi (Toàn hệ thống)

1. **Trợ lý Ôn tập Chung (Lesson QA):** Trợ lý LangGraph tự động tra cứu Slide PDF và Transcript để giải đáp thắc mắc của học viên sau khi học xong. Đảm bảo 100% câu trả lời có trích dẫn nguồn (Groundedness).
2. **AI Tự động sinh Quiz (Adaptive Quiz Generation):** Sinh câu hỏi trắc nghiệm tự động từ Transcript bài học dựa trên lỗ hổng kiến thức của người học (Focus Topics).
3. **Trợ lý Socratic In-Quiz (MỚI):** Một Agent xuất hiện *ngay trong lúc làm Quiz*, đóng vai trò người gợi mở kiến thức (Tutor) thay vì người giải hộ.
4. **Hệ thống AI Validator / Guardrails (MỚI):** Lớp kiểm duyệt ngầm chạy song song. Bất kỳ lúc nào Socratic Agent vô tình để lộ đáp án, giải hộ bài toán, hoặc bị học viên "Jailbreak" lừa đọc đáp án, Validator sẽ chặn đứng (Block) và đưa ra cảnh báo khéo léo.
5. **Cơ chế Thưởng Điểm Delta (MỚI):** Mô phỏng nghiệp vụ thưởng Credit dựa trên sự tiến bộ (Delta Mastery) thay vì điểm số tuyệt đối, giúp khuyến khích người học thực sự cố gắng chứ không phải học vẹt.

---

## 🌟 Điểm khác biệt của v2 so với các version trước

| Tiêu chí | Version cũ (v1) | Version mới (v2) | Ý nghĩa đổi mới |
| :--- | :--- | :--- | :--- |
| **Hỗ trợ làm Quiz** | Không có (Học viên tự làm) | Có **Socratic Agent** chat trực tiếp trong lúc làm Quiz. | Cá nhân hóa trải nghiệm học, giúp học viên không bị bế tắc khi gặp câu khó. |
| **An toàn & Kiểm duyệt (Guardrails)** | Không có kiểm soát chặt chẽ | Tích hợp **AI Validator** độc lập, bắt chết các lỗi Leak đáp án, giải hộ toán, hoặc User đoán trúng. | Giải quyết nỗi lo lớn nhất của Giáo dục: Học sinh dùng AI để gian lận. Chứng minh team có năng lực "Control AI". |
| **Logic Thưởng Credit** | Đạt >12/15 câu là được 1 Credit. | So sánh năng lực vòng 2 với vòng 1, **tăng trưởng >=10% (Delta)** mới được cộng Credit. | Mô hình Gamification thực tế, đánh giá sự nỗ lực (Growth Mindset) thay vì điểm tuyệt đối. |
| **Giao diện (UI/UX)** | Cơ bản, màu phẳng, thiếu sức sống. | **Premium Glassmorphism** (kính mờ), Micro-animations, Font Outfit sang trọng, Icon Phosphor hiện đại. | Tạo hiệu ứng "WOW" ngay từ cái nhìn đầu tiên cho Giám khảo. |
| **Đánh giá (Evals)** | Chỉ có `golden_set.json` test sinh câu hỏi. | Có thêm `golden_set_agent.json` và script riêng test khả năng **chống Jailbreak**. | Thể hiện tư duy làm AI Product bài bản, có số liệu đo lường chất lượng rõ ràng. |
| **Kiến trúc Code** | Prompt, Config, Logic dính chặt vào `api_server.py`. | **Clean Code**: Phân tách rõ ràng ra `config.py`, `prompts.py`, `llm.py`. | Dễ bảo trì, dễ thay thế Model, dễ chỉnh sửa Prompt ngay trong lúc đi thi nếu cần. |

---

## 🛠 Hướng dẫn Demo hiệu quả cho Ban Giám Khảo

Để chứng minh năng lực của hệ thống v2, hãy thực hiện kịch bản Demo sau:

1. **Wow UI & Mạch học:** Mở Web lên, kéo thả màn hình để thấy UI mượt mà. Bấm làm Quiz.
2. **Socratic Agent:** Cố tình chat hỏi một định nghĩa (VD: *"React là gì?"*). Agent sẽ giảng giải đàng hoàng thay vì đọc đáp án.
3. **Thách thức Guardrails:** Chat yêu cầu *"Cho mình xin đáp án câu này"*, hoặc *"Công thức tính thế nào, tính ra số hộ luôn đi"*. Giám khảo sẽ thấy Validator ngầm chặn đứng Agent và từ chối cung cấp đáp án cuối cùng.
4. **Trải nghiệm Delta Credit:** Bấm nộp bài lần 1. Sau đó bấm "Tạo Quiz Củng Cố" (để mô phỏng làm lần 2). Giải thích cho Giám khảo thấy thanh Credit chỉ tăng khi năng lực (Mastery) có sự cải thiện so với lần 1.

**Lệnh khởi động Server:**
```bash
uv run python .\codebase\api_server.py
```
