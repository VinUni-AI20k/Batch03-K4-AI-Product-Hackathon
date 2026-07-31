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
  { source: "Day03 · Tính toán chi phí", question: "Bạn đang dùng OpenAI API. Input prompt dài 1000 tokens (giá $0.01/1k), output sinh ra 500 tokens (giá $0.03/1k). Tổng chi phí cho request này là bao nhiêu?", options: ["$0.025", "$0.040", "$0.015", "$0.035"], correct: 0, review: "Tính toán: (1000/1000)*0.01 + (500/1000)*0.03 = $0.025." },
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

const MAX_CHEAT_WARNINGS = 3;
const CHEAT_EVENT_DEBOUNCE_MS = 1000;

let activeQuiz = publishedQuiz;
const state = { 
  index: 0, 
  answers: [], 
  credits: 7, 
  maxCredits: 20, 
  quizType: "published", 
  focusTopics: [], 
  rewardGranted: false,
  previousMastery: null, // Track delta
  fullscreenActive: false,
  cheatCount: 0,
  lastCheatAt: 0,
  terminatedForIntegrity: false,
  outTimer: null,
};

const modal = document.querySelector("#quiz-modal");
const quizView = document.querySelector("#quiz-view");
const quizAgentView = document.querySelector("#quiz-agent-view");
const creditValue = document.querySelector("#credit-value");
const creditProgress = document.querySelector("#credit-progress");
const askForm = document.querySelector("#ask-form");
const askInput = document.querySelector("#ask-input");
const lessonSelect = document.querySelector("#lesson-select");
const tutorConversation = document.querySelector("#tutor-conversation");
const slideFrame = document.querySelector("#slide-frame");

const quizAgentForm = document.querySelector("#quiz-agent-form");
const quizAgentInput = document.querySelector("#quiz-agent-input");
const quizAgentChat = document.querySelector("#quiz-agent-chat");
const quizQuotaVal = document.querySelector("#quiz-quota-val");

const cheatWarningModal = document.querySelector("#cheat-warning-modal");
const continueQuizBtn = document.querySelector("#continue-quiz-btn");
const cheatCountdownSpan = document.querySelector("#cheat-countdown");
const cheatWarningCount = document.querySelector("#cheat-warning-count");
let cheatIntervalTimer = null;

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
  quizQuotaVal.textContent = state.credits;
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.background = type === "danger" ? "#ef4444" : "#4f46e5";
  toast.style.color = "white";
  toast.style.padding = "16px 28px";
  toast.style.borderRadius = "16px";
  toast.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
  toast.style.zIndex = "99999";
  toast.style.fontFamily = "'Outfit', sans-serif";
  toast.style.fontSize = "16px";
  toast.style.fontWeight = "600";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(30px) scale(0.9)";
  
  const icon = document.createElement("i");
  icon.className = type === "danger" ? "ph-fill ph-warning-octagon" : "ph-fill ph-info";
  icon.style.fontSize = "22px";
  toast.appendChild(icon);
  
  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);
  
  document.body.appendChild(toast);
  
  // Slide up and fade in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";
  }, 50);
  
  // Slide down and fade out
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(30px) scale(0.9)";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 6000);
}

function openQuiz() {
  if (state.outTimer) {
    clearTimeout(state.outTimer);
    state.outTimer = null;
    modal.classList.remove("hidden");
    document.getElementById("quiz-start-screen").classList.remove("hidden");
    document.getElementById("quiz-layout-main").classList.add("hidden");
    document.getElementById("start-fullscreen-btn").innerHTML = '<i class="ph ph-arrows-out"></i> Trở lại Fullscreen và tiếp tục';
    showToast("Đã khôi phục bài thi. Vui lòng vào lại chế độ Toàn màn hình.", "info");
    return;
  }

  activeQuiz = publishedQuiz;
  state.quizType = "published";
  state.focusTopics = [];
  state.index = 0;
  state.answers = [];
  state.rewardGranted = false;
  state.cheatCount = 0;
  state.lastCheatAt = 0;
  state.terminatedForIntegrity = false;
  state.fullscreenActive = false;
  
  modal.classList.remove("hidden");
  document.getElementById("quiz-start-screen").classList.remove("hidden");
  document.getElementById("quiz-layout-main").classList.add("hidden");
  quizAgentView.classList.remove("hidden");
  quizAgentChat.innerHTML = `<div class="tutor-message">Câu này khó? Mình có thể gợi mở giúp bạn nhớ lại bài. Tốn 1 Quota/lượt hỏi.</div>`;
  
  renderQuestion();
}

