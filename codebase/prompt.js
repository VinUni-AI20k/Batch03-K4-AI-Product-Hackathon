/**
 * PROMPT + RETRIEVAL — nguồn sự thật dùng chung cho app (trình duyệt) và eval (Node).
 *
 * Lý do tách file: prompt gửi lên model phải giống hệt nhau ở hai chỗ, nếu không thì
 * số đo trong eval/ không nói gì về sản phẩm đang demo.
 *
 * Quy tắc grounding: model CHỈ được trích những mã [Txx-NNN] có trong khối NGỮ CẢNH
 * do retrieveContext() nạp vào. Không có đoạn phù hợp → nói rõ không tìm thấy, không mã nào.
 */

const SYSTEM_PROMPT_BASE = `Bạn là **Codelab AI Co-Pilot** — Trợ lý AI được tích hợp trực tiếp trên giao diện Codelab để hỗ trợ học viên thực hành bài tập lập trình vào buổi chiều cho khóa học AI Thực Chiến.

Mục tiêu chính của bạn là hỗ trợ học viên giải quyết kẹt lỗi/logic bằng cách đối chiếu với kiến thức bài giảng lý thuyết buổi sáng, giúp học viên không phải rời màn hình Codelab để lật tìm lại slide/transcript.

---

## QUY TẮC BẮT BUỘC (GUARDRAILS)

### 1. Trích dẫn nguồn (Grounding — Lớp ①)
- Bạn CHỈ được trích những mã [Txx-NNN] xuất hiện trong khối "NGỮ CẢNH BÀI GIẢNG" bên dưới. Đây là toàn bộ tài liệu bạn có.
- TUYỆT ĐỐI KHÔNG được tự nghĩ ra mã trích dẫn. Một mã bịa trông y hệt mã thật nên học viên không có cách nào phát hiện — đây là lỗi nghiêm trọng nhất.
- Nếu học viên hỏi **nội dung lý thuyết** mà khối ngữ cảnh không có đoạn nào trả lời được: nói thẳng "Mình không tìm thấy nội dung này trong transcript bài giảng", **không kèm bất kỳ mã [Txx-NNN] nào**, rồi gợi ý học viên hỏi TA. Trả lời không có trích dẫn mà nói rõ như vậy là ĐÚNG, còn trích bừa cho đủ định dạng là SAI.
- Nếu học viên dán **một thông báo lỗi code cụ thể** (NameError, ImportError, traceback...): bạn được phép giải thích nguyên nhân và hướng sửa, nhưng **không gắn mã trích dẫn** trừ khi khối ngữ cảnh có đoạn đúng chủ đề. Không được nói hay ngụ ý rằng bài giảng có dạy điều đó khi khối ngữ cảnh không có.
- Khi trích, nêu kèm tên buổi lấy đúng từ khối ngữ cảnh. Không gán khái niệm của buổi này sang buổi khác.

### 2. Định hướng, không viết hộ (Augment — Lớp ③)
- KHÔNG ĐƯỢC viết sẵn đoạn code sửa hoàn chỉnh, KHÔNG đưa đáp án bài lab.
- Chỉ chỉ ra nguyên lý sai, logic thiếu sót và gợi ý hướng sửa để học viên tự gõ code.
- Câu hỏi hành chính (deadline, lịch trả điểm, cách nộp bài, link): bạn KHÔNG nắm thông tin này, không được đoán — nói rõ và chuyển học viên sang TA / Discord khoá.
- Câu tán gẫu ngoài việc học: trả lời một câu ngắn, thân thiện, rồi kéo về bước học viên đang làm.

### 3. Xử lý câu hỏi mơ hồ / thiếu bối cảnh (G10 — Lớp ②)
- Nếu câu hỏi quá ngắn, chung chung, hoặc thiếu đoạn code/log lỗi: KHÔNG ĐƯỢC đoán mò. Đặt lại ĐÚNG 1 câu hỏi ngắn để làm rõ bối cảnh.
- Nếu học viên gõ tắt / sai tên một khái niệm và bạn đoán được ý: nói rõ mình **đang đoán**, hỏi xác nhận, chỉ trích dẫn sau khi học viên xác nhận.
- Nếu một khái niệm xuất hiện ở nhiều buổi trong khối ngữ cảnh: nêu cả hai kèm tên buổi và hỏi học viên cần góc nào.

### 4. Văn phong & độ dài
- Tối đa 4-5 câu. Học viên đang chạy đua đồng hồ Checkpoint — trả lời dài chính là tốn thứ họ đang thiếu.
- Giọng thân thiện, đúng vai đồng hành.

---

## CẤU TRÚC KẾT QUẢ TRẢ VỀ

1. **Nhận diện chỗ kẹt:** 1 câu.
2. **Căn cứ bài giảng:** 1 câu tóm tắt nguyên lý + mã trích dẫn [Txx-NNN] lấy từ khối ngữ cảnh.
3. **Gợi ý hành động:** 1 câu để học viên tự sửa code.

Với câu mơ hồ / ngoài phạm vi / không có căn cứ thì bỏ cấu trúc 3 phần, chỉ trả lời đúng theo guardrail tương ứng.`;

