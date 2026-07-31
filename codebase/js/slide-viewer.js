// ============================================
// VLearn Slide Viewer — PDF.js Integration
// Renders PDF to <canvas> with selectable text layer
// ============================================

// --- PDF.js Setup ---
const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

// Import TextLayer — thử từ pdfjsLib trước, nếu không có thì lấy từ pdf_viewer
let TextLayerClass = pdfjsLib.TextLayer;
if (!TextLayerClass) {
  try {
    const viewer = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf_viewer.mjs');
    TextLayerClass = viewer.TextLayer || viewer.TextLayerBuilder;
    console.log('[VLearn] TextLayer loaded from pdf_viewer.mjs');
  } catch(e) { console.warn('[VLearn] Could not load pdf_viewer.mjs for TextLayer', e); }
} else {
  console.log('[VLearn] TextLayer available from pdfjsLib');
}

// --- State ---
let currentPage = 1;
let totalPages = 83;
let currentZoom = 100;
let currentPdfPath = '../data/vlearn-pack/slides/d1-slide-hackathon.pdf';
window.currentPdfPath = currentPdfPath;
let pdfDoc = null;        // PDF.js document instance
let pageRendering = false;
let pageNumPending = null;
let currentPageTextContent = ''; // Extracted text of current page

// --- DOM References ---
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const textLayerDiv = document.getElementById('text-layer');
const loadingEl = document.getElementById('pdf-loading');
const slideFrame = document.getElementById('slide-aspect-frame');

// ============================================
// PDF.js Core Rendering
// ============================================

/**
 * Render a specific page of the loaded PDF onto the canvas
 * and create a text layer overlay for selection.
 */
