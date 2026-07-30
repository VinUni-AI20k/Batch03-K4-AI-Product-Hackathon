"use client";

import { FormEvent, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { getSlideContent } from "@/data/mock-course";
import { decideTutorIntent, TutorDecision } from "@/lib/navigation-intent";

type Message =
  | { id: number; role: "student"; text: string }
  | {
      id: number;
      role: "tutor";
      text: string;
      decision?: TutorDecision;
      destination?: number;
      error?: boolean;
    };

const starterMessages: Message[] = [
  {
    id: 1,
    role: "tutor",
    text: "Xin chào! Mình là Đi Đúng Trang. Mình phân biệt yêu cầu điều hướng với câu hỏi kiến thức trước khi trả lời.",
  },
];

export function SmartTutor({
  open,
  currentPage,
  totalPages,
  onClose,
  onNavigate,
}: {
  open: boolean;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
  onNavigate: (page: number) => void;
}) {
  const [input, setInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const currentSlide = useMemo(() => getSlideContent(currentPage), [currentPage]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    const decision = decideTutorIntent(question);
    const nextMessages: Message[] = [{ id: Date.now(), role: "student", text: question }];

    if (decision.intent === "navigate_page") {
      if (decision.page < 1 || decision.page > totalPages) {
        nextMessages.push({
          id: Date.now() + 1,
          role: "tutor",
          text: `Tài liệu này chỉ có ${totalPages} trang. Bạn muốn mở một trang từ 1 đến ${totalPages} chứ?`,
          decision,
          error: true,
        });
      } else {
        const destination = getSlideContent(decision.page);
        nextMessages.push({
          id: Date.now() + 1,
          role: "tutor",
          text: `Đã hiểu đây là yêu cầu điều hướng. Trang ${decision.page} là “${destination.title}”.`,
          decision,
          destination: decision.page,
        });
        onNavigate(decision.page);
      }
    } else if (decision.intent === "clarify") {
      nextMessages.push({
        id: Date.now() + 1,
        role: "tutor",
        text: "Bạn muốn mở một trang cụ thể hay muốn hỏi về nội dung mang con số đó? Ví dụ: “Mở trang 8” hoặc “8 phần cốt lõi là gì?”.",
        decision,
      });
    } else {
      const referencedPage = decision.page ?? currentPage;
      const slide = getSlideContent(referencedPage);
      nextMessages.push({
        id: Date.now() + 1,
        role: "tutor",
        text: `Trang ${referencedPage} nói về “${slide.title}”. ${slide.body}`,
        decision,
      });
    }
    setMessages((previous) => [...previous, ...nextMessages]);
    setInput("");
  }

  return (
    <aside className={`tutor-shell ${open ? "tutor-open" : ""}`}>
      <header className="relative flex h-[68px] shrink-0 items-center gap-3 border-b border-slate-200 px-4">
        <div className="grid size-9 place-items-center rounded-xl border border-[#c9dceb] bg-[#eef6fb] text-[#12568f]">
          <Icon name="bot" className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-black text-[#123f6f]">Đi Đúng Trang</h2>
          <p className="flex items-center gap-1 text-[10px] text-[#16a36b]"><i className="size-1.5 rounded-full bg-[#16a36b]" />AI Tutor theo ngữ cảnh</p>
        </div>
        <div className="ml-auto flex gap-1">
          <button className="reader-icon-button" onClick={() => setHistoryOpen(!historyOpen)} title="Lịch sử trò chuyện">
            <Icon name="history" className="size-4" />
          </button>
          <button className="reader-icon-button" onClick={() => setMessages(starterMessages)} title="Cuộc trò chuyện mới">
            <Icon name="plus" className="size-4" />
          </button>
          <button className="reader-icon-button xl:hidden" onClick={onClose} title="Đóng Tutor">
            <Icon name="x" className="size-4" />
          </button>
        </div>
        {historyOpen && (
          <div className="absolute right-3 top-[58px] z-20 w-[286px] rounded-xl border border-slate-200 bg-white shadow-lg">
            <p className="border-b border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Lịch sử trò chuyện</p>
            <p className="px-3 py-4 text-xs text-slate-500">Phiên demo hiện tại · {Math.max(0, Math.floor((messages.length - 1) / 2))} câu hỏi</p>
          </div>
        )}
      </header>

      <div className="border-b border-slate-200 bg-[#f9fbfd] px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-[#8da1b8]">Ngữ cảnh: Slide trang {currentPage}</span>
          <span className="rounded-full border border-[#cdddeb] bg-white px-2 py-1 text-[9px] font-bold text-[#12568f]">Trang slide: {currentPage}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[92%] rounded-2xl px-3.5 py-3 text-[12px] leading-[1.55] shadow-sm ${
              message.role === "student"
                ? "rounded-br-md bg-[#12568f] text-white"
                : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
            }`}>
              {message.role === "tutor" && message.decision && (
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${
                    message.decision.intent === "navigate_page"
                      ? "bg-[#e6f7ef] text-[#08734b]"
                      : message.decision.intent === "clarify"
                        ? "bg-[#fff4df] text-[#9a5b00]"
                        : "bg-[#edf4fb] text-[#12568f]"
                  }`}>
                    {message.decision.intent}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">
                    {Math.round(message.decision.confidence * 100)}% confidence
                  </span>
                </div>
              )}
              <p>{message.text}</p>
              {message.role === "tutor" && message.decision && (
                <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] text-slate-400">{message.decision.reason}</p>
              )}
              {message.role === "tutor" && message.destination && (
                <button onClick={() => onNavigate(message.destination!)} className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#eef6fb] px-3 py-2 font-bold text-[#12568f]">
                  <span className="flex items-center gap-2"><Icon name="target" className="size-4" />Mở lại trang {message.destination}</span>
                  <Icon name="chevronRight" className="size-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-3">
        <div className="mb-2 flex gap-1.5 overflow-x-auto">
          {["Trang số 8 ở đâu?", "Tóm tắt trang này", "8 phần cốt lõi là gì?"].map((prompt) => (
            <button key={prompt} onClick={() => setInput(prompt)} className="shrink-0 rounded-full border border-slate-200 bg-[#f8fafc] px-2.5 py-1.5 text-[9px] font-semibold text-slate-600">{prompt}</button>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="h-9 min-w-0 flex-1 rounded-full border border-slate-200 bg-[#f8fafc] px-3 text-xs outline-none focus:border-[#8cb2d3]"
            placeholder="Nhập câu hỏi hoặc yêu cầu mở trang..."
          />
          <button className="grid size-9 shrink-0 place-items-center rounded-full bg-[#8fb3d1] text-white hover:bg-[#12568f]" aria-label="Gửi câu hỏi">
            <Icon name="send" className="size-4" />
          </button>
        </form>
        <p className="mt-2 truncate text-[9px] text-slate-400">Đang xem: {currentSlide.title}</p>
      </div>
    </aside>
  );
}
