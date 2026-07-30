function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const dropzone = document.getElementById('dropzone');
const pdfInput = document.getElementById('pdf-input');
const dzEmpty = document.getElementById('dropzone-empty');
const dzFilled = document.getElementById('dropzone-filled');
const fileNameEl = document.getElementById('file-name');
const generateBtn = document.getElementById('generate-btn');
const errorBox = document.getElementById('error-box');

const numGroup = document.getElementById('num-questions-group');
const modeGroup = document.getElementById('mode-group');
const difficultyGroup = document.getElementById('difficulty-group');

const formPanel = document.getElementById('form-panel');
const loadingPanel = document.getElementById('loading-panel');
const loadingText = document.getElementById('loading-text');
const resultsPanel = document.getElementById('results-panel');
const demoPanel = document.getElementById('demo-panel');
const demoToggle = document.getElementById('demo-toggle');
const demoContent = document.getElementById('demo-content');
const cancelBtn = document.getElementById('cancel-btn');
const modeBanner = document.getElementById('mode-banner');
const warningBanner = document.getElementById('warning-banner');
const metaLine = document.getElementById('meta-line');
const quizList = document.getElementById('quiz-list');
const demoQuizList = document.getElementById('demo-quiz-list');

const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30MB, khớp copy trên dropzone

let selectedFile = null;
let numQuestions = 10;
let mode = 'standard';
let difficultyLevel = 'mixed'; // easy | medium | hard | mixed (dễ -> khó, mặc định)
let currentController = null; // AbortController của request /api/generate-quiz đang chạy (để Hủy)

const DIFF_LABEL = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
const DIFFICULTY_GROUP_LABEL = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó', mixed: 'Dễ → Khó (trộn)' };

// ---------- Stepper ----------
function setStep(name) {
  document.querySelectorAll('.step').forEach(el => {
    el.classList.toggle('active', el.dataset.step === name);
  });
}

// ---------- Upload ----------
dropzone.addEventListener('click', () => pdfInput.click());
// Dropzone là <div>, không phải <button>/<input> nên mặc định không dùng bàn phím được —
// thêm tabindex+role trong HTML rồi bắt Enter/Space ở đây để tương đương click (a11y: BUG-002).
dropzone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    pdfInput.click();
  }
});
['dragover', 'dragenter'].forEach(ev =>
  dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add('dragover'); })
);
['dragleave', 'drop'].forEach(ev =>
  dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove('dragover'); })
);
dropzone.addEventListener('drop', e => {
  const f = e.dataTransfer.files[0];
  if (f) setFile(f);
});
pdfInput.addEventListener('change', () => {
  if (pdfInput.files[0]) setFile(pdfInput.files[0]);
});

let hasCachedDoc = false;
const docViewerBar = document.getElementById('doc-viewer-bar');
const toggleDocBtn = document.getElementById('toggle-doc-btn');
const docPagesCount = document.getElementById('doc-pages-count');
const docPreviewContent = document.getElementById('doc-preview-content');
const docPagesList = document.getElementById('doc-pages-list');
const docLibraryWrapper = document.getElementById('doc-library-wrapper');
const docLibrarySelect = document.getElementById('doc-library-select');
const openPdfLink = document.getElementById('open-pdf-link');

if (toggleDocBtn) {
  toggleDocBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    docPreviewContent.classList.toggle('hidden');
  });
}

async function loadDocumentLibrary() {
  try {
    const res = await fetch('/api/documents');
    const data = await res.json();
    if (data.documents && data.documents.length > 0) {
      docLibraryWrapper.classList.remove('hidden');
      docLibrarySelect.innerHTML = data.documents.map(d => `
        <option value="${d.doc_id}" ${d.doc_id === data.active_doc_id ? 'selected' : ''}>
          📄 ${d.filename} (${d.total_pages} trang, ${d.total_chars} ký tự) — Nạp lúc ${d.upload_time}
        </option>
      `).join('');
    }
  } catch (err) {
    console.log('Lỗi nạp kho tài liệu:', err);
  }
}

