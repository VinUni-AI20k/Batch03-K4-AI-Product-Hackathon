import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { initialEvents, initialMessages, initialPlatforms, quickActions } from "./data.js";

const Icon = ({ children, className = "" }) => (
  <span className={`material-symbols-rounded select-none ${className}`} aria-hidden="true">
    {children}
  </span>
);

function Header({ onOpenConnections }) {
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
        <button className="relative grid size-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100" aria-label="Thông báo">
          <Icon>notifications</Icon>
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500" />
        </button>
        <button onClick={onOpenConnections} className="flex items-center gap-3 rounded-full p-1 pr-2 transition hover:bg-slate-100">
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-extrabold text-white">M</div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold text-ink">Minh Trương</p>
            <p className="text-[11px] text-slate-500">Học viên · Khóa 4</p>
          </div>
          <Icon className="hidden text-lg text-slate-400 sm:block">expand_more</Icon>
        </button>
      </div>
    </header>
  );
}

function ChatPanel({ messages, onSend }) {
  const [value, setValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages.length]);

  const submit = (event) => {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white lg:max-w-[40%] lg:border-r lg:border-slate-200/80" aria-label="Trò chuyện với StudyPulse">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-extrabold text-ink">Trợ lý của bạn</h2>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" />
            Sẵn sàng hỗ trợ
          </div>
        </div>
        <button className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Tùy chọn trò chuyện">
          <Icon>more_horiz</Icon>
        </button>
      </div>

      <div className="chat-scroll flex-1 space-y-5 overflow-y-auto px-5 py-6" aria-live="polite">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-blue-700">
            <Icon className="text-lg">verified_user</Icon>
            Phạm vi hỗ trợ
          </div>
          <p className="text-sm leading-6 text-slate-600">Mình tổng hợp lịch, deadline và link học. Mình không nộp bài hoặc trả lời tin nhắn thay bạn.</p>
        </div>
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            {message.role === "assistant" ? (
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                <Icon className="text-lg">neurology</Icon>
              </div>
            ) : null}
            <div className={`max-w-[82%] ${message.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block rounded-2xl px-4 py-3 text-left text-sm leading-6 ${
                message.role === "user"
                  ? "rounded-tr-sm bg-blue-600 text-white"
                  : "rounded-tl-sm bg-slate-100 text-slate-700"
              }`}>
                {message.text}
              </div>
              <p className="mt-1.5 text-[10px] font-medium text-slate-400">{message.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      <form onSubmit={submit} className="border-t border-slate-100 bg-white p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
          <button type="button" className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-white" aria-label="Đính kèm">
            <Icon>attach_file</Icon>
          </button>
          <label className="sr-only" htmlFor="chat-input">Nhập câu hỏi</label>
          <textarea
            id="chat-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) submit(event);
            }}
            rows="1"
            placeholder="Hỏi về lịch hoặc deadline..."
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-ink outline-none placeholder:text-slate-400"
          />
          <button type="submit" className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40" disabled={!value.trim()} aria-label="Gửi">
            <Icon className="text-xl">arrow_upward</Icon>
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">Kết quả AI có thể chưa chính xác. Hãy kiểm tra nguồn gốc trước khi xác nhận.</p>
      </form>
    </section>
  );
}

