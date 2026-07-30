// Quiz cuối bài là bản cố định đã phát hành (demo quy trình AI draft → GV duyệt).
const publishedQuiz = [
  { source: "Day03 · Mục Tool calling", question: "Trong mô hình ReAct, thành phần nào giúp agent thực hiện hành động ngoài việc suy luận?", options: ["Reflection", "Tool calling", "Fine-tuning", "Tokenization"], correct: 1, review: "Ôn lại: ReAct kết hợp Reasoning và Action qua tool calling." },
  { source: "Day03 · Mục Context", question: "Mục tiêu chính của việc quản lý context trong một agent là gì?", options: ["Tăng số lượng tool", "Giữ thông tin liên quan để agent ra quyết định tốt", "Loại bỏ mọi lịch sử", "Thay mô hình ngôn ngữ"], correct: 1, review: "Ôn lại: chọn lọc context liên quan trước khi agent hành động." },
  { source: "Day03 · Mục Tool calling", question: "Khi tool trả về lỗi, agent nên làm gì trước tiên?", options: ["Bỏ qua lỗi và trả lời chắc chắn", "Kiểm tra lỗi, điều chỉnh hành động hoặc hỏi thêm thông tin", "Gọi lại tool vô hạn", "Xóa toàn bộ lịch sử"], correct: 1, review: "Ôn lại: quan sát kết quả tool để điều chỉnh bước tiếp theo." },
  { source: "Day03 · LLM và logic", question: "LLM mạnh nhất ở dạng bài toán nào?", options: ["Duyệt đồ thị tối ưu tuyệt đối", "Suy luận ngữ nghĩa dựa trên văn bản", "Tính toán deterministic", "Lưu trữ quan hệ"], correct: 1, review: "Ôn lại giới hạn của LLM và bài toán ngữ nghĩa." },
  { source: "Day03 · Case du lịch", question: "Dữ liệu địa điểm và khoảng cách nên được hỗ trợ bởi thành phần nào?", options: ["Chỉ prompt", "Cơ sở dữ liệu/đồ thị", "Temperature cao", "Bộ nhớ hội thoại"], correct: 1, review: "Ôn lại cách kết hợp LLM với dữ liệu có cấu trúc." },
  { source: "Day03 · Narrow scope", question: "Khi yêu cầu quá lớn, bước phù hợp đầu tiên là gì?", options: ["Build toàn bộ", "Thu hẹp phạm vi và làm lần lượt", "Tăng model", "Bỏ user research"], correct: 1, review: "Ôn lại nguyên tắc narrow down yêu cầu." },
  { source: "Day03 · Tool", question: "Tool giúp agent làm gì?", options: ["Chỉ tạo văn bản dài", "Tương tác với hệ thống/dữ liệu bên ngoài", "Loại bỏ reasoning", "Thay thế mọi API"], correct: 1, review: "Ôn lại vai trò của tool trong agent." },
  { source: "Day03 · RAG", question: "RAG chủ yếu bổ sung điều gì cho LLM?", options: ["Nguồn thông tin liên quan tại thời điểm hỏi", "Thêm tham số model", "Tăng tốc mạng", "Giao diện mới"], correct: 0, review: "Ôn lại retrieval và grounding." },
  { source: "Day03 · Workflow", question: "Workflow phù hợp khi nào?", options: ["Không biết trước bước nào", "Có chuỗi bước tương đối xác định", "Mọi quyết định ngẫu nhiên", "Không có mục tiêu"], correct: 1, review: "Ôn lại workflow và agent." },
  { source: "Day03 · Agent", question: "Điểm khác quan trọng của agent so với chatbot đơn giản là gì?", options: ["Chỉ có giao diện chat", "Có thể quyết định bước và hành động tiếp theo", "Luôn đúng", "Không cần context"], correct: 1, review: "Ôn lại khả năng lập kế hoạch/hành động của agent." },
  { source: "Day03 · Observation", question: "Trong vòng lặp ReAct, observation được dùng để làm gì?", options: ["Trang trí output", "Cập nhật reasoning cho bước tiếp theo", "Xóa tool", "Đóng ứng dụng"], correct: 1, review: "Ôn lại vòng lặp Reason–Act–Observe." },
  { source: "Day03 · Fallback", question: "Khi model chính lỗi, một fallback hợp lý là gì?", options: ["Im lặng", "Model nhẹ cho câu dễ kèm thông báo giới hạn", "Bịa kết quả", "Gọi vô hạn"], correct: 1, review: "Ôn lại graceful fallback." },
  { source: "Day03 · Cost", question: "Trước khi trình bày giải pháp AI, nên làm rõ điều gì?", options: ["Màu nút", "Chi phí vận hành và metric", "Tên agent", "Số animation"], correct: 1, review: "Ôn lại cost và metric." },
  { source: "Day03 · Deterministic", question: "Phần nào nên tách khỏi LLM?", options: ["Logic cần kết quả xác định tuyệt đối", "Giải thích ngôn ngữ", "Tóm tắt", "Phân loại mềm"], correct: 0, review: "Ôn lại phần deterministic và probabilistic." },
  { source: "Day03 · Product", question: "Khi chọn AI cho một bài toán, câu hỏi đầu tiên là gì?", options: ["Model nào mới nhất", "LLM có phù hợp sức mạnh bài toán không", "Logo gì", "Deploy ở đâu"], correct: 1, review: "Ôn lại problem–solution fit." },
];

