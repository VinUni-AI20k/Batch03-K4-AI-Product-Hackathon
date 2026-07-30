'use client';
import Header from '../components/Header'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCourseInfo } from '../utils/api'

export default function HomePage() {
  const [info, setInfo] = useState(null)
  const [lang, setLang] = useState('VI')

  useEffect(() => {
    getCourseInfo()
      .then(data => setInfo(data))
      .catch(() => {})
  }, [])

  const totalCourses = 1
  const totalQuestions = 13
  const daysRead = info?.progress_completed ?? 0
  const daysTotal = info?.progress_total ?? 6

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Header lang={lang} setLang={setLang} info={info} />

      {/* Top banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-centered py-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#E11D48] tracking-wider uppercase">
              VLEARN · VINUNI AI THỰC CHIẾN
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5">
              Không gian học tập VLearn
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Theo dõi tiến độ, học liệu và phần kiến thức cần cùng cố tại VinUni AI Thực Chiến.
            </p>
          </div>
          <Link
            href="/my-courses"
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span className="text-[#0B3B60] font-semibold">{totalCourses} khóa học đang theo học</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="container-centered py-6 space-y-5">
        {/* Welcome card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B3B60] to-[#1565A8]" style={{minHeight: '180px'}}>
          {/* Decorative red accent */}
          <div className="absolute top-0 right-0 w-[120px] h-full">
            <svg viewBox="0 0 120 180" fill="none" className="w-full h-full" preserveAspectRatio="none">
              <path d="M20 0H120V180H0L20 0Z" fill="#CC1B38" opacity="0.85" />
            </svg>
          </div>

          <div className="relative z-10 p-8">
            <div className="text-xs font-bold text-blue-200 tracking-wider uppercase">
              VLEARN · VINUNI AI THỰC CHIẾN
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-3">
              Chào mừng trở lại, VŨ HỮU TRƯỜNG!
            </h2>
            <p className="text-sm text-blue-100 mt-2 max-w-xl leading-relaxed">
              VLearn đang tổng hợp tiến độ đọc và các tín hiệu học tập. Mở Khóa học của tôi để tiếp tục ngày học hoặc trao đổi cùng VLearn Tutor.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Tín hiệu học tập đang hoạt động
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                Đã đọc {daysRead}/{daysTotal} ngày học
              </span>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Courses count */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Khóa học</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalCourses}</div>
            </div>
          </div>

          {/* Questions count */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6">
                <path d="M9 18l6-6-6-6"/>
                <path d="M15 18l-6-6 6-6" transform="translate(4, 0)"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Câu hỏi với tutor</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalQuestions}</div>
            </div>
          </div>
        </div>

        {/* View my courses link card */}
        <Link href="/my-courses" className="block">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between group hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B3B60" strokeWidth="1.6">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">Xem khóa học của tôi</div>
                <div className="text-sm text-[#64748B] mt-0.5">Mở danh sách đầy đủ các lớp bạn đang theo học.</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </Link>
      </main>
    </div>
  )
}
