'use client';

import Header from '../../components/Header';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function LogoutPage() {
  const { lang, login, isLoggedIn } = useApp();

  const isVi = lang === 'VI';

  const t = {
    title: isVi ? 'Bạn đã đăng xuất' : 'You have logged out',
    subtitle: isVi ? 'Cảm ơn bạn đã đồng hành cùng VLearn - VinUni AI Thực Chiến!' : 'Thank you for learning with VLearn - VinUni Practical AI!',
    reloginBtn: isVi ? 'Đăng nhập lại' : 'Log in again',
    goHome: isVi ? 'Trở về trang chủ' : 'Return to Home',
    loggedOutMsg: isVi ? 'Phiên làm việc của bạn trên thiết bị này đã kết thúc an toàn.' : 'Your session on this device has ended securely.',
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A]">
      <Header />

      <main className="container-centered py-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {t.subtitle}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t.loggedOutMsg}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                login();
                window.location.href = '/';
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#0B3B60] to-[#1565A8] dark:from-[#1E3A8A] dark:to-[#3B82F6] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>{t.reloginBtn}</span>
            </button>

            <Link
              href="/"
              onClick={() => login()}
              className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t.goHome}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
