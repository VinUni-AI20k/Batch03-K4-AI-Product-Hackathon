# Reflection cá nhân — Phan Văn Hoàng Nam · AI Agent QA · Batch 03

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: `codebase/agent.py`
- Chức năng cụ thể: Viết `SYSTEM_PROMPT` trung tâm điều hướng hành vi của AI Agent, thiết kế cấu trúc prompt cho luồng Fallback LLM và các câu trả lời override của Guardrails.
- Commit nào có tên mình: Cập nhật System Prompt và Guardrail messages.

**Phần mình phụ trách trong spec.md:**
- Section: Hỗ trợ §5 (Quyết định của AI Agent dựa trên Prompt) và định hình hành vi cho các kịch bản rủi ro.

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Brainstorm System Prompt | ChatGPT | Đưa ra bản nháp cấu trúc prompt định danh AI. | Điều chỉnh giọng văn phù hợp với ngữ cảnh Vingroup - VinUni. |
| Viết kịch bản Guardrails | Claude 3.5 Sonnet | Viết các mẫu tin nhắn từ chối lịch sự. | Rà soát và thêm thông tin cụ thể (luật Vibe-coding, lịch Batch 03). |
| Tối ưu token | Gemini 1.5 Pro | Rút gọn prompt để tiết kiệm token. | Kiểm tra xem prompt rút gọn có làm mất intent gốc không. |

**Mình hiểu code của mình đến mức:**
> Mình hiểu rõ cách SYSTEM_PROMPT tương tác với `tool_calls` của OpenAI. Nếu LLM phản hồi sai định dạng, mình biết cách tinh chỉnh lại các "Giới hạn (Boundaries)" trong prompt để ép mô hình tuân thủ.

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> Ban đầu, khi hỏi về "kinh nghiệm đi học", AI tự động dùng dữ liệu bịa (hallucination) thay vì gọi tool Search Facebook để lấy thông tin thực tế.

**Nguyên nhân:**
> System Prompt chưa nhấn mạnh đủ mạnh việc "BẮT BUỘC ưu tiên gọi tool Search Facebook khi không có trong Sổ tay".

**Cách fix:**
> Bổ sung chỉ thị IN HOA vào SYSTEM_PROMPT: "LUÔN gọi tool search_knowledge_base trước... Tìm kiếm internet khi cần... KHÔNG tự bịa dữ liệu".

**Bài học:**
> Prompting không chỉ là ra lệnh, mà là thiết lập hệ thống rào cản. LLM rất lười gọi tool nếu nó nghĩ nó tự trả lời được. Cần phải đưa instruction gọi tool lên vị trí ưu tiên cao.

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> Mình sẽ thiết lập bộ test prompt ngay từ đầu thay vì sửa prompt dựa trên cảm tính. Mỗi lần đổi prompt mình sẽ chạy qua Golden Set tự động ngay lập tức để đo xem % chính xác có bị giảm không.
