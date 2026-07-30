import { Header } from "./header";
import { Icon } from "./icons";
import { StatCard } from "./stat-card";
import { WelcomeCard } from "./welcome-card";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-[#eef4f8] text-slate-900">
      <Header />
      <main className="flex min-w-0 flex-col">
        <header className="dashboard-heading">
          <div className="page-container">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="kicker">VLearn · VinUni AI Thực Chiến</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Không gian học tập VLearn</h1>
                <p className="mt-1 text-sm text-slate-500">Theo dõi tiến độ, học liệu và phần kiến thức cần củng cố tại VinUni AI Thực Chiến.</p>
              </div>
              <div className="course-count">1 khóa học đang theo học</div>
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="page-container space-y-7">
            <WelcomeCard />
            <section className="grid gap-4 sm:grid-cols-2">
              <StatCard icon="book" label="Khóa học" value="1" />
              <StatCard icon="activity" label="Câu hỏi với Tutor" value="27" />
            </section>
            <a href="/course/comp2010/reader?slide=D05-S01" className="course-link" aria-label="Xem khóa học của tôi">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="dashboard-icon"><Icon name="book" className="size-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">Xem khóa học của tôi</p>
                  <p className="truncate text-xs text-slate-500">Mở danh sách đầy đủ các lớp bạn đang theo học.</p>
                </div>
              </div>
              <Icon name="arrow" className="size-5 shrink-0 text-[#8ca4be]" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
