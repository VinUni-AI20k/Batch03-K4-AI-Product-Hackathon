# Reflection cá nhân — [Tên thành viên] · AI Agent QA · Batch 03

> **Hướng dẫn:** Mỗi thành viên copy file này, đổi tên thành `reflection_[ten].md`, điền đầy đủ 4 mục.
> Tại CP5/CP6, TA có thể hỏi bất kỳ mục nào — phải giải thích được phần có tên mình.

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: `[vd: codebase/agent.py]`
- Chức năng cụ thể: `[vd: viết hàm _check_guardrails(), _retrieve_relevant_docs()]`
- Commit nào có tên mình: `[link commit hoặc mô tả]`

**Phần mình phụ trách trong spec.md:**
- Section: `[vd: §5 — 4 lớp chỗ khó, §7 — kiểm thử]`

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Viết guardrail regex | Claude/Cursor | Gợi ý pattern | Kiểm tra, test, sửa false positive |
| Viết golden set | ChatGPT | Brainstorm case | Chọn lọc, validate với rubric |
| Debug agent.py | Copilot | Explain error | Hiểu root cause, quyết định fix |

**Mình hiểu code của mình đến mức:**
> [Mô tả: "Mình có thể giải thích từng dòng trong _check_guardrails() vì mình tự viết logic và test từng case. Phần _generate_llm_answer() mình dùng AI gợi ý structure nhưng đã đọc và hiểu từng parameter."]

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> [Mô tả case: "Ban đầu L2 trigger nhầm khi query dài nhưng chứa keyword 'lỗi pip'. Ví dụ: 'Lỗi pip install Microsoft Visual C++ trên Windows fix thế nào?' bị hỏi lại không cần thiết."]

**Nguyên nhân:**
> [Mô tả: "Regex L2 dùng substring match thay vì full-string match, nên keyword ngắn trong câu dài cũng kích hoạt."]

**Cách fix:**
> [Mô tả: "Thêm ^ và $ vào regex để match full string, giảm threshold từ ≤5 xuống ≤4 từ."]

**Bài học:**
> [Mô tả: "Test với real user queries thay vì chỉ test happy path. False positive guardrail còn tệ hơn không có guardrail vì làm mất niềm tin người dùng."]

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> [Ví dụ: "Sẽ xây golden set TRƯỚC khi viết code guardrail — vì có test case rõ ràng thì viết code mới đúng. Lần này mình viết code trước, sau đó mới phát hiện false positive qua test."]
