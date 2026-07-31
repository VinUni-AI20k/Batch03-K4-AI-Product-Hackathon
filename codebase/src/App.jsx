import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import SlideViewer from "./components/SlideViewer";
import AiTutorChatPanel from "./components/AiTutorChatPanel";

let messageCounter = 0;
function createMessage(role, content, extra = {}) {
  messageCounter += 1;
  return {
    id: `${Date.now()}-${messageCounter}`,
    role,
    content,
    ...extra
  };
}

export default function App() {
  const [slideData, setSlideData] = useState(null);
  const [currentSlideId, setCurrentSlideId] = useState(12);
  const [messages, setMessages] = useState([
    createMessage(
      "assistant",
      "Chào Minh Anh! Mình đã đồng bộ với Slide 12.\n\n📌 Bôi đen một khái niệm trên slide hoặc chọn câu hỏi gợi ý để bắt đầu."
    )
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [serviceMode, setServiceMode] = useState("openrouter");

  useEffect(() => {
    fetch("/api/slides")
      .then((response) => {
        if (!response.ok) throw new Error("Không tải được dữ liệu slide.");
        return response.json();
      })
      .then(setSlideData)
      .catch((error) => {
        setMessages((current) => [
          ...current,
          createMessage("assistant", error.message)
        ]);
      });
  }, []);

  const orderedSlides = slideData?.slides || [];
  const currentIndex = orderedSlides.findIndex(
    (slide) => slide.id === currentSlideId
  );
  const slide = useMemo(
    () => orderedSlides.find((item) => item.id === currentSlideId),
    [orderedSlides, currentSlideId]
  );

  function changeSlide(id, announce = true) {
    const target = orderedSlides.find((item) => item.id === Number(id));
    if (!target) return;
    setCurrentSlideId(target.id);
    if (announce) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `Đã mở Slide ${target.id}: ${target.title}.\n\n${target.tutorRecap || target.summary.join(" ")}`
        )
      ]);
    }
  }

  async function sendMessage(text, options = {}) {
    if (isTyping || !slide) return;

    const normalized = text.toLowerCase().trim();
    const userMessage = createMessage("user", text);
    const history = [...messages, userMessage];
    setMessages(history);

    if (normalized.includes("mở slide 5")) {
      changeSlide(5);
      return;
    }

    if (normalized.includes("so sánh slide 5") && normalized.includes("12")) {
      setIsTyping(true);
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          createMessage(
            "assistant",
            "Slide 5 giải thích nguyên lý Loose Coupling; Slide 12 áp dụng nguyên lý đó vào kiến trúc Microservices. Nói ngắn gọn: Slide 5 là nền tảng, Slide 12 là cách triển khai trong thực tế."
          )
        ]);
        setIsTyping(false);
      }, 650);
      return;
    }

    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideId: slide.id,
          selectedText: options.selectedText || "",
          includeQuiz: Boolean(options.includeQuiz),
          messages: history.map(({ role, content }) => ({ role, content }))
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "AI Tutor gặp lỗi.");

      setServiceMode(result.mode || "openrouter");
      setMessages((current) => [
        ...current,
        createMessage("assistant", result.answer, {
          quiz: result.quiz || null
        })
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `Không thể kết nối AI Tutor. ${error.message}`,
          { retryText: text }
        )
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function answerQuiz(quiz, option) {
    if (isTyping) return;
    const correct = option.id === quiz.correctOptionId;
    setMessages((current) => [
      ...current.map((message) =>
        message.quiz?.id === quiz.id ? { ...message, quiz: null } : message
      ),
      createMessage("user", option.text)
    ]);
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          correct ? quiz.correctFeedback : quiz.incorrectFeedback,
          {
            action: correct ? null : quiz.remediation
          }
        )
      ]);
      setIsTyping(false);
    }, 700);
  }

  if (!slide) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0B0F1A] text-sm text-slate-400">
        Đang tải không gian học tập…
      </div>
    );
  }

  return (
    <div className="flex h-screen min-w-[1180px] overflow-hidden bg-[#0B0F1A] text-slate-100">
      <div className="flex min-w-0 flex-1 flex-col">
        <Header slide={slide} />
        <SlideViewer
          slide={slide}
          onAskSelection={(selectedText) =>
            sendMessage(`Giải thích "${selectedText}"`, {
              selectedText,
              includeQuiz: true
            })
          }
          onPrev={() => changeSlide(orderedSlides[currentIndex - 1]?.id)}
          onNext={() => changeSlide(orderedSlides[currentIndex + 1]?.id)}
          canPrev={currentIndex > 0}
          canNext={currentIndex < orderedSlides.length - 1}
        />
      </div>

      <AiTutorChatPanel
        slide={slide}
        messages={messages}
        isTyping={isTyping}
        serviceMode={serviceMode}
        onSend={sendMessage}
        onQuizAnswer={answerQuiz}
        onOpenSlide={changeSlide}
      />
    </div>
  );
}
