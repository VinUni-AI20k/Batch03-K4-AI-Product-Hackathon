import Link from "next/link";
import { Header } from "@/components/header";
import { Icon } from "@/components/icons";

export default function MyCoursesPage() {
  return (
    <div className="min-h-screen bg-[#eef4f8]">
      <Header />
      <header className="dashboard-heading">
        <div className="page-container flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">VLearn · VinUni AI Thực Chiến</p>
            <h1 className="mt-1 text-2xl font-bold">Khóa học của tôi</h1>
            <p className="mt-1 text-sm text-slate-500">Mỗi khóa học lưu trữ tài liệu, giáo án và phần ghi chú tương tác của riêng bạn.</p>
          </div>
          <span className="course-count">1 khóa học đang theo học</span>
        </div>
      </header>
      <main className="page-container p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[306px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="dashboard-icon"><Icon name="bookOpen" className="size-5" /></div>
            <span className="rounded-full border border-[#9be8c6] bg-[#ecfff7] px-2.5 py-1 text-[10px] font-bold text-[#07945f]">0% đọc</span>
          </div>
          <p className="mt-5 text-[11px] font-bold text-[#8ca1bb]">COMP2010</p>
          <h2 className="mt-1 text-lg font-black">Khoá 3 + 4 Phase 1</h2>
          <p className="mt-3 text-sm text-slate-500">Khóa học Khoá 3 + 4 Phase 1</p>
          <div className="mt-5 h-2 rounded-full bg-[#edf1f5]" />
          <p className="mt-4 text-xs text-slate-500"><span className="text-[#0baa70]">〽</span> Sẵn sàng học</p>
          <div className="mt-3 flex items-center justify-between">
            <Link href="/course/comp2010/study-overview" className="rounded-xl border border-[#b9d1e5] px-3 py-2 text-xs font-bold text-[#12568f]">Sổ tay học tập</Link>
            <Link href="/course/comp2010" className="text-xs font-bold text-[#d6222f]">Mở khóa học →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