async function renderPage(num) {
  pageRendering = true;

  try {
    const page = await pdfDoc.getPage(num);

    // Calculate scale to fit within container width/height
    const containerWidth = slideFrame.clientWidth || 800;
    const containerHeight = slideFrame.clientHeight || 600;
    const unscaledViewport = page.getViewport({ scale: 1 });

    // Fit to container while respecting zoom
    const baseScale = Math.min(
      containerWidth / unscaledViewport.width,
      containerHeight / unscaledViewport.height
    );
    const scale = baseScale * (currentZoom / 100);
    const viewport = page.getViewport({ scale });

    // Set canvas dimensions (use devicePixelRatio for sharpness)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    // --- Hide loading spinner IMMEDIATELY after canvas is ready ---
    pageRendering = false;
    showLoading(false);

    // Đồng bộ kích thước draw-canvas với canvas của PDF
    resizeDrawCanvas();

    // --- Render Text Layer asynchronously in background ---
    setTimeout(async () => {
      try {
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = viewport.width + 'px';
        textLayerDiv.style.height = viewport.height + 'px';
        // Set --scale-factor for pdf_viewer.min.css to position spans correctly
        textLayerDiv.style.setProperty('--scale-factor', viewport.scale);

        const textContent = await page.getTextContent();
        currentPageTextContent = textContent.items
          .filter(item => {
            if (!item.transform) return true;
            const [a, b, c, d] = item.transform;
            return Math.abs(b) < 0.01 && Math.abs(c) < 0.01;
          })
          .map(item => item.str).join(' ');

        console.log('[VLearn] TextLayerClass available:', !!TextLayerClass, '| Text items:', textContent.items.length, '| scale:', viewport.scale);
        if (TextLayerClass) {
          const textLayer = new TextLayerClass({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
          });
          await textLayer.render();

          // Ẩn các span watermark (bị xoay) — vẫn giữ trong DOM để multi-line selection hoạt động
          textLayerDiv.querySelectorAll('span').forEach(span => {
            const style = span.style;
            const transform = style.transform || '';
            // Span có rotate() hoặc matrix với rotation → là watermark
            if (transform.includes('rotate') || 
                (transform.includes('matrix') && !/matrix\(\s*[\d.-]+,\s*0,\s*0,/.test(transform))) {
              span.style.pointerEvents = 'none';
              span.style.userSelect = 'none';
              span.style.opacity = '0';
            }
          });

          console.log('[VLearn] TextLayer rendered, spans:', textLayerDiv.children.length);
        }
      } catch (tErr) {
        console.error("Text layer render error:", tErr);
      }
    }, 20);

    // If another page was requested while rendering, render it now
    if (pageNumPending !== null) {
      const pendingPage = pageNumPending;
      pageNumPending = null;
      renderPage(pendingPage);
    }
  } catch (err) {
    console.error('Error rendering page:', err);
    pageRendering = false;
    showLoading(false);
  }
}

/**
 * Queue a page render (prevents overlapping renders)
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Load a PDF document from the given path
 */
let loadedPdfPath = null;

async function loadPdfDocument(pdfPath) {
  if (pdfDoc && loadedPdfPath === pdfPath) {
    showLoading(false);
    queueRenderPage(currentPage);
    return;
  }

  showLoading(true);
  try {
    const loadingTask = pdfjsLib.getDocument({
      url: pdfPath,
      rangeChunkSize: 65536,
      disableAutoFetch: false,
      disableStream: false,
    });
    pdfDoc = await loadingTask.promise;
    loadedPdfPath = pdfPath;
    totalPages = pdfDoc.numPages;

    // Update total pages in all UI elements
    document.querySelectorAll('.total-pages-count').forEach(el => el.textContent = totalPages);

    // Render thumbnail filmstrip track
    renderThumbnailsTrack(totalPages);

    // Render the first (or current) page
    queueRenderPage(currentPage);
    showLoading(false);
  } catch (err) {
    console.error('Error loading PDF:', err);
    showLoading(false);
  }
}

function showLoading(show) {
  if (loadingEl) {
    loadingEl.style.display = show ? 'flex' : 'none';
  }
}

// ============================================
// Page Navigation & Thumbnails Logic
// ============================================

function prevSlidePage() {
  if (currentPage > 1) {
    currentPage--;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function nextSlidePage() {
  if (currentPage < totalPages) {
    currentPage++;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function goToSlidePage(num) {
  if (num >= 1 && num <= totalPages && num !== currentPage) {
    currentPage = num;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function updatePageUI() {
  const curPgEl = document.getElementById('current-page-num');
  if (curPgEl) curPgEl.textContent = currentPage;

  const chipPgEl = document.getElementById('current-page-chip');
  if (chipPgEl) chipPgEl.textContent = currentPage;

  const tutorSlideEl = document.getElementById('tutor-slide-num');
  if (tutorSlideEl) tutorSlideEl.textContent = currentPage;

  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    const strokeCount = (pageDrawStrokes[currentPage] && pageDrawStrokes[currentPage].length > 0) ? pageDrawStrokes[currentPage].length : 0;
    notesIndEl.textContent = `Trang ${currentPage} · ${strokeCount} note`;
  }

  updateActiveThumbnail(currentPage);
  resizeDrawCanvas();
  updateNotesPanelUI();
}

// ============================================
// Left Sidebar Tabs & Personal Notes Engine
// ============================================

const pageTextNotes = {};

function switchSidebarTab(tabName) {
  document.querySelectorAll('.sidebar-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.sidebar-panel').forEach(panel => panel.classList.remove('active'));

  const targetBtn = document.getElementById(`tab-btn-${tabName}`);
  const targetPanel = document.getElementById(`panel-${tabName}`);

  if (targetBtn) targetBtn.classList.add('active');
  if (targetPanel) targetPanel.classList.add('active');

  if (tabName === 'notes') {
    updateNotesPanelUI();
  }
}

function updateNotesPanelUI() {
  const pageNumEl = document.getElementById('note-editor-page-num');
  if (pageNumEl) pageNumEl.textContent = currentPage;

  const noteEl = document.getElementById('note-textarea-input');
  if (noteEl) {
    const savedContent = pageTextNotes[currentPage] || '';
    if (noteEl.tagName === 'TEXTAREA') noteEl.value = savedContent;
    else noteEl.innerHTML = savedContent;
  }

  const chipSpan = document.querySelector('#note-ai-chip span');
  if (chipSpan) {
    chipSpan.textContent = `Slide Trang ${currentPage}: Ghi chú bằng AI`;
  }

  renderSavedNotesList();
}

function autoSaveCurrentNote() {
  const noteEl = document.getElementById('note-textarea-input');
  if (!noteEl) return;

  // Hỗ trợ cả contenteditable (innerHTML) và textarea (value)
  const content = noteEl.tagName === 'TEXTAREA' ? noteEl.value.trim() : noteEl.innerHTML.trim();
  if (content && content !== '<br>') {
    pageTextNotes[currentPage] = content;
  } else {
    delete pageTextNotes[currentPage];
  }

  renderSavedNotesList();
}

function clearCurrentPageNote() {
  delete pageTextNotes[currentPage];
  const noteEl = document.getElementById('note-textarea-input');
  if (noteEl) {
    if (noteEl.tagName === 'TEXTAREA') noteEl.value = '';
    else noteEl.innerHTML = '';
  }
  renderSavedNotesList();
}

function renderSavedNotesList() {
  const container = document.getElementById('saved-notes-list');
  const counterEl = document.getElementById('saved-notes-counter');
  const badgeEl = document.getElementById('sidebar-notes-badge');
  if (!container) return;

  const pageKeys = Object.keys(pageTextNotes).map(Number).sort((a, b) => a - b);
  if (counterEl) counterEl.textContent = pageKeys.length;
  if (badgeEl) badgeEl.textContent = pageKeys.length;

  if (pageKeys.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px 12px;color:#94a3b8;font-size:0.75rem;">
        Chưa có ghi chú nào.<br>Hãy viết ghi chú ở trên để lưu lại!
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  pageKeys.forEach(pg => {
    const card = document.createElement('div');
    card.className = `saved-note-card ${pg === currentPage ? 'active' : ''}`;
    card.onclick = () => {
      goToSlidePage(pg);
    };
    card.innerHTML = `
      <div class="saved-note-card-title">📝 Slide Trang ${pg}</div>
      <div class="saved-note-card-text">${escapeHtml(pageTextNotes[pg])}</div>
    `;
    container.appendChild(card);
  });
}

function stripMarkdownForNote(text) {
  if (!text) return '';
  let cleaned = text
    .replace(/\[WRITE_NOTE:\s*([\s\S]*?)\]/gi, '$1')
    .replace(/\[(?:T\d+-\d+|Slide\s*\d+|Trang\s*\d+)\]/gi, '')
    .trim();

  // Nếu AI trả về 1 dòng duy nhất phân cách bởi dấu ; thì tự động tách thành gạch đầu dòng
  if (!cleaned.includes('\n') && cleaned.includes(';')) {
    cleaned = cleaned
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => `- ${part}`)
      .join('\n');
  }

  // Loại bỏ các câu hội thoại giao tiếp thừa
  let lines = cleaned.split('\n');
  const seenLines = new Set();
  let filtered = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    // Lọc các câu mở đầu hội thoại thừa
    if (/^(tiêu đề slide là|tiêu đề slide để ghi vào note|dưới đây là|bạn có thể|nếu bạn muốn|rất tiếc|hi vọng|dựa vào slide|ngữ cảnh chỉ nói về|mình có thể ghi luôn|chủ đề:)/i.test(trimmed)) {
      return false;
    }
    // Loại bỏ dòng trùng lặp
    const normalizedLine = trimmed.replace(/^[-•*#]\s*/, '').toLowerCase();
    if (seenLines.has(normalizedLine)) return false;
    seenLines.add(normalizedLine);
    return true;
  });

  return (filtered.length > 0 ? filtered.join('\n') : cleaned).trim();
}

let noteTypewriterInterval = null;

// Chuyển Markdown text đơn giản thành HTML cho note editor
function markdownToNoteHtml(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inUl = false;

  lines.forEach(line => {
    const t = line.trimEnd();
    if (!t) {
      if (inUl) { html += '</ul>'; inUl = false; }
      html += '<br>';
      return;
    }
    if (/^#{1}\s+(.+)/.test(t)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      html += `<h1>${t.replace(/^#{1}\s+/, '')}</h1>`;
    } else if (/^#{2,}\s+(.+)/.test(t)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      html += `<h2>${t.replace(/^#{2,}\s+/, '')}</h2>`;
    } else if (/^[-*•]\s+(.+)/.test(t)) {
      if (!inUl) { html += '<ul>'; inUl = true; }
      const content = t.replace(/^[-*•]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<li>${content}</li>`;
    } else {
      if (inUl) { html += '</ul>'; inUl = false; }
      const content = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p>${content}</p>`;
    }
  });
  if (inUl) html += '</ul>';
  return html;
}

function typewriterEffectOnNote(fullText, onComplete) {
  const noteEl = document.getElementById('note-textarea-input');
  if (!noteEl) return;

  if (noteTypewriterInterval) {
    clearInterval(noteTypewriterInterval);
    noteTypewriterInterval = null;
  }

  // Tự động chuyển sang tab Ghi chú bên trái
  const notesTabBtn = document.querySelector('.sidebar-tab-btn[data-tab="notes"]');
  if (notesTabBtn && !notesTabBtn.classList.contains('active')) {
    switchSidebarTab('notes');
  }

  const existingHtml = noteEl.innerHTML.trim();
  const hasExistingContent = existingHtml && existingHtml !== '<br>' && existingHtml !== '<div><br></div>';

  if (noteEl.tagName === 'TEXTAREA') {
    // Fallback textarea mode
    const existingVal = noteEl.value.trim();
    const startVal = existingVal ? existingVal + '\n' : '';
    noteEl.value = startVal;
    let index = 0;
    noteTypewriterInterval = setInterval(() => {
      if (index < fullText.length) {
        noteEl.value += fullText.charAt(index++);
        pageTextNotes[currentPage] = noteEl.value;
        noteEl.scrollTop = noteEl.scrollHeight;
        autoSaveCurrentNote();
      } else {
        clearInterval(noteTypewriterInterval);
        noteTypewriterInterval = null;
        if (typeof onComplete === 'function') onComplete();
      }
    }, 18);
  } else {
    // contenteditable mode: Nối tiếp nội dung mới vào sau nội dung cũ (APPEND)
    const baseHtml = hasExistingContent ? existingHtml + '<br>' : '';
    const lines = fullText.split('\n').filter(l => l.trim());
    let lineIndex = 0;
    noteTypewriterInterval = setInterval(() => {
      if (lineIndex < lines.length) {
        const partialText = lines.slice(0, lineIndex + 1).join('\n');
        noteEl.innerHTML = baseHtml + markdownToNoteHtml(partialText);
        pageTextNotes[currentPage] = noteEl.innerHTML;
        noteEl.scrollTop = noteEl.scrollHeight;
        autoSaveCurrentNote();
        lineIndex++;
      } else {
        clearInterval(noteTypewriterInterval);
        noteTypewriterInterval = null;
        if (typeof onComplete === 'function') onComplete();
      }
    }, 120);
  }
}

// Mini format toolbar commands
function noteFormatCmd(cmd) {
  const noteEl = document.getElementById('note-textarea-input');
  if (!noteEl) return;
  noteEl.focus();

  if (cmd === 'h1') {
    document.execCommand('formatBlock', false, 'h1');
  } else if (cmd === 'h2') {
    document.execCommand('formatBlock', false, 'h2');
  } else if (cmd === 'bold') {
    document.execCommand('bold', false, null);
  } else if (cmd === 'italic') {
    document.execCommand('italic', false, null);
  } else if (cmd === 'ul') {
    document.execCommand('insertUnorderedList', false, null);
  } else if (cmd === 'hr') {
    document.execCommand('insertHTML', false, '<hr>');
  }
  autoSaveCurrentNote();
}

function removeAINoteChip() {
  const chipContainer = document.getElementById('input-chip-container');
  if (chipContainer) chipContainer.innerHTML = '';
  const input = document.getElementById('tutor-input');
  if (input) input.placeholder = 'Nhập câu hỏi hoặc bôi đen tài liệu...';
}

function generateAINoteForCurrentPage() {
  // 1. Mở khung Chatbot VLearn Tutor bên phải nếu đang thu gọn
  const panel = document.querySelector('.tutor-panel');
  if (panel && panel.classList.contains('collapsed')) {
    toggleTutorPanel();
  }

  // 2. Hiển thị thẻ Chip Badge đính kèm ở ô nhập Chat (Duy trì cố định)
  const chipContainer = document.getElementById('input-chip-container');
  if (chipContainer) {
    chipContainer.innerHTML = `
      <div class="input-chip-badge" id="note-ai-chip">
        <svg xmlns="http://www.w3.org/2000/svg" class="chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>Slide Trang ${currentPage}: Ghi chú bằng AI</span>
        <span class="chip-close" onclick="removeAINoteChip()">&times;</span>
      </div>
    `;
  }

  // 3. Để trống ô nhập văn bản và con trỏ sẵn sàng chờ người dùng gõ
  const input = document.getElementById('tutor-input');
  if (input) {
    input.value = '';
    input.placeholder = `Nhập yêu cầu hoặc câu hỏi cho Slide Trang ${currentPage}...`;
    input.focus();
  }
}

function askTutorAboutNote() {
  const noteText = pageTextNotes[currentPage];
  if (!noteText) {
    alert('Hãy nhập nội dung ghi chú cho trang này trước khi hỏi AI!');
    return;
  }
  sendTutorMsgWithText(`Giải thích và tư vấn thêm dựa trên Ghi chú của tôi ở trang ${currentPage}: "${noteText}"`);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================
// Slide Tools (Đọc, Bút, Highlight, Tẩy & Đổi màu) & Freehand Drawing Engine
// ============================================

let currentSlideTool = 'read';
let currentPenColor = '#ef4444';
const pageDrawStrokes = {}; // Saves array of strokes per page
let isDrawing = false;
let currentStroke = null;

function setPenColor(color) {
  currentPenColor = color;
  document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
  
  const dots = document.querySelectorAll('.color-dot');
  dots.forEach(dot => {
    if (dot.getAttribute('onclick') && dot.getAttribute('onclick').includes(color)) {
      dot.classList.add('active');
    }
  });

  if (currentSlideTool === 'read' || currentSlideTool === 'eraser') {
    setSlideTool('pen');
  }
}

function getDrawCanvas() {
  const dc = document.getElementById('draw-canvas');
  if (dc && dc.dataset.bound !== 'true') {
    dc.dataset.bound = 'true';
    dc.addEventListener('mousedown', startDrawing);
    dc.addEventListener('mousemove', drawMove);
    dc.addEventListener('mouseup', stopDrawing);
    dc.addEventListener('mouseleave', stopDrawing);

    dc.addEventListener('touchstart', startDrawing, { passive: false });
    dc.addEventListener('touchmove', drawMove, { passive: false });
    dc.addEventListener('touchend', stopDrawing);
  }
  return dc;
}

function setSlideTool(tool) {
  currentSlideTool = tool;
  
  // Toggle toolbar button active states
  document.querySelectorAll('.canvas-toolbar .tool-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-tool-${tool}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Toggle tool class on slide frame
  if (slideFrame) {
    slideFrame.classList.remove('tool-read', 'tool-pen', 'tool-highlight', 'tool-eraser');
    slideFrame.classList.add(`tool-${tool}`);
  }
  
  resizeDrawCanvas();
}

function resizeDrawCanvas() {
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas || !canvas) return;
  drawCanvas.width = canvas.width;
  drawCanvas.height = canvas.height;
  drawCanvas.style.width = canvas.style.width;
  drawCanvas.style.height = canvas.style.height;
  redrawPageStrokes(currentPage);
}

function eraseStrokesAt(x, y) {
  const strokes = pageDrawStrokes[currentPage];
  if (!strokes || strokes.length === 0) return;

  const eraserRadius = 30;
  const initialCount = strokes.length;
  
  pageDrawStrokes[currentPage] = strokes.filter(stroke => {
    return !stroke.points.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return (dx * dx + dy * dy) < (eraserRadius * eraserRadius);
    });
  });

  if (pageDrawStrokes[currentPage].length !== initialCount) {
    const notesIndEl = document.getElementById('page-notes-indicator');
    if (notesIndEl) {
      notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
    }
    redrawPageStrokes(currentPage);
  }
}

function startDrawing(e) {
  if (currentSlideTool === 'read') return;
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  const drawCtx = drawCanvas.getContext('2d');
  if (!drawCtx) return;

  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  if (currentSlideTool === 'eraser') {
    isDrawing = true;
    eraseStrokesAt(x, y);
    return;
  }

  isDrawing = true;
  currentStroke = {
    tool: currentSlideTool,
    color: currentSlideTool === 'pen' ? currentPenColor : (currentPenColor + '66'),
    lineWidth: currentSlideTool === 'pen' ? 4 : 18,
    points: [{ x, y }]
  };
  
  if (!pageDrawStrokes[currentPage]) {
    pageDrawStrokes[currentPage] = [];
  }
  pageDrawStrokes[currentPage].push(currentStroke);
  
  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
  }

  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
}

function drawMove(e) {
  if (!isDrawing) return;
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  
  e.preventDefault();
  
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  if (currentSlideTool === 'eraser') {
    eraseStrokesAt(x, y);
    return;
  }
  
  if (currentStroke) {
    currentStroke.points.push({ x, y });
    redrawPageStrokes(currentPage);
  }
}

let pageRedoHistory = {};

function stopDrawing() {
  if (isDrawing && currentStroke) {
    pageRedoHistory[currentPage] = [];
  }
  isDrawing = false;
  currentStroke = null;
}

function undoStroke() {
  if (!pageDrawStrokes[currentPage] || pageDrawStrokes[currentPage].length === 0) return;
  if (!pageRedoHistory[currentPage]) pageRedoHistory[currentPage] = [];

  const lastStroke = pageDrawStrokes[currentPage].pop();
  pageRedoHistory[currentPage].push(lastStroke);

  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
  }

  redrawPageStrokes(currentPage);
}

function redoStroke() {
  if (!pageRedoHistory[currentPage] || pageRedoHistory[currentPage].length === 0) return;
  if (!pageDrawStrokes[currentPage]) pageDrawStrokes[currentPage] = [];

  const restoredStroke = pageRedoHistory[currentPage].pop();
  pageDrawStrokes[currentPage].push(restoredStroke);

  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
  }

  redrawPageStrokes(currentPage);
}

function redrawPageStrokes(pageNum) {
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  const drawCtx = drawCanvas.getContext('2d');
  if (!drawCtx) return;

  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  
  const strokes = pageDrawStrokes[pageNum] || [];
  strokes.forEach(stroke => {
    if (!stroke.points || stroke.points.length === 0) return;
    
    drawCtx.save();
    drawCtx.strokeStyle = stroke.color;
    drawCtx.lineWidth = stroke.lineWidth;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    
    drawCtx.beginPath();
    drawCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      drawCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    drawCtx.stroke();
    drawCtx.restore();
  });
}

function renderThumbnailsTrack(total) {
  const thumbTrack = document.getElementById('thumb-track');
  if (!thumbTrack) return;
  thumbTrack.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    const card = document.createElement('div');
    card.className = `thumb-card ${i === currentPage ? 'active' : ''}`;
    card.id = `thumb-card-${i}`;
    card.setAttribute('onclick', `goToSlidePage(${i})`);
    card.innerHTML = `
      <canvas id="thumb-canvas-${i}" class="thumb-canvas"></canvas>
      <span class="thumb-badge">${i}</span>
    `;
    thumbTrack.appendChild(card);
  }

  // Asynchronously render real visual slide thumbnails on canvas
  setTimeout(() => {
    renderThumbnailPreviews();
  }, 100);
}

let renderingThumbs = false;
async function renderThumbnailPreviews() {
  if (!pdfDoc || renderingThumbs) return;
  renderingThumbs = true;

  try {
    const total = pdfDoc.numPages;
    for (let i = 1; i <= total; i++) {
      const c = document.getElementById(`thumb-canvas-${i}`);
      if (!c || c.dataset.rendered === 'true') continue;

      try {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });
        
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        c.width = viewport.width * dpr;
        c.height = viewport.height * dpr;
        
        const ctx2d = c.getContext('2d');
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

        await page.render({
          canvasContext: ctx2d,
          viewport: viewport,
        }).promise;

        c.dataset.rendered = 'true';
      } catch (pErr) {
        // Individual page render catch
      }
    }
  } catch (err) {
    // Non-blocking thumbnail preview error
  } finally {
    renderingThumbs = false;
  }
}