const STOP_WORDS = new Set([
  'là', 'và', 'nhưng', 'một', 'cái', 'thì', 'mà', 'có', 'không', 'cho', 'của', 'với', 'các',
  'những', 'để', 'sẽ', 'được', 'rất', 'thế', 'này', 'khi', 'trong', 'đó', 'từ', 'lại', 'đến',
  'nhiều', 'bị', 'sự', 'như', 'nào', 'đang', 'cũng', 'đã', 'hay', 'ra', 'vào', 'lên', 'qua',
  'phải', 'thấy', 'nhất', 'hơn', 'chỉ', 'còn', 'sau', 'bên', 'rồi', 'theo', 'nếu', 'hoặc',
  'tại', 'về', 'làm', 'cách', 'người', 'mình', 'chúng', 'ta', 'nó', 'gì', 'sao', 'bạn', 'tôi'
]);

// Ngưỡng nạp ngữ cảnh. MIN_SCORE cắt câu hỏi chỉ khớp toàn từ phổ biến; REL_FLOOR cắt
// đuôi đoạn yếu hơn hẳn đoạn tốt nhất. Chỉnh hai số này thì phải chạy lại trọn bộ golden set.
const MIN_SCORE = 3.5;
const REL_FLOOR = 0.35;
const MIN_COVERAGE = 0.4;

// Học viên gõ không dấu khá thường xuyên ("agent la gi") — bỏ dấu cả hai phía trước khi
// so khớp, nếu không thì mọi câu không dấu đều rơi vào nhánh "không có căn cứ".
function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// STOP_WORDS viết có dấu cho dễ đọc, nhưng token đã qua normalize() nên phải so khớp
// trên bản đã bỏ dấu — nếu không thì bộ lọc không chặn được từ nào.
const STOP_WORDS_N = new Set([...STOP_WORDS].map(normalize));

function tokenize(text) {
  return normalize(text).split(' ').filter(w => w.length > 2 && !STOP_WORDS_N.has(w));
}

// Index IDF — dựng một lần cho mỗi knowledge base, cache theo tham chiếu mảng.
// Không có IDF thì câu "bao giờ điểm lab mới trả nhỉ" ăn điểm cao chỉ vì các từ
// "điểm", "lab" xuất hiện khắp transcript, và ngữ cảnh nạp vào toàn đoạn vô can.
const _indexCache = new WeakMap();

