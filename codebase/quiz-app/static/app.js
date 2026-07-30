const dropzone = document.getElementById('dropzone');
const pdfInput = document.getElementById('pdf-input');
const dzEmpty = document.getElementById('dropzone-empty');
const dzFilled = document.getElementById('dropzone-filled');
const fileNameEl = document.getElementById('file-name');
const generateBtn = document.getElementById('generate-btn');
const errorBox = document.getElementById('error-box');

const numGroup = document.getElementById('num-questions-group');
const modeGroup = document.getElementById('mode-group');

const formPanel = document.getElementById('form-panel');
const loadingPanel = document.getElementById('loading-panel');
const loadingText = document.getElementById('loading-text');
const resultsPanel = document.getElementById('results-panel');
const demoPanel = document.getElementById('demo-panel');
const modeBanner = document.getElementById('mode-banner');
const warningBanner = document.getElementById('warning-banner');
const metaLine = document.getElementById('meta-line');
const quizList = document.getElementById('quiz-list');
const demoQuizList = document.getElementById('demo-quiz-list');

const MAX_FILE_BYTES = 30 * 1024 * 1024; // 30MB, khớp copy trên dropzone

let selectedFile = null;
let numQuestions = 10;
let mode = 'standard';

const DIFF_LABEL = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

// ---------- Stepper ----------
function setStep(name) {
  document.querySelectorAll('.step').forEach(el => {
    el.classList.toggle('active', el.dataset.step === name);
  });
}

// ---------- Upload ----------
dropzone.addEventListener('click', () => pdfInput.click());
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

function setFile(f) {
  if (f.type !== 'application/pdf') {
    showError('Chỉ nhận file PDF.');
    return;
  }
  if (f.size > MAX_FILE_BYTES) {
    showError(`File ${(f.size / 1024 / 1024).toFixed(1)}MB vượt quá giới hạn 30MB.`);
    return;
  }
  selectedFile = f;
  fileNameEl.textContent = `${f.name} (${(f.size / 1024).toFixed(0)} KB)`;
  dzEmpty.classList.add('hidden');
  dzFilled.classList.remove('hidden');
  generateBtn.disabled = false;
  hideError();
  setStep('upload');
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

// ---------- Generate ----------
generateBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  hideError();

  formPanel.classList.add('hidden');
  demoPanel.classList.add('hidden');
  resultsPanel.classList.add('hidden');
  loadingPanel.classList.remove('hidden');
  setStep('generate');
  loadingText.textContent = mode === 'stress'
    ? 'Đang gọi Gemini (chế độ sáng tạo — temperature cao)…'
    : 'Đang gọi Gemini để sinh quiz…';

  const fd = new FormData();
  fd.append('pdf', selectedFile);
  fd.append('num_questions', numQuestions);
  fd.append('mode', mode);

  try {
    const res = await fetch('/api/generate-quiz', { method: 'POST', body: fd });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Lỗi không xác định (HTTP ${res.status})`);
    }
    renderResults(data);
  } catch (err) {
    loadingPanel.classList.add('hidden');
    formPanel.classList.remove('hidden');
    setStep('upload');
    showError(err.message);
  }
});

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
      card.querySelectorAll('.option').forEach((b, i) => {
        b.disabled = true;
        if (i === q.correct_index) b.classList.add('correct');
        else if (i === chosen) b.classList.add('wrong');
      });
      exprEl.textContent = q.explanation || '';
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

  if (data.mode === 'stress') {
    modeBanner.textContent = '⚡ Kết quả từ CHẾ ĐỘ SÁNG TẠO — AI được phép liên hệ ví dụ ngoài tài liệu. Câu nào chưa xác minh được nguồn sẽ có nhãn ⚠️. Không dùng chế độ này để phát quiz thật.';
    modeBanner.classList.remove('hidden');
  } else {
    modeBanner.classList.add('hidden');
  }

  if (data.warning) {
    warningBanner.textContent = '⚠️ ' + data.warning;
    warningBanner.classList.remove('hidden');
  } else {
    warningBanner.classList.add('hidden');
  }

  metaLine.textContent = `Model: ${data.model} · ${data.pages_used} trang có text (${data.total_chars} ký tự) · ${data.questions.length} câu · thời gian gọi API: ${data.elapsed_seconds}s`;

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
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}
function hideError() {
  errorBox.classList.add('hidden');
}