if (docLibrarySelect) {
  docLibrarySelect.addEventListener('change', async () => {
    const docId = docLibrarySelect.value;
    if (!docId) return;
    try {
      const res = await fetch('/api/select-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: docId })
      });
      const data = await res.json();
      if (data.success) {
        selectedFile = null;
        hasCachedDoc = true;
        if (fileNameEl) fileNameEl.textContent = `Tài liệu đã chọn: ${data.filename} (${data.total_pages} trang)`;
        if (dzEmpty) dzEmpty.classList.add('hidden');
        if (dzFilled) dzFilled.classList.remove('hidden');
        if (generateBtn) generateBtn.disabled = false;

        if (openPdfLink) {
          openPdfLink.href = `/api/view-pdf?doc_id=${docId}`;
        }
        if (docViewerBar && data.pages) {
          docViewerBar.classList.remove('hidden');
          if (toggleDocBtn) toggleDocBtn.innerHTML = `📖 Xem nội dung: <strong style="text-decoration: underline;">${data.filename}</strong> (${data.total_pages} trang)`;
          if (docPagesList) docPagesList.innerHTML = data.pages.map(p => `
            <div style="margin-bottom: 14px; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
              <strong style="color: #4f46e5; font-size: 13px;">📄 [Trang ${p.page}] (${p.text.length} ký tự)</strong>
              <p style="margin: 6px 0 0 0; white-space: pre-wrap; word-break: break-word; color: #1e293b; font-family: inherit; font-size: 13px;">${escapeHtml(p.text)}</p>
            </div>
          `).join('');
        }
      }
    } catch (err) {
      showError('Lỗi chọn tài liệu từ kho.');
    }
  });
}