const syllabus = {
  problem_fit: { label: "Phù hợp bài toán & giới hạn LLM", sourceIds: ["T03-024", "T03-025", "T03-027", "T03-028", "T03-029", "T03-030", "T03-031", "T03-032", "T03-033"] },
  tool_calling: { label: "Tool calling & phần xác định", sourceIds: ["T03-034", "T03-035"] },
  context_rag: { label: "Context & RAG", sourceIds: ["T03-036"] },
  product_decision: { label: "Thiết kế sản phẩm AI", sourceIds: ["T03-037", "T03-038"] },
};

const publishedTopics = [
  "tool_calling", "context_rag", "tool_calling", "problem_fit", "problem_fit",
  "problem_fit", "tool_calling", "context_rag", "product_decision", "product_decision",
  "tool_calling", "product_decision", "product_decision", "tool_calling", "problem_fit",
];
publishedQuiz.forEach((question, index) => { question.topic = publishedTopics[index]; });

let activeQuiz = publishedQuiz;
const state = { index: 0, answers: [], credits: 7, maxCredits: 20, quizType: "published", focusTopics: [], rewardGranted: false };
const modal = document.querySelector("#quiz-modal");
const quizView = document.querySelector("#quiz-view");
const creditValue = document.querySelector("#credit-value");
const creditProgress = document.querySelector("#credit-progress");
const askForm = document.querySelector("#ask-form");
const askInput = document.querySelector("#ask-input");
const lessonSelect = document.querySelector("#lesson-select");
const tutorConversation = document.querySelector("#tutor-conversation");
const slideFrame = document.querySelector("#slide-frame");

const lessons = {
  day03: { label: "Day03", title: "Từ Chatbot đến Agentic Agent", file: "day03-material.pdf", description: "Bạn vừa hoàn thành Day03. Dành 3 phút để kiểm tra các ý chính và biết phần nào cần ôn lại." },
  day04: { label: "Day04", title: "Prompt Engineering & Tool Calling", file: "day04-prompt-engineering-tool-calling-v2.pdf", description: "Bạn đang xem slide Day04. Hỏi Tutor về nội dung bài học hoặc làm quiz củng cố sau buổi học." },
  day05: { label: "Day05", title: "AI Product", file: "day05-lecture-slides.pdf", description: "Bạn đang xem slide Day05. Hỏi Tutor về nội dung bài học hoặc làm quiz củng cố sau buổi học." },
};

function setActiveLesson(lessonId) {
  const lesson = lessons[lessonId];
  if (!lesson) return;
  lessonSelect.value = lessonId;
  slideFrame.src = `/slides/${lessonId}#view=FitH`;
  slideFrame.title = `Slide bài học ${lesson.label}`;
  document.querySelector("#document-title").textContent = lesson.file;
  document.querySelector("#document-meta").textContent = `COMP2010 · ${lesson.label}`;
  document.querySelector("#slide-label").textContent = lesson.label;
  document.querySelector("#slide-filename").textContent = lesson.file;
  document.querySelectorAll(".lesson-trigger").forEach((button) => {
    button.classList.toggle("active", button.dataset.lesson === lessonId && button.classList.contains("lesson-file"));
    button.classList.toggle("selected", button.dataset.lesson === lessonId && button.classList.contains("day-item"));
  });
}