async function openReinforcementQuiz(topicIds) {
  if (state.outTimer) {
    clearTimeout(state.outTimer);
    state.outTimer = null;
    modal.classList.remove("hidden");
    document.getElementById("quiz-start-screen").classList.remove("hidden");
    document.getElementById("quiz-layout-main").classList.add("hidden");
    document.getElementById("start-fullscreen-btn").innerHTML = '<i class="ph ph-arrows-out"></i> Trở lại Fullscreen và tiếp tục';
    showToast("Đã khôi phục bài thi. Vui lòng vào lại chế độ Toàn màn hình.", "info");
    return;
  }

  state.quizType = "reinforcement";
  state.focusTopics = topicIds;
  state.index = 0;
  state.answers = [];
  modal.classList.remove("hidden");
  quizAgentView.classList.add("hidden");
  
  const topicLabels = topicIds.map((id) => syllabus[id].label);
  const focusSourceIds = [...new Set(topicIds.flatMap((id) => syllabus[id].sourceIds))];
  quizView.innerHTML = `<span class="quiz-eyebrow"><i class="ph-fill ph-magic-wand"></i> LANGGRAPH · QUIZ CỦNG CỐ</span><h2>Đang tạo quiz theo phần cần củng cố…</h2><p class="quiz-subtitle">Agent truy xuất transcript cho: ${topicLabels.join(" · ")}, sau đó kiểm tra nguồn trước khi hiển thị.</p>`;
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
    quizAgentView.classList.remove("hidden");
    quizAgentChat.innerHTML = `<div class="tutor-message">Chào bạn, mình tiếp tục hỗ trợ bạn ôn tập vòng củng cố. Tốn 1 Quota/lượt hỏi.</div>`;
    renderQuestion();
  } catch (error) {
    quizView.innerHTML = `<span class="quiz-eyebrow text-danger"><i class="ph-fill ph-warning-circle"></i> CHƯA TẠO ĐƯỢC QUIZ</span><h2>Hệ thống cần thêm căn cứ</h2><p class="quiz-subtitle">${error.message}</p><p class="quiz-subtitle">Bạn có thể xem lại phần đề cương hoặc thử tạo lại. Hệ thống không thay bằng câu hỏi giả.</p><div class="quiz-actions"><button class="outline-button" id="back-to-analysis"><i class="ph ph-arrow-left"></i> Xem phân tích</button><button class="primary-button" id="retry-reinforcement"><i class="ph ph-arrows-clockwise"></i> Thử lại</button></div>`;
    document.querySelector("#back-to-analysis").addEventListener("click", renderLearningAnalysis);
    document.querySelector("#retry-reinforcement").addEventListener("click", () => openReinforcementQuiz(topicIds));
  }
}

function closeQuiz() {
  state.fullscreenActive = false;
  modal.classList.add("hidden");
}

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
    <span class="question-source"><i class="ph-fill ph-bookmark-simple"></i> ${item.source}</span>
    <h3 class="question-text">${item.question}</h3>
    <div class="answers">${item.options.map((option, i) => `
      <button class="answer ${selected === i ? "selected" : ""}" data-choice="${i}">
        <span class="answer-letter">${String.fromCharCode(65 + i)}</span>${option}
      </button>`).join("")}</div>
    <div class="quiz-actions">
      ${state.index > 0 ? '<button class="outline-button" id="previous-question"><i class="ph ph-arrow-left"></i> Quay lại</button>' : ""}
      <button class="primary-button ${selected === undefined ? "disabled" : ""}" id="next-question" ${selected === undefined ? "disabled" : ""}>
        ${state.index === activeQuiz.length - 1 ? 'Nộp quiz <i class="ph ph-check"></i>' : 'Câu tiếp theo <i class="ph ph-arrow-right"></i>'}
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
    if (topic) {
        topic.total += 1;
        if (state.answers[index] === item.correct) topic.correct += 1;
    }
  });
  return Object.values(mastery).map((item) => ({ ...item, percent: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0 }));
}

