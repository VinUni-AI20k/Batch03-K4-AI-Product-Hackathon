/**
 * CODELAB AI CO-PILOT — App Logic (VLearn Theme)
 *
 * Flow:
 *  - Panel mở/đóng qua nút "AI Co-Pilot" trên header hoặc FAB
 *  - Chips nhanh → tự điền câu hỏi và gửi
 *  - OpenRouter Gemini call thật khi có key; fallback Mock từ KNOWLEDGE_BASE
 *  - Citation cards hiển thị trích dẫn [Txx-NNN] từ transcript khoá học
 */

// ============================================================
// KNOWLEDGE BASE — Trích từ transcript khoá học (data/vlearn-pack/transcript/)
// (Biến KNOWLEDGE_BASE được khởi tạo từ file knowledge_base.js)
// ============================================================

// ============================================================
// SYSTEM PROMPT
// ============================================================
const SYSTEM_PROMPT = `Bạn là **Codelab AI Co-Pilot** — Trợ lý AI được tích hợp trực tiếp trên giao diện Codelab để hỗ trợ học viên thực hành bài tập lập trình vào buổi chiều cho khóa học AI Thực Chiến.

Mục tiêu chính của bạn là hỗ trợ học viên giải quyết kẹt lỗi/logic bằng cách đối chiếu với kiến thức bài giảng lý thuyết buổi sáng, giúp học viên không phải rời màn hình Codelab để lật tìm lại slide/transcript.

---

## QUY TẮC BẮT BỘC (GUARDRAILS)

### 1. Trích dẫn nguồn bắt buộc (Grounding - Lớp ①)
- Mọi giải thích nguyên lý/lý thuyết PHẢI được đối chiếu với bài giảng buổi sáng và bắt buộc đính kèm mã trích dẫn đoạn bài giảng dạng [Txx-NNN] (Ví dụ: [T02-045] hoặc [T01-012]).
- Tuyệt đối không bịa đặt kiến thức ngoài phạm vi tài liệu được cấp.

### 2. Định hướng, không viết hộ (Augment Mode - Lớp ③)
- Bạn đóng vai trò hướng dẫn (Augment).
- KHÔNG ĐƯỢC viết sẵn 100% đoạn code sửa hoàn chỉnh cho học viên.
- Chỉ chỉ ra nguyên lý sai, logic thiếu sót và gợi ý hướng sửa để học viên tự gõ code.

### 3. Xử lý câu hỏi mơ hồ / Thiếu bối cảnh (G10 - Clarification - Lớp ②)
- Nếu câu hỏi của học viên quá ngắn, chung chung (VD: "lỗi này sửa sao", "bị lỗi 500", "code không chạy") hoặc thiếu đoạn code/log lỗi, KHÔNG ĐƯỢC đoán mò.
- Bắt buộc phải đặt lại ĐÚNG 1 CÂU HỎI ngắn gọn để yêu cầu học viên làm rõ bối cảnh.

### 4. Văn phong & Độ dài
- Trả lời ngắn gọn, súc tích (tối đa 3 - 4 câu).
- Giọng văn thân thiện, đúng vai trò đồng hành hỗ trợ học viên.

---

## CẤU TRÚC KẾT QUẢ TRẢ VỀ (OUTPUT FORMAT)

Mỗi phản hồi của bạn nên đi theo cấu trúc 3 phần ngắn gọn:
1. **Nhận diện nguyên lý sai:** (1 câu chỉ ra điểm kẹt logic)
2. **Căn cứ bài giảng:** (1 câu tóm tắt nguyên lý + Mã trích dẫn [Txx-NNN])
3. **Gợi ý hành động:** (1 câu hướng dẫn học viên tự sửa code)

*(Lưu ý: Nếu nhận được ngữ cảnh cảnh báo thời gian Checkpoint, hãy thêm 1 dòng nhắc nhở đếm ngược ngắn ở cuối).*`;

// ============================================================
// STATE
// ============================================================
const state = {
  apiKey: null,
  useMock: false,
  isLoading: false,
  history: [],
  panelOpen: true
};

