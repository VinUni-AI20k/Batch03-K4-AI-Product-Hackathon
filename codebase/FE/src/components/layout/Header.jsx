import { useState, useRef, useEffect } from "react";
import { Icon } from "../common/Icon.jsx";

export function Header({ googleConnected, googleEmail, onGoogleLogin, onGoogleLogout, onOpenConnections }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = googleEmail ? googleEmail.split("@")[0] : "Minh Trương";
  const avatarChar = googleEmail ? googleEmail[0].toUpperCase() : "M";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-float">
          <Icon className="text-[26px]">neurology</Icon>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-ink">StudyPulse</h1>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">AI</span>
          </div>
          <p className="hidden truncate text-xs text-slate-500 sm:block">Trợ lý học tập đa nền tảng</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {googleConnected ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100"
              title="Tài khoản Google & Quản lý"
            >
              <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-extrabold text-white">
                {avatarChar}
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[140px] truncate text-xs font-bold text-ink">{username}</p>
                <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đã kết nối
                </p>
              </div>
              <Icon className="hidden text-lg text-slate-400 sm:block">expand_more</Icon>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-panel">
                <div className="border-b border-slate-100 pb-3 px-2">
                  <p className="text-xs font-bold text-ink">{username}</p>
                  <p className="truncate text-[11px] text-slate-500">{googleEmail}</p>
                </div>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenConnections();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Icon className="text-base text-blue-600">hub</Icon>
                    <span>Quản lý kết nối</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onGoogleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Icon className="text-base text-red-600">logout</Icon>
                    <span>Đăng xuất Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onGoogleLogin}
            className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow"
            title="Đăng nhập Google"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Đăng nhập với Google</span>
          </button>
        )}
      </div>
    </header>
  );
}
