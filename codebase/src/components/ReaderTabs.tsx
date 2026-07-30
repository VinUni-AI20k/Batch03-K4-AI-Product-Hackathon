"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  CreditCard,
  NotebookPen,
  Sparkles,
  Send,
  Plus,
  X,
  Bot
} from "lucide-react";

interface ReaderTabsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "mindmap" | "flashcards" | "notes" | "tutor";
  currentPage?: number;
  totalPages?: number;
  materialTitle?: string;
}

export function ReaderTabs({
  isOpen,
  onClose,
  initialTab = "tutor",
  currentPage = 1,
  totalPages = 23,
  materialTitle = "day01-slide-blue-v0.pdf"
}: ReaderTabsProps) {
  const [activeTab, setActiveTab] = useState<"mindmap" | "flashcards" | "notes" | "tutor">(initialTab);
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: "ai" | "user";
    text: string;
    badge?: string;
    citation?: string;
  }>>([
    {
      sender: "ai",
      text: `Xin chào bạn! Mình là AI Tutor VLearn. Bạn đang xem tài liệu "${materialTitle}" (Trang ${currentPage}/${totalPages}). Bạn có thắc mắc gì cần giải đáp không?`
    }
  ]);
  const [notes, setNotes] = useState([
    { id: "1", page: currentPage, text: "Ghi chú: Cần ôn lại các khái niệm LLM Foundations ở slide Day 01.", time: "10:24 AM" }
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  const handleSendAiMessage = (textToSend?: string) => {
    const query = textToSend || aiPrompt;
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { sender: "user", text: query }]);
    if (!textToSend) setAiPrompt("");

    const qLower = query.toLowerCase();

    // Determine context scope & response
    setTimeout(() => {
      if (qLower.includes("cả bộ") || qLower.includes("toàn bộ") || qLower.includes("tổng quan bài")) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: "ai",
            badge: `📚 NGỮ CẢNH: CẢ BỘ SLIDE DAY 01 (${totalPages} TRANG)`,
            text: `Tổng hợp toàn bộ ${totalPages} trang slide thuộc học liệu "${materialTitle}":\n\n1. Trang 1–5: Khái niệm cơ bản Generative AI & Generative vs Discriminative.\n2. Trang 6–14: Kiến trúc Transformer, Self-Attention & Multi-Head Attention.\n3. Trang 15–23: Các giai đoạn huấn luyện (Pre-training, SFT, RLHF) & Đánh giá mô hình.`,
            citation: `[Trang 1, 6, 12, 18, 23 - ${materialTitle}]`
          }
        ]);
      } else if (qLower.includes("đáp án") || qLower.includes("bài tập về nhà") || qLower.includes("thiếu")) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: "ai",
            badge: `⚠️ NGỮ CẢNH: NGOÀI PHẠM VI HỌC LIỆU`,
            text: `Rất tiếc, câu hỏi của bạn không nằm trong căn cứ của bộ slide "${materialTitle}" (${totalPages} trang). AI Tutor từ chối đoán mò để tránh gây hiểu sai kiến thức.\n\n👉 Bạn vui lòng kiểm tra phần Bài tập trên hệ thống VLearn hoặc hỏi trực tiếp TA trên channel Discord khoá học!`,
            citation: `[Không tìm thấy trích dẫn hợp lệ]`
          }
        ]);
      } else {
        // Default: Trang đang mở (Current Page Context)
        setChatMessages(prev => [
          ...prev,
          {
            sender: "ai",
            badge: `📌 NGỮ CẢNH: TRANG ${currentPage} / ${totalPages}`,
            text: `Dựa trên nội dung Trang ${currentPage} của bài học "${materialTitle}":\n\n• Slide trang ${currentPage} tập trung vào kiến thức trọng tâm về LLMs và cấu trúc bài học Day 01.\n• Cụ thể: Phân tích cơ chế hoạt động của mô hình ngôn ngữ và cách áp dụng vào sản phẩm AI.`,
            citation: `[Trang ${currentPage} - ${materialTitle}]`
          }
        ]);
      }
    }, 600);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        page: currentPage,
        text: newNoteText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setNewNoteText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 top-14 z-40 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all sm:w-[420px] dark:border-slate-800 dark:bg-slate-900">
      {/* Drawer Header & Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab("tutor")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "tutor"
                ? "bg-white text-[#124f8c] shadow-sm dark:bg-slate-700 dark:text-sky-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Tutor
          </button>
          <button
            onClick={() => setActiveTab("mindmap")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "mindmap"
                ? "bg-white text-[#124f8c] shadow-sm dark:bg-slate-700 dark:text-sky-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            Sơ đồ
          </button>
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "flashcards"
                ? "bg-white text-[#124f8c] shadow-sm dark:bg-slate-700 dark:text-sky-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Flashcard
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "notes"
                ? "bg-white text-[#124f8c] shadow-sm dark:bg-slate-700 dark:text-sky-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <NotebookPen className="h-3.5 w-3.5" />
            Ghi chú
          </button>
        </div>

        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        {/* Tab 1: AI Tutor Chat */}
        {activeTab === "tutor" && (
          <div className="flex h-full flex-col justify-between space-y-4">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#124f8c] text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[88%]">
                    {msg.badge && (
                      <span className="inline-block self-start rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-[#124f8c] dark:bg-sky-950 dark:text-sky-300">
                        {msg.badge}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-[#124f8c] font-medium text-white dark:bg-sky-500 dark:text-slate-950"
                          : "border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {msg.text}
                      {msg.citation && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                          {msg.citation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick suggested prompts */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-400">Gợi ý thắc mắc mẫu (Lát cắt Demo):</p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleSendAiMessage(`Tóm tắt nội dung slide trang ${currentPage} này`)}
                  className="rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#124f8c] transition-colors hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
                >
                  📌 <strong>[Trang đang xem]</strong> Tóm tắt slide trang {currentPage} này
                </button>
                <button
                  onClick={() => handleSendAiMessage(`Tóm tắt toàn bộ bài học Day 01 (${totalPages} trang)`)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  📚 <strong>[Cả bộ slide]</strong> Tóm tắt toàn bộ bài học Day 01 ({totalPages} trang)
                </button>
                <button
                  onClick={() => handleSendAiMessage("Cho mình xin đáp án bài tập về nhà buổi này")}
                  className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-left text-[11px] font-semibold text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  ⚠️ <strong>[Thiếu căn cứ]</strong> Hỏi đáp án bài tập về nhà
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Đặt câu hỏi cho AI Tutor VLearn..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:border-[#124f8c] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={() => handleSendAiMessage()}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#124f8c] text-white hover:bg-[#0b355f] dark:bg-sky-500 dark:text-slate-950"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Mindmap Sơ đồ tư duy */}
        {activeTab === "mindmap" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Sơ đồ tư duy học liệu ({materialTitle})
            </h3>
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="rounded-lg bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <span className="font-bold text-[#124f8c] dark:text-sky-400 text-xs">📌 1. LLM Foundations</span>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                  Next Token Prediction, Auto-regressive Models, Tokenization.
                </p>
              </div>
              <div className="ml-4 border-l-2 border-[#124f8c]/30 pl-3 space-y-2">
                <div className="rounded-lg bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">🔹 2. Transformer Architecture</span>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    Encoder-Decoder, Positional Encoding, Multi-Head Attention.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">🔹 3. Training Phases</span>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    Pre-training → SFT → RLHF Alignment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Flashcards */}
        {activeTab === "flashcards" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Thẻ ghi nhớ Flashcards (3 thẻ)
              </h3>
              <span className="text-[11px] font-semibold text-[#124f8c] dark:text-sky-400">
                Đã thuộc: 1/3
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center space-y-3 dark:border-slate-800 dark:bg-slate-800">
              <span className="inline-block rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-[#124f8c] dark:bg-sky-950 dark:text-sky-400">
                Câu hỏi 1 / 3
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                Self-Attention trong Transformer có công dụng chính là gì?
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Trả lời: Tính toán mức độ liên quan giữa tất cả các token trong cùng một câu văn bản.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Ghi chú */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Ghi chú cá nhân bài học
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Thêm ghi chú bài học..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-[#124f8c] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={handleAddNote}
                className="flex items-center gap-1 rounded-xl bg-[#124f8c] px-3 py-2 text-xs font-bold text-white hover:bg-[#0b355f] dark:bg-sky-500 dark:text-slate-950"
              >
                <Plus className="h-4 w-4" />
                Lưu
              </button>
            </div>

            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-[#124f8c] dark:text-sky-400">Trang {n.page}</span>
                    <span>{n.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-800 dark:text-slate-200 font-medium">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