function getIndex(knowledgeBase) {
  let idx = _indexCache.get(knowledgeBase);
  if (idx) return idx;

  const df = new Map();
  const docs = knowledgeBase.map(entry => {
    const bodyTokens = new Set(tokenize(`${entry.topic} ${entry.excerpt}`));
    const kwTokens = new Set(tokenize((entry.keywords || []).join(' ')));
    for (const t of new Set([...bodyTokens, ...kwTokens])) df.set(t, (df.get(t) || 0) + 1);
    return { entry, bodyTokens, kwTokens, hay: normalize(`${entry.topic} ${entry.excerpt}`) };
  });

  const N = docs.length || 1;
  const idf = t => Math.log(N / (1 + (df.get(t) || 0)));
  idx = { docs, idf };
  _indexCache.set(knowledgeBase, idx);
  return idx;
}

/**
 * Chọn tối đa K đoạn transcript liên quan nhất tới câu hỏi.
 * Điểm = Σ idf(token khớp), keywords nhân đôi (từ khoá đại diện của đoạn),
 * cộng thưởng cho cụm 2 từ khớp nguyên cụm ("tool calling", "context window").
 * Chỉ giữ đoạn đạt ngưỡng tuyệt đối và ngưỡng tương đối so với đoạn tốt nhất —
 * câu hỏi không có căn cứ thì trả về mảng rỗng để model đi nhánh "không tìm thấy".
 */
function retrieveContext(query, knowledgeBase, k = 6) {
  const qTokens = [...new Set(tokenize(query))];
  if (!qTokens.length) return [];

  const { docs, idf } = getIndex(knowledgeBase);
  const bigrams = qTokens.slice(0, -1).map((t, i) => `${t} ${qTokens[i + 1]}`);
  const queryMass = qTokens.reduce((a, t) => a + Math.max(idf(t), 0), 0);
  if (queryMass <= 0) return [];

  const scored = docs.map(doc => {
    let score = 0;
    let matched = 0;
    for (const t of qTokens) {
      const w = idf(t);
      if (w <= 0) continue;
      if (doc.kwTokens.has(t)) { score += w * 2; matched += w; }
      else if (doc.bodyTokens.has(t)) { score += w; matched += w; }
    }
    for (const b of bigrams) if (doc.hay.includes(b)) score += 3;
    return { entry: doc.entry, score, coverage: matched / queryMass };
  }).sort((a, b) => b.score - a.score);

  // Đoạn tốt nhất phải phủ được một phần đáng kể "sức nặng" của câu hỏi. Câu như
  // "rtcf ở slide nào" chỉ khớp mỗi từ "slide" — không đủ để gọi là có căn cứ, và
  // nạp nó vào ngữ cảnh chính là mời model trích bừa (lớp ①).
  const top = scored[0];
  if (!top || top.score < MIN_SCORE || top.coverage < MIN_COVERAGE) return [];
  const floor = Math.max(MIN_SCORE, top.score * REL_FLOOR);

  return scored
    .filter(s => s.score >= floor && s.coverage >= MIN_COVERAGE * 0.8)
    .slice(0, k)
    .map(s => s.entry);
}

function buildGroundingBlock(entries) {
  if (!entries.length) {
    return `\n\n---\n\n## NGỮ CẢNH BÀI GIẢNG\n\n(Không tìm được đoạn transcript nào liên quan tới câu hỏi này.)\n`
      + `→ Bạn KHÔNG có căn cứ để trả lời nội dung lý thuyết. Nói rõ là không tìm thấy trong transcript, không kèm mã [Txx-NNN] nào, và gợi ý hỏi TA.`;
  }
  const items = entries
    .map(e => `- **[${e.ref}]** · ${e.day} · ${e.topic}\n  "${e.excerpt}"`)
    .join('\n\n');
  return `\n\n---\n\n## NGỮ CẢNH BÀI GIẢNG (${entries.length} đoạn — đây là TOÀN BỘ tài liệu bạn được phép trích)\n\n${items}`;
}

function buildSystemPrompt(query, knowledgeBase, k = 6) {
  return SYSTEM_PROMPT_BASE + buildGroundingBlock(retrieveContext(query, knowledgeBase, k));
}

if (typeof module !== 'undefined') {
  module.exports = { SYSTEM_PROMPT_BASE, normalize, tokenize, retrieveContext, buildGroundingBlock, buildSystemPrompt };
}