async function checkActiveDocument() {
  await loadDocumentLibrary();
  try {
    const res = await fetch('/api/active-document');
    const data = await res.json();
    if (data.has_cached_doc) {
      hasCachedDoc = true;
      if (fileNameEl) fileNameEl.textContent = `Tài liệu đang chọn: ${data.filename} (${data.total_pages} trang, ${data.total_chars} ký tự)`;
      if (dzEmpty) dzEmpty.classList.add('hidden');
      if (dzFilled) dzFilled.classList.remove('hidden');
      if (generateBtn) generateBtn.disabled = false;

      if (openPdfLink && data.doc_id) {
        openPdfLink.href = `/api/view-pdf?doc_id=${data.doc_id}`;
      }
      if (docViewerBar && data.pages) {
        docViewerBar.classList.remove('hidden');
        toggleDocBtn.innerHTML = `📖 Xem nội dung: <strong style="text-decoration: underline;">${data.filename}</strong> (${data.total_pages} trang)`;
        docPagesList.innerHTML = data.pages.map(p => `
          <div style="margin-bottom: 14px; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
            <strong style="color: #4f46e5; font-size: 13px;">📄 [Trang ${p.page}] (${p.text.length} ký tự)</strong>
            <p style="margin: 6px 0 0 0; white-space: pre-wrap; word-break: break-word; color: #1e293b; font-family: inherit; font-size: 13px;">${escapeHtml(p.text)}</p>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.log('Chưa có active document:', err);
  }
}

// Gọi kiểm tra tài liệu đã lưu ngay khi load trang
checkActiveDocument();

async function setFile(f) {
  if (f.type !== 'application/pdf') {
    showError('Chỉ nhận file PDF.');
    return;
  }
  if (f.size > MAX_FILE_BYTES) {
    showError(`File ${(f.size / 1024 / 1024).toFixed(1)}MB vượt quá giới hạn 30MB.`);
    return;
  }

  hideError();
  
  // Hiển thị progress bar thay vì chuyển màn hình
  showUploadProgress(f.name, 0, 'Chuẩn bị upload...');
  
  const fd = new FormData();
  fd.append('pdf', f);

  try {
    // Upload với XMLHttpRequest để theo dõi tiến độ
    const data = await uploadWithProgress(fd, (percent, status) => {
      updateUploadProgress(percent, status);
    });
    
    if (!data.success) {
      throw new Error(data.error || 'Lỗi xử lý file PDF');
    }

    selectedFile = f;
    hasCachedDoc = true;

    if (fileNameEl) fileNameEl.textContent = `Tài liệu vừa nạp & Embedding thành công: ${data.filename} (${data.total_pages} trang, ${data.total_chars} ký tự)`;
    dzEmpty.classList.add('hidden');
    dzFilled.classList.remove('hidden');
    generateBtn.disabled = false;

    if (openPdfLink && data.doc_id) {
      openPdfLink.href = `/api/view-pdf?doc_id=${data.doc_id}`;
    }

    if (docViewerBar && data.pages) {
      docViewerBar.classList.remove('hidden');
      toggleDocBtn.innerHTML = `📖 Xem nội dung: <strong style="text-decoration: underline;">${data.filename}</strong> (${data.total_pages} trang)`;
      docPagesList.innerHTML = data.pages.map(p => `
        <div style="margin-bottom: 14px; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
          <strong style="color: #4f46e5; font-size: 13px;">📄 [Trang ${p.page}] (${p.text.length} ký tự)</strong>
          <p style="margin: 6px 0 0 0; white-space: pre-wrap; word-break: break-word; color: #1e293b; font-family: inherit; font-size: 13px;">${escapeHtml(p.text)}</p>
        </div>
      `).join('');
    }

    hideUploadProgress();
    await loadDocumentLibrary();

  } catch (err) {
    hideUploadProgress();
    showError(err.message || 'Lỗi xử lý & Embedding file PDF');
  }
}

// Hàm upload với progress tracking thông minh
function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let uploadComplete = false;
    let fakeProgressInterval = null;
    let currentFakeProgress = 0;
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        // Upload thật: 0-60% (nhanh)
        const uploadPercent = Math.round((e.loaded / e.total) * 60);
        onProgress(uploadPercent, 'Đang upload file...');
        currentFakeProgress = uploadPercent;
      }
    });
    
    xhr.upload.addEventListener('loadend', () => {
      uploadComplete = true;
      // Upload xong, bắt đầu fake progress cho phần xử lý backend: 60-95%
      onProgress(60, 'Đang trích xuất text từ PDF...');
      currentFakeProgress = 60;
      
      fakeProgressInterval = setInterval(() => {
        if (currentFakeProgress < 90) {
          // 60-90%: nhích bình thường (mỗi 300ms tăng 1%)
          currentFakeProgress += 1;
          onProgress(currentFakeProgress, 'Đang chạy Embedding (Qwen3-8B)...');
        } else if (currentFakeProgress < 95) {
          // 90-95%: nhích chậm lại (mỗi 500ms tăng 1%)
          currentFakeProgress += 0.5;
          onProgress(Math.floor(currentFakeProgress), 'Đang hoàn tất indexing...');
        }
        // Dừng ở 95%, chờ response thật
      }, currentFakeProgress < 90 ? 300 : 500);
    });
    
    xhr.addEventListener('load', () => {
      // Dừng fake progress
      if (fakeProgressInterval) {
        clearInterval(fakeProgressInterval);
      }
      
      if (xhr.status >= 200 && xhr.status < 300) {
        // Vọt lên 100% khi thành công
        onProgress(100, 'Hoàn thành!');
        
        try {
          setTimeout(() => {
            resolve(JSON.parse(xhr.responseText));
          }, 300);
        } catch (err) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error || `HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      }
    });
    
    xhr.addEventListener('error', () => {
      if (fakeProgressInterval) {
        clearInterval(fakeProgressInterval);
      }
      reject(new Error('Network error'));
    });
    
    xhr.open('POST', '/api/upload-and-index');
    xhr.send(formData);
  });
}

