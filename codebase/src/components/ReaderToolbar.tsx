"use client";

import React, { useState } from "react";
import {
  Download,
  Highlighter,
  Maximize2,
  Minimize2,
  Minus,
  MoreHorizontal,
  MousePointer2,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";

interface ReaderToolbarProps {
  title: string;
  publicCode?: string;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenAiTutor: () => void;
  onOpenConfusionModal: () => void;
}

type ReaderTool = "read" | "draw" | "highlight";

export function ReaderToolbar({
  currentPage,
  totalPages,
  zoomLevel,
  onZoomChange,
  onToggleFullscreen,
  isFullscreen,
  onOpenAiTutor,
}: ReaderToolbarProps) {
  const [activeTool, setActiveTool] = useState<ReaderTool>("read");

  const toolButtonClass = (tool: ReaderTool) =>
    `flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors ${
      activeTool === tool
        ? "border border-[#155493]/25 bg-sky-50 text-[#155493] shadow-sm dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="shrink-0 border-b border-slate-200 bg-[#f3f7fb] px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setActiveTool("read")} className={toolButtonClass("read")}>
            <MousePointer2 className="h-4 w-4" />
            <span className="hidden sm:inline">Đọc</span>
          </button>
          <button type="button" onClick={() => setActiveTool("draw")} className={toolButtonClass("draw")}>
            <Pencil className="h-4 w-4" />
            <span className="hidden md:inline">Bút</span>
          </button>
          <button type="button" onClick={() => setActiveTool("highlight")} className={toolButtonClass("highlight")}>
            <Highlighter className="h-4 w-4" />
            <span className="hidden lg:inline">Highlight</span>
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Thêm công cụ">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <span className="rounded-xl bg-sky-50 px-3 py-2 text-[11px] font-bold text-[#155493] dark:bg-sky-950/60 dark:text-sky-300">
            Trang {currentPage} · 1 note
          </span>
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))} className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Thu nhỏ">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-14 text-center text-xs font-bold text-slate-700 dark:text-slate-200">{zoomLevel}%</span>
            <button type="button" onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))} className="flex h-9 w-9 items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Phóng to">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 sm:flex dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Tải học liệu">
            <Download className="h-4 w-4" />
          </button>
          <button type="button" onClick={onOpenAiTutor} className="flex h-9 items-center gap-1.5 rounded-xl bg-[#155493] px-3 text-xs font-bold text-white transition-colors hover:bg-[#0d3f70]">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">VLearn Tutor</span>
          </button>
          <button type="button" onClick={onToggleFullscreen} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <span className="sr-only">Trang {currentPage} trên {totalPages}</span>
    </div>
  );
}