function updateCredits() {
  creditValue.textContent = `${state.credits} / ${state.maxCredits}`;
  creditProgress.style.width = `${(state.credits / state.maxCredits) * 100}%`;
}

function openQuiz() {
  activeQuiz = publishedQuiz;
  state.quizType = "published";
  state.focusTopics = [];
  state.index = 0;
  state.answers = [];
  state.rewardGranted = false;
  modal.classList.remove("hidden");
  renderQuestion();
}

async function openReinforcementQuiz(topicIds) {
  state.quizType = "reinforcement";
  state.focusTopics = topicIds;
  state.index = 0;
  state.answers = [];
  modal.classList.remove("hidden");
  const topicLabels = topicIds.map((id) => syllabus[id].label);
  const focusSourceIds = [...new Set(topicIds.flatMap((id) => syllabus[id].sourceIds))];
  quizView.innerHTML = `<span class="quiz-eyebrow">LANGGRAPH · QUIZ CỦNG CỐ</span><h2>Đang tạo quiz theo phần cần củng cố…</h2><p class="quiz-subtitle">Agent truy xuất transcript cho: ${topicLabels.join(" · ")}, sau đó kiểm tra nguồn trước khi hiển thị.</p>`;
  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_title: "Day03 — Quiz củng cố cá nhân hoá",
        source_ids: focusSourceIds,
        focus_topics: topicLabels,
        focus_source_ids: focusSourceIds,
        question_count: 5,
      }),
    });
    const payload = await response.json();
    if (!response.ok || payload.status !== "OK") throw new Error(payload.message || "Không tạo được quiz củng cố");
    activeQuiz = payload.questions.map((question) => ({
      source: question.source_ids.join(", "), question: question.question, options: question.options,
      correct: question.correct, review: question.explanation, topic: "reinforcement",
    }));
    state.traceId = payload.trace_id;
    renderQuestion();
  } catch (error) {
    quizView.innerHTML = `<span class="quiz-eyebrow">CHƯA TẠO ĐƯỢC QUIZ CỦNG CỐ</span><h2>Hệ thống cần thêm căn cứ</h2><p class="quiz-subtitle">${error.message}</p><p class="quiz-subtitle">Bạn có thể xem lại phần đề cương hoặc thử tạo lại. Hệ thống không thay bằng câu hỏi giả.</p><div class="quiz-actions"><button class="outline-button" id="back-to-analysis">← Xem phân tích</button><button class="primary-button" id="retry-reinforcement">Thử lại</button></div>`;
    document.querySelector("#back-to-analysis").addEventListener("click", renderLearningAnalysis);
    document.querySelector("#retry-reinforcement").addEventListener("click", () => openReinforcementQuiz(topicIds));
  }
}

function closeQuiz() { modal.classList.add("hidden"); }

function renderQuestion() {
  const item = activeQuiz[state.index];
  const selected = state.answers[state.index];
  const percent = (state.index / activeQuiz.length) * 100;
  const isPublished = state.quizType === "published";
  const subtitle = isPublished
    ? "15 câu · Bản demo quy trình AI soạn nháp → GV duyệt → phát hành"
    : `${activeQuiz.length} câu · AI thật từ transcript · trace ${state.traceId}`;
  quizView.innerHTML = `
    <span class="quiz-eyebrow">${isPublished ? "QUIZ CUỐI BÀI · DAY03" : "QUIZ CỦNG CỐ CÁ NHÂN HOÁ"}</span>
    <h2>${isPublished ? "Kiểm tra kiến thức sau buổi học" : "Củng cố đúng phần bạn cần ôn"}</h2>
    <p class="quiz-subtitle">${subtitle}</p>
    <div class="progress-row"><span>Câu ${state.index + 1} / ${activeQuiz.length}</span><span>${Math.round(percent)}%</span></div>
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
        ${state.index === activeQuiz.length - 1 ? "Nộp quiz" : "Câu tiếp theo →"}
      </button>
    </div>`;
  document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    state.answers[state.index] = Number(button.dataset.choice);
    renderQuestion();
  }));
  document.querySelector("#previous-question")?.addEventListener("click", () => { state.index -= 1; renderQuestion(); });
  document.querySelector("#next-question").addEventListener("click", () => {
    if (state.index < activeQuiz.length - 1) { state.index += 1; renderQuestion(); } else { renderResults(); }
  });
}