// ============================================================
// DOM
// ============================================================
const $ = id => document.getElementById(id);
const dom = {
  aiPanel:       $('aiPanel'),
  aiMessages:    $('aiMessages'),
  aiInput:       $('aiInput'),
  btnAiSend:     $('btnAiSend'),
  btnAiHeader:   $('btnAiHeader'),
  btnClosePanel: $('btnClosePanel'),
  fabAi:         $('fabAi'),
  modalBackdrop: $('modalBackdrop'),
  apiKeyInput:   $('apiKeyInput'),
  btnSaveKey:    $('btnSaveKey'),
  btnMock:       $('btnMock'),
  toast:         $('toast'),
  countdown:     $('countdownDisplay'),
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initPanelToggle();
  initInput();
  initChips();
  initModal();
  initCountdown();
  initStepNav();

  // Show modal on first load
  dom.modalBackdrop.classList.remove('hidden');

  // Restore key
  const saved = sessionStorage.getItem('vlearn_openrouter_key');
  if (saved) {
    state.apiKey = saved;
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(true);
  }
});

// ============================================================
// PANEL TOGGLE
// ============================================================
function initPanelToggle() {
  dom.btnAiHeader.addEventListener('click', () => togglePanel(true));
  dom.btnClosePanel.addEventListener('click', () => togglePanel(false));
  dom.fabAi.addEventListener('click', () => togglePanel(true));
}

function togglePanel(open) {
  state.panelOpen = open;
  if (open) {
    dom.aiPanel.classList.remove('collapsed');
    dom.fabAi.classList.add('hidden');
  } else {
    dom.aiPanel.classList.add('collapsed');
    dom.fabAi.classList.remove('hidden');
  }
}

// ============================================================
// STEP NAVIGATION (demo only)
// ============================================================
function initStepNav() {
  document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.step-item').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.step-dot').forEach(d => {
        if (d.classList.contains('active')) {
          d.classList.remove('active');
          d.textContent = d.closest('.step-item').querySelector('span').textContent.slice(0,1);
        }
      });
      item.classList.add('active');
      const dot = item.querySelector('.step-dot');
      dot.classList.add('active');
    });
  });
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown() {
  let secs = 10 * 3600 + 42 * 60 + 51;
  setInterval(() => {
    if (secs <= 0) return;
    secs--;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    dom.countdown.textContent =
      `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, 1000);
}

// ============================================================
// MODAL
// ============================================================
function initModal() {
  dom.btnSaveKey.addEventListener('click', () => {
    const key = dom.apiKeyInput.value.trim();
    if (!key.startsWith('sk-or-v1-')) {
      showToast('⚠️ Key không hợp lệ (phải bắt đầu bằng "sk-or-v1-")');
      return;
    }
    state.apiKey = key;
    sessionStorage.setItem('vlearn_openrouter_key', key);
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(true);
    showToast('✅ Đã kết nối OpenRouter Gemini — AI thật đã sẵn sàng!');
  });

  dom.btnMock.addEventListener('click', () => {
    state.useMock = true;
    dom.modalBackdrop.classList.add('hidden');
    setSourceTag(false);
    showToast('🎭 Mock mode — Câu trả lời từ transcript khoá học');
  });
}

function setSourceTag(real) {
  const el = document.querySelector('.ai-source-tag');
  if (!el) return;
  el.innerHTML = real
    ? `<span style="color:var(--success)">●</span>&nbsp;Gemini 2.5 Flash · OpenRouter`
    : `<span style="color:var(--warning)">●</span>&nbsp;Mock mode`;
}

// ============================================================
// INPUT
// ============================================================
function initInput() {
  dom.aiInput.addEventListener('input', () => {
    dom.aiInput.style.height = 'auto';
    dom.aiInput.style.height = Math.min(dom.aiInput.scrollHeight, 100) + 'px';
  });
  dom.aiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });
  dom.btnAiSend.addEventListener('click', handleSend);
}

function initChips() {
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-q]');
    if (!chip) return;
    dom.aiInput.value = chip.dataset.q;
    handleSend();
  });
}

// ============================================================
// SEND
// ============================================================
async function handleSend() {
  const text = dom.aiInput.value.trim();
  if (!text || state.isLoading) return;

  appendUserMsg(text);
  dom.aiInput.value = '';
  dom.aiInput.style.height = 'auto';

  state.history.push({ role: 'user', content: text });

  const typingEl = appendTyping();
  state.isLoading = true;
  dom.btnAiSend.disabled = true;

  try {
    let resp;
    if (state.useMock || !state.apiKey) {
      resp = await mockResponse(text);
    } else {
      resp = await openrouterGeminiCall();
    }
    typingEl.remove();
    appendAssistantMsg(resp);
    state.history.push({ role: 'model', content: resp.raw });
  } catch (err) {
    typingEl.remove();
    appendErrorMsg(err.message);
  } finally {
    state.isLoading = false;
    dom.btnAiSend.disabled = false;
    scrollBottom();
  }
}

// ============================================================
// OPENROUTER GEMINI API
// ============================================================
async function openrouterGeminiCall() {
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...state.history.slice(-6).map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content }))
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.apiKey}`,
      'HTTP-Referer': location.origin,
      'X-Title': 'K4-hackathon-HiHi-E403'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.4,
      max_tokens: 600,
      top_p: 0.9
    })
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '(Không có phản hồi)';
  return parseResp(raw);
}

