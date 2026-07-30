/* =============================================================
   app.js — VLearn prototype (CP2 · mức Mock, bấm đi hết flow)
   Mọi câu trả lời của tutor đang là MOCK — xem mục AI_CALL bên dưới.
   ============================================================= */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- state ---------------- */
const S = {
  page: 1,
  zoom: 1,
  tool: 'read',
  lang: 'vi',
  penSize: 3,
  penColor: '#e0483b',
  moreOpen: false,    // "..." trên toolbar có đang mở thanh phụ không
  notes: [],          // {id,page,kind,quote,text,x,y}
  undo: [],           // {page,label,fn}
  chat: [],
  snap: null,         // vùng ảnh đang đính kèm
  simFail: false,     // mô phỏng lỗi mạng cho câu kế tiếp
  busy: false,
  selQuote: '',
  selPos: null,
};

/* ---------------- i18n ---------------- */
const I18N = {
  vi: {
    sideTitle: 'Học liệu môn học', sideSub: 'Chương, slide và tài liệu đã upload',
    tRead: 'Đọc', tPen: 'Bút', tHl: 'Highlight', tSnip: 'Chụp vùng',
    tCircle: 'Khoanh', tText: 'Text', tImg: 'Ảnh', tEraser: 'Tẩy', stroke: 'NÉT',
    page: 'Trang', note: 'Ghi chú', copy: 'Sao chép', cancel: 'Huỷ',
    askAI: 'Hỏi AI', confused: 'Báo bối rối', snipAsk: 'Hỏi AI vùng này',
    snipHint: 'Kéo chuột để chọn vùng cần hỏi · Esc để thoát',
    ttSub: 'Trợ lý học theo ngữ cảnh', ctxSlide: 'Trang slide',
    askPh: 'Nhập câu hỏi hoặc bôi đen tài liệu...',
    docs: 'TÀI LIỆU', pages: 'trang', notes: 'note',
    answered: 'ĐÃ TRẢ LỜI', lowconf: 'ĐỘ TIN THẤP', failed: 'LỖI', asking: 'ĐANG TRẢ LỜI',
    trust: ['Rất tin cậy', 'Tạm tin cậy', 'Chưa chắc'],
    ctx: 'Ngữ cảnh', srcOne: 'nguồn tham khảo',
    helpful: 'Phản hồi này có hữu ích không?',
    close: 'Đóng', save: 'Lưu', retry: 'Thử lại',
  },
  en: {
    sideTitle: 'Course materials', sideSub: 'Chapters, slides and uploaded files',
    tRead: 'Read', tPen: 'Pen', tHl: 'Highlight', tSnip: 'Snip',
    tCircle: 'Circle', tText: 'Text', tImg: 'Image', tEraser: 'Eraser', stroke: 'SIZE',
    page: 'Page', note: 'Note', copy: 'Copy', cancel: 'Cancel',
    askAI: 'Ask AI', confused: 'Flag confusion', snipAsk: 'Ask AI about this',
    snipHint: 'Drag to select the region · Esc to exit',
    ttSub: 'Context-aware study assistant', ctxSlide: 'Slide page',
    askPh: 'Type a question or highlight the document...',
    docs: 'FILES', pages: 'pages', notes: 'notes',
    answered: 'ANSWERED', lowconf: 'LOW CONFIDENCE', failed: 'FAILED', asking: 'ANSWERING',
    trust: ['High confidence', 'Moderate', 'Unsure'],
    ctx: 'Context', srcOne: 'source(s)',
    helpful: 'Was this helpful?',
    close: 'Close', save: 'Save', retry: 'Retry',
  },
};
const t = k => I18N[S.lang][k];

function applyLang() {
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#btnLang').textContent = S.lang.toUpperCase();
  document.documentElement.lang = S.lang;
  // đổi nhãn "Trang N / 76" trên từng sheet mà không render lại (giữ annotation)
  $$('.page-head > span:first-child').forEach(el => {
    el.textContent = `${t('page')} ${el.closest('.page').dataset.page} / ${DOC.totalPages}`;
  });
  renderChapters();
  syncChrome();
  renderChat();
}

/* ---------------- icons ---------------- */
const ICO = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg>',
  caret: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h5v18H6a2 2 0 01-2-2zM13 3h5a2 2 0 012 2v14a2 2 0 01-2 2h-5z"/></svg>',
  ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="M20 4l-8 8"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/></svg>',
  warn: '<svg viewBox="0 0 24 24"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>',
  err: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
  thumbUp: '<svg viewBox="0 0 24 24"><path d="M7 10v10H4V10zM7 10l4-7a2 2 0 013 2l-1 5h5a2 2 0 012 2.3l-1 6A2 2 0 0117 20H7z"/></svg>',
  thumbDown: '<svg viewBox="0 0 24 24"><path d="M17 14V4h3v10zM17 14l-4 7a2 2 0 01-3-2l1-5H6a2 2 0 01-2-2.3l1-6A2 2 0 017 4h10z"/></svg>',
};

/* =============================================================
   SIDEBAR
   ============================================================= */
function renderChapters() {
  $('#chapters').innerHTML = CHAPTERS.map(c => `
    <div class="chapter${c.open ? ' open' : ''}" data-ch="${c.id}">
      <button class="ch-head">
        <span class="ch-play">${ICO.play}</span>
        <span class="ch-txt">
          <span class="ch-name">${c.title}</span>
          <span class="ch-meta">${c.docs.length} ${t('docs')} · ${c.status}</span>
        </span>
        ${c.studying ? `<span class="badge">STUDYING</span>` : ''}
        <span class="ch-caret">${ICO.caret}</span>
      </button>
      <div class="ch-body">
        ${c.docs.map(d => `
          <button class="docitem${d.active ? ' active' : ''}" data-doc="${d.name}">
            <span class="dot">${ICO.play}</span>
            <span class="doc-t"><b>${d.name}</b><span>${d.pages} ${t('pages')}</span></span>
            <span class="doc-check${d.done ? '' : ' off'}">${ICO.check}</span>
          </button>`).join('')}
      </div>
    </div>`).join('');

  $$('#chapters .ch-head').forEach(b => b.onclick = () => {
    const c = CHAPTERS.find(x => x.id === b.closest('.chapter').dataset.ch);
    c.open = !c.open;
    b.closest('.chapter').classList.toggle('open', c.open);
  });
  $$('#chapters .docitem').forEach(b => b.onclick = () => {
    const name = b.dataset.doc;
    if (name === DOC.file) { goPage(1); toast('ok', 'Đang xem ' + name); }
    else toast('warn', 'Tài liệu "' + name + '" chưa mở trong prototype này');
  });
}