function renderLearningAnalysis() {
  quizAgentView.classList.add("hidden"); // Ẩn agent trong màn hình analysis
  const currentMastery = calculateMastery();
  
  const weakTopics = currentMastery.filter((item) => item.percent < 70);
  const topicIds = (weakTopics.length ? weakTopics : currentMastery).map((item) => item.id);
  
  const cards = currentMastery.map((item) => {
    const mastered = item.percent >= 70;
    
    let deltaHtml = "";
    if (state.previousMastery) {
        const prevTopic = state.previousMastery.find(p => p.id === item.id);
        if (prevTopic) {
            const delta = item.percent - prevTopic.percent;
            if (delta > 0) {
                deltaHtml = `<span class="delta-badge"><i class="ph ph-trend-up"></i> +${delta}%</span>`;
            } else if (delta < 0) {
                deltaHtml = `<span class="delta-badge" style="color:var(--danger);background:#fee2e2;"><i class="ph ph-trend-down"></i> ${delta}%</span>`;
            }
        }
    }

    return `<article class="mastery-card ${mastered ? "mastered" : "needs-review"}">
      <div><strong>${item.label}</strong><span>${item.correct}/${item.total} câu đúng</span></div>
      <b>${item.percent}% ${deltaHtml}</b>
      <div class="mastery-track"><span style="width:${item.percent}%"></span></div>
      <small>${mastered ? "Đã nắm tốt" : "Cần củng cố"}</small>
    </article>`;
  }).join("");
  
  quizView.innerHTML = `
    <span class="quiz-eyebrow">PHÂN TÍCH THEO ĐỀ CƯƠNG DAY03</span>
    <h2>Mức độ nắm vững của bạn</h2>
    <p class="quiz-subtitle">Tỷ lệ được tính từ quiz cuối bài đã phát hành; đây là gợi ý ôn tập, không phải điểm học phần.</p>
    <div class="mastery-list">${cards}</div>
    <div class="analysis-note"><strong>${weakTopics.length ? `${weakTopics.length} nội dung cần củng cố` : "Bạn đã nắm tốt các nội dung đã kiểm tra"}</strong><span>${weakTopics.length ? "Tạo 5 câu quiz cá nhân hoá từ transcript tương ứng." : "Bạn vẫn có thể làm một quiz củng cố ngắn để ôn sâu hơn."}</span></div>
    <div class="quiz-actions"><button class="outline-button" id="back-to-results"><i class="ph ph-arrow-left"></i> Kết quả quiz</button><button class="primary-button" id="generate-reinforcement">Tạo quiz củng cố <i class="ph ph-arrow-right"></i></button></div>`;
  document.querySelector("#back-to-results").addEventListener("click", renderResults);
  document.querySelector("#generate-reinforcement").addEventListener("click", () => openReinforcementQuiz(topicIds));
  
  // Lưu lại mastery hiện tại cho lần sau
  state.previousMastery = currentMastery;
}