function parseResp(raw) {
  const refs = [...(raw.match(/\[T\d{2}-\d{3}\]/g) || [])];
  const citations = refs.map(r => {
    const code = r.slice(1, -1);
    return KNOWLEDGE_BASE.find(k => k.ref === code) || { ref: code, day: '?', topic: 'Transcript khoá học', excerpt: '(Xem transcript)' };
  }).filter((c, i, a) => a.findIndex(x => x.ref === c.ref) === i);
  return { raw, answer: raw, citations };
}

// ============================================================
// MOCK
// ============================================================
async function mockResponse(text) {
  await delay(700 + Math.random() * 500);
  const lower = text.toLowerCase();
  const matched = KNOWLEDGE_BASE.filter(k => k.keywords.some(kw => lower.includes(kw)));

  let answer = '';
  let citations = matched.slice(0, 2);

  if (lower.includes('intent') || lower.includes('review_concept') || lower.includes('chatlog') || lower.includes('mining')) {
    answer = `Intent **review_concept** là loại hội thoại mà học viên hỏi AI Tutor để nhắc lại lý thuyết đã học, không phải hỏi code. Đây là intent phổ biến nhất trong chatlog khoá học — chiếm ~85% theo mining của nhóm bạn.\n\nĐây là bằng chứng mạnh cho pain point *"phải tra lý thuyết khi làm Codelab"* vì nó đếm được và có ví dụ nguyên văn.`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T02-008' || k.ref === 'T02-012');
  } else if (lower.includes('pain point') || lower.includes('actor') || lower.includes('hành vi') || lower.includes('có những gì')) {
    answer = `Một pain point đầy đủ cần **4 thành tố**: (1) **Actor** — ai cụ thể, (2) **Hành vi** — đang làm gì, (3) **Trở ngại** — vướng ở đâu, (4) **Hậu quả** — tốn gì (thời gian / điểm số / niềm tin).\n\n"Học viên không thích giao diện" ✗ — "Học viên đang gõ code Codelab bị kẹt lỗi phải chuyển tab tìm slide, tốn 10-15 phút/lần" ✓`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T01-001' || k.ref === 'T01-011');
  } else if (lower.includes('mining') || lower.includes('bằng chứng') || lower.includes('evidence') || lower.includes('đúng chuẩn')) {
    answer = `Chuẩn evidence Đường B — Mining gồm: **(1)** Số đếm được (VD: "41/200 hội thoại"), **(2)** ≥5 ví dụ nguyên văn (copy từ chatlog), **(3)** Phương pháp đếm ghi rõ để người khác kiểm lại được.\n\n❌ Không đạt: "nhiều bạn hỏi lại lý thuyết" (cảm nhận, không đếm được).`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T02-012');
  } else if (lower.includes('impact') || lower.includes('bảng') || lower.includes('so sánh') || lower.includes('ứng viên')) {
    answer = `Bảng impact cần **≥3 ứng viên**, mỗi dòng gồm: tên pain point | số người gặp | tần suất | mỗi lần tốn gì | có build nổi trong sự kiện không.\n\nChọn ứng viên có **bằng chứng mạnh nhất** (số đếm được, không phải ứng viên nghe "hay nhất"). Ứng viên bị loại vẫn giữ lại trong spec để người chấm thấy nhóm đã cân nhắc.`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T02-018');
  } else if (lower.includes('lát cắt') || lower.includes('một câu') || lower.includes('format') || lower.includes('prototype')) {
    answer = `Lát cắt = **1 user · 1 việc · 1 quyết định AI · 1 kết quả**, tất cả trong 1 câu.\n\nVí dụ: *"Học viên đang gõ code Codelab bị kẹt lỗi → AI Co-Pilot trích 2 dòng lý thuyết liên quan kèm mã [Txx-NNN] → học viên tự sửa được mà không rời trang."*\n\nKiểm tra: bỏ AI ra, việc đó có còn tồn tại không? Có → Pain point thật.`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T03-005');
  } else if (lower.includes('chỗ khó') || lower.includes('rủi ro') || lower.includes('taxonomy')) {
    answer = `4 lớp chỗ khó cần cụ thể hoá cho sản phẩm của bạn:\n① **Nguồn sự thật** — AI có thể bịa citation [Txx-NNN] không tồn tại\n② **Mơ hồ** — học viên hỏi quá chung chung, AI nên hỏi lại\n③ **Ngoài phạm vi** — hỏi đáp án assignment thay vì hỏi lý thuyết\n④ **Domain** — cite sai trang/đoạn → học viên học sai kiến thức`;
    citations = KNOWLEDGE_BASE.filter(k => k.ref === 'T03-011');
  } else {
    answer = `Câu hỏi hay! Tuy nhiên mình không tìm thấy đoạn lý thuyết trực tiếp cho vấn đề này trong transcript khoá học. Bạn có thể hỏi TA để có câu trả lời chính xác hơn nhé 🙏\n\nHoặc bạn thử hỏi cụ thể hơn về: mining chatlog, pain point, bảng impact, lát cắt, hoặc 4 lớp chỗ khó?`;
    citations = [];
  }

  return { raw: answer, answer, citations };
}