function calculateMastery() {
  const mastery = Object.fromEntries(Object.entries(syllabus).map(([id, item]) => [id, { ...item, id, correct: 0, total: 0 }]));
  publishedQuiz.forEach((item, index) => {
    const topic = mastery[item.topic];
    topic.total += 1;
    if (state.answers[index] === item.correct) topic.correct += 1;
  });
  return Object.values(mastery).map((item) => ({ ...item, percent: Math.round((item.correct / item.total) * 100) }));
}

function renderLearningAnalysis() {
  const mastery = calculateMastery();
  const weakTopics = mastery.filter((item) => item.percent < 70);
  const topicIds = (weakTopics.length ? weakTopics : mastery).map((item) => item.id);
  const cards = mastery.map((item) => {
    const mastered = item.percent >= 70;
    return `<article class="mastery-card ${mastered ? "mastered" : "needs-review"}">
      <div><strong>${item.label}</strong><span>${item.correct}/${item.total} câu đúng</span></div>
      <b>${item.percent}%</b><div class="mastery-track"><span style="width:${item.percent}%"></span></div>
      <small>${mastered ? "Đã nắm tốt" : "Cần củng cố"}</small>
    </article>`;
  }).join("");
  quizView.innerHTML = `
    <span class="quiz-eyebrow">PHÂN TÍCH THEO ĐỀ CƯƠNG DAY03</span>
    <h2>Mức độ nắm vững của bạn</h2>
    <p class="quiz-subtitle">Tỷ lệ được tính từ quiz cuối bài đã phát hành; đây là gợi ý ôn tập, không phải điểm học phần.</p>
    <div class="mastery-list">${cards}</div>
    <div class="analysis-note"><strong>${weakTopics.length ? `${weakTopics.length} nội dung cần củng cố` : "Bạn đã nắm tốt các nội dung đã kiểm tra"}</strong><span>${weakTopics.length ? "Tạo 5 câu quiz cá nhân hoá từ transcript tương ứng." : "Bạn vẫn có thể làm một quiz củng cố ngắn để ôn sâu hơn."}</span></div>
    <div class="quiz-actions"><button class="outline-button" id="back-to-results">← Kết quả quiz</button><button class="primary-button" id="generate-reinforcement">Tạo quiz củng cố <span>→</span></button></div>`;
  document.querySelector("#back-to-results").addEventListener("click", renderResults);
  document.querySelector("#generate-reinforcement").addEventListener("click", () => openReinforcementQuiz(topicIds));
}

