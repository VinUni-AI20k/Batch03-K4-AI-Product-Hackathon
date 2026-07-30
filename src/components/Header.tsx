"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  ExternalLink,
  User,
  LogOut,
  Bell,
  Menu
} from "lucide-react";

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  onToggleSidebar?: () => void;
}

export function Header({
  userEmail = "26ai.manhnh@vinuni.edu.vn",
  userName = "NGUYỄN HÙNG MẠNH",
  onToggleSidebar
}: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<"VI" | "EN">("VI");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left section: Mobile sidebar button & Logo */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#124f8c] text-white shadow-sm">
            <span className="text-lg font-black tracking-tighter">V</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#124f8c] dark:text-sky-400">
            VLearn
          </span>
        </Link>

        {/* Primary Navigation items */}
        <nav className="hidden items-center gap-1 md:flex ml-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <BookOpen className="h-4 w-4 text-slate-500" />
            Trang chủ
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-[#124f8c] transition-colors dark:bg-sky-950/50 dark:text-sky-400"
          >
            Khóa học của tôi
          </Link>
        </nav>
      </div>

      {/* Right section: CodeLabs link, Language toggle, Dark mode, User dropdown */}
      <div className="flex items-center gap-2">
        <a
          href="https://codelabs.vlearn.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          Mở Codelabs
        </a>

        {/* Language selector */}
        <button
          onClick={() => setLang(lang === "VI" ? "EN" : "VI")}
          className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-bold text-[#124f8c] hover:bg-slate-50 dark:border-slate-700 dark:text-sky-400 dark:hover:bg-slate-800"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Chuyển chế độ sáng/tối"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#124f8c] text-[11px] font-bold text-white">
              {userName ? userName.charAt(0) : "U"}
            </div>
            <span className="hidden max-w-[140px] truncate text-xs font-medium text-slate-700 sm:inline dark:text-slate-200">
              {userEmail}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{userName}</p>
                <p className="truncate text-[11px] text-slate-500">{userEmail}</p>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