function renderResults(options = {}) {
  const terminatedForIntegrity = options.terminatedForIntegrity === true;
  const timeout = options.timeout === true;
  state.fullscreenActive = false;
  quizAgentView.classList.add("hidden"); // Ẩn agent lúc hiện kết quả
  const score = state.answers.reduce((total, answer, index) => total + (answer === activeQuiz[index].correct ? 1 : 0), 0);
  const isPublished = state.quizType === "published";
  
  // TÍNH TOÁN DELTA ĐỂ THƯỞNG CREDIT
  let creditsToAward = 0;
  let rewardReason = "";
  
  if (isPublished && !terminatedForIntegrity) {
      const currentMastery = calculateMastery();
      if (!state.previousMastery) {
          // Lần đầu làm quiz: Thưởng nếu đạt ngưỡng cứng (như cũ)
          if (score >= 12) {
              creditsToAward = 1;
              rewardReason = "Đạt từ 12/15 câu";
          } else {
              rewardReason = "Cố gắng đạt từ 12/15 để nhận credit";
          }
      } else {
          // Từ lần 2 trở đi: Thưởng dựa trên Delta (Độ cải thiện)
          let totalDelta = 0;
          currentMastery.forEach(curr => {
              const prev = state.previousMastery.find(p => p.id === curr.id);
              if (prev && curr.percent > prev.percent) {
                  totalDelta += (curr.percent - prev.percent);
              }
          });
          
          if (totalDelta >= 10) { // Cứ cải thiện tổng 10% là được 1 credit
              creditsToAward = Math.floor(totalDelta / 10);
              if (creditsToAward > 3) creditsToAward = 3; // Cap per quiz
              rewardReason = `Cải thiện năng lực (Delta +${totalDelta}%)`;
          } else {
              rewardReason = "Chưa có sự cải thiện năng lực (Delta) rõ rệt";
          }
      }
  }

  const eligibleForCredit = creditsToAward > 0 && state.credits < state.maxCredits;
  
  if (eligibleForCredit) {
    state.credits = Math.min(state.credits + creditsToAward, state.maxCredits);
    updateCredits();
  }
  
  const review = activeQuiz.find((item, index) => state.answers[index] !== item.correct)?.review || "Bạn đã nắm tốt các ý chính trong quiz này.";
  const answers = activeQuiz.map((item, index) => `<li><span class="${state.answers[index] === item.correct ? "status-correct" : "status-wrong"}"><i class="ph-fill ${state.answers[index] === item.correct ? "ph-check-circle" : "ph-x-circle"}"></i> ${state.answers[index] === item.correct ? "Đúng" : "Xem lại"}</span> · ${item.source}</li>`).join("");
  
  const reward = isPublished
    ? `<div class="reward-banner"><span class="reward-icon">${eligibleForCredit ? `<i class="ph-fill ph-plus"></i>${creditsToAward}` : "0"}</span><div><strong>${terminatedForIntegrity ? "Không cộng credit do bài bị kết thúc vì vi phạm quy chế" : eligibleForCredit ? `Bạn nhận được ${creditsToAward} practice credit(s)` : state.credits >= state.maxCredits ? "Bạn đã đạt giới hạn 20 credits" : rewardReason}</strong><small>Credits hiện tại: ${state.credits}/${state.maxCredits} · Chỉ dùng để hỏi Agent.</small></div></div>`
    : `<div class="reward-banner"><span class="reward-icon"><i class="ph-fill ph-check"></i></span><div><strong>Bạn đã hoàn thành quiz củng cố</strong><small>Quiz này dùng để ôn đúng trọng tâm, không thay đổi điểm học phần hay credit.</small></div></div>`;
    
  const headingText = timeout 
    ? "BÀI KIỂM TRA BỊ HỦY DO THOÁT QUÁ 10 GIÂY" 
    : terminatedForIntegrity 
      ? "Bạn đã vượt quá 3 lần cảnh báo" 
      : "Bạn đã hoàn thành quiz!";
      
  const subtitleText = timeout
    ? "Hệ thống đã tự động khóa và nộp bài do phát hiện bạn rời khỏi khu vực làm bài quá 10 giây quy định."
    : terminatedForIntegrity
      ? "Hệ thống đã tự động nộp bài và chấm các câu bạn đã trả lời."
      : "";

  quizView.innerHTML = `
    <span class="quiz-eyebrow">${terminatedForIntegrity ? "BÀI LÀM ĐÃ KẾT THÚC" : isPublished ? "KẾT QUẢ QUIZ CUỐI BÀI" : "KẾT QUẢ QUIZ CỦNG CỐ"}</span>
    <h2>${headingText}</h2>
    ${terminatedForIntegrity ? `<p class="quiz-subtitle text-danger">${subtitleText}</p>` : ""}
    <div class="result-score">${score}/${activeQuiz.length}<small>câu đúng</small></div>
    <div class="result-grid"><div class="result-card"><small>NỘI DUNG NÊN ÔN LẠI</small><strong>${review}</strong></div><div class="result-card"><small>GỢI Ý TIẾP THEO</small><strong>${isPublished ? "Xem phân tích theo đề cương để biết phần cần củng cố." : "Mở lại transcript hoặc slide liên quan để ôn sâu hơn."}</strong></div></div>
    <ul class="feedback-list">${answers}</ul>${reward}
    <div class="quiz-actions"><button class="outline-button" id="retry-quiz"><i class="ph ph-arrows-clockwise"></i> Làm lại</button>${isPublished ? '<button class="primary-button" id="analyze-learning"><i class="ph ph-chart-line-up"></i> Phân tích mức độ nắm vững</button>' : '<button class="primary-button" id="finish-quiz"><i class="ph ph-check"></i> Xong</button>'}</div>`;
  document.querySelector("#retry-quiz").addEventListener("click", () => isPublished ? openQuiz() : openReinforcementQuiz(state.focusTopics));
  document.querySelector("#analyze-learning")?.addEventListener("click", renderLearningAnalysis);
  document.querySelector("#finish-quiz")?.addEventListener("click", closeQuiz);
}