function renderResults() {
  const score = state.answers.reduce((total, answer, index) => total + (answer === activeQuiz[index].correct ? 1 : 0), 0);
  const isPublished = state.quizType === "published";
  const qualifiesForCredit = isPublished && score >= 12;
  const eligibleForCredit = qualifiesForCredit && !state.rewardGranted && state.credits < state.maxCredits;
  const review = activeQuiz.find((item, index) => state.answers[index] !== item.correct)?.review || "Bạn đã nắm tốt các ý chính trong quiz này.";
  if (eligibleForCredit) {
    state.credits += 1;
    state.rewardGranted = true;
    updateCredits();
  }
  const creditEarned = qualifiesForCredit && state.rewardGranted;
  const answers = activeQuiz.map((item, index) => `<li><span class="${state.answers[index] === item.correct ? "status-correct" : "status-wrong"}">${state.answers[index] === item.correct ? "✓ Đúng" : "× Cần xem lại"}</span> · ${item.source}</li>`).join("");
  const reward = isPublished
    ? `<div class="reward-banner"><span class="reward-icon">${creditEarned ? "+1" : "0"}</span><div><strong>${creditEarned ? "Bạn nhận được 1 practice credit" : state.credits >= state.maxCredits ? "Bạn đã đạt giới hạn 20 credits" : "Đạt từ 12/15 để nhận credit"}</strong><small>Credits hiện tại: ${state.credits}/${state.maxCredits} · Chỉ dùng trong chế độ ôn tập.</small></div></div>`
    : `<div class="reward-banner"><span class="reward-icon">✓</span><div><strong>Bạn đã hoàn thành quiz củng cố</strong><small>Quiz này dùng để ôn đúng trọng tâm, không thay đổi điểm học phần hay credit.</small></div></div>`;
  quizView.innerHTML = `
    <span class="quiz-eyebrow">${isPublished ? "KẾT QUẢ QUIZ CUỐI BÀI" : "KẾT QUẢ QUIZ CỦNG CỐ"}</span>
    <h2>Bạn đã hoàn thành quiz!</h2>
    <div class="result-score">${score}/${activeQuiz.length}<small>câu đúng</small></div>
    <div class="result-grid"><div class="result-card"><small>NỘI DUNG NÊN ÔN LẠI</small><strong>${review}</strong></div><div class="result-card"><small>GỢI Ý TIẾP THEO</small><strong>${isPublished ? "Xem phân tích theo đề cương để biết phần cần củng cố." : "Mở lại transcript hoặc slide liên quan để ôn sâu hơn."}</strong></div></div>
    <ul class="feedback-list">${answers}</ul>${reward}
    <div class="quiz-actions"><button class="outline-button" id="retry-quiz">Làm lại</button>${isPublished ? '<button class="primary-button" id="analyze-learning">Phân tích mức độ nắm vững</button>' : '<button class="primary-button" id="finish-quiz">Quay lại bài học</button>'}</div>`;
  document.querySelector("#retry-quiz").addEventListener("click", () => isPublished ? openQuiz() : openReinforcementQuiz(state.focusTopics));
  document.querySelector("#analyze-learning")?.addEventListener("click", renderLearningAnalysis);
  document.querySelector("#finish-quiz")?.addEventListener("click", closeQuiz);
}

function addTutorBubble(text, kind = "agent", meta = "") {
  const bubble = document.createElement("div");
  bubble.className = kind === "user" ? "user-message" : "tutor-message";
  bubble.textContent = text;
  tutorConversation.appendChild(bubble);
  if (meta) {
    const footer = document.createElement("div");
    footer.className = "agent-meta";
    footer.textContent = meta;
    tutorConversation.appendChild(footer);
  }
  tutorConversation.scrollTop = tutorConversation.scrollHeight;
  return bubble;
}

async function askLesson(question) {
  const cleanQuestion = question.trim();
  if (cleanQuestion.length < 3) return;
  addTutorBubble(cleanQuestion, "user");
  askInput.value = "";
  askInput.disabled = true;
  const loading = addTutorBubble("Đang tìm trong slide đã chọn…");
  try {
    const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson_id: lessonSelect.value, question: cleanQuestion }) });
    const payload = await response.json();
    loading.remove();
    if (!response.ok || payload.status !== "OK") throw new Error(payload.message || "Agent chưa trả lời được");
    addTutorBubble(payload.answer, "agent", `LangGraph · ${payload.tools_used.join(" → ")} · trace ${payload.trace_id}`);
  } catch (error) {
    loading.remove();
    addTutorBubble(`Mình chưa trả lời được: ${error.message}. Hãy kiểm tra server và OPENAI_API_KEY.`, "agent");
  } finally {
    askInput.disabled = false;
    askInput.focus();
  }
}

document.querySelector("#side-end-quiz").addEventListener("click", openQuiz);
document.querySelector("#close-quiz").addEventListener("click", closeQuiz);
modal.addEventListener("click", (event) => { if (event.target === modal) closeQuiz(); });
askForm.addEventListener("submit", (event) => { event.preventDefault(); askLesson(askInput.value); });
document.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => askLesson(button.dataset.question)));
lessonSelect.addEventListener("change", () => setActiveLesson(lessonSelect.value));
document.querySelectorAll(".lesson-trigger").forEach((button) => button.addEventListener("click", () => setActiveLesson(button.dataset.lesson)));
updateCredits();
