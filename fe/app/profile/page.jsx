'use client';

import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { lang, user } = useApp();

  const isVi = lang === 'VI';

  const t = {
    title: isVi ? 'Hồ sơ học viên & Bài đã nộp' : 'Student Profile & Submissions',
    subtitle: isVi ? 'Xem chi tiết thông tin cá nhân và lịch sử nộp bài các ngày học' : 'View personal details and submission history',
    backHome: isVi ? 'Quay lại trang chủ' : 'Back to Home',
    accountInfo: isVi ? 'Thông tin tài khoản' : 'Account Information',
    fullName: isVi ? 'Họ và tên' : 'Full Name',
    email: isVi ? 'Email VinUni' : 'VinUni Email',
    studentId: isVi ? 'Mã học viên' : 'Student ID',
    role: isVi ? 'Vai trò' : 'Role',
    cohort: isVi ? 'Khóa / Cohort' : 'Cohort',
    submissionsList: isVi ? 'Danh sách bài tập đã nộp' : 'Submitted Assignments List',
    submittedAt: isVi ? 'Thời gian nộp' : 'Submitted Time',
    status: isVi ? 'Trang thái' : 'Status',
    score: isVi ? 'Điểm số' : 'Grade / Score',
    graded: isVi ? 'Đã chấm' : 'Graded',
    pending: isVi ? 'Chưa chấm' : 'Pending',
    download: isVi ? 'Tải tệp nộp' : 'Download Submission',
    feedback: isVi ? 'Nhận xét từ giảng viên' : 'Instructor Feedback',
    noSubmissions: isVi ? 'Chưa có bài nộp nào' : 'No submissions found'
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A]">
      <Header />

      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="container-centered py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3B60] to-[#1565A8] dark:from-[#1E3A8A] dark:to-[#3B82F6] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                {user.avatarChar}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>{t.backHome}</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="container-centered py-8 space-y-6">
        {/* Profile Details Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B3B60" className="dark:stroke-blue-400" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{t.accountInfo}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.fullName}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{user.name}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate">{user.email}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.studentId}</span>
              <div className="text-base font-extrabold text-[#0B3B60] dark:text-[#38BDF8] mt-1">{user.studentId}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.role}</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize">{user.role}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 col-span-1 md:col-span-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cohort}</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">{user.cohort}</div>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>{t.submissionsList}</span>
            </h2>
            <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0B3B60] dark:text-[#38BDF8] px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
              {user.submissions.length} bài đã nộp
            </span>
          </div>

          <div className="space-y-4">
            {user.submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="inline-block text-[11px] font-extrabold text-[#0B3B60] dark:text-[#38BDF8] bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-md mb-1.5">
                      {sub.code}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {sub.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                      <span>🕒 {t.submittedAt}: <strong>{sub.submittedAt}</strong></span>
                      <span>📁 {sub.fileName} ({sub.fileSize})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      sub.status === 'graded'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}>
                      {sub.status === 'graded' ? t.graded : t.pending}
                    </span>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.score}</div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        {sub.score}
                      </div>
                    </div>
                  </div>
                </div>

                {sub.feedback && (
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{t.feedback}: </span>
                    {sub.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
