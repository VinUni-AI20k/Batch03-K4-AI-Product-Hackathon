let currentPage = 1;
let totalPages = 83;
let currentZoom = 100;
let currentPdfPath = '../data/vlearn-pack/slides/d1-slide-hackathon.pdf';

// --- Toggle VLearn Tutor AI Sidebar (Thò/Thụt) ---
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

function askTutorAboutCurrentSlide() {
  sendTutorMsgWithText(`Tóm tắt nội dung slide trang ${currentPage} cho tôi`);
}

function loadPdf(pdfPath, docName, totalPgs) {
  currentPdfPath = pdfPath;
  totalPages = totalPgs;
  currentPage = 1;
  
  const docTitleEl = document.getElementById('current-doc-title');
  if (docTitleEl) docTitleEl.textContent = docName;

  const docWatermarkEl = document.getElementById('doc-watermark-id');
  if (docWatermarkEl) docWatermarkEl.textContent = docName;
  
  document.querySelectorAll('.total-pages-count').forEach(el => el.textContent = totalPgs);
  updatePage();

  // Update active doc state
  document.querySelectorAll('.doc-item').forEach(item => item.classList.remove('active'));
  if (typeof event !== 'undefined' && event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

function prevSlidePage() {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
  }
}

function nextSlidePage() {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
  }
}

function updatePage() {
  const curPgEl = document.getElementById('current-page-num');
  if (curPgEl) curPgEl.textContent = currentPage;

  const chipPgEl = document.getElementById('current-page-chip');
  if (chipPgEl) chipPgEl.textContent = currentPage;
  
  const tutorSlideEl = document.getElementById('tutor-slide-num');
  if (tutorSlideEl) tutorSlideEl.textContent = currentPage;
  
  const frame = document.getElementById('pdf-frame');
  if (frame) {
    frame.src = currentPdfPath + '#toolbar=0&navpanes=0&view=FitH&page=' + currentPage;
  }
}

function scrollToPage(pg) {
  const viewport = document.getElementById('slide-viewport');
  const cards = document.querySelectorAll('.slide-page-container');
  if (cards[pg - 1]) {
    cards[pg - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (viewport) {
    viewport.scrollTop = (pg - 1) * 680;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Scroll listener for continuous vertical slide scrolling
  const viewport = document.getElementById('slide-viewport');
  if (viewport) {
    viewport.addEventListener('scroll', function() {
      const cards = document.querySelectorAll('.slide-page-container');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          currentPage = index + 1;
          const curPgEl = document.getElementById('current-page-num');
          if (curPgEl) curPgEl.textContent = currentPage;
          
          const tutorSlideEl = document.getElementById('tutor-slide-num');
          if (tutorSlideEl) tutorSlideEl.textContent = currentPage;
        }
      });
    }, { passive: true });
  }
});

function zoomSlide(delta) {
  currentZoom = Math.min(200, Math.max(50, currentZoom + delta));
  const zoomEl = document.getElementById('zoom-value');
  if (zoomEl) zoomEl.textContent = currentZoom + '%';
  
  const frame = document.getElementById('pdf-frame');
  if (frame) {
    frame.style.transform = `scale(${currentZoom / 100})`;
    frame.style.transformOrigin = 'top center';
  }
}

function downloadPdf() {
  const a = document.createElement('a');
  a.href = currentPdfPath;
  const docTitleEl = document.getElementById('current-doc-title');
  a.download = docTitleEl ? docTitleEl.textContent : 'slide.pdf';
  a.click();
}

function sendTutorMsg(e) {
  e.preventDefault();
  const input = document.getElementById('tutor-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const chatBody = document.getElementById('tutor-chat-body');
  if (!chatBody) return;

  // Append user msg
  const userTag = document.createElement('div');
  userTag.className = 'chat-context-tag';
  userTag.textContent = `Ngữ cảnh: Slide trang ${currentPage}`;
  chatBody.appendChild(userTag);

  const userMsg = document.createElement('div');
  userMsg.className = 'tutor-msg user';
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate Tutor response
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'tutor-msg assistant';
    botMsg.textContent = `VLearn Tutor: Dựa trên slide trang ${currentPage}, "${text}" là một khái niệm quan trọng. Bạn cần thêm giải thích chi tiết nào khác không?`;
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}
