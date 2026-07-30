const messages = document.querySelector("#messages");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#question-input");
const quickPrompts = document.querySelectorAll("[data-prompt]");

function getCurrentTime() {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

function formatDecision(result, provider = "ai") {
  const labels = {
    answer: "Có nguồn chính thức",
    ask_clarifying_question: "Cần hỏi rõ thêm",
    escalate_to_lab_coach: "Chuyển Lab Coach/Admin"
  };

  const types = {
    answer: "answer",
    ask_clarifying_question: "clarify",
    escalate_to_lab_coach: "escalate"
  };

  return {
    type: types[result.decision] || "escalate",
    label: labels[result.decision] || "Chuyển Lab Coach/Admin",
    text: result.answer,
    source: `${result.source || "Không có nguồn"} · confidence: ${result.confidence || "low"} · provider: ${provider}`
  };
}

function createMessage(role, text, reply = null) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "HV" : "CC";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.innerHTML = `<strong>${role === "user" ? "Học viên" : "Campus Companion"}</strong><span>${getCurrentTime()}</span>`;

  bubble.appendChild(meta);

  if (reply) {
    const decision = document.createElement("div");
    decision.className = `decision ${reply.type}`;
    decision.textContent = reply.label;
    bubble.appendChild(decision);
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.appendChild(paragraph);

  if (reply?.source) {
    const source = document.createElement("div");
    source.className = "source";
    source.textContent = reply.source;
    bubble.appendChild(source);
  }

  article.append(avatar, bubble);
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
}

function submitQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) return;

  createMessage("user", trimmed);
  input.value = "";

  window.setTimeout(async () => {
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(error.error || "Server error");
      }

      const data = await response.json();
      const reply = formatDecision(data.result, data.provider);
      createMessage("bot", reply.text, reply);
    } catch (error) {
      createMessage("bot", "Server AI chưa sẵn sàng. Hãy chạy prototype bằng `npm start` và cấu hình API key hoặc bật `ALLOW_MOCK_AI=1` để kiểm flow.", {
        type: "escalate",
        label: "API chưa sẵn sàng",
        source: error.message
      });
    }
  }, 360);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuestion(input.value);
});

quickPrompts.forEach((button) => {
  button.addEventListener("click", () => {
    submitQuestion(button.dataset.prompt);
  });
});
