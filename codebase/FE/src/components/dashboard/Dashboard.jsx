import { useDeferredValue, useMemo, useState } from "react";
import { Icon } from "../common/Icon.jsx";
import { QuickActions } from "./QuickActions.jsx";
import { Connections } from "./Connections.jsx";
import { EventCard } from "./EventCard.jsx";
import { TimelineSkeleton } from "./TimelineSkeleton.jsx";
import { TimelineError } from "./TimelineError.jsx";

export function Dashboard({
  events,
  timelineLoading,
  timelineError,
  onRetryTimeline,
  busyItemId,
  platforms,
  activeAction,
  onAction,
  onCalendar,
  onEdit,
  onFlag,
  onTogglePlatform,
  onDisconnectGuild,
  outlookConnecting,
  showConnections,
  setShowConnections,
  googleUser,
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const greetingTitle = useMemo(() => {
    if (!googleUser?.connected) {
      return "Chào mừng bạn đến với StudyPulse AI 👋";
    }
    const name = googleUser.email ? googleUser.email.split("@")[0] : "bạn";
    const hour = new Date().getHours();
    let timeStr = "buổi sáng";
    if (hour >= 11 && hour < 14) timeStr = "buổi trưa";
    else if (hour >= 14 && hour < 18) timeStr = "buổi chiều";
    else if (hour >= 18 || hour < 5) timeStr = "buổi tối";
    return `Chào ${timeStr}, ${name} 👋`;
  }, [googleUser]);

  const greetingSubtitle = useMemo(() => {
    if (!googleUser?.connected) {
      return "Vui lòng đăng nhập bằng Google ở góc trên bên phải để bắt đầu tổng hợp deadline và lịch học.";
    }
    return "Hỏi StudyPulse ở khung chat để bắt đầu tổng hợp deadline và lịch học thật.";
  }, [googleUser]);

  const filteredEvents = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase("vi");
    let list = events;
    if (activeAction === "discord") list = list.filter((event) => event.source === "Discord");
    if (activeAction === "today") list = list.filter((event) => event.date === "Hôm nay");
    if (activeAction === "important") list = list.filter((event) => event.priority === "Khẩn cấp");
    if (!normalized) return list;
    return list.filter((event) => `${event.title} ${event.course} ${event.source}`.toLocaleLowerCase("vi").includes(normalized));
  }, [activeAction, deferredQuery, events]);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });
  }, []);

  return (
    <section className="dashboard-scroll min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-5 md:px-6 lg:px-7" aria-label="Dashboard học tập">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-slate-500 capitalize">{todayStr}</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{greetingTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">{greetingSubtitle}</p>
          </div>
          <button onClick={() => setShowConnections(!showConnections)} className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-blue-300">
            <Icon className="text-lg">settings_input_component</Icon>Quản lý kết nối
          </button>
        </div>

        <div className="mt-6">
          <QuickActions active={activeAction} onSelect={onAction} />
        </div>

        {showConnections ? (
          <div className="mt-6"><Connections platforms={platforms} onToggle={onTogglePlatform} onDisconnectGuild={onDisconnectGuild} outlookConnecting={outlookConnecting} /></div>
        ) : (
          <>
            <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-ink">Dòng thời gian học tập</h2>
                <p className="mt-1 text-xs text-slate-500">{filteredEvents.length} thông báo được tổng hợp từ tool thật</p>
              </div>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</Icon>
                <label className="sr-only" htmlFor="event-search">Tìm thông báo</label>
                <input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm môn học, nguồn..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition-colors focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-60" />
              </div>
            </div>

            {timelineError ? (
              <TimelineError onRetry={onRetryTimeline} />
            ) : timelineLoading ? (
              <TimelineSkeleton />
            ) : (
              <div className="mt-4 space-y-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} onCalendar={onCalendar} onEdit={onEdit} onFlag={onFlag} isBusy={busyItemId === event.id} />
                  ))
                ) : events.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <Icon className="text-4xl text-slate-300">chat</Icon>
                    <p className="mt-3 text-sm font-bold text-slate-600">Chưa có dữ liệu thật nào được tổng hợp</p>
                    <p className="mt-1 text-xs text-slate-400">Bấm một mục nhanh ở trên, hoặc hỏi StudyPulse ở khung chat bên trái.</p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <Icon className="text-4xl text-slate-300">search_off</Icon>
                    <p className="mt-3 text-sm font-bold text-slate-600">Không tìm thấy thông báo phù hợp</p>
                    <button onClick={() => { setQuery(""); onAction("week"); }} className="mt-3 text-xs font-bold text-blue-600">Xóa bộ lọc</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
