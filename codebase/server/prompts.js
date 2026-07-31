// Adapted from eval/prompts.md (Prompt A + Prompt B, drafted by Trần Đức Bảo).
// Merged into one generation call that returns the correct answer and
// per-option feedback up front, so grading the student's pick is a local
// lookup instead of a second live call — matches the fixed 4-option MCQ UI
// already built in codebase/index.html and avoids a second model call that
// could invent a citation different from the one used at generation time.

function buildQuizPrompt({ day, sectionTitle, groundingText, questionCount }) {
    return `Bạn là AI tutor của khoá "AI Thực Chiến". Nhiệm vụ: đọc PHẦN KIẾN THỨC dưới đây
(trích từ slide bài giảng "${day}", phần "${sectionTitle}") và sinh ra ${questionCount} câu hỏi
trắc nghiệm (4 đáp án) để kiểm tra học viên có THỰC SỰ hiểu và áp dụng được khái niệm
trong phần này, không phải chỉ nhớ định nghĩa.

QUAN TRỌNG — chỉ được dùng nội dung trong PHẦN KIẾN THỨC được cấp bên dưới, mỗi đoạn
đã có sẵn mã trích dẫn dạng [T01-005]. TUYỆT ĐỐI không dùng kiến thức ngoài, không tự
bịa thêm số liệu, ví dụ hay khái niệm không có trong đoạn được cấp.

Yêu cầu cho mỗi câu hỏi:
1. Đặt học viên vào một tình huống hoặc ví dụ áp dụng cụ thể — không hỏi kiểu thuần
   "định nghĩa X là gì".
2. Đúng 4 đáp án (A/B/C/D), chỉ 1 đáp án đúng.
3. Mỗi đáp án (kể cả đáp án đúng) có "feedback" ngắn (1-2 câu) giải thích vì sao đáp án
   đó đúng/sai, bám sát nội dung PHẦN KIẾN THỨC. Nếu đáp án sai tương ứng một hiểu lầm
   phổ biến, feedback nêu rõ tên hiểu lầm đó.
4. Trường "citation" của mỗi câu PHẢI là một trong các mã [T0x-NNN] xuất hiện trong
   PHẦN KIẾN THỨC được cấp — không suy đoán số trang không có trong danh sách.
5. Trường "sourcePages" là mảng SỐ TRANG (chỉ lấy phần số, ví dụ mã "[T01-006]" ->
   6) của TẤT CẢ các trang trong PHẦN KIẾN THỨC mà câu hỏi này thực sự dựa vào — có
   thể nhiều hơn 1 trang nếu câu hỏi kết hợp kiến thức từ nhiều đoạn.
6. Trường "reviewSummary" là một đoạn văn ngắn (3-5 câu) do bạn tự viết lại, tổng hợp
   đúng nội dung của các trang trong "sourcePages" — dùng để học viên đọc lại khi trả
   lời sai câu này. Chỉ tổng hợp đúng nội dung đã có trong PHẦN KIẾN THỨC, không thêm
   thông tin ngoài, không lặp nguyên văn câu hỏi.
7. Nếu PHẦN KIẾN THỨC không đủ nội dung cho ${questionCount} câu có ý nghĩa, sinh ít hơn
   thay vì bịa thêm.

PHẦN KIẾN THỨC:
"""
${groundingText}
"""

Trả về đúng theo JSON schema đã cung cấp.`;
}

module.exports = { buildQuizPrompt };
