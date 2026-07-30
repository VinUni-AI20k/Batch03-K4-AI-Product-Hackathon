"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const onCourse = pathname.startsWith("/course/");

  const links = [
    { href: "/dashboard", label: "Trang chủ", icon: "home", active: pathname === "/" || pathname === "/dashboard" },
    { href: "/my-courses", label: "Khóa học của tôi", icon: "bookOpen", active: pathname === "/my-courses" || pathname === "/course/comp2010" },
    ...(onCourse ? [{ href: "/course/comp2010/study-overview", label: "Sổ tay học tập", icon: "file", active: pathname.includes("study-overview") }] : []),
  ];

  return (
    <header className={`sticky top-0 z-50 border-b border-slate-200 shadow-[0_3px_5px_rgba(57,63,72,0.12)] ${dark ? "bg-slate-900 text-white" : "bg-white"}`}>
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="shrink-0"><Logo /></Link>
        <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.href} className={`nav-link ${link.active ? "nav-active" : ""}`} href={link.href}>
              <Icon name={link.icon} className="size-[18px]" />{link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <button className="header-tool">VI</button>
          <button className="header-tool" onClick={() => setDark(!dark)} aria-label="Chuyển giao diện tối"><Icon name="moon" className="size-4" /></button>
          <div className="relative">
            <button className="profile-button" onClick={() => setAccountOpen(!accountOpen)} aria-label="Mở menu tài khoản">
              <span className="grid size-6 place-items-center rounded-md bg-white font-black">2</span>
              <Icon name={accountOpen ? "chevronUp" : "chevronDown"} className="size-3.5" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-10 w-[286px] rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-xl">
                <p className="text-[11px] font-black uppercase tracking-[.12em] text-[#94a3b8]">Tài khoản VLearn</p>
                <p className="mt-2 text-sm font-black">demo.student@vlearn.local</p>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Vai trò</span><b>Sinh viên</b></div>
                  <div className="flex justify-between"><span className="text-slate-500">Cohort</span><b>AI Thực Chiến</b></div>
                </div>
                <button className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-sm font-bold">Đăng xuất</button>
              </div>
            )}
          </div>
        </div>
        <div className="relative ml-auto lg:hidden">
          <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Mở menu">
            <Icon name={mobileOpen ? "x" : "menu"} className="size-6" />
          </button>
          {mobileOpen && (
            <div className="absolute right-0 top-[52px] w-56 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
              {links.map((link) => <Link key={link.href} href={link.href} className={`block rounded-lg px-3 py-2 font-semibold ${link.active ? "text-[#124f8c]" : "text-slate-600"} hover:bg-[#eef4f8]`}>{link.label}</Link>)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