function QuickActions({ active, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action.id)}
          className={`flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
            active === action.id ? "border-blue-300 ring-4 ring-blue-50" : "border-slate-200"
          }`}
        >
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${action.color}`}>
            <Icon className="text-xl">{action.icon}</Icon>
          </span>
          <span className="text-xs font-bold leading-4 text-slate-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

function EventCard({ event, onCalendar, onEdit, onFlag }) {
  const urgent = event.priority === "Khẩn cấp";
  const review = !event.verified;

  return (
    <article className={`event-card rounded-2xl border bg-white p-4 transition hover:shadow-md ${review ? "border-amber-200" : "border-slate-200"}`}>
      <div className="flex gap-3">
        <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
          event.type === "deadline" ? "bg-orange-50 text-orange-600" : review ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
        }`}>
          <Icon>{event.type === "deadline" ? "assignment" : review ? "question_mark" : "event"}</Icon>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{event.course}</p>
              <h3 className="mt-1 text-sm font-extrabold leading-5 text-ink">{event.title}</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
              urgent ? "bg-red-50 text-red-600" : review ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
            }`}>
              {event.priority}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-bold text-slate-700"><Icon className="text-base">schedule</Icon>{event.date} · {event.time}</span>
            <span className="flex items-center gap-1.5"><Icon className="text-base">{event.sourceIcon}</Icon>{event.source}</span>
            <span className={`flex items-center gap-1.5 ${review ? "text-amber-700" : "text-emerald-700"}`}>
              <Icon className="text-base">{review ? "warning" : "verified"}</Icon>{event.confidence}% tin cậy
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{event.detail}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800">
              <Icon className="text-base">open_in_new</Icon>{event.action}
            </button>
            <span className="hidden flex-1 sm:block" />
            <button onClick={() => onEdit(event)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100">
              Chỉnh sửa
            </button>
            <button onClick={() => onFlag(event.id)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600">
              Đánh dấu sai
            </button>
            <button onClick={() => onCalendar(event.id)} className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
              <Icon className="text-base">calendar_add_on</Icon>Thêm vào lịch
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Connections({ platforms, onToggle }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Thiết lập dữ liệu</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">Kết nối nền tảng</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Cấp quyền để StudyPulse gom thông báo học tập về một nơi.</p>
        </div>
        <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon>hub</Icon></div>
      </div>
      <div className="mt-6 divide-y divide-slate-100">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center gap-3 py-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600"><Icon>{platform.icon}</Icon></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-ink">{platform.name}</p>
                <span className={`size-2 rounded-full ${platform.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
              </div>
              <p className="truncate text-xs text-slate-500">{platform.scope}</p>
            </div>
            <button
              onClick={() => onToggle(platform.id)}
              disabled={platform.id === "zalo"}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                platform.connected ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              }`}
            >
              {platform.connected ? "Quản lý" : "Kết nối"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
        <Icon className="text-xl">shield_lock</Icon>
        <p className="text-xs leading-5"><strong>Quyền riêng tư:</strong> StudyPulse chỉ đọc nguồn bạn cấp quyền và không tự gửi email hay tin nhắn.</p>
      </div>
    </div>
  );
}

function Dashboard({ events, platforms, activeAction, onAction, onCalendar, onEdit, onFlag, onTogglePlatform, showConnections, setShowConnections }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filteredEvents = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase("vi");
    let list = events;
    if (activeAction === "discord") list = list.filter((event) => event.source === "Discord");
    if (activeAction === "today") list = list.filter((event) => event.date === "Hôm nay");
    if (activeAction === "important") list = list.filter((event) => event.priority === "Khẩn cấp");
    if (!normalized) return list;
    return list.filter((event) => `${event.title} ${event.course} ${event.source}`.toLocaleLowerCase("vi").includes(normalized));
  }, [activeAction, deferredQuery, events]);

  return (
    <section className="dashboard-scroll min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-5 md:px-6 lg:px-7" aria-label="Dashboard học tập">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-slate-500">Thứ Năm, 30 tháng 7</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">Chào buổi chiều, Minh 👋</h2>
            <p className="mt-2 text-sm text-slate-500">Bạn có <strong className="text-red-600">1 deadline khẩn cấp</strong> cần xử lý hôm nay.</p>
          </div>
          <button onClick={() => setShowConnections(!showConnections)} className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:border-blue-300">
            <Icon className="text-lg">settings_input_component</Icon>Quản lý kết nối
          </button>
        </div>

        <div className="mt-6">
          <QuickActions active={activeAction} onSelect={onAction} />
        </div>

        {showConnections ? (
          <div className="mt-6"><Connections platforms={platforms} onToggle={onTogglePlatform} /></div>
        ) : (
          <>
            <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-ink">Dòng thời gian học tập</h2>
                <p className="mt-1 text-xs text-slate-500">{filteredEvents.length} thông báo được tổng hợp · Cập nhật 2 phút trước</p>
              </div>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">search</Icon>
                <label className="sr-only" htmlFor="event-search">Tìm thông báo</label>
                <input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm môn học, nguồn..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-60" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onCalendar={onCalendar} onEdit={onEdit} onFlag={onFlag} />
              )) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Icon className="text-4xl text-slate-300">search_off</Icon>
                  <p className="mt-3 text-sm font-bold text-slate-600">Không tìm thấy thông báo phù hợp</p>
                  <button onClick={() => { setQuery(""); onAction("week"); }} className="mt-3 text-xs font-bold text-blue-600">Xóa bộ lọc</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function EditDialog({ event, onClose, onSave }) {
  const [time, setTime] = useState(event?.time ?? "");
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <form onSubmit={(e) => { e.preventDefault(); onSave(event.id, time); }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Human in the loop</p>
            <h2 id="edit-title" className="mt-1 text-xl font-extrabold text-ink">Chỉnh sửa thời gian</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Đóng"><Icon>close</Icon></button>
        </div>
        <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{event.title}</p>
        <label htmlFor="event-time" className="mt-5 block text-xs font-bold text-slate-600">Thời gian chính xác</label>
        <input id="event-time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" autoFocus />
        <p className="mt-2 text-xs leading-5 text-slate-400">Thay đổi của bạn sẽ được ghi nhận để cải thiện lần trích xuất sau.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Hủy</button>
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
}

function Toast({ text }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      <Icon className="text-xl text-emerald-400">check_circle</Icon>{text}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [events, setEvents] = useState(initialEvents);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [activeAction, setActiveAction] = useState("week");
  const [showConnections, setShowConnections] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileView, setMobileView] = useState("dashboard");

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };

  const sendMessage = (text) => {
    const time = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    const isOutOfScope = /bài luận|làm bài|viết hộ|giải bài/i.test(text);
    const reply = isOutOfScope
      ? "Mình chỉ hỗ trợ quản lý lịch và deadline. Bạn có muốn mình tìm thông báo hoặc tài liệu liên quan trong Gmail/Discord không?"
      : "Mình tìm thấy 2 thông báo liên quan. Kết quả đã được lọc ở Dashboard; bạn có thể mở nguồn gốc để kiểm chứng.";
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text, time },
      { id: Date.now() + 1, role: "assistant", text: reply, time },
    ]);
  };

  const handleAction = (id) => {
    setActiveAction(id);
    setShowConnections(false);
  };

  const togglePlatform = (id) => {
    setPlatforms((current) => current.map((platform) => platform.id === id ? { ...platform, connected: true } : platform));
    notify("Đã kết nối nền tảng thành công");
  };

  const flagEvent = (id) => {
    setEvents((current) => current.filter((event) => event.id !== id));
    notify("Đã đánh dấu sai và chuyển cho TA kiểm tra");
  };

  const saveEvent = (id, time) => {
    setEvents((current) => current.map((event) => event.id === id ? { ...event, time, confidence: 100, verified: true, priority: "Đã xác nhận" } : event));
    setEditingEvent(null);
    notify("Đã lưu thay đổi của bạn");
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
      <Header onOpenConnections={() => { setShowConnections(true); setMobileView("dashboard"); }} />
      <div className="hidden min-h-0 flex-1 lg:flex">
        <ChatPanel messages={messages} onSend={sendMessage} />
        <Dashboard events={events} platforms={platforms} activeAction={activeAction} onAction={handleAction} onCalendar={() => notify("Đã thêm sự kiện vào Google Calendar")} onEdit={setEditingEvent} onFlag={flagEvent} onTogglePlatform={togglePlatform} showConnections={showConnections} setShowConnections={setShowConnections} />
      </div>
      <div className="min-h-0 flex-1 lg:hidden">
        {mobileView === "chat" ? (
          <ChatPanel messages={messages} onSend={sendMessage} />
        ) : (
          <Dashboard events={events} platforms={platforms} activeAction={activeAction} onAction={handleAction} onCalendar={() => notify("Đã thêm sự kiện vào Google Calendar")} onEdit={setEditingEvent} onFlag={flagEvent} onTogglePlatform={togglePlatform} showConnections={showConnections} setShowConnections={setShowConnections} />
        )}
      </div>
      <nav className="grid h-16 shrink-0 grid-cols-2 border-t border-slate-200 bg-white lg:hidden" aria-label="Điều hướng di động">
        <button onClick={() => setMobileView("dashboard")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "dashboard" ? "text-blue-600" : "text-slate-400"}`}><Icon>dashboard</Icon>Tổng quan</button>
        <button onClick={() => setMobileView("chat")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "chat" ? "text-blue-600" : "text-slate-400"}`}><Icon>smart_toy</Icon>Trợ lý AI</button>
      </nav>
      <EditDialog event={editingEvent} onClose={() => setEditingEvent(null)} onSave={saveEvent} />
      {toast ? <Toast text={toast} /> : null}
    </main>
  );
}



