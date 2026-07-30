require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'prototype')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasKey: Boolean(OPENAI_API_KEY), model: OPENAI_MODEL });
});

// Quyết định AI trung tâm của lát cắt: tóm tắt toàn bộ slide, grounded vào đúng
// nội dung slide đã gửi lên (chống bịa), điều chỉnh theo hồ sơ học viên.
// Key chỉ tồn tại ở đây (biến môi trường), browser không bao giờ thấy nó.
app.post('/api/summarize', async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(400).json({ ok: false, error: 'Server chưa có OPENAI_API_KEY — kiểm tra file .env' });
  }
  const { docTitle, sections, personaTags } = req.body || {};
  if (!docTitle || !Array.isArray(sections)) {
    return res.status(400).json({ ok: false, error: 'Thiếu docTitle hoặc sections trong request' });
  }
  // Fix từ eval/results-run-1.md (case C04): sections rỗng nhưng không chặn ->
  // model tự bịa nguyên nội dung với citation giả "(trang X)". Chặn sớm ở đây.
  if (sections.length === 0) {
    return res.status(400).json({ ok: false, error: 'sections rỗng — không có nội dung slide để tóm tắt' });
  }

  const context = sections
    .map(s => `- (Trang ${s.page}) ${s.heading}: ${(s.bullets || []).join('; ')}`)
    .join('\n');
  const personaDesc = Array.isArray(personaTags) && personaTags.length
    ? personaTags.join(', ')
    : 'chưa có hồ sơ học viên';
  // Fix từ eval/results-run-1.md (D4 fail ở case C07/C08): chỉ liệt kê tag persona
  // dạng danh sách không đổi được hành vi model — phải ra chỉ thị điều kiện cụ thể.
  const personaInstruction = personaTags.includes('Code: chưa biết') || personaTags.includes('Nền tảng: ngành khác, mới ra trường')
    ? 'BẮT BUỘC thêm đúng 1 câu ẩn dụ đời thường (không dùng thuật ngữ kỹ thuật) cho MỖI khái niệm kỹ thuật trong bài.'
    : personaTags.includes('Code: thành thạo')
      ? 'BẮT BUỘC bỏ hẳn phần giải thích khái niệm lập trình/AI cơ bản, đi thẳng vào ứng dụng/kiến trúc, viết súc tích.'
      : 'Giữ giọng trung tính, không giả định trình độ.';
  const domainInstruction = personaTags.includes('Nền tảng: rẽ ngành sang AI') || personaTags.includes('Mục tiêu: kỹ năng cộng thêm')
    ? 'Với mỗi khái niệm, BẮT BUỘC thêm 1 ví dụ liên hệ công việc/kinh doanh, không chỉ ví dụ kỹ thuật thuần.'
    : '';
  const prompt =
    `Bạn là trợ giảng AI của khoá học AI thực chiến. Dưới đây là nội dung slide "${docTitle}" — ` +
    `CHỈ được dùng đúng các mục này, KHÔNG bịa thêm; nếu học viên cần điều gì không có trong đây, ` +
    `phải nói rõ tài liệu không đề cập:\n${context}\n\n` +
    `Hồ sơ học viên: ${personaDesc}.\n` +
    `Hãy tóm tắt toàn bộ nội dung trên thành các ý chính, MỖI Ý PHẢI ghi rõ "(trang X)" lấy đúng từ ` +
    `nguồn ở trên. ${personaInstruction} ${domainInstruction}\n` +
    `Viết tiếng Việt, ngắn gọn, dễ quét mắt.`;

  const t0 = Date.now();
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error((data && data.error && data.error.message) || `HTTP ${r.status}`);
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('Model không trả về nội dung (có thể bị chặn bởi content filter)');
    res.json({ ok: true, text, model: OPENAI_MODEL, latencyMs: Date.now() - t0 });
  } catch (err) {
    res.status(502).json({ ok: false, error: String(err.message || err), latencyMs: Date.now() - t0 });
  }
});

app.listen(PORT, () => {
  console.log(`VLearn Tutor+ server chạy tại http://localhost:${PORT}`);
  console.log(OPENAI_API_KEY ? 'OPENAI_API_KEY: đã nạp từ .env' : 'OPENAI_API_KEY: CHƯA CÓ — xem .env.example');
});