// In-Quiz Socratic Agent Chat Logic
function addQuizAgentBubble(text, kind = "agent") {
  const bubble = document.createElement("div");
  bubble.className = `tutor-message ${kind === "user" ? "user-msg" : ""}`;
  if (kind === "agent") {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }
  quizAgentChat.appendChild(bubble);
  quizAgentChat.scrollTop = quizAgentChat.scrollHeight;
  return bubble;
}

async function askQuizAgent(question) {
    const cleanQuestion = question.trim();
    if (cleanQuestion.length < 3) return;
    
    if (state.credits <= 0) {
        addQuizAgentBubble("Bạn đã hết Quota hỏi đáp. Hãy nộp bài và cải thiện điểm để nhận thêm Quota nhé!", "agent");
        return;
    }
    
    addQuizAgentBubble(cleanQuestion, "user");
    quizAgentInput.value = "";
    quizAgentInput.disabled = true;
    
    // Deduct credit
    state.credits -= 1;
    updateCredits();
    
    const loading = addQuizAgentBubble("Đang phân tích câu hỏi...", "agent");
    
    // Prepare context
    const currentItem = activeQuiz[state.index];
    const question_context = {
        question: currentItem.question,
        options: currentItem.options,
        correct: currentItem.correct
    };

    try {
        const response = await fetch("/api/ask-quiz", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ question_context, question: cleanQuestion }) 
        });
        const payload = await response.json();
        loading.remove();
        
        if (!response.ok || payload.status !== "OK") throw new Error(payload.message || "Agent chưa trả lời được");
        
        const replyBubble = addQuizAgentBubble(payload.answer, "agent");
        
        // Add meta info if the validator rejected it
        if (payload.is_safe === false) {
             const footer = document.createElement("div");
             footer.className = "agent-meta";
             footer.style.color = "var(--danger)";
             footer.textContent = "Validator: Phát hiện nguy cơ lộ đáp án, đã chặn nội dung.";
             quizAgentChat.appendChild(footer);
             quizAgentChat.scrollTop = quizAgentChat.scrollHeight;
        }

    } catch (error) {
        loading.remove();
        addQuizAgentBubble(`Lỗi kết nối: ${error.message}. Hãy kiểm tra server và OPENAI_API_KEY.`, "agent");
    } finally {
        quizAgentInput.disabled = false;
        quizAgentInput.focus();
    }
}

