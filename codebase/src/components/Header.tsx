"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

interface HeaderProps {
  materialTitle: string;
  materialCode?: string;
  onToggleSidebar?: () => void;
}

export function Header({
  materialTitle,
  materialCode = "COMP2010",
  onToggleSidebar,
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<"VI" | "EN">("VI");

  const toggleDarkMode = () => {
    const nextValue = !isDarkMode;
    setIsDarkMode(nextValue);
    document.documentElement.classList.toggle("dark", nextValue);
  };

  return (
    <header className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:flex dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
            aria-label="Mở danh sách học liệu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex shrink-0 items-center gap-2.5">
          <BrandMark className="h-9 w-9" />
          <span className="text-xl font-extrabold tracking-tight text-[#155493] dark:text-sky-300">
            <span className="text-[#cf202f]">V</span>Learn
          </span>
        </div>

        <div className="mx-1 hidden h-9 w-px bg-slate-200 md:block dark:bg-slate-700" />

        <div className="hidden min-w-0 items-center gap-2.5 md:flex">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#155493] dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">
            <BookOpen className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="max-w-[44vw] truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {materialTitle}
            </p>
            <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {materialCode} · Học liệu bài giảng
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setLang(lang === "VI" ? "EN" : "VI")}
          className="flex h-9 min-w-10 items-center justify-center rounded-xl border border-slate-200 px-2 text-xs font-bold text-[#155493] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-sky-300 dark:hover:bg-slate-800"
          aria-label="Đổi ngôn ngữ"
        >
          {lang}
        </button>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#155493] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-sky-300 dark:hover:bg-slate-800"
          aria-label="Đổi giao diện sáng tối"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
