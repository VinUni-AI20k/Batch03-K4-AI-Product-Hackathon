import Link from "next/link";
import { Header } from "@/components/header";
import { Icon } from "@/components/icons";

const stats = [
  ["file", "Ghi chú", "2"],
  ["highlighter", "Đoạn đánh dấu", "0"],
  ["bot", "Hỏi Tutor", "27"],
  ["target", "Trang cần ôn", "2"],
];

export default function StudyOverviewPage() {
  return (
    <div className="min-h-screen bg-[#eef4f8]">
      <Header />
      <header className="dashboard-heading">
        <div className="page-container flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">VLearn · VinUni AI Thực Chiến</p>
            <h1 className="mt-1 text-2xl font-bold">Sổ tay học tập · COMP2010</h1>
            <p className="mt-1 text-sm text-slate-500">Tổng hợp ghi chú, câu hỏi và những trang cần củng cố.</p>
          </div>
          <Link href="/course/comp2010/reader?slide=D05-S01" className="rounded-xl bg-[#12568f] px-5 py-2.5 text-sm font-bold text-white">Ôn trang ưu tiên →</Link>
        </div>
      </header>
      <main className="page-container space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2">
          {stats.map(([icon, label, value]) => (
            <article key={label} className="stat-card">
              <div className="flex items-center gap-3.5">
                <div className="dashboard-icon"><Icon name={icon} className="size-5" /></div>
                <div><p className="text-[11px] font-bold uppercase text-[#94a3b8]">{label}</p><p className="text-xl font-black">{value}</p></div>
              </div>
            </article>
          ))}
        </section>
        <section>
          <h2 className="text-lg font-black">Các trang nên ôn trước</h2>
          <p className="mt-1 text-sm text-slate-500">Xếp hạng bằng tín hiệu học tập mô phỏng cục bộ.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[8, 38].map((page, index) => (
              <article key={page} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><span className="rounded-full bg-[#f1f5f9] px-2 py-1 text-xs font-black">#{index + 1}</span><span className="rounded-full bg-[#ebfff6] px-2 py-1 text-xs font-bold text-[#08895a]">Ưu tiên</span></div>
                <h3 className="mt-4 font-black">AI Product Thinking</h3>
                <p className="mt-1 text-sm text-slate-500">Slide {page} · Có câu hỏi cần xem lại</p>
                <Link href={`/course/comp2010/reader?slide=D05-S01&page=${page}`} className="mt-4 inline-flex rounded-xl border border-[#b9d1e5] px-3 py-2 text-xs font-bold text-[#12568f]">Ôn lại slide →</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