// Hiển thị progress bar
function showUploadProgress(filename, percent, status) {
  // Tạo progress bar nếu chưa có
  let progressContainer = document.getElementById('upload-progress-container');
  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.id = 'upload-progress-container';
    progressContainer.style.cssText = `
      margin-top: 12px;
      padding: 16px;
      background: #f0f9ff;
      border: 2px solid #0284c7;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.15);
    `;
    dropzone.parentNode.insertBefore(progressContainer, dropzone.nextSibling);
  }
  
  progressContainer.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
      <div style="font-size: 20px;">📤</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; color: #0c4a6e; font-size: 14px; margin-bottom: 4px;">
          ${escapeHtml(filename)}
        </div>
        <div id="upload-status" style="font-size: 12px; color: #475569;">
          ${status || 'Chuẩn bị...'}
        </div>
      </div>
      <div id="upload-percent" style="font-size: 18px; font-weight: 700; color: #0284c7; min-width: 50px; text-align: right;">
        ${percent}%
      </div>
    </div>
    <div style="width: 100%; height: 8px; background: #e0f2fe; border-radius: 4px; overflow: hidden;">
      <div id="upload-progress-bar" style="height: 100%; background: linear-gradient(90deg, #0284c7, #06b6d4); border-radius: 4px; transition: width 0.3s ease; width: ${percent}%;"></div>
    </div>
  `;
  
  progressContainer.classList.remove('hidden');
}

// Cập nhật progress bar
function updateUploadProgress(percent, status) {
  const percentEl = document.getElementById('upload-percent');
  const barEl = document.getElementById('upload-progress-bar');
  const statusEl = document.getElementById('upload-status');
  
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (barEl) barEl.style.width = `${percent}%`;
  if (statusEl && status) statusEl.textContent = status;
}

// Ẩn progress bar
function hideUploadProgress() {
  const progressContainer = document.getElementById('upload-progress-container');
  if (progressContainer) {
    setTimeout(() => {
      progressContainer.style.transition = 'opacity 0.5s ease';
      progressContainer.style.opacity = '0';
      setTimeout(() => {
        progressContainer.remove();
      }, 500);
    }, 500);
  }
}

// ---------- Option groups ----------
function wireGroup(group, btnClass, onSelect) {
  group.querySelectorAll('.' + btnClass).forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.' + btnClass).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(btn.dataset.value);
    });
  });
}
wireGroup(numGroup, 'pill-btn', v => { numQuestions = parseInt(v, 10); });
wireGroup(modeGroup, 'diff-card', v => { mode = v; });
wireGroup(difficultyGroup, 'pill-btn', v => { difficultyLevel = v; });

// ---------- Generate ----------
generateBtn.addEventListener('click', async () => {
  if ((!selectedFile && !hasCachedDoc) || generateBtn.disabled) return;
  hideError();
  generateBtn.disabled = true;

  formPanel.classList.add('hidden');
  demoPanel.classList.add('hidden');
  resultsPanel.classList.add('hidden');
  loadingPanel.classList.remove('hidden');
  setStep('generate');
  if (loadingText) {
    loadingText.textContent = mode === 'stress'
      ? 'Đang gọi AI (chế độ sáng tạo — temperature cao)…'
      : 'Đang gọi AI để sinh quiz…';
  }

  const fd = new FormData();
  if (selectedFile) {
    fd.append('pdf', selectedFile);
  }
  fd.append('num_questions', numQuestions);
  fd.append('mode', mode);
  fd.append('difficulty_level', difficultyLevel);
  
  // Thêm tuỳ chọn bật/tắt RAG
  const useRagCheckbox = document.getElementById('use-rag-checkbox');
  fd.append('use_rag', useRagCheckbox && useRagCheckbox.checked ? 'true' : 'false');

  // AbortController để nút Hủy có tác dụng thật (BUG-004): backend có thể mất
  // tới vài phút (timeout 90s x tối đa 3 lần retry) nếu OpenAI bị rate-limit.
  currentController = new AbortController();

  try {
    const res = await fetch('/api/generate-quiz', { method: 'POST', body: fd, signal: currentController.signal });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Lỗi không xác định (HTTP ${res.status})`);
    }
    renderResults(data);
  } catch (err) {
    loadingPanel.classList.add('hidden');
    formPanel.classList.remove('hidden');
    setStep('upload');
    if (err.name !== 'AbortError') {
      showError(err.message);
    }
    // AbortError (do bấm Hủy) không hiện error-box đỏ — người dùng chủ động hủy, không phải lỗi hệ thống.
  } finally {
    currentController = null;
    generateBtn.disabled = false;
  }
});

