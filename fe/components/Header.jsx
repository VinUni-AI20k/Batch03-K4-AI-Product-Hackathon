"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header({ lang, setLang, info, onStart }){
  const pathname = usePathname()
  const [openUser, setOpenUser] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(()=>{
    if(dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[dark])

  const isHome = pathname === '/' || pathname === '/home'
  const isCourses = pathname === '/my-courses'
  const isNotebook = pathname === '/notebook'
  const showNotebook = isCourses || isNotebook

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="container-centered flex items-center justify-between py-3">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d="M4 16L16 4L28 16" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16L16 28L28 16" stroke="#0B3B60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">VLearn</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isHome
                  ? 'text-[#0B3B60] font-semibold bg-slate-50'
                  : 'text-[#64748B] hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Trang chủ</span>
            </Link>

            <Link
              href="/my-courses"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isCourses
                  ? 'text-[#0B3B60] font-semibold bg-slate-50'
                  : 'text-[#64748B] hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <span>Khóa học của tôi</span>
            </Link>

            {/* Sổ tay học tập – only visible on my-courses and notebook pages */}
            {showNotebook && (
              <Link
                href="/notebook"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isNotebook
                    ? 'text-[#0B3B60] font-semibold bg-slate-50'
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <line x1="8" y1="7" x2="16" y2="7"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <span>Sổ tay học tập</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mở Codelabs */}
          <button
            onClick={()=>alert('Open Codelabs')}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>Mở Codelabs</span>
          </button>

          {/* Language toggle */}
          <button
            onClick={()=>setLang(lang==='VI'?'EN':'VI')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            {lang}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={()=>setDark(!dark)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={()=>setOpenUser(!openUser)}
              className="flex items-center gap-2.5 px-3 py-1.5 border border-slate-200 rounded-full hover:border-slate-300 transition-colors"
            >
              <div className="bg-slate-100 text-[#0B3B60] w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div className="text-sm text-slate-700 max-w-[160px] truncate font-medium">26ai.truongvh@vinun...</div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                <Link href="#" className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Đổi tài khoản</Link>
                <Link href="#" className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">Đăng xuất</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
