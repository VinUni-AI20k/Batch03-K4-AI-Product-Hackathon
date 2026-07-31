import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

function ChatBubble({ message, onQuizAnswer, onOpenSlide }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`animate-message flex gap-2.5 ${
        isUser ? "flex-row-reverse" : "items-start"
      }`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
          isUser
            ? "bg-gradient-to-br from-orange-400 to-orange-600"
            : "bg-blue-600"
        } text-white`}
      >
        <Icon name={isUser ? "cap" : "bot"} className="h-4 w-4" />
      </span>

      <div
        className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-5 ${
          isUser
            ? "rounded-tr-md bg-blue-600 text-white"
            : "rounded-tl-md border border-white/[0.06] bg-[#171E2C] text-slate-300"
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>

        {message.quiz && (
          <div className="mt-3 border-t border-white/[0.08] pt-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-orange-300">
              ❓ Micro-Quiz
            </p>
            <p className="font-semibold leading-5 text-slate-100">
              {message.quiz.question}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {message.quiz.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onQuizAnswer(message.quiz, option)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-blue-400/50 hover:bg-blue-500/10"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {message.action && (
          <button
            onClick={() => onOpenSlide(message.action.targetSlideId)}
            className="mt-3 w-full rounded-xl border border-amber-400/20 bg-amber-500/[0.08] p-3 text-left transition hover:border-amber-400/40 hover:bg-amber-500/[0.12]"
          >
            <p className="text-[11px] text-amber-300">{message.action.reason}</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">
                  📌 {message.action.cardTitle}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {message.action.cardSubtitle}
                </p>
              </div>
              <Icon name="arrowRight" className="h-4 w-4 text-amber-300" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="animate-message flex items-start gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
        <Icon name="bot" className="h-4 w-4" />
      </span>
      <div className="flex gap-1 rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#171E2C] px-4 py-4">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: `${item * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AiTutorChatPanel({
  slide,
  messages,
  isTyping,
  serviceMode,
  onSend,
  onQuizAnswer,
  onOpenSlide,
  onCollapse
}) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const hasDocument = Boolean(slide);
  const quickReplies = [
    "Tóm tắt trang này",
    "Giải thích ý chính",
    "Tạo một micro-quiz"
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function submit(event) {
    event.preventDefault();
    const value = input.trim();
    if (!value || isTyping || !hasDocument) return;
    setInput("");
    onSend(value);
  }

  return (
    <aside className="relative flex h-screen min-h-0 w-[420px] shrink-0 flex-col border-l border-white/[0.075] bg-[#0F1420]">
      <button
        type="button"
        onClick={onCollapse}
        title="Thu gọn AI Tutor"
        aria-label="Thu gọn AI Tutor"
        className="absolute -left-10 top-1/2 z-50 grid h-16 w-10 -translate-y-1/2 place-items-center rounded-l-2xl border border-r-0 border-white/10 bg-[#171E2C] text-slate-500 shadow-xl shadow-black/25 transition hover:border-blue-400/25 hover:bg-blue-500/10 hover:text-blue-200"
      >
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>

      <div className="border-b border-white/[0.07] px-5 py-[17px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-950/40">
              <Icon name="bot" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-white">AI Tutor</h2>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Powered by{" "}
                {serviceMode === "mock"
                  ? "demo fallback"
                  : serviceMode === "ollama"
                  ? "Ollama (local)"
                  : "Gemini"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {hasDocument
            ? `Context Synced: ${slide.contextLabel} · Trang ${slide.id}`
            : "Đang chờ tài liệu"}
        </div>
      </div>

      <div className="chat-scroll flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            onQuizAnswer={onQuizAnswer}
            onOpenSlide={onOpenSlide}
          />
        ))}
        {isTyping && <TypingBubble />}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/[0.07] bg-[#0D121D] px-4 pb-3 pt-3">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              disabled={isTyping || !hasDocument}
              onClick={() => onSend(reply)}
              className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-slate-300 transition hover:border-blue-400/35 hover:bg-blue-500/10 hover:text-white disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-[#141A26] p-2 focus-within:border-blue-500/45"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={!hasDocument}
            placeholder={
              hasDocument
                ? "Hỏi về nội dung tài liệu..."
                : "Thêm tài liệu để bắt đầu..."
            }
            className="min-w-0 flex-1 bg-transparent px-2 text-[13px] text-white outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || !hasDocument}
            className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
          >
            <Icon name="send" className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 flex justify-end">
          <span className="rounded-md border border-white/10 bg-black px-2 py-1 text-[9px] font-semibold text-slate-400">
            ⚡ Made in Bolt
          </span>
        </div>
      </div>
    </aside>
  );
}
