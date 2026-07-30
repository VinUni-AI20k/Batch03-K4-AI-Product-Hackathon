"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sparkles
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

export function ReaderToolbar({
  title,
  publicCode = "D01-S01",
  currentPage,
  totalPages,
  zoomLevel,
  onPageChange,
  onZoomChange,
  onToggleFullscreen,
  isFullscreen,
  onOpenAiTutor,
  onOpenConfusionModal
}: ReaderToolbarProps) {
  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Left: Document info & public code */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 rounded-md bg-[#124f8c]/10 px-2 py-0.5 text-xs font-bold text-[#124f8c] dark:bg-sky-500/20 dark:text-sky-400">
          {publicCode}
        </span>
        <h1 className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h1>
      </div>

      {/* Middle: Page Controls & Zoom */}
      <div className="flex items-center gap-2">
        {/* Page Navigator */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <strong className="font-bold text-slate-900 dark:text-white">{currentPage}</strong> / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            title="Thu nhỏ"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="w-11 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            {zoomLevel}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700"
            title="Phóng to"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Confusion feedback */}
        <button
          onClick={onOpenConfusionModal}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
          title="Báo phần kiến thức mông lung"
        >
          <HelpCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden md:inline">Mông lung</span>
        </button>

        {/* Ask AI Tutor */}
        <button
          onClick={onOpenAiTutor}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-[#124f8c] px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#0b355f] dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hỏi AI Tutor</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 sm:flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