cancelBtn.addEventListener('click', () => {
  if (currentController) currentController.abort();
});

// ---------- Demo mẫu: thu gọn mặc định, tránh chiếm màn hình đầu (BUG-005) ----------
if (demoToggle) {
  demoToggle.addEventListener('click', () => {
    if (!demoContent) return;
    const willShow = demoContent.classList.contains('hidden');
    demoContent.classList.toggle('hidden', !willShow);
    demoToggle.textContent = willShow ? '🙈 Ẩn demo' : '👀 Xem thử quiz sẽ trông như thế nào';
  });
}

// ---------- Render 1 thẻ câu hỏi (dùng chung cho demo + kết quả thật) ----------
function renderQuizCard(q, idx, { interactive = true } = {}) {
  const card = document.createElement('div');
  card.className = 'qcard';

  const optionsHtml = q.options.map((opt, i) =>
    `<button class="option" data-i="${i}" ${interactive ? '' : 'disabled'}>${opt}</button>`
  ).join('');

  const verifiedBadge = q.source_verified === false
    ? '<span class="diff-badge" style="background:var(--red-soft);color:#C43E4A;">⚠️ Chưa xác minh nguồn</span>'
    : '';

  card.innerHTML = `
    <div class="qcard-top">
      <span class="qindex">Câu ${idx + 1}</span>
      <span class="diff-badge diff-${q.difficulty}">${DIFF_LABEL[q.difficulty] || q.difficulty}</span>
      ${verifiedBadge}
    </div>
    ${q.scenario ? `<div class="qscenario">${q.scenario}</div>` : ''}
    <div class="qtext">${q.question}</div>
    <div class="options">${optionsHtml}</div>
    <div class="feedback">
      <div class="label">Giải thích</div>
      <div class="expl-text"></div>
      ${q.source_snippet ? `<div class="src"><b>Trích nguồn:</b> <span class="src-text"></span></div>` : ''}
    </div>
  `;

  const feedback = card.querySelector('.feedback');
  const exprEl = card.querySelector('.expl-text');
  const srcEl = card.querySelector('.src-text');

  card.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = parseInt(btn.dataset.i, 10);
      let targetIndex = typeof q.correct_index === 'number' ? q.correct_index : undefined;
      if (targetIndex === undefined) {
        const rawAns = String(q.answer || q.correct_answer || q.correct_index || '').trim();
        const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
        const firstChar = rawAns.toUpperCase().charAt(0);
        if (letterMap[firstChar] !== undefined) {
          targetIndex = letterMap[firstChar];
        } else if (!isNaN(parseInt(rawAns, 10))) {
          targetIndex = parseInt(rawAns, 10);
        } else {
          const matchIdx = q.options.findIndex(opt => opt.toLowerCase().includes(rawAns.toLowerCase()));
          if (matchIdx !== -1) targetIndex = matchIdx;
        }
      }

      card.querySelectorAll('.option').forEach((b, i) => {
        b.disabled = true;
        if (i === targetIndex) b.classList.add('correct');
        else if (i === chosen) b.classList.add('wrong');
      });
      if (exprEl) exprEl.textContent = q.explanation || '';
      if (srcEl) srcEl.textContent = q.source_snippet || '(không có)';
      feedback.classList.add('show');
      setStep('quiz');
    });
  });

  return card;
}