/* =============================================================
   SLIDES
   ============================================================= */
function slideHTML(p) {
  const foot = `<div class="s-foot"><span>${p.foot || ''}</span><span>DAY 02 · ${String(p.n).padStart(2, '0')} / ${DOC.totalPages}</span></div>`;
  const head = `<h2>${p.title || ''}</h2>` + (p.sub ? `<p class="lead">${p.sub}</p>` : '');

  switch (p.kind) {
    case 'title':
      return `<div class="s-eyebrow">${p.eyebrow}</div>
        <h1 class="s-title">${p.title}</h1>
        <p class="s-sub">${p.sub}</p>
        <div class="s-foot"><span>${p.foot}</span><span></span></div>`;

    case 'divider':
      return `<div class="s-eyebrow">${p.eyebrow}</div>
        <h1 class="s-title">${p.title}</h1>
        <p class="s-sub">${p.sub}</p>${foot}`;

    case 'quote':
      return `<div class="s-quote">“${p.quote}”</div><div class="s-by">${p.by}</div>${foot}`;

    case 'numbered':
      return head + p.items.map((x, i) =>
        `<div class="s-num"><i>${String(i + 1).padStart(2, '0')}</i><span>${x}</span></div>`).join('') + foot;

    case 'bullets':
      return head + `<ul class="s-list">${p.items.map(x => `<li>${x}</li>`).join('')}</ul>` + foot;

    case 'compare':
      return head + `<div class="s-cols">${p.cols.map(c =>
        `<div class="s-col ${c.tone}"><h4>${c.head}</h4><ul>${c.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>` + foot;

    case 'stats':
      return head + `<div class="s-stats">${p.stats.map(s =>
        `<div class="s-stat"><b>${s.big}</b><span>${s.small}</span></div>`).join('')}</div>` + foot;

    case 'framework':
      return head + `<div class="s-fw">
        <div><h5>${p.groupA.label}</h5>${p.groupA.items.map(i => `<div class="s-kv"><b>${i.k}</b><span>${i.v}</span></div>`).join('')}</div>
        <div><h5>${p.groupB.label}</h5>${p.groupB.items.map(i => `<div class="s-kv"><b>${i.k}</b><span>${i.v}</span></div>`).join('')}</div>
      </div>` + foot;

    case 'template':
      return head + `<div class="s-tpl">${p.lines.join('<br>')}</div>` + foot;

    case 'profile':
      return `<h2>${p.title}</h2><div class="s-profile">
        <div class="s-avatar">${p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
        <div><div class="nm">${p.name}</div><div class="rl">${p.role}</div>
        <ul class="s-list">${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>
      </div>` + foot;
  }
  return head + foot;
}

function renderPages() {
  const wm = 'DEMO · CP2';
  $('#pages').innerHTML = PAGES.map(p => {
    const green = ['title', 'divider', 'quote'].includes(p.kind);
    return `<section class="page" id="pg${p.n}" data-page="${p.n}">
      <div class="page-head"><span>${t('page')} ${p.n} / ${DOC.totalPages}</span><span class="r">${DOC.file}</span></div>
      <div class="slide${green ? ' green' : ''}" data-wm="${wm}">
        ${slideHTML(p)}
        <svg class="ink" viewBox="0 0 1000 562" preserveAspectRatio="none"></svg>
      </div>
    </section>`;
  }).join('');
  $('#pagerTotal').textContent = DOC.totalPages;
  observePages();
}

/* ---- scroll-spy: tính thẳng từ scrollTop, KHÔNG dùng IntersectionObserver ----
   IntersectionObserver chỉ báo những entry vừa đổi trạng thái nên hay chọn nhầm sang
   trang kế tiếp (hiển thị 12 khi đang đọc 11), và nó vẫn bắn giữa lúc smooth-scroll
   làm S.page bị ghi đè → bấm chuyển trang bị nhảy 2-3 trang một lần.
   Cách dưới đây tính trang theo một "đường ngắm" cố định ngay dưới toolbar,
   và khoá hẳn việc cập nhật trong lúc đang bay tới trang đích. */
const TOP_GAP = 86;        // = padding-top của .pages-scroll (chỗ chừa cho toolbar nổi)
const AIM = TOP_GAP + 24;  // đường ngắm: trang nào vượt qua vạch này thì là trang đang đọc
let pageEls = [];
let scrollTarget = null;   // scrollTop đích khi đang smooth-scroll; null = người dùng tự cuộn
let settleTimer = 0;

function observePages() {
  pageEls = $$('.page');
  const sc = $('#scroller');
  sc.removeEventListener('scroll', onScroll);
  sc.addEventListener('scroll', onScroll, { passive: true });
}

/* trang cuối cùng có mép trên đã vượt lên trên đường ngắm */
function pageAtScroll() {
  const y = $('#scroller').scrollTop + AIM;
  let n = 1;
  for (const el of pageEls) {
    if (el.offsetTop <= y) n = +el.dataset.page;
    else break;                       // pageEls theo đúng thứ tự trang nên dừng được sớm
  }
  return n;
}

function onScroll() {
  if (scrollTarget !== null) {
    // đang bay tới đích: chỉ mở khoá khi đã tới nơi, tuyệt đối không đụng S.page giữa chừng
    if (Math.abs($('#scroller').scrollTop - scrollTarget) < 4) releaseScroll();
    return;
  }
  const n = pageAtScroll();
  if (n !== S.page) { S.page = n; syncChrome(); }
}

function releaseScroll() {
  scrollTarget = null;
  clearTimeout(settleTimer);
}

function goPage(n) {
  n = Math.min(Math.max(1, n), DOC.totalPages);
  S.page = n;
  syncChrome();                        // cập nhật số trang ngay, không đợi cuộn xong
  const sc = $('#scroller'), el = $('#pg' + n);
  const max = Math.max(0, sc.scrollHeight - sc.clientHeight);
  const top = Math.min(Math.max(0, el.offsetTop - TOP_GAP), max);
  if (Math.abs(sc.scrollTop - top) < 4) { releaseScroll(); return; }  // đã ở đúng chỗ
  scrollTarget = top;
  clearTimeout(settleTimer);
  settleTimer = setTimeout(releaseScroll, 1500);  // phòng khi người dùng cắt ngang cú cuộn
  sc.scrollTo({ top, behavior: 'smooth' });
}

/* =============================================================
   CHROME (chip, pager, nút bật/tắt)
   ============================================================= */
function syncChrome() {
  const cnt = S.notes.filter(n => n.page === S.page).length;
  $('#chipPageText').textContent = `${t('page')} ${S.page} · ${cnt} ${t('notes')}`;
  $('#pagerNow').textContent = S.page;
  $('#ctxChip').innerHTML = `${t('ctxSlide')}: <b>${S.page}</b>`;
  $('#zoomVal').textContent = Math.round(S.zoom * 100) + '%';
  $('#btnUndo').disabled = !S.undo.length;
  const pg = $('#pg' + S.page);
  const hasInk = pg && pg.querySelector('.ink > *, mark, .note-pin, .slide-text, .slide-img');
  $('#btnClear').disabled = !hasInk;
}

/* =============================================================
   TOOLS
   ============================================================= */
const SVG_NS = 'http://www.w3.org/2000/svg';
const COLORS = ['#e0483b', '#2f7fe0', '#22a06b', '#facc15', '#f97316', '#111827'];
const INK_TOOLS = ['pen', 'circle', 'text'];   // các công cụ cần bảng màu + độ dày nét

function setTool(name) {
  S.tool = name;
  $$('.tool[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === name));
  $$('.page').forEach(p => {
    p.classList.toggle('pen-mode', name === 'pen' || name === 'circle');
    p.classList.toggle('hl-mode', name === 'hl');
    p.classList.toggle('text-mode', name === 'text');
    p.classList.toggle('eraser-mode', name === 'eraser');
  });
  name === 'snip' ? openSnip() : closeSnip();
  updateSubbar();
}

/* ----- thanh công cụ phụ ----- */
function renderSwatches() {
  $('#swatches').innerHTML = COLORS.map(c =>
    `<button class="swatch${c === S.penColor ? ' on' : ''}" data-color="${c}" style="background:${c}" data-tip="${c}"></button>`).join('');
  $$('#swatches .swatch').forEach(b => b.onclick = () => {
    S.penColor = b.dataset.color;
    renderSwatches();
    // đổi màu cho ô chữ đang gõ dở
    const live = document.activeElement;
    if (live && live.classList?.contains('slide-text')) live.style.color = S.penColor;
  });
}

function updateSubbar() {
  const inky = INK_TOOLS.includes(S.tool);
  const show = S.moreOpen || inky;
  $('#subbar').hidden = !show;
  $('#subExtra').hidden = !S.moreOpen;
  $('#inkOpts').hidden = !inky;
  $('#subSep').hidden = !(S.moreOpen && inky);
  $('#btnMore').classList.toggle('active', S.moreOpen);
  // canh cho thanh phụ rộng bằng toolbar chính, giống bản VLearn thật
  if (show) $('#subbar').style.width = $('#toolbar').offsetWidth + 'px';
}

/* ----- bút vẽ & khoanh tròn ----- */
let draw = null;
document.addEventListener('pointerdown', e => {
  if (S.tool !== 'pen' && S.tool !== 'circle') return;
  const slide = e.target.closest('.slide');
  if (!slide) return;
  e.preventDefault();
  const svg = slide.querySelector('.ink');

  if (S.tool === 'circle') {
    const el = document.createElementNS(SVG_NS, 'ellipse');
    el.style.stroke = S.penColor;
    el.setAttribute('stroke-width', S.penSize);
    svg.appendChild(el);
    draw = { mode: 'circle', el, slide, start: slidePt(slide, e) };
  } else {
    const path = document.createElementNS(SVG_NS, 'path');
    path.style.stroke = S.penColor;
    path.setAttribute('stroke-width', S.penSize);
    svg.appendChild(path);
    draw = { mode: 'pen', el: path, pts: [], slide };
    addPoint(e);
  }
  slide.setPointerCapture?.(e.pointerId);
});

document.addEventListener('pointermove', e => {
  if (!draw) return;
  if (draw.mode === 'pen') return addPoint(e);
  const p = slidePt(draw.slide, e), s = draw.start;
  draw.el.setAttribute('cx', (s.x + p.x) / 2);
  draw.el.setAttribute('cy', (s.y + p.y) / 2);
  draw.el.setAttribute('rx', Math.abs(p.x - s.x) / 2);
  draw.el.setAttribute('ry', Math.abs(p.y - s.y) / 2);
});

document.addEventListener('pointerup', () => {
  if (!draw) return;
  const { el, slide, mode } = draw;
  const page = +slide.closest('.page').dataset.page;
  const tooSmall = mode === 'pen'
    ? draw.pts.length < 2
    : (+el.getAttribute('rx') < 6 || +el.getAttribute('ry') < 6);
  if (tooSmall) el.remove();
  else pushUndo(page, mode === 'pen' ? 'nét bút' : 'nét khoanh', () => el.remove());
  draw = null;
  syncChrome();
});

/* toạ độ con trỏ quy về hệ 1000×562 của lớp mực */
function slidePt(slide, e) {
  const r = slide.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * 1000, y: ((e.clientY - r.top) / r.height) * 562 };
}
function addPoint(e) {
  const p = slidePt(draw.slide, e);
  draw.pts.push([p.x, p.y]);
  draw.el.setAttribute('d', draw.pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' '));
}

/* ----- công cụ Text ----- */
document.addEventListener('pointerdown', e => {
  if (S.tool !== 'text') return;
  const slide = e.target.closest('.slide');
  if (!slide || e.target.closest('.slide-text')) return;
  const r = slide.getBoundingClientRect();
  addTextBox(slide, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
});

function addTextBox(slide, xPct, yPct) {
  const page = +slide.closest('.page').dataset.page;
  const box = document.createElement('div');
  box.className = 'slide-text';
  box.contentEditable = 'true';
  box.style.left = xPct + '%';
  box.style.top = yPct + '%';
  box.style.color = S.penColor;
  box.style.fontSize = (1.3 + S.penSize * 0.22).toFixed(2) + 'cqw';
  slide.appendChild(box);
  box.focus();
  let counted = false;
  box.addEventListener('blur', () => {
    if (!box.textContent.trim()) { box.remove(); syncChrome(); return; }
    if (!counted) { counted = true; pushUndo(page, 'ô chữ', () => box.remove()); }
    syncChrome();
  });
}

/* ----- công cụ Ảnh ----- */
$('#btnImg').onclick = () => $('#imgPicker').click();
$('#imgPicker').onchange = e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    const slide = $('#pg' + S.page + ' .slide');
    if (!slide) return;
    const img = document.createElement('img');
    img.className = 'slide-img';
    img.src = rd.result;
    img.style.left = '50%';
    img.style.top = '50%';
    slide.appendChild(img);
    pushUndo(S.page, 'ảnh chèn', () => img.remove());
    toast('ok', 'Đã chèn ảnh vào trang ' + S.page);
  };
  rd.readAsDataURL(f);
};

/* ----- công cụ Tẩy ----- */
document.addEventListener('pointerdown', e => {
  if (S.tool !== 'eraser') return;
  const slide = e.target.closest('.slide');
  if (!slide) return;
  e.preventDefault();
  if (!eraseAt(slide, e.clientX, e.clientY)) toast('warn', 'Không có nét nào ở chỗ vừa bấm');
});

function eraseAt(slide, cx, cy) {
  const page = +slide.closest('.page').dataset.page;

  // 1) chữ, ảnh, ghim, highlight — bắt theo khung bao, phần tử mới nhất được ưu tiên
  const plain = [...slide.querySelectorAll('.slide-text,.slide-img,.note-pin,mark')].reverse();
  for (const el of plain) {
    const r = el.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) { removeAnn(el, page); return true; }
  }

  // 2) nét bút / khoanh — dùng isPointInStroke, nới tạm bề rộng nét cho dễ trúng
  const svg = slide.querySelector('.ink');
  const p = slidePt(slide, { clientX: cx, clientY: cy });
  const pt = svg.createSVGPoint ? svg.createSVGPoint() : new DOMPoint();
  pt.x = p.x; pt.y = p.y;
  for (const el of [...svg.children].reverse()) {
    if (!el.isPointInStroke) continue;
    const w = +el.getAttribute('stroke-width') || 3;
    el.setAttribute('stroke-width', w + 14);
    const hit = el.isPointInStroke(pt);
    el.setAttribute('stroke-width', w);
    if (hit) { removeAnn(el, page); return true; }
  }
  return false;
}

function removeAnn(el, page) {
  const parent = el.parentNode, next = el.nextSibling;
  if (el.tagName === 'MARK') {
    // gỡ thẻ mark nhưng giữ nguyên các node con để hoàn tác bọc lại được
    const kids = [...el.childNodes];
    kids.forEach(k => parent.insertBefore(k, el));
    el.remove();
    pushUndo(page, 'tẩy highlight', () => {
      parent.insertBefore(el, next);
      kids.forEach(k => el.appendChild(k));
    });
  } else {
    if (el.classList?.contains('note-pin')) S.notes = S.notes.filter(n => (n.text || n.quote) !== el.title);
    el.remove();
    pushUndo(page, 'tẩy', () => parent.insertBefore(el, next));
  }
  syncChrome();
}

function pushUndo(page, label, fn) {
  S.undo.push({ page, label, fn });
  syncChrome();
}

/* ----- highlight ----- */
function highlightSelection() {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  const slide = slideOf(range.commonAncestorContainer);
  if (!slide) return null;
  const mark = document.createElement('mark');
  try { mark.appendChild(range.extractContents()); range.insertNode(mark); }
  catch { return null; }
  sel.removeAllRanges();
  const page = +slide.closest('.page').dataset.page;
  pushUndo(page, 'highlight', () => {
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    mark.remove(); parent.normalize();
  });
  return { page, mark };
}

/* ----- ghim ghi chú lên slide ----- */
function addPin(note) {
  const slide = $('#pg' + note.page + ' .slide');
  if (!slide) return;
  const pin = document.createElement('div');
  pin.className = 'note-pin' + (note.kind === 'confused' ? ' confused' : '');
  pin.style.left = note.x + '%';
  pin.style.top = note.y + '%';
  pin.textContent = note.kind === 'confused' ? '?' : 'N';
  pin.title = note.text || note.quote;
  pin.onclick = ev => { ev.stopPropagation(); openNotesModal(note.page); };
  slide.appendChild(pin);
  pushUndo(note.page, 'ghi chú', () => {
    pin.remove();
    S.notes = S.notes.filter(n => n.id !== note.id);
    syncChrome();
  });
}

function addNote({ page, kind, quote, text, x = 88, y = 12 }) {
  const note = { id: 'n' + Date.now() + Math.random().toString(36).slice(2, 5), page, kind, quote, text, x, y };
  S.notes.push(note);
  addPin(note);
  syncChrome();
  return note;
}

/* =============================================================
   ★ CÔNG CỤ CHỤP VÙNG (snip)
   ============================================================= */
const snipLayer = $('#snipLayer'), snipBox = $('#snipBox'), snipBar = $('#snipBar');
let snip = null;   // {x,y,w,h} theo toạ độ của viewer
let dragMode = null;

function openSnip() {
  snipLayer.hidden = false;
  snipLayer.classList.add('dim');
  $('#snipHint').hidden = false;
  snipBox.hidden = true;
  snipBar.hidden = true;
  snip = null;
}
function closeSnip() {
  snipLayer.hidden = true;
  snipLayer.classList.remove('dim');
  snipBox.hidden = true;
  snip = null;
  if (S.tool === 'snip') { S.tool = 'read'; $$('.tool[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === 'read')); }
}
function paintSnip() {
  snipBox.style.left = snip.x + 'px';
  snipBox.style.top = snip.y + 'px';
  snipBox.style.width = snip.w + 'px';
  snipBox.style.height = snip.h + 'px';
  $('#snipSize').textContent = Math.round(snip.w) + ' × ' + Math.round(snip.h);
  // thanh nút lật lên trên nếu vùng chọn nằm sát đáy
  const bottomRoom = snipLayer.clientHeight - (snip.y + snip.h);
  snipBar.style.top = bottomRoom < 90 ? 'auto' : 'calc(100% + 12px)';
  snipBar.style.bottom = bottomRoom < 90 ? 'calc(100% + 12px)' : 'auto';
}

snipLayer.addEventListener('pointerdown', e => {
  const r = snipLayer.getBoundingClientRect();
  const handle = e.target.closest('.h');
  const inBar = e.target.closest('.snip-bar');
  if (inBar) return;

  if (handle) {
    dragMode = { type: 'resize', dir: [...handle.classList].find(c => c !== 'h'), start: { ...snip }, px: e.clientX, py: e.clientY };
  } else if (snip && e.target.closest('.snip-box')) {
    dragMode = { type: 'move', start: { ...snip }, px: e.clientX, py: e.clientY };
  } else {
    snip = { x: e.clientX - r.left, y: e.clientY - r.top, w: 0, h: 0 };
    dragMode = { type: 'new', ox: snip.x, oy: snip.y };
    snipBox.hidden = false;
    snipBar.hidden = true;
    $('#snipHint').hidden = true;
    paintSnip();
  }
  try { snipLayer.setPointerCapture(e.pointerId); } catch { }
  e.preventDefault();
});

snipLayer.addEventListener('pointermove', e => {
  if (!dragMode) return;
  const r = snipLayer.getBoundingClientRect();
  if (dragMode.type === 'new') {
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    snip.x = Math.min(cx, dragMode.ox); snip.y = Math.min(cy, dragMode.oy);
    snip.w = Math.abs(cx - dragMode.ox); snip.h = Math.abs(cy - dragMode.oy);
  } else if (dragMode.type === 'move') {
    const dx = e.clientX - dragMode.px, dy = e.clientY - dragMode.py;
    snip.x = clamp(dragMode.start.x + dx, 0, r.width - snip.w);
    snip.y = clamp(dragMode.start.y + dy, 0, r.height - snip.h);
  } else {
    const dx = e.clientX - dragMode.px, dy = e.clientY - dragMode.py, s = dragMode.start, d = dragMode.dir;
    let { x, y, w, h } = s;
    if (d.includes('w')) { x = s.x + dx; w = s.w - dx; }
    if (d.includes('e')) { w = s.w + dx; }
    if (d.includes('n')) { y = s.y + dy; h = s.h - dy; }
    if (d.includes('s')) { h = s.h + dy; }
    if (w > 24 && h > 24) snip = { x, y, w, h };
  }
  paintSnip();
});

snipLayer.addEventListener('pointerup', () => {
  if (!dragMode) return;
  dragMode = null;
  if (!snip || snip.w < 20 || snip.h < 20) { snipBox.hidden = true; $('#snipHint').hidden = false; snip = null; return; }
  snipBar.hidden = false;
  paintSnip();
});

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* trang nào nằm dưới tâm vùng chọn (tạm tắt lớp phủ để elementFromPoint xuyên qua) */
function pageUnderSnip() {
  if (!snip) return S.page;
  const r = snipLayer.getBoundingClientRect();
  snipLayer.style.pointerEvents = 'none';
  const el = document.elementFromPoint(r.left + snip.x + snip.w / 2, r.top + snip.y + snip.h / 2);
  snipLayer.style.pointerEvents = '';
  const pg = el && el.closest ? el.closest('.page') : null;
  return pg ? +pg.dataset.page : S.page;
}

$('#snipAsk').onclick = () => {
  const p = pageUnderSnip();
  S.snap = { page: p, w: Math.round(snip.w), h: Math.round(snip.h) };
  closeSnip();
  openTutor(true);
  renderAttach();
  send(`Giải thích giúp mình vùng vừa chọn ở trang ${p}`, { page: p, region: true });
};
$('#snipNote').onclick = () => {
  const p = pageUnderSnip();
  const box = { ...snip };
  closeSnip();
  openNoteEditor({ page: p, quote: `Vùng ảnh ${Math.round(box.w)}×${Math.round(box.h)}px trên slide`, x: 88, y: 12 });
};
$('#snipCopy').onclick = () => {
  toast('ok', `Đã sao chép vùng ${Math.round(snip.w)}×${Math.round(snip.h)}px (mock — chưa render ảnh thật)`);
  closeSnip();
};
$('#snipCancel').onclick = () => closeSnip();

/* =============================================================
   POPUP KHI BÔI ĐEN
   ============================================================= */
const selPopup = $('#selPopup');
const slideOf = node => {
  const el = node && (node.nodeType === 1 ? node : node.parentElement);
  return el ? el.closest('.slide') : null;
};
document.addEventListener('mouseup', e => {
  if (S.tool === 'pen' || S.tool === 'snip') return;
  if (e.target.closest('.sel-popup')) return;
  setTimeout(() => {
    const sel = window.getSelection();
    const txt = sel.toString().trim();
    const slide = sel.rangeCount ? slideOf(sel.getRangeAt(0).startContainer) : null;
    if (!txt || !slide) { selPopup.hidden = true; return; }

    if (S.tool === 'hl') { const r = highlightSelection(); if (r) toast('ok', 'Đã highlight'); selPopup.hidden = true; return; }

    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const sr = slide.getBoundingClientRect();
    S.selQuote = txt;
    S.selPos = {
      page: +slide.closest('.page').dataset.page,
      x: clamp(((rect.left + rect.width / 2 - sr.left) / sr.width) * 100, 4, 96),
      y: clamp(((rect.top - sr.top) / sr.height) * 100, 6, 94),
    };
    selPopup.hidden = false;
    const pw = selPopup.offsetWidth, ph = selPopup.offsetHeight;
    selPopup.style.left = clamp(rect.left + rect.width / 2 - pw / 2, 10, innerWidth - pw - 10) + 'px';
    selPopup.style.top = (rect.top - ph - 10 > 84 ? rect.top - ph - 10 : rect.bottom + 10) + 'px';
  }, 0);
});
document.addEventListener('mousedown', e => {
  if (!e.target.closest('.sel-popup')) selPopup.hidden = true;
  if (!e.target.closest('#moreMenu') && !e.target.closest('#btnDocMenu')) $('#moreMenu').hidden = true;
});

$('#spAsk').onclick = () => {
  selPopup.hidden = true;
  openTutor(true);
  const q = S.selQuote.length > 90 ? S.selQuote.slice(0, 90) + '…' : S.selQuote;
  send(`Giải thích giúp mình đoạn: “${q}”`, { page: S.selPos.page, quote: S.selQuote });
  window.getSelection().removeAllRanges();
};
$('#spConfused').onclick = () => {
  selPopup.hidden = true;
  const n = addNote({ page: S.selPos.page, kind: 'confused', quote: S.selQuote, text: 'Đã báo bối rối', x: S.selPos.x, y: S.selPos.y });
  toast('warn', `Đã gửi tín hiệu bối rối ở trang ${n.page} cho giảng viên`);
  window.getSelection().removeAllRanges();
};
$('#spNote').onclick = () => {
  selPopup.hidden = true;
  openNoteEditor({ page: S.selPos.page, quote: S.selQuote, x: S.selPos.x, y: S.selPos.y });
  window.getSelection().removeAllRanges();
};

/* =============================================================
   TUTOR CHAT
   ============================================================= */
/* ---- AI_CALL: điểm duy nhất sẽ nối model thật ở CP3 ---- */
function mockAnswer(q, opts = {}) {
  const s = q.toLowerCase();
  if (opts.region) return withPage(ANSWERS.region, opts.page);
  if (/deadline|hạn nộp|nộp bài|điểm số|bao nhiêu điểm|link nộp/.test(s)) return ANSWERS.outofscope;
  if (s.replace(/[^a-zà-ỹ0-9]/gi, '').length < 12) return ANSWERS.clarify;
  if (/yếu tố|framework|6\+3|actor|boundary|trang 67/.test(s)) return ANSWERS.framework;
  if (/rule|workflow|agent|cấp độ/.test(s)) return ANSWERS.levels;
  if (/problem statement|lát cắt|một câu|viết bài toán/.test(s)) return ANSWERS.statement;
  if (/lịch sử|nguồn gốc|ai phát minh|năm nào|tác giả gốc/.test(s)) return ANSWERS.lowconf;
  return withPage(ANSWERS.generic, opts.page || S.page);
}
function withPage(a, p) {
  return {
    ...a,
    body: a.body.map(x => x.replaceAll('{p}', p)),
    sources: (a.sources || []).map(s => ({ ...s, page: s.page || p })),
  };
}

function send(text, opts = {}) {
  if (S.busy || !text.trim()) return;
  const page = opts.page || S.page;
  S.chat.push({ role: 'user', text, ctxPage: page, snap: S.snap });
  S.snap = null; renderAttach();
  renderChat();

  const failing = S.simFail;
  S.simFail = false;
  S.busy = true;
  S.chat.push({ role: 'typing' });
  renderChat();

  setTimeout(() => {
    S.chat.pop();
    if (failing) {
      S.chat.push({ role: 'ai', error: true, retry: { text, opts } });
    } else {
      const a = mockAnswer(text, { ...opts, page });
      S.chat.push({ role: 'ai', data: a, ctxPage: page });
    }
    S.busy = false;
    renderChat();
  }, 900 + Math.random() * 500);
}

function confLabel(c) {
  const L = t('trust');
  return c >= 75 ? L[0] : c >= 50 ? L[1] : L[2];
}

function renderChat() {
  const box = $('#chat');
  box.innerHTML = S.chat.map((m, i) => {
    if (m.role === 'user') {
      const att = m.snap ? `<div class="snap-att"><span class="thumb"></span>Vùng ảnh ${m.snap.w}×${m.snap.h}px · trang ${m.snap.page}</div>` : '';
      return `<div style="align-self:flex-end;max-width:88%">${att}<div class="msg-user">${esc(m.text)}</div></div>`;
    }
    if (m.role === 'typing') {
      return `<div class="msg-ai">
        <div class="ai-meta"><span class="state warn">${t('asking')}</span></div>
        <div class="bubble"><div class="typing"><i></i><i></i><i></i></div></div></div>`;
    }
    if (m.error) {
      return `<div class="msg-ai">
        <div class="ai-meta"><span class="state err">${t('failed')}</span></div>
        <div class="bubble"><p>Không gọi được trợ lý (mô phỏng lỗi mạng). Câu hỏi của bạn vẫn được giữ nguyên.</p>
        <div class="chips"><button class="qchip" data-retry="${i}">${t('retry')}</button></div></div></div>`;
    }
    const a = m.data;
    const isClarify = a.kind === 'clarify', isRefuse = a.kind === 'refuse', low = a.conf > 0 && a.conf < 60;
    const meta = isClarify || isRefuse
      ? `<div class="ai-meta"><span class="state warn">${isRefuse ? 'NGOÀI PHẠM VI' : 'CẦN LÀM RÕ'}</span></div>`
      : `<div class="ai-meta">
          <div class="conf${low ? ' low' : ''}"><div class="conf-bar"><i style="width:${a.conf}%"></i></div>
          <span class="conf-txt">${a.conf}% · ${confLabel(a.conf)}</span></div>
          <span class="state${low ? ' warn' : ''}">${low ? t('lowconf') : t('answered')}</span>
        </div>`;

    const srcs = (a.sources || []).length ? `
      <div class="sources open">
        <button class="src-head" data-src>${ICO.ext}<span>${a.sources.length} ${t('srcOne')}</span><span class="car">${ICO.caret}</span></button>
        <div class="src-body">${a.sources.map((s, k) => `
          <div class="src-card" data-goto="${s.page}">
            <div class="src-top"><span class="src-n">${k + 1}</span>
            <span class="src-pg">${ICO.book} Tr.${s.page}</span></div>
            <div class="src-q">${s.text}</div>
          </div>`).join('')}</div>
      </div>` : '';

    const chips = a.chips ? `<div class="chips">${a.chips.map(c => `<button class="qchip" data-ask="${esc(c)}">${c}</button>`).join('')}</div>` : '';
    const acts = a.actions ? `<div class="chips">${a.actions.map(c => `<button class="qchip" data-act2="${esc(c)}">${c}</button>`).join('')}</div>` : '';

    const fb = (isClarify || isRefuse) ? '' : `
      <div class="feedback"><span>${t('helpful')}</span>
        <button class="fb up" data-fb="${i}:up">${ICO.thumbUp}</button>
        <button class="fb down" data-fb="${i}:down">${ICO.thumbDown}</button>
      </div>`;

    return `<div class="msg-ai">
      ${meta}
      ${m.ctxPage ? `<div class="ctx-line">${t('ctx')}: Slide trang ${m.ctxPage}</div>` : ''}
      <div class="bubble">${a.body.map(p => `<p>${linkCites(p)}</p>`).join('')}${chips}${acts}${srcs}${fb}</div>
    </div>`;
  }).join('');

  box.scrollTop = box.scrollHeight;
  wireChat();
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const linkCites = s => s.replace(/\[trang (\d+)\]/g, (_, n) => `<span class="cite" data-goto="${n}">[trang ${n}]</span>`);

function wireChat() {
  $$('#chat [data-goto]').forEach(el => el.onclick = () => {
    goPage(+el.dataset.goto);
    toast('ok', 'Đã nhảy tới trang ' + el.dataset.goto);
  });
  $$('#chat [data-src]').forEach(b => b.onclick = () => b.closest('.sources').classList.toggle('open'));
  $$('#chat [data-ask]').forEach(b => b.onclick = () => send(b.dataset.ask));
  $$('#chat [data-act2]').forEach(b => b.onclick = () => toast('ok', `"${b.dataset.act2}" — luồng này chưa nối ở CP2`));
  $$('#chat [data-retry]').forEach(b => b.onclick = () => {
    const m = S.chat[+b.dataset.retry];
    S.chat.splice(+b.dataset.retry, 1);
    renderChat();
    send(m.retry.text, m.retry.opts);
  });
  $$('#chat [data-fb]').forEach(b => b.onclick = () => {
    const [, dir] = b.dataset.fb.split(':');
    const row = b.closest('.feedback');
    $$('.fb', row).forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    toast(dir === 'up' ? 'ok' : 'warn', dir === 'up' ? 'Cảm ơn phản hồi!' : 'Đã ghi nhận — câu này sẽ được TA rà lại');
  });
}

function renderAttach() {
  const row = $('#attachRow');
  if (!S.snap) { row.hidden = true; row.innerHTML = ''; return; }
  row.hidden = false;
  row.innerHTML = `<div class="snap-att"><span class="thumb"></span>
    Vùng ảnh ${S.snap.w}×${S.snap.h}px · trang ${S.snap.page}
    <button id="dropSnap"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`;
  $('#dropSnap').onclick = () => { S.snap = null; renderAttach(); };
}

function openTutor(force) {
  const w = $('#workspace');
  if (force) w.classList.remove('tutor-off');
  else w.classList.toggle('tutor-off');
}

/* =============================================================
   MODAL / TOAST
   ============================================================= */
function openModal(title, bodyHTML, footHTML) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHTML;
  $('#modalFoot').innerHTML = footHTML || `<button class="btn" data-close>${t('close')}</button>`;
  $('#backdrop').hidden = false;
  $$('#modal [data-close]').forEach(b => b.onclick = closeModal);
}
const closeModal = () => { $('#backdrop').hidden = true; };
$('#modalClose').onclick = closeModal;
$('#backdrop').onclick = e => { if (e.target.id === 'backdrop') closeModal(); };

function openNoteEditor(base) {
  openModal('Ghi chú · trang ' + base.page,
    `<div class="note-row"><span class="pg">Tr.${base.page}</span>
      <div class="bd"><div class="qt">“${esc(base.quote)}”</div></div></div>
     <textarea class="note-input" id="noteText" placeholder="Viết ghi chú của bạn..."></textarea>`,
    `<button class="btn" data-close>${t('cancel')}</button>
     <button class="btn primary" id="noteSave">${t('save')}</button>`);
  setTimeout(() => $('#noteText').focus(), 30);
  $('#noteSave').onclick = () => {
    const txt = $('#noteText').value.trim();
    addNote({ ...base, kind: 'note', text: txt || '(không có nội dung)' });
    closeModal();
    toast('ok', 'Đã lưu ghi chú ở trang ' + base.page);
  };
}

function openNotesModal(page) {
  const list = page ? S.notes.filter(n => n.page === page) : S.notes;
  const body = list.length ? list.map(n => `
    <div class="note-row"><span class="pg">Tr.${n.page}</span>
      <div class="bd"><div class="qt">“${esc(n.quote)}”</div><div>${esc(n.text)}</div></div>
    </div>`).join('')
    : `<div class="note-empty">Chưa có ghi chú nào. Bôi đen một đoạn trên slide rồi bấm <b>Ghi chú</b>.</div>`;
  openModal(`Ghi chú của bạn (${S.notes.length})`, body,
    `<button class="btn" data-close>${t('close')}</button>
     <button class="btn primary" id="expNotes">Xuất .md</button>`);
  $('#expNotes').onclick = () => { closeModal(); exportNotes(); };
}

function exportNotes() {
  if (!S.notes.length) return toast('warn', 'Chưa có ghi chú nào để xuất');
  const md = `# Ghi chú · ${DOC.file}\n\n` + S.notes
    .sort((a, b) => a.page - b.page)
    .map(n => `## Trang ${n.page}${n.kind === 'confused' ? ' · BỐI RỐI' : ''}\n> ${n.quote}\n\n${n.text}\n`).join('\n');
  const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'vlearn-notes.md'; a.click();
  URL.revokeObjectURL(url);
  toast('ok', 'Đã xuất ' + S.notes.length + ' ghi chú ra file .md');
}

function toast(kind, msg) {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = (ICO[kind] || ICO.ok) + '<span>' + esc(msg) + '</span>';
  $('#toasts').appendChild(el);
  setTimeout(() => { el.style.opacity = 0; el.style.transition = '.3s'; }, 2400);
  setTimeout(() => el.remove(), 2750);
}

/* =============================================================
   WIRING
   ============================================================= */
$$('.tool[data-tool]').forEach(b => b.onclick = () => setTool(b.dataset.tool));

/* "..." trên toolbar = bật/tắt thanh công cụ phụ (Khoanh · Text · Ảnh · Tẩy) */
$('#btnMore').onclick = () => { S.moreOpen = !S.moreOpen; updateSubbar(); };

/* các tuỳ chọn của tài liệu chuyển lên nút ⋮ ở thanh trên cùng */
$('#btnDocMenu').onclick = e => {
  const m = $('#moreMenu');
  const r = e.currentTarget.getBoundingClientRect();
  m.hidden = !m.hidden;
  m.style.left = Math.min(r.left, innerWidth - 270) + 'px';
  m.style.top = (r.bottom + 8) + 'px';
};
$$('#moreMenu button').forEach(b => b.onclick = () => {
  $('#moreMenu').hidden = true;
  const a = b.dataset.act;
  if (a === 'fit') { S.zoom = 1; applyZoom(); toast('ok', 'Đã đưa về 100%'); }
  else if (a === 'fs') { document.documentElement.requestFullscreen?.().catch(() => { }); }
  else if (a === 'print') window.print();
  else if (a === 'info') openModal('Thông tin tài liệu',
    `<p><b>Tên file:</b> ${DOC.file}<br><b>Môn:</b> ${DOC.course}<br><b>Mã tài liệu:</b> ${DOC.code}<br>
     <b>Số trang:</b> ${DOC.totalPages}<br><b>Giảng viên:</b> ${DOC.instructor}</p>
     <p><b>Mức prototype:</b> Mock — nội dung slide và câu trả lời tutor đều là dữ liệu giả.</p>`);
  else if (a === 'report') openModal('Báo lỗi tài liệu',
    `<textarea class="note-input" placeholder="Mô tả lỗi bạn gặp ở trang ${S.page}..."></textarea>`,
    `<button class="btn" data-close>${t('cancel')}</button><button class="btn primary" data-close>Gửi</button>`);
  else if (a === 'simfail') { S.simFail = true; toast('warn', 'Câu hỏi kế tiếp sẽ mô phỏng lỗi mạng'); }
});

function applyZoom() {
  document.documentElement.style.setProperty('--zoom', S.zoom);
  syncChrome();
}
$('#zoomIn').onclick = () => { S.zoom = Math.min(2, +(S.zoom + .09).toFixed(2)); applyZoom(); };
$('#zoomOut').onclick = () => { S.zoom = Math.max(.5, +(S.zoom - .09).toFixed(2)); applyZoom(); };

function setPenSize(v, quiet) {
  S.penSize = Math.min(12, Math.max(1, v));
  $('#penRange').value = S.penSize;
  if (!quiet) toast('ok', 'Cỡ bút: ' + S.penSize + 'px');
}
$('#penUp').onclick = () => setPenSize(S.penSize + 1);
$('#penDown').onclick = () => setPenSize(S.penSize - 1);
$('#penRange').oninput = e => setPenSize(+e.target.value, true);
$('#btnDownload').onclick = () => toast('ok', 'Đang tải ' + DOC.file + ' (mock)');
$('#btnExport').onclick = exportNotes;
$('#btnUndo').onclick = () => {
  const u = S.undo.pop();
  if (!u) return;
  u.fn(); syncChrome();
  toast('ok', 'Đã hoàn tác: ' + u.label);
};
$('#btnClear').onclick = () => {
  const pg = $('#pg' + S.page);
  openModal('Xoá annotation trang ' + S.page + '?',
    `<p>Toàn bộ nét bút, highlight và ghim ghi chú trên trang ${S.page} sẽ bị xoá. Không hoàn tác được.</p>`,
    `<button class="btn" data-close>${t('cancel')}</button><button class="btn primary" id="doClear">Xoá</button>`);
  $('#doClear').onclick = () => {
    $$('.ink > *', pg).forEach(p => p.remove());
    $$('.note-pin, .slide-text, .slide-img', pg).forEach(p => p.remove());
    $$('mark', pg).forEach(m => { const par = m.parentNode; while (m.firstChild) par.insertBefore(m.firstChild, m); m.remove(); par.normalize(); });
    S.notes = S.notes.filter(n => n.page !== S.page);
    S.undo = S.undo.filter(u => u.page !== S.page);
    closeModal(); syncChrome();
    toast('ok', 'Đã xoá annotation trang ' + S.page);
  };
};

$('#chipPage').onclick = () => openNotesModal();
$('#prevPage').onclick = () => goPage(S.page - 1);
$('#nextPage').onclick = () => goPage(S.page + 1);

$('#tglSidebar').onclick = () => $('#workspace').classList.toggle('side-off');
$('#tglTutor').onclick = () => openTutor(false);

$('#btnTheme').onclick = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  toast('ok', dark ? 'Chế độ sáng' : 'Chế độ tối');
};
$('#btnLang').onclick = () => { S.lang = S.lang === 'vi' ? 'en' : 'vi'; applyLang(); };
$('#btnBack').onclick = () => toast('warn', 'Quay lại danh sách môn — màn hình này chưa có trong prototype CP2');
$('#brand').onclick = e => { e.preventDefault(); goPage(1); };

$('#btnNewChat').onclick = () => {
  S.chat = []; S.snap = null; renderAttach(); renderChat();
  toast('ok', 'Đã mở hội thoại mới');
};
$('#btnHistory').onclick = () => openModal('Lịch sử hội thoại',
  `<div class="note-row"><span class="pg">Hôm nay</span><div class="bd"><b>Day 02 · trang 67</b><div class="qt">“trang 67 nói về cái gì vậy”</div></div></div>
   <div class="note-row"><span class="pg">Hôm qua</span><div class="bd"><b>Day 01 · trang 12</b><div class="qt">“JTBD khác persona chỗ nào”</div></div></div>
   <div class="note-row"><span class="pg">2 ngày trước</span><div class="bd"><b>Day 01 · trang 40</b><div class="qt">“cho ví dụ về cost of error”</div></div></div>`);

$('#btnSend').onclick = () => {
  const i = $('#ask');
  if (!i.value.trim()) return toast('warn', 'Nhập câu hỏi trước đã');
  send(i.value.trim(), { page: S.page });
  i.value = '';
};
$('#ask').addEventListener('keydown', e => { if (e.key === 'Enter') $('#btnSend').click(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSnip(); selPopup.hidden = true; $('#moreMenu').hidden = true; closeModal();
    S.moreOpen = false; updateSubbar();
  }
  if (e.target.matches('input,textarea') || e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goPage(S.page + 1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goPage(S.page - 1); }
  if (e.key === 's' && !e.ctrlKey) setTool('snip');
  if (e.key === 'r') setTool('read');
  if (e.key === 'b') setTool('pen');
  if (e.key === 'h') setTool('hl');
});

/* ---------------- boot ---------------- */
renderChapters();
renderPages();
renderSwatches();
setPenSize(S.penSize, true);
S.chat = SEED_CHAT.map(m => m.role === 'user'
  ? { role: 'user', text: m.text, ctxPage: m.ctxPage }
  : { role: 'ai', data: ANSWERS[m.key], ctxPage: m.ctxPage });
renderChat();
applyLang();
applyZoom();
setTimeout(() => toast('ok', 'Prototype CP2 · dữ liệu và câu trả lời AI đều là mock'), 600);
