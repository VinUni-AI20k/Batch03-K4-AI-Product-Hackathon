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

// Offline batch version of buildQuizPrompt — used once by
// scripts/generate-question-bank.js to pre-build a reviewed question bank per
// section (see codebase/server/data/questionBank.json), instead of calling
// Gemini live every time a student opens a quiz. Same schema and grounding
// rules as buildQuizPrompt, but asks for a larger batch and explicitly
// spreads coverage across every slide in the section so a random 2-3 pick at
// quiz time can land on any part of the section, not just its first slides.
function buildBankPrompt({ day, sectionTitle, groundingText, questionCount, slideCount }) {
    return `Bạn là AI tutor của khoá "AI Thực Chiến". Nhiệm vụ: đọc PHẦN KIẾN THỨC dưới đây
(trích từ slide bài giảng "${day}", phần "${sectionTitle}", gồm ${slideCount} trang slide) và
sinh ra MỘT NGÂN HÀNG ${questionCount} câu hỏi trắc nghiệm (4 đáp án) để kiểm tra học viên có
THỰC SỰ hiểu và áp dụng được khái niệm trong phần này, không phải chỉ nhớ định nghĩa. Ngân
hàng này sẽ được lưu tĩnh — mỗi lượt học viên làm quiz, hệ thống chỉ rút ngẫu nhiên 2-3 câu
trong ngân hàng này ra, nên ngân hàng PHẢI phủ đều khắp phần kiến thức, không dồn hết câu hỏi
vào một vài trang slide đầu.

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
7. KHÔNG được có hai câu hỏi trùng ý hoặc kiểm tra cùng một khái niệm theo cùng một
   cách — mỗi câu phải kiểm tra một khái niệm, một góc nhìn, hoặc một trang slide
   khác nhau trong PHẦN KIẾN THỨC. Rải câu hỏi đều across tất cả các trang, ưu tiên
   không bỏ sót trang nào có nội dung đáng kiểm tra.
8. Nếu PHẦN KIẾN THỨC không đủ nội dung cho ${questionCount} câu có ý nghĩa và không
   trùng lặp, sinh ít hơn thay vì bịa thêm hoặc lặp ý.

PHẦN KIẾN THỨC:
"""
${groundingText}
"""

Trả về đúng theo JSON schema đã cung cấp.`;
}

// "Hỏi AI" chat prompt — unlike buildQuizPrompt/buildBankPrompt (grading tools that
// must stay 100% inside the slide corpus, no exceptions — see spec.md §5① and
// eval/golden_set.json TC09), this is a free-form Q&A assistant. It's allowed to use
// Google Search grounding (wired up in server.js via tools:[{googleSearch:{}}]) as a
// fallback, but the slide deck is always the priority source.
function buildChatPrompt({ day, groundingText, message }) {
    return `Bạn là trợ lý "Hỏi AI" của khoá "AI Thực Chiến", hỗ trợ học viên hỏi đáp về nội dung
bài giảng "${day}".

NGUYÊN TẮC ƯU TIÊN NGUỒN (bắt buộc theo đúng thứ tự, không đảo ngược):
1. ƯU TIÊN TUYỆT ĐỐI nội dung SLIDE bên dưới — đây là nguồn chính thức của khoá học.
   Nếu SLIDE đã đủ thông tin trả lời, CHỈ dùng SLIDE, không cần và không nên tìm web.
2. CHỈ khi SLIDE không đủ thông tin để trả lời câu hỏi, bạn được phép tìm kiếm web để
   bổ sung. Khi đó PHẢI nói rõ với học viên đây là thông tin lấy từ web (ngoài slide
   chính thức của khoá) — không được lẫn lộn khiến học viên tưởng đó là nội dung slide.
3. Khi dùng nội dung SLIDE, PHẢI trích dẫn đúng mã đoạn dạng [T0x-NNN] có sẵn trong
   SLIDE được cấp bên dưới — không suy đoán mã không tồn tại trong danh sách.
4. Nếu câu hỏi nằm ngoài phạm vi cả slide lẫn kiến thức tìm được trên web, hãy nói rõ
   bạn không chắc thay vì bịa câu trả lời.

SLIDE (${day}):
"""
${groundingText}
"""

Câu hỏi của học viên: "${message}"

Trả lời ngắn gọn (tối đa ~120 từ), đúng trọng tâm câu hỏi, giọng văn thân thiện như một
trợ giảng.`;
}

module.exports = { buildQuizPrompt, buildBankPrompt, buildChatPrompt };