function updateActiveThumbnail(pageNum) {
  document.querySelectorAll('.thumb-card').forEach(el => el.classList.remove('active'));
  const currentCard = document.getElementById(`thumb-card-${pageNum}`);
  const currentNumBadge = document.getElementById('thumb-current-num');
  if (currentNumBadge) currentNumBadge.textContent = pageNum;

  if (currentCard) {
    currentCard.classList.add('active');
    currentCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function toggleThumbnailsBar() {
  const thumbBar = document.getElementById('slide-thumbnails-bar');
  if (thumbBar) {
    thumbBar.classList.toggle('collapsed');
  }
}

// ============================================
// Zoom
// ============================================

function zoomSlide(delta) {
  currentZoom = Math.min(200, Math.max(50, currentZoom + delta));
  const zoomEl = document.getElementById('zoom-value');
  if (zoomEl) zoomEl.textContent = currentZoom + '%';
  queueRenderPage(currentPage);
}

// ============================================
// Load another PDF (sidebar click)
// ============================================

function loadPdf(pdfPath, docName, totalPgs) {
  currentPdfPath = pdfPath;
  window.currentPdfPath = pdfPath;
  currentPage = 1;

  const docTitleEl = document.getElementById('current-doc-title');
  if (docTitleEl) docTitleEl.textContent = docName;

  const docWatermarkEl = document.getElementById('doc-watermark-id');
  if (docWatermarkEl) docWatermarkEl.textContent = docName;

  updatePageUI();

  // Update active doc state in sidebar
  document.querySelectorAll('.doc-item').forEach(item => item.classList.remove('active'));
  if (typeof event !== 'undefined' && event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  loadPdfDocument(pdfPath);
}

// ============================================
// Download PDF
// ============================================

function downloadPdf() {
  const a = document.createElement('a');
  a.href = currentPdfPath;
  const docTitleEl = document.getElementById('current-doc-title');
  a.download = docTitleEl ? docTitleEl.textContent : 'slide.pdf';
  a.click();
}

// ============================================
// VLearn Tutor AI Panel (Toggle)
// ============================================

function toggleTutorPanel() {
  const panel = document.querySelector('.tutor-panel');
  const btn = document.getElementById('btn-toggle-tutor');
  const layout = document.querySelector('.viewer-layout');
  if (panel) {
    const isCollapsed = panel.classList.toggle('collapsed');
    if (layout) {
      if (isCollapsed) layout.classList.add('slide-layout-expanded');
      else layout.classList.remove('slide-layout-expanded');
    }
    if (btn) {
      if (isCollapsed) {
        btn.classList.remove('active');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.07a1 1 0 0 1-1.235-1.236l1.07-3.825A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z"/></svg> <span>Mở VLearn Tutor</span>';
        btn.setAttribute('title', 'Mở cửa sổ VLearn Tutor AI');
      } else {
        btn.classList.add('active');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.07a1 1 0 0 1-1.235-1.236l1.07-3.825A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z"/></svg> <span>VLearn Tutor</span>';
        btn.setAttribute('title', 'Đóng cửa sổ VLearn Tutor AI');
      }
    }
    // Re-render after layout shift to fit new container width
    setTimeout(() => queueRenderPage(currentPage), 350);
  }
}

// ============================================
// Chat / Tutor Messages
// ============================================

function sendTutorMsg(e) {
  e.preventDefault();
  const input = document.getElementById('tutor-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const chatBody = document.getElementById('tutor-chat-body');
  if (!chatBody) return;

  const emptyState = document.getElementById('chat-empty-state');
  if (emptyState) emptyState.remove();

  // Kiểm tra nếu thẻ chip đính kèm đang kích hoạt hoặc câu lệnh có từ khóa ghi chú
  const chipBadge = document.getElementById('note-ai-chip') || document.querySelector('.input-chip-badge');
  const isNoteRequest = !!chipBadge || /ghi chú|note|lưu note|tạo note|ghi chép|đọc slide.*ghi chú/i.test(text);
  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'tutor-msg user';
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Hiển thị hiệu ứng AI đang suy nghĩ (Thinking Indicator Animation)
  const thinkingCard = document.createElement('div');
  thinkingCard.className = 'chat-thinking-indicator';
  thinkingCard.innerHTML = `
    <div class="thinking-avatar">
      <img src="brand/vinuni-mark.svg" alt="VLearn AI" />
    </div>
    <div class="thinking-bubble">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
      <span class="thinking-text">VLearn AI Tutor đang suy nghĩ...</span>
    </div>
  `;
  chatBody.appendChild(thinkingCard);
  chatBody.scrollTop = chatBody.scrollHeight;

  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const studentEmail = currentUser ? currentUser.email : "unknown_student";
  const studentName = currentUser ? currentUser.name : "Unknown";

  // Gọi REST API tới Python RAG Backend hoặc Fallback Direct API
  const apiBase = window.location.protocol.startsWith('http') ? '' : 'http://localhost:8080';
  fetch(`${apiBase}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: text,
      page_number: currentPage,
      slide_file: currentPdfPath,
      student_email: studentEmail,
      student_name: studentName
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Backend offline");
    return res.json();
  })
  .then(data => {
    renderBotResponse(data.answer);
  })
  .catch(async () => {
    // Fallback: Gọi trực tiếp Endpoint https://api.xah.io/v1/chat/completions từ Frontend JS
    try {
      const pageContext = currentPageTextContent ? currentPageTextContent.substring(0, 1500) : '';
      const fullUserPrompt = `Bạn là VLearn AI Tutor. Học viên đang xem Trang ${currentPage} với nội dung slide:\n${pageContext}\n\nCâu hỏi: ${text}`;
      
      let apiKey = localStorage.getItem('VLEARN_API_KEY');
      if (!apiKey || apiKey.startsWith('sk-proj-NDMpJ')) {
        apiKey = window.prompt("Vui lòng nhập API Key cho server https://api.xah.io/v1:");
        if (apiKey) {
          localStorage.setItem('VLEARN_API_KEY', apiKey.trim());
        } else {
          renderBotResponse("⚠️ Bạn chưa nhập API Key. Vui lòng bấm F5 và nhập API Key để sử dụng AI Tutor.");
          return;
        }
      }
      
      const resApi = await fetch('https://api.xah.io/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'phatchau036/gpt-5.4',
          messages: [
            { role: 'system', content: 'Bạn là VLearn AI Tutor định vị trang slide. Trả lời bằng Markdown tiếng Việt kèm [Trang N].' },
            { role: 'user', content: fullUserPrompt }
          ]
        })
      });

      const dataApi = await resApi.json();
      if (dataApi.error) {
        if (dataApi.error.message && dataApi.error.message.includes("API key")) {
          localStorage.removeItem('VLEARN_API_KEY');
        }
        renderBotResponse(`⚠️ Lỗi từ AI Server (api.xah.io): ${dataApi.error.message}`);
        return;
      }
      const ans = dataApi.choices?.[0]?.message?.content || 'Không nhận được phản hồi từ AI.';

      renderBotResponse(ans);
    } catch (err) {
      if (thinkingCard && thinkingCard.parentNode) {
        thinkingCard.remove();
      }
      const botMsg = document.createElement('div');
      botMsg.className = 'tutor-msg assistant';
      botMsg.innerHTML = `⚠️ Lỗi kết nối AI: ${err.message}`;
      chatBody.appendChild(botMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });

  function renderBotResponse(answerText) {
    if (thinkingCard && thinkingCard.parentNode) {
      thinkingCard.remove();
    }
    // Chỉ ghi note khi AI dùng thẻ [WRITE_NOTE:] tường minh
    // Không tự động ghi toàn bộ answerText để tránh ghi trùng 2 lần
    const noteMatch = (answerText || '').match(/\[WRITE_NOTE:\s*([\s\S]*?)\]/i);
    let noteContentToSave = '';

    if (noteMatch) {
      noteContentToSave = noteMatch[1].trim();
      answerText = (answerText || '').replace(/\[WRITE_NOTE:\s*[\s\S]*?\]/gi, '').trim();
    }

    if (noteContentToSave) {
      const cleanNoteText = stripMarkdownForNote(noteContentToSave);
      typewriterEffectOnNote(cleanNoteText);
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'tutor-msg assistant';
    chatBody.appendChild(botMsg);

    // Markdown parsing
    let parsedHtml = '';
    if (window.marked && typeof window.marked.parse === 'function') {
      parsedHtml = window.marked.parse(answerText || '');
    } else {
      parsedHtml = (answerText || '')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    // Typewriter / Smooth Reveal Effect
    const rawText = answerText || '';
    if (rawText.length > 0) {
      let charIndex = 0;
      const step = Math.max(1, Math.floor(rawText.length / 45));
      const interval = setInterval(() => {
        charIndex += step;
        if (charIndex >= rawText.length) {
          charIndex = rawText.length;
          clearInterval(interval);
          botMsg.innerHTML = parsedHtml;
        } else {
          const partialText = rawText.substring(0, charIndex);
          if (window.marked && typeof window.marked.parse === 'function') {
            botMsg.innerHTML = window.marked.parse(partialText);
          } else {
            botMsg.innerHTML = partialText.replace(/\n/g, '<br>');
          }
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 25);
    } else {
      botMsg.innerHTML = parsedHtml;
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
}



function sendTutorMsgWithText(text) {
  const panel = document.querySelector('.tutor-panel');
  if (panel && panel.classList.contains('collapsed')) {
    toggleTutorPanel();
  }
  const input = document.getElementById('tutor-input');
  if (input) {
    input.value = text;
    const form = document.getElementById('tutor-form');
    if (form) {
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);
    }
  }
}

function handleSuggestionClick(type) {
  let promptText = '';
  if (type === 'summarize') {
    promptText = `Tóm tắt những ý chính của slide trang ${currentPage} cho mình`;
  } else if (type === 'explain') {
    promptText = `Giải thích nội dung slide trang ${currentPage} theo cách đơn giản và dễ hiểu giúp mình`;
  } else if (type === 'terms') {
    promptText = `Liệt kê và giải thích các thuật ngữ quan trọng trong slide trang ${currentPage}`;
  }
  if (promptText) {
    sendTutorMsgWithText(promptText);
  }
}

function askTutorAboutCurrentSlide() {
  handleSuggestionClick('summarize');
}

// ============================================
// Text Selection on Slide → Floating Tooltip
// ============================================

const selectionTooltip = document.getElementById('selection-tooltip');
let selectedText = '';

document.addEventListener('mouseup', (e) => {
  // Only handle selections within the text layer
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  const anchorNode = sel ? sel.anchorNode : null;
  const isInsideTextLayer = anchorNode && (
    textLayerDiv.contains(anchorNode) || 
    (anchorNode.nodeType === Node.ELEMENT_NODE && anchorNode.closest('.textLayer')) ||
    (anchorNode.parentNode && anchorNode.parentNode.closest('.textLayer'))
  );

  if (text.length > 2 && isInsideTextLayer) {
    selectedText = text;

    // Position the tooltip near the selection
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    selectionTooltip.style.top = (rect.top - 48) + 'px';
    selectionTooltip.style.left = (rect.left + rect.width / 2) + 'px';
    selectionTooltip.classList.add('visible');
  } else {
    // If click is outside tooltip, hide it
    if (selectionTooltip && !selectionTooltip.contains(e.target)) {
      selectionTooltip.classList.remove('visible');
      selectedText = '';
    }
  }
});

// Tooltip button handlers
if (document.getElementById('btn-ask-selection')) {
  document.getElementById('btn-ask-selection').addEventListener('click', () => {
    if (selectedText) {
      sendTutorMsgWithText(`Giải thích giúp em phần bôi đen này ở trang ${currentPage}: "${selectedText}"`);
      selectionTooltip.classList.remove('visible');
      window.getSelection().removeAllRanges();
    }
  });
}

if (document.getElementById('btn-confuse-selection')) {
  document.getElementById('btn-confuse-selection').addEventListener('click', () => {
    if (selectedText) {
      sendTutorMsgWithText(`Em cảm thấy bối rối/chưa hiểu rõ phần bôi đen này ở trang ${currentPage}: "${selectedText}". Trợ lý giải thích chi tiết và trực quan hơn giúp em nhé!`);
      selectionTooltip.classList.remove('visible');
      window.getSelection().removeAllRanges();
    }
  });
}

if (document.getElementById('btn-note-selection')) {
  document.getElementById('btn-note-selection').addEventListener('click', () => {
    if (selectedText) {
      const noteEl = document.getElementById('note-textarea-input');
      if (noteEl) {
        if (noteEl.tagName === 'TEXTAREA') {
          const currentVal = noteEl.value.trim();
          const appendStr = (currentVal ? "\n- " : "- ") + selectedText;
          noteEl.value = currentVal + appendStr;
        } else {
          const existingHtml = noteEl.innerHTML.trim();
          const hasContent = existingHtml && existingHtml !== '<br>' && existingHtml !== '<div><br></div>';
          const appendHtml = `<ul><li>${escapeHtml(selectedText)}</li></ul>`;
          noteEl.innerHTML = (hasContent ? existingHtml + '<br>' : '') + appendHtml;
        }
        autoSaveCurrentNote();
        updateNotesPanelUI();
        switchSidebarTab('notes');
      }
      selectionTooltip.classList.remove('visible');
      window.getSelection().removeAllRanges();
    }
  });
}

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener('keydown', (e) => {
  // Don't intercept if user is typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    prevSlidePage();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    nextSlidePage();
  }
});

// ============================================
// Window Resize → Re-render
// ============================================

let resizeTimeout;
let lastFrameWidth = 0;
let lastFrameHeight = 0;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (!slideFrame) return;
    const curW = slideFrame.clientWidth;
    const curH = slideFrame.clientHeight;
    if (Math.abs(curW - lastFrameWidth) > 10 || Math.abs(curH - lastFrameHeight) > 10) {
      lastFrameWidth = curW;
      lastFrameHeight = curH;
      if (pdfDoc) queueRenderPage(currentPage);
    }
  }, 300);
});

// ============================================
// Expose functions to global scope (for onclick in HTML)
// ============================================

window.toggleTutorPanel = toggleTutorPanel;
window.prevSlidePage = prevSlidePage;
window.nextSlidePage = nextSlidePage;
window.zoomSlide = zoomSlide;
window.downloadPdf = downloadPdf;
window.loadPdf = loadPdf;
window.sendTutorMsg = sendTutorMsg;
window.sendTutorMsgWithText = sendTutorMsgWithText;
window.handleSuggestionClick = handleSuggestionClick;
window.askTutorAboutCurrentSlide = askTutorAboutCurrentSlide;
window.toggleThumbnailsBar = toggleThumbnailsBar;
window.goToSlidePage = goToSlidePage;
window.setSlideTool = setSlideTool;
window.setPenColor = setPenColor;
window.switchSidebarTab = switchSidebarTab;
window.autoSaveCurrentNote = autoSaveCurrentNote;
window.clearCurrentPageNote = clearCurrentPageNote;
window.askTutorAboutNote = askTutorAboutNote;
window.generateAINoteForCurrentPage = generateAINoteForCurrentPage;
window.removeAINoteChip = removeAINoteChip;
window.noteFormatCmd = noteFormatCmd;
window.undoStroke = undoStroke;
window.redoStroke = redoStroke;

// ============================================
// Initial Load
// ============================================

loadPdfDocument(currentPdfPath);
updateNotesPanelUI();
