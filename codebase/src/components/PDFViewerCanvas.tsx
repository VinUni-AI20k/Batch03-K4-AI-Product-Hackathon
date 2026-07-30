"use client";

import React, { useRef } from "react";
import {
  Code,
  CheckCircle,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

interface SlideSection {
  type: "hero" | "text" | "highlights" | "code" | "formula" | "note" | "diagram";
  content?: string;
  items?: string[];
  language?: string;
  code?: string;
  formula?: string;
  title?: string;
}

interface SlideContent {
  title: string;
  subtitle?: string;
  author?: string;
  badge: string;
  sections: SlideSection[];
}

interface PDFViewerCanvasProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  materialTitle: string;
  onPageChange: (page: number) => void;
}

export function PDFViewerCanvas({
  currentPage,
  totalPages,
  zoomLevel,
  materialTitle,
  onPageChange
}: PDFViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample slide deck content simulating the actual 83-page COMP2010 Day 01 lecture slide deck
  const getSlideContent = (page: number): SlideContent => {
    switch (page) {
      case 1:
        return {
          title: "COMP2010 - VinUni AI Thực Chiến",
          subtitle: "Day 01: Generative AI, Large Language Models (LLM) Foundations & Architecture",
          author: "VinUni Faculty & AI Research Team",
          badge: "Lecture Material · D01-S01",
          sections: [
            {
              type: "hero",
              content: "Chào mừng các bạn sinh viên đến với môn học COMP2010. Trong bài học hôm nay, chúng ta sẽ bắt đầu tìm hiểu về Nền tảng Mô hình Ngôn ngữ Lớn (LLM) và Nguyên lý Kiến trúc Transformer."
            },
            {
              type: "highlights",
              items: [
                "1. Sự tiến hóa từ RNN/LSTM đến Transformer & LLM",
                "2. Cơ chế Self-Attention & Multi-Head Attention",
                "3. Quy trình Pre-training, SFT (Supervised Fine-Tuning) và RLHF",
                "4. Ứng dụng thực tiễn trong Xây dựng AI Application & Agentic System"
              ]
            }
          ]
        };
      case 2:
        return {
          title: "1. Tổng quan về Generative AI & Large Language Models",
          subtitle: "Định nghĩa, Khả năng & Giới hạn",
          badge: "Nền tảng kiến thức",
          sections: [
            {
              type: "text",
              content: "LLM (Large Language Model) là các mô hình AI dựa trên mạng Nơ-ron sâu được huấn luyện trên lượng dữ liệu văn bản khổng lồ (hàng nghìn tỷ token) để dự đoán token tiếp theo (Next Token Prediction)."
            },
            {
              type: "code",
              language: "python",
              code: `# Minh họa cơ chế Auto-regressive Next Token Generation
def generate_text(prompt, model, max_tokens=50):
    tokens = tokenize(prompt)
    for _ in range(max_tokens):
        logits = model(tokens)
        next_token = sample_next_token(logits)
        tokens.append(next_token)
        if next_token == EOS_TOKEN:
            break
    return decode(tokens)`
            },
            {
              type: "note",
              content: "💡 Lưu ý quan trọng: Mô hình LLM bản chất là dự đoán xác suất token tiếp theo (Probabilistic Next Token Predictor), không phải cơ sở dữ liệu tra cứu tĩnh."
            }
          ]
        };
      case 3:
        return {
          title: "2. Kiến trúc Transformer (Attention Is All You Need)",
          subtitle: "Encoder - Decoder & Self-Attention Mechanism",
          badge: "Kiến trúc cốt lõi",
          sections: [
            {
              type: "diagram",
              title: "Cấu trúc Encoder-Decoder Transformer",
              items: [
                "Input Embeddings + Positional Encoding",
                "Multi-Head Self-Attention Layer",
                "Layer Normalization & Residual Connections",
                "Feed Forward Neural Network (FFN)"
              ]
            },
            {
              type: "text",
              content: "Công thức toán học của Scaled Dot-Product Attention:"
            },
            {
              type: "formula",
              formula: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V"
            }
          ]
        };
      default:
        return {
          title: `${materialTitle} - Slide ${page}`,
          subtitle: `Chủ đề bài học Day 01 (Trang ${page} / ${totalPages})`,
          badge: `Slide ${page}`,
          sections: [
            {
              type: "text",
              content: `Nội dung chi tiết slide học phần COMP2010 trang ${page}. Bao gồm phần giảng giải lý thuyết, các ví dụ mã nguồn minh họa và bài tập luyện tập có định hướng.`
            },
            {
              type: "highlights",
              items: [
                `Khái niệm trọng tâm trang ${page}`,
                `Ví dụ thực hành lập trình Python / PyTorch liên quan`,
                `Ghi chú quan trọng cần chuẩn bị cho phần bài tập Lab`
              ]
            }
          ]
        };
    }
  };

  const slide = getSlideContent(currentPage);
  const scale = zoomLevel / 100;

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-auto bg-[#edf3f8] p-4 dark:bg-slate-950"
    >
      {/* Slide Container with Scaled Zoom & Shadow */}
      <div
        className="w-full max-w-5xl transition-transform duration-200"
        style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
      >
        <div className="relative min-h-[580px] rounded-2xl border border-sky-300 bg-[#fffdf6] p-8 shadow-[0_8px_24px_rgba(15,56,96,0.10)] transition-all dark:border-sky-900 dark:bg-slate-900">
          {/* Slide Top Banner */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BrandMark className="h-6 w-6" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                VinUni AI Thực Chiến · COMP2010
              </span>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#124f8c] dark:bg-sky-950 dark:text-sky-400">
              {slide.badge}
            </span>
          </div>

          {/* Slide Title */}
          <div className="mt-6">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="mt-1 text-xs font-semibold text-[#124f8c] dark:text-sky-400">
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Slide Content Sections */}
          <div className="mt-6 space-y-4">
            {slide.sections.map((sec, idx) => {
              if (sec.type === "hero") {
                return (
                  <div key={idx} className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-300">
                    {sec.content}
                  </div>
                );
              }

              if (sec.type === "text") {
                return (
                  <p key={idx} className="text-sm font-medium text-slate-700 leading-relaxed dark:text-slate-300">
                    {sec.content}
                  </p>
                );
              }

              if (sec.type === "highlights" && sec.items) {
                return (
                  <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900">
                    {sec.items.map((item: string, itemIdx: number) => (
                      <div key={itemIdx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#124f8c] dark:text-sky-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              if (sec.type === "code" && sec.code) {
                return (
                  <div key={idx} className="overflow-hidden rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-200 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-bold text-sky-400">
                        <Code className="h-3.5 w-3.5" /> {sec.language || "python"}
                      </span>
                      <span>Next Token Sampling</span>
                    </div>
                    <pre className="mt-3 overflow-x-auto leading-relaxed">
                      <code>{sec.code}</code>
                    </pre>
                  </div>
                );
              }

              if (sec.type === "formula" && sec.formula) {
                return (
                  <div key={idx} className="flex justify-center rounded-xl bg-slate-900 p-4 text-sm font-mono font-bold text-sky-300">
                    {sec.formula}
                  </div>
                );
              }

              if (sec.type === "note" && sec.content) {
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs font-medium text-amber-900 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{sec.content}</span>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Slide Footer with Page Number */}
          <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-400 dark:border-slate-800">
            <span>VinUni VLearn Adaptive Learning</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Trang {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigator for Quick Page Flipping */}
      <div className="sticky bottom-4 z-30 mt-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Trang {currentPage} trên {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
