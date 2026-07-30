"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { askTutor } from "../services/mockApi";
import type { ChatMessageData, Lecture } from "../types";
import ChatMessage from "./ChatMessage";

export default function TutorPanel({ lecture, page, messages, setMessages, onNavigate }: {
  lecture?: Lecture;
  page: number;
  messages: ChatMessageData[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>;
  onNavigate: (page: number) => void;
}) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

  const sendQuestion = async (question: string) => {
    const text = question.trim();
    if (!text || isThinking) return;
    setInput("");
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text }]);
    setIsThinking(true);
    const answer = await askTutor(text, page);
    setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", text: "", answer }]);
    setIsThinking(false);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void sendQuestion(input); };

  return (
    <aside className="tutor-panel">
      <header className="tutor-header">
        <div><span className="assistant-mark">AI</span><div><strong>AI Tutor</strong><span><i /> Đang sẵn sàng</span></div></div>
        <button className="icon-button" aria-label="Menu AI Tutor">•••</button>
      </header>
      <div className="context-bar"><span>Đang dùng ngữ cảnh</span><button onClick={() => onNavigate(page)}><b>▤</b> Trang {page}<i>↗</i></button></div>
      <div className="messages" aria-live="polite">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onNavigate={onNavigate} onSuggestion={(suggestion) => void sendQuestion(suggestion)} onFeedback={(id, value, note) => setMessages((current) => current.map((item) => item.id === id ? { ...item, feedback: value, feedbackNote: note } : item))} />
        ))}
        {isThinking && <div className="thinking"><span className="assistant-mark">AI</span><div><i /><i /><i /></div><small>Đang tìm trong trang {page}…</small></div>}
        <div ref={endRef} />
      </div>
      <form className="chat-composer" onSubmit={submit}>
        {!lecture || lecture.status !== "ready" ? <div className="composer-disabled">Chọn một tài liệu đã xử lý để đặt câu hỏi.</div> : (
          <>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendQuestion(input); } }} placeholder={`Hỏi về nội dung Trang ${page}…`} rows={2} />
            <div className="composer-actions"><button type="button" className="attach-button" aria-label="Đính kèm">＋</button><span>Enter để gửi</span><button className="send-button" type="submit" disabled={!input.trim() || isThinking} aria-label="Gửi câu hỏi">↑</button></div>
          </>
        )}
        <small>AI có thể mắc lỗi. Hãy kiểm tra citation trước khi sử dụng.</small>
      </form>
    </aside>
  );
}