// Global Tutor Chat Logic
function addTutorBubble(text, sender = "agent", meta = "") {
  const bubble = document.createElement("div");
  bubble.className = `tutor-message ${sender === "user" ? "user-msg" : ""}`;
  if (sender === "agent") {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }
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
document.querySelector("#close-quiz").addEventListener("click", () => {
  if (state.fullscreenActive && !document.getElementById("quiz-start-screen").classList.contains("hidden")) {
    handleCheat("Chủ động đóng cửa sổ làm bài");
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
    closeQuiz();
  }
});
modal.addEventListener("click", (event) => { 
  if (event.target === modal) {
    if (state.fullscreenActive && !document.getElementById("quiz-start-screen").classList.contains("hidden")) {
      handleCheat("Chủ động thoát khỏi vùng làm bài");
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      closeQuiz();
    }
  }
});

// Anti-Cheat: Start Fullscreen
document.getElementById("start-fullscreen-btn").addEventListener("click", () => {
  const startButton = document.getElementById("start-fullscreen-btn");
  const fullscreenError = document.getElementById("fullscreen-error");
  if (typeof document.documentElement.requestFullscreen !== "function") {
    fullscreenError.classList.remove("hidden");
    return;
  }
  document.documentElement.requestFullscreen().then(() => {
    // Clear out timer if it exists when successfully entering fullscreen
    if (state.outTimer) {
      clearTimeout(state.outTimer);
      state.outTimer = null;
      showToast("Đã khôi phục trạng thái làm bài.", "info");
    }
    
    state.fullscreenActive = true;
    document.getElementById("quiz-start-screen").classList.add("hidden");
    document.getElementById("quiz-layout-main").classList.remove("hidden");
    document.getElementById("cheat-log").classList.add("hidden");
    document.getElementById("cheat-log").innerHTML = "";
    fullscreenError.classList.add("hidden");
    startButton.innerHTML = '<i class="ph ph-arrows-out"></i> Bắt đầu làm bài';
    renderQuestion();
  }).catch(() => {
    state.fullscreenActive = false;
    fullscreenError.classList.remove("hidden");
    startButton.innerHTML = '<i class="ph ph-arrows-out"></i> Cho phép mở Fullscreen và thử lại';
    alert("Trình duyệt chưa cấp quyền Fullscreen. Nhấn OK, sau đó bấm lại nút Cho phép mở Fullscreen.");
  });
});

// Anti-Cheat: Fullscreen Exit and Visibility Change
function handleCheat(reason) {
  if (modal.classList.contains("hidden") && !state.outTimer) return;
  if (state.terminatedForIntegrity) return;

  const now = Date.now();
  if (now - state.lastCheatAt < CHEAT_EVENT_DEBOUNCE_MS) return;
  state.lastCheatAt = now;
  state.cheatCount = (state.cheatCount || 0) + 1;

  // Log warning to cheat-log inside start screen
  const cheatLog = document.getElementById("cheat-log");
  cheatLog.classList.remove("hidden");
  const remaining = MAX_CHEAT_WARNINGS - state.cheatCount;
  cheatLog.innerHTML += `<div><i class="ph-fill ph-warning"></i> Cảnh báo ${state.cheatCount}/${MAX_CHEAT_WARNINGS}: ${reason} - Lúc ${new Date().toLocaleTimeString()}. ${remaining > 0 ? `Còn ${remaining} lần cảnh báo.` : "Vi phạm thêm một lần sẽ kết thúc bài."}</div>`;

  // Exceeded max warnings
  if (state.cheatCount > MAX_CHEAT_WARNINGS) {
    state.terminatedForIntegrity = true;
    if (state.outTimer) {
      clearTimeout(state.outTimer);
      state.outTimer = null;
    }
    state.fullscreenActive = false;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => console.log(error));
    }
    document.getElementById("quiz-start-screen").classList.add("hidden");
    document.getElementById("quiz-layout-main").classList.remove("hidden");
    renderResults({ terminatedForIntegrity: true });
    modal.classList.remove("hidden");
    showToast("Bài kiểm tra đã bị hủy do vi phạm quy chế quá số lần cho phép!", "danger");
    return;
  }

  // Let them out: suspend fullscreenActive check, exit fullscreen, and close modal
  state.fullscreenActive = false;
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((error) => console.log(error));
  }
  modal.classList.add("hidden");

  // Show Modal Warning
  cheatWarningModal.classList.remove("hidden");
  cheatWarningCount.textContent = `Bạn đã vi phạm ${state.cheatCount}/${MAX_CHEAT_WARNINGS} lần`;

  let timeLeft = 10;
  cheatCountdownSpan.textContent = timeLeft;

  // Start 10-second timer to invalidate quiz
  if (state.outTimer) clearTimeout(state.outTimer);
  if (cheatIntervalTimer) clearInterval(cheatIntervalTimer);
  
  cheatIntervalTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      cheatCountdownSpan.textContent = timeLeft;
    } else {
      clearInterval(cheatIntervalTimer);
    }
  }, 1000);

  state.outTimer = setTimeout(() => {
    state.terminatedForIntegrity = true;
    state.outTimer = null;
    clearInterval(cheatIntervalTimer);
    
    cheatWarningModal.classList.add("hidden");
    
    // Invalidate and show results
    document.getElementById("quiz-start-screen").classList.add("hidden");
    document.getElementById("quiz-layout-main").classList.remove("hidden");
    renderResults({ terminatedForIntegrity: true, timeout: true });
    modal.classList.remove("hidden");
    showToast("Bài kiểm tra đã bị hủy do thoát quá 10 giây!", "danger");
  }, 10000);

  document.getElementById("start-fullscreen-btn").innerHTML = '<i class="ph ph-arrows-out"></i> Trở lại Fullscreen và tiếp tục';
}

