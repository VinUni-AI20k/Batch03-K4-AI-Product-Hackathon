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
// SYSTEM PROMPT + RETRIEVAL — xem codebase/prompt.js
// (SYSTEM_PROMPT_BASE và buildSystemPrompt() dùng chung với eval runner)
// ============================================================

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
      resp = await openrouterGeminiCall(text);
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
async function openrouterGeminiCall(query) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  // Grounding: nạp các đoạn transcript liên quan tới đúng câu hỏi này vào system prompt.
  // Trước đây prompt yêu cầu "bắt buộc kèm mã [Txx-NNN]" mà không đưa tài liệu nào —
  // model không còn cách nào khác ngoài bịa mã.
  const messages = [
    { role: 'system', content: buildSystemPrompt(query, KNOWLEDGE_BASE) },
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
  const codes = [...new Set((raw.match(/\[T\d{2}-\d{3}\]/g) || []).map(r => r.slice(1, -1)))];

  // Kịch bản K2 (spec §5): mã model trả về mà không có trong knowledge base thì KHÔNG
  // được render thành citation card. Card giữ chỗ "(Xem transcript)" vẫn trông y hệt một
  // trích dẫn hợp lệ — đó là đúng cái lỗi lớp ① mà sản phẩm hứa chống.
  const citations = [];
  const unverified = [];
  for (const code of codes) {
    const hit = KNOWLEDGE_BASE.find(k => k.ref === code);
    if (hit) citations.push(hit);
    else unverified.push(code);
  }
  if (unverified.length) {
    console.warn('[co-pilot] Mã trích dẫn không đối chiếu được, đã ẩn:', unverified.join(', '));
  }
  return { raw, answer: raw, citations, unverified };
}

// ============================================================
// MOCK
// ============================================================
// Mock mode dùng chung đúng bộ retrieval với AI thật — chỉ khác ở chỗ không gọi model,
// mà đọc thẳng đoạn transcript khớp nhất. Nhờ vậy mock không bao giờ trích được mã
// không tồn tại, và đường "không có căn cứ" cũng hiện đúng như bản chạy thật.
async function mockResponse(text) {
  await delay(700 + Math.random() * 500);
  const citations = retrieveContext(text, KNOWLEDGE_BASE, 2);

  if (!citations.length) {
    const answer = `Mình không tìm thấy nội dung này trong transcript 6 buổi giảng của khoá 🙏\n\nBạn thử hỏi cụ thể hơn về một khái niệm đã học, hoặc hỏi TA để có câu trả lời chính xác nhé.`;
    return { raw: answer, answer, citations: [], unverified: [] };
  }

  const top = citations[0];
  const answer = `Phần này được nhắc tới trong **${top.day}** — mục *${top.topic}* [${top.ref}].\n\n`
    + `Bạn đọc đoạn trích bên dưới rồi đối chiếu với chỗ đang kẹt nhé; nếu chưa khớp, gõ tiếp cho mình biết bạn đang vướng ở bước nào.`;
  return { raw: answer, answer, citations, unverified: [] };
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

function appendAssistantMsg({ answer, citations, unverified = [] }) {
  const el = document.createElement('div');
  el.className = 'ai-msg assistant';

  const citHtml = citations.map(c => `
    <div class="citation-card">
      <div class="citation-top">
        <span class="citation-ref">[${c.ref}]</span>
        <span class="citation-src">📚 ${c.day} · ${c.topic}</span>
      </div>
      <p class="citation-text">"${c.excerpt}"</p>
    </div>`).join('')
    // G2 — nói rõ mức tin cậy: mã không đối chiếu được thì cảnh báo, không dựng card.
    + (unverified.length ? `
    <div class="citation-warn">⚠️ Mã ${unverified.map(u => `[${u}]`).join(', ')} không đối chiếu được với transcript khoá học — đừng dùng làm căn cứ.</div>` : '')
    // K3 — trả lời không kèm căn cứ nào phải được đánh dấu khác hẳn câu có trích dẫn.
    + (!citations.length && !unverified.length ? `
    <div class="citation-warn">Câu này mình trả lời từ hiểu biết chung, chưa trace được về transcript khoá học.</div>` : '');

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
