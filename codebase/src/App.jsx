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
  const [deckData, setDeckData] = useState(null);
  const [currentDeckId, setCurrentDeckId] = useState("day-1");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCounts, setPageCounts] = useState({});
  const [pageText, setPageText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [messages, setMessages] = useState([
    createMessage(
      "assistant",
      "Chào Minh Anh! Mình đã đồng bộ với tài liệu Day 1.\n\n📌 Hãy bôi đen một đoạn trên PDF và chọn “Hỏi AI Tutor”, hoặc nhập câu hỏi vào ô chat."
    )
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [serviceMode, setServiceMode] = useState("openrouter");

  useEffect(() => {
    fetch("/api/decks")
      .then((response) => {
        if (!response.ok) throw new Error("Không tải được danh sách tài liệu.");
        return response.json();
      })
      .then(setDeckData)
      .catch((error) => {
        setMessages((current) => [
          ...current,
          createMessage("assistant", error.message)
        ]);
      });
  }, []);

  const decks = deckData?.decks || [];
  const deck = useMemo(
    () => decks.find((item) => item.id === currentDeckId),
    [decks, currentDeckId]
  );
  const totalPages = deck
    ? pageCounts[deck.id] || deck.totalPages || 1
    : 1;

  const slide = deck
    ? {
        id: currentPage,
        totalPages,
        title: deck.title,
        contextLabel: deck.shortTitle
      }
    : null;

  function changeDeck(deckId) {
    const target = decks.find((item) => item.id === deckId);
    if (!target || target.id === currentDeckId) return;
    setCurrentDeckId(target.id);
    setCurrentPage(1);
    setPageText("");
    setMessages((current) => [
      ...current,
      createMessage(
        "assistant",
        `Đã mở ${target.shortTitle}: ${target.title}. Mình sẽ dùng nội dung của từng trang làm nguồn trả lời.`
      )
    ]);
  }

  function changePage(pageNumber, announce = false) {
    if (!deck) return;
    const target = Number(pageNumber);
    if (!Number.isInteger(target) || target < 1 || target > totalPages) {
      return;
    }
    setCurrentPage(target);
    setPageText("");
    if (announce) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `Đã mở ${deck.shortTitle}, trang ${target}. Bạn có thể bôi đen nội dung để hỏi ngay.`
        )
      ]);
    }
  }

  async function uploadDeck(file) {
    if (!file || isUploading) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const response = await fetch("/api/decks/upload", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Không thể tải PDF lên.");
      }

      setDeckData((current) => ({
        ...current,
        decks: [...current.decks, result.deck]
      }));
      setCurrentDeckId(result.deck.id);
      setCurrentPage(1);
      setPageText("");
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `Đã tải lên “${result.deck.title}”. Mình sẽ dùng nội dung PDF này làm nguồn trả lời.`
        )
      ]);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function sendMessage(text, options = {}) {
    if (isTyping || !deck) return;

    const normalized = text.toLowerCase().trim();
    const includeQuiz =
      Boolean(options.includeQuiz) ||
      normalized.includes("quiz") ||
      normalized.includes("câu hỏi kiểm tra");
    const userMessage = createMessage("user", text);
    const history = [...messages, userMessage];
    setMessages(history);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId: deck.id,
          pageNumber: currentPage,
          pageText,
          selectedText: options.selectedText || "",
          includeQuiz,
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
    }, 550);
  }

  if (!deck || !slide) {
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
          deck={deck}
          decks={decks}
          pageNumber={currentPage}
          totalPages={totalPages}
          onDeckChange={changeDeck}
          onPageChange={changePage}
          onDocumentLoad={(numPages) =>
            setPageCounts((current) => ({
              ...current,
              [deck.id]: numPages
            }))
          }
          onPageText={setPageText}
          onUpload={uploadDeck}
          isUploading={isUploading}
          uploadError={uploadError}
          onAskSelection={(selectedText) =>
            sendMessage(`Giải thích đoạn được chọn: “${selectedText}”`, {
              selectedText,
              includeQuiz: true
            })
          }
          onPrev={() => changePage(currentPage - 1)}
          onNext={() => changePage(currentPage + 1)}
          canPrev={currentPage > 1}
          canNext={currentPage < totalPages}
        />
      </div>

      <AiTutorChatPanel
        slide={slide}
        messages={messages}
        isTyping={isTyping}
        serviceMode={serviceMode}
        onSend={sendMessage}
        onQuizAnswer={answerQuiz}
        onOpenSlide={(page) => changePage(page, true)}
      />
    </div>
  );
}
