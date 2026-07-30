// CP2 MOCK: quiz, đáp án, feedback và credits là dữ liệu giả lập.
// CP3 sẽ thay mảng quizMock bằng output từ AI call có mã nguồn học liệu hợp lệ.
const quizMock = [
  { source: "Day03 · Mục ReAct", question: "Trong mô hình ReAct, thành phần nào giúp agent thực hiện hành động ngoài việc suy luận?", options: ["Reflection", "Tool calling", "Fine-tuning", "Tokenization"], correct: 1, review: "Ôn lại: ReAct kết hợp Reasoning và Action qua tool calling." },
  { source: "Day03 · Mục Context", question: "Mục tiêu chính của việc quản lý context trong một agent là gì?", options: ["Tăng số lượng tool", "Giữ thông tin liên quan để agent ra quyết định tốt", "Loại bỏ mọi lịch sử", "Thay mô hình ngôn ngữ"], correct: 1, review: "Ôn lại: chọn lọc context liên quan trước khi agent hành động." },
  { source: "Day03 · Mục Tool calling", question: "Khi tool trả về lỗi, agent nên làm gì trước tiên?", options: ["Bỏ qua lỗi và trả lời chắc chắn", "Kiểm tra lỗi, điều chỉnh hành động hoặc hỏi thêm thông tin", "Gọi lại tool vô hạn", "Xóa toàn bộ lịch sử"], correct: 1, review: "Ôn lại: quan sát kết quả tool để điều chỉnh bước tiếp theo." },
];

const state = { index: 0, answers: [], credits: 7, maxCredits: 20 };
const modal = document.querySelector("#quiz-modal");
const quizView = document.querySelector("#quiz-view");
const creditValue = document.querySelector("#credit-value");
const creditProgress = document.querySelector("#credit-progress");

function updateCredits() {
  creditValue.textContent = `${state.credits} / ${state.maxCredits}`;
  creditProgress.style.width = `${(state.credits / state.maxCredits) * 100}%`;
}

function openQuiz() {
  state.index = 0;
  state.answers = [];
  modal.classList.remove("hidden");
  renderQuestion();
}

function closeQuiz() { modal.classList.add("hidden"); }

function renderQuestion() {
  const item = quizMock[state.index];
  const selected = state.answers[state.index];
  const percent = (state.index / quizMock.length) * 100;
  quizView.innerHTML = `
    <span class="quiz-eyebrow">QUIZ CỦNG CỐ · DAY03</span>
    <h2>Kiểm tra nhanh sau buổi học</h2>
    <p class="quiz-subtitle">3 câu · khoảng 3 phút · chỉ dùng cho ôn tập</p>
    <div class="progress-row"><span>Câu ${state.index + 1} / ${quizMock.length}</span><span>${Math.round(percent)}%</span></div>
    <div class="progress-line"><span style="width:${percent}%"></span></div>
    <span class="question-source">▣ ${item.source}</span>
    <h3 class="question-text">${item.question}</h3>
    <div class="answers">${item.options.map((option, i) => `
      <button class="answer ${selected === i ? "selected" : ""}" data-choice="${i}">
        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>${option}
      </button>`).join("")}</div>
    <div class="quiz-actions">
      ${state.index > 0 ? '<button class="outline-button" id="previous-question">← Quay lại</button>' : ""}
      <button class="primary-button ${selected === undefined ? "disabled" : ""}" id="next-question" ${selected === undefined ? "disabled" : ""}>
        ${state.index === quizMock.length - 1 ? "Nộp quiz" : "Câu tiếp theo →"}
      </button>
    </div>`;
  document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    state.answers[state.index] = Number(button.dataset.choice);
    renderQuestion();
  }));
  document.querySelector("#previous-question")?.addEventListener("click", () => { state.index -= 1; renderQuestion(); });
  document.querySelector("#next-question").addEventListener("click", () => {
    if (state.index < quizMock.length - 1) { state.index += 1; renderQuestion(); } else { renderResults(); }
  });
}

function renderResults() {
  const score = state.answers.reduce((total, answer, index) => total + (answer === quizMock[index].correct ? 1 : 0), 0);
  const eligibleForCredit = score >= 2 && state.credits < state.maxCredits;
  const review = quizMock.find((item, index) => state.answers[index] !== item.correct)?.review || "Bạn đã nắm tốt các ý chính của Day03.";
  if (eligibleForCredit) { state.credits += 1; updateCredits(); }
  const answers = quizMock.map((item, index) => `<li><span class="${state.answers[index] === item.correct ? "status-correct" : "status-wrong"}">${state.answers[index] === item.correct ? "✓ Đúng" : "× Cần xem lại"}</span> · ${item.source}</li>`).join("");
  quizView.innerHTML = `
    <span class="quiz-eyebrow">KẾT QUẢ QUIZ · DAY03</span>
    <h2>Bạn đã hoàn thành quiz!</h2>
    <div class="result-score">${score}/3<small>câu đúng</small></div>
    <div class="result-grid"><div class="result-card"><small>NỘI DUNG NÊN ÔN LẠI</small><strong>${review}</strong></div><div class="result-card"><small>GỢI Ý TIẾP THEO</small><strong>Mở lại đoạn Day03 liên quan trước khi sang bài mới.</strong></div></div>
    <ul class="feedback-list">${answers}</ul>
    <div class="reward-banner"><span class="reward-icon">+${eligibleForCredit ? 1 : 0}</span><div><strong>${eligibleForCredit ? "Bạn nhận được 1 practice credit" : state.credits >= state.maxCredits ? "Bạn đã đạt giới hạn 20 credits" : "Hoàn thành quiz để nhận credit"}</strong><small>Credits hiện tại: ${state.credits}/${state.maxCredits} · Chỉ dùng trong chế độ ôn tập.</small></div></div>
    <div class="quiz-actions"><button class="outline-button" id="retry-quiz">Làm lại</button><button class="primary-button" id="finish-quiz">Quay lại bài học</button></div>`;
  document.querySelector("#retry-quiz").addEventListener("click", openQuiz);
  document.querySelector("#finish-quiz").addEventListener("click", closeQuiz);
}

document.querySelector("#start-quiz").addEventListener("click", openQuiz);
document.querySelector("#side-start").addEventListener("click", openQuiz);
document.querySelector("#close-quiz").addEventListener("click", closeQuiz);
modal.addEventListener("click", (event) => { if (event.target === modal) closeQuiz(); });
updateCredits();