document.addEventListener("fullscreenchange", () => {
  if (state.fullscreenActive && !document.fullscreenElement && !modal.classList.contains("hidden")) {
    handleCheat("Thoát chế độ Toàn màn hình");
  }
});

document.addEventListener("visibilitychange", () => {
  if (state.fullscreenActive && document.visibilityState === "hidden" && !modal.classList.contains("hidden")) {
    handleCheat("Chuyển Tab / Ẩn trình duyệt");
  }
});

document.documentElement.addEventListener("mouseleave", () => {
  if (state.fullscreenActive && document.fullscreenElement && !modal.classList.contains("hidden")) {
    handleCheat("Di chuột ra khỏi vùng làm bài");
  }
});

// Anti-Cheat: Continue Quiz from Warning
continueQuizBtn?.addEventListener("click", () => {
  if (state.outTimer) clearTimeout(state.outTimer);
  state.outTimer = null;
  if (cheatIntervalTimer) clearInterval(cheatIntervalTimer);
  
  cheatWarningModal.classList.add("hidden");
  
  if (typeof document.documentElement.requestFullscreen === "function") {
    document.documentElement.requestFullscreen().then(() => {
      state.fullscreenActive = true;
      modal.classList.remove("hidden");
      document.getElementById("quiz-start-screen").classList.add("hidden");
      document.getElementById("quiz-layout-main").classList.remove("hidden");
    }).catch(() => {
      modal.classList.remove("hidden");
      document.getElementById("quiz-start-screen").classList.remove("hidden");
      document.getElementById("quiz-layout-main").classList.add("hidden");
    });
  } else {
    modal.classList.remove("hidden");
    document.getElementById("quiz-start-screen").classList.remove("hidden");
    document.getElementById("quiz-layout-main").classList.add("hidden");
  }
});

// Global Tutor Events
askForm.addEventListener("submit", (event) => { event.preventDefault(); askLesson(askInput.value); });
document.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => askLesson(button.dataset.question)));
lessonSelect.addEventListener("change", () => setActiveLesson(lessonSelect.value));
document.querySelectorAll(".lesson-trigger").forEach((button) => button.addEventListener("click", () => setActiveLesson(button.dataset.lesson)));

// In-Quiz Agent Events
quizAgentForm.addEventListener("submit", (event) => { event.preventDefault(); askQuizAgent(quizAgentInput.value); });

updateCredits();