// ============================================================
// DOM HELPERS
// ============================================================
function appendUserMsg(text) {
  const el = document.createElement('div');
  el.className = 'ai-msg user';
  el.innerHTML = `
    <div class="ai-avatar">HV</div>
    <div class="ai-msg-content"><p>${esc(text)}</p></div>
  `;
  dom.aiMessages.appendChild(el);
  scrollBottom();
}

function appendAssistantMsg({ answer, citations }) {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';

  const citHtml = citations.map(c => `
    <div class="citation-card">
      <div class="citation-top">
        <span class="citation-ref">[${c.ref}]</span>
        <span class="citation-src">📚 ${c.day} · ${c.topic}</span>
      </div>
      <p class="citation-text">"${c.excerpt}"</p>
    </div>`).join('');

  const uid = Date.now();
  el.innerHTML = `
    <div class="ai-avatar" style="background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="url(#am${uid})"/>
        <path d="M5 8l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <defs><linearGradient id="am${uid}" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stop-color="#4285f4"/><stop offset="1" stop-color="#8b5cf6"/>
        </linearGradient></defs>
      </svg>
    </div>
    <div class="ai-msg-content">
      <div>${mdToHtml(answer)}</div>
      ${citHtml}
    </div>`;
  dom.aiMessages.appendChild(el);
  scrollBottom();
}

function appendTyping() {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';
  el.innerHTML = `
    <div class="ai-avatar" style="background:#f1f3f4">
      <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#4285f4" opacity=".3"/></svg>
    </div>
    <div class="typing-wrap">
      <div class="typing-dots"><span></span><span></span><span></span></div>
      <span class="typing-label">Đang tra transcript...</span>
    </div>`;
  dom.aiMessages.appendChild(el);
  scrollBottom();
  return el;
}

function appendErrorMsg(msg) {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';
  el.innerHTML = `
    <div class="ai-avatar" style="background:#fce8e6;font-size:12px">⚠</div>
    <div class="ai-msg-content">
      <p style="color:#d93025">Lỗi kết nối: <strong>${esc(msg)}</strong></p>
      <p>Bạn thử lại sau hoặc chuyển sang Mock mode.</p>
    </div>`;
  dom.aiMessages.appendChild(el);
}

function scrollBottom() {
  requestAnimationFrame(() => { dom.aiMessages.scrollTop = dom.aiMessages.scrollHeight; });
}

// ============================================================
// UTILS
// ============================================================
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

function mdToHtml(md) {
  return md
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px">$2</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ol style="margin:8px 0">${s}</ol>`)
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px">')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function showToast(msg, ms = 2500) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  setTimeout(() => dom.toast.classList.remove('show'), ms);
}