function renderResults(data) {
  loadingPanel.classList.add('hidden');
  resultsPanel.classList.remove('hidden');
  setStep('review');

  if (modeBanner) {
    if (data.mode === 'stress') {
      modeBanner.textContent = '⚡ Kết quả từ CHẾ ĐỘ SÁNG TẠO — AI được phép liên hệ ví dụ ngoài tài liệu. Câu nào chưa xác minh được nguồn sẽ có nhãn ⚠️. Không dùng chế độ này để phát quiz thật.';
      modeBanner.classList.remove('hidden');
    } else {
      modeBanner.classList.add('hidden');
    }
  }

  if (warningBanner) {
    if (data.warning) {
      warningBanner.textContent = '⚠️ ' + data.warning;
      warningBanner.classList.remove('hidden');
    } else {
      warningBanner.classList.add('hidden');
    }
  }

  const diffLabel = DIFFICULTY_GROUP_LABEL[data.difficulty_level] || data.difficulty_level;
  if (metaLine) {
    metaLine.textContent = `Model: ${data.model} · Mức độ khó: ${diffLabel} · ${data.pages_used} trang có text (${data.total_chars} ký tự) · ${data.questions.length} câu · thời gian gọi API: ${data.elapsed_seconds}s`;
  }

  quizList.innerHTML = '';
  data.questions.forEach((q, idx) => {
    quizList.appendChild(renderQuizCard(q, idx));
  });
}

document.getElementById('reset-btn').addEventListener('click', () => {
  resultsPanel.classList.add('hidden');
  formPanel.classList.remove('hidden');
  demoPanel.classList.remove('hidden');
  setStep('upload');
  checkActiveDocument();
});

// ---------- Demo mẫu (hiện sẵn khi chưa upload gì, minh hoạ G2 - làm rõ AI làm được gì) ----------
const DEMO_QUESTIONS = [
  {
    difficulty: 'easy',
    scenario: '',
    question: 'Theo bài giảng, "Học sâu" (Deep Learning) là một nhánh con của lĩnh vực nào?',
    options: ['Học máy (Machine Learning)', 'Thiết kế đồ hoạ', 'Quản trị cơ sở dữ liệu', 'Mạng máy tính'],
    correct_index: 0,
    explanation: 'Deep Learning là một nhánh con của Machine Learning, dùng mạng nơ-ron nhiều lớp để tự học đặc trưng từ dữ liệu.',
    source_snippet: '',
  },
  {
    difficulty: 'medium',
    scenario: 'Một đội đang huấn luyện mô hình phân loại ảnh cho ứng dụng nội bộ.',
    question: 'Trong quy trình huấn luyện mô hình, bước nào diễn ra NGAY SAU khi thu thập dữ liệu?',
    options: ['Triển khai mô hình', 'Đánh giá mô hình', 'Làm sạch & tiền xử lý dữ liệu', 'Trực quan hoá kết quả'],
    correct_index: 2,
    explanation: 'Sau khi thu thập, dữ liệu cần được làm sạch và tiền xử lý trước khi đưa vào huấn luyện — bỏ qua bước này thường khiến mô hình học sai pattern.',
    source_snippet: '',
  },
  {
    difficulty: 'hard',
    scenario: 'Một mô hình đạt độ chính xác 98% trên tập huấn luyện nhưng chỉ 65% trên tập kiểm tra.',
    question: 'Tình huống nào dưới đây là ví dụ rõ nhất về "overfitting" mà bài giảng đã đề cập?',
    options: [
      'Mô hình học quá ít epoch',
      'Dữ liệu huấn luyện quá lớn',
      'Mô hình thay đổi kiến trúc liên tục',
      'Mô hình khớp gần như hoàn hảo dữ liệu huấn luyện nhưng dự đoán kém trên dữ liệu mới',
    ],
    correct_index: 3,
    explanation: 'Overfitting xảy ra khi mô hình "học thuộc" dữ liệu huấn luyện (kể cả nhiễu) thay vì học được pattern tổng quát, nên dự đoán kém trên dữ liệu chưa từng thấy.',
    source_snippet: '',
  },
];

DEMO_QUESTIONS.forEach((q, idx) => {
  demoQuizList.appendChild(renderQuizCard(q, idx));
});

// ---------- Helpers ----------
function showError(msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }
}
function hideError() {
  if (errorBox) {
    errorBox.classList.add('hidden');
  }
}
