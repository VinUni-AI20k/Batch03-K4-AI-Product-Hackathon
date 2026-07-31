import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { initialMessages, initialPlatforms, quickActions } from "./data.js";
import { ApiError } from "./api/client.js";
import { sendChatMessage } from "./api/chat.js";
import { TIMELINE_KEY, confirmCalendar, flagTimelineItem, getTimeline, patchTimelineItem } from "./api/timeline.js";
import {
  disconnectDiscord,
  disconnectGoogle,
  disconnectOutlook,
  getConnections,
  getDiscordInviteUrl,
  getGoogleAuthUrl,
  getOutlookConnectStatus,
  startOutlookConnect,
} from "./api/connections.js";

const REVOCABLE_PLATFORM_IDS = new Set(["gmail", "outlook"]);

const QUICK_ACTION_QUERIES = {
  important: "Kiểm tra giúp mình email quan trọng gần đây trên Gmail.",
  discord: "Có thông báo mới nào từ Discord BTC không?",
  today: "Hôm nay tôi có những cuộc họp nào?",
  week: "Tuần này mình còn deadline nào chưa nộp?",
};

function formatTime() {
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

// outlook-local-mcp's device-code message reads e.g. "To sign in, use a web
// browser to open the page https://microsoft.com/devicelogin and enter the
// code ABCD1234 to authenticate." — pull out the URL + code so the UI can
// open the tab itself and show a copyable code instead of raw prose.
function parseOutlookDeviceCode(message) {
  const match = /open the page (\S+) and enter the code (\S+) to authenticate/.exec(message ?? "");
  return match ? { url: match[1], code: match[2] } : null;
}

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
        <button className="relative grid size-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100" aria-label="Thông báo">
          <Icon>notifications</Icon>
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500" />
        </button>
        <button onClick={onOpenConnections} className="flex items-center gap-3 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100">
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

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
    >
      {children}
    </a>
  ),
  code: ({ children }) => <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-100 last:mb-0">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-slate-300 pl-3 italic text-slate-500 last:mb-0">{children}</blockquote>
  ),
  h1: ({ children }) => <p className="mb-1 text-base font-extrabold">{children}</p>,
  h2: ({ children }) => <p className="mb-1 text-[15px] font-extrabold">{children}</p>,
  h3: ({ children }) => <p className="mb-1 text-sm font-extrabold">{children}</p>,
  hr: () => <hr className="my-2 border-slate-200" />,
};

function MarkdownText({ text }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {text}
    </ReactMarkdown>
  );
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const eventDateFormat = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const eventTimeFormat = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" });

function formatEventRange(event) {
  if (!event.start) return "";
  if (DATE_ONLY_RE.test(event.start)) {
    return `Cả ngày · ${eventDateFormat.format(new Date(`${event.start}T00:00:00`))}`;
  }
  const start = new Date(event.start);
  const datePart = eventDateFormat.format(start);
  const startTime = eventTimeFormat.format(start);
  const endTime = event.end && !DATE_ONLY_RE.test(event.end) ? eventTimeFormat.format(new Date(event.end)) : null;
  return endTime ? `${datePart} · ${startTime} - ${endTime}` : `${datePart} · ${startTime}`;
}

function MeetingCard({ event }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="text-lg">event</Icon>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{event.summary || "(Không có tiêu đề)"}</p>
          <p className="mt-0.5 text-xs text-slate-500">{formatEventRange(event)}</p>
          {event.location ? <p className="mt-0.5 truncate text-xs text-slate-500">{event.location}</p> : null}
        </div>
      </div>
      {event.meet_link ? (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="grid size-7 place-items-center rounded-full bg-white shadow-sm">
              <Icon className="text-base text-emerald-600">videocam</Icon>
            </span>
            Google Meet
          </div>
          <a
            href={event.meet_link}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
          >
            Tham gia
          </a>
        </div>
      ) : null}
      {event.attachments?.length || event.html_link ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 px-4 py-2">
          {event.attachments?.map((attachment) => (
            <a
              key={attachment.url}
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
            >
              <Icon className="text-sm">description</Icon>
              {attachment.title || "Tài liệu"}
            </a>
          ))}
          {event.html_link ? (
            <a href={event.html_link} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-slate-500 hover:underline">
              Xem trên Google Calendar
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MessageBubble({ message, onRetry }) {
  const isUser = message.role === "user";
  const isClarification = message.needsClarification;
  const isError = message.isError;

  return (
    <div className={`message-enter flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
          <Icon className="text-lg">neurology</Icon>
        </div>
      ) : null}
      <div className={`max-w-[82%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-left text-sm leading-6 ${
            isUser
              ? "rounded-tr-sm bg-blue-600 text-white"
              : isError
                ? "rounded-tl-sm bg-red-50 text-red-700"
                : isClarification
                  ? "rounded-tl-sm bg-amber-50 text-amber-800"
                  : "rounded-tl-sm bg-slate-100 text-slate-700"
          }`}
        >
          {message.loading ? (
            <span className="flex items-center gap-2">
              <span className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" aria-hidden="true" />
              StudyPulse đang xử lý…
            </span>
          ) : isUser ? (
            message.text
          ) : (
            <MarkdownText text={message.text} />
          )}
        </div>
        {!isUser && message.calendarEvents?.length ? (
          <div className="mt-2 space-y-2 text-left">
            {message.calendarEvents.map((event) => (
              <MeetingCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
        {message.isError && message.retryText ? (
          <button
            onClick={() => onRetry(message.retryText)}
            className="mt-1.5 rounded-lg px-2 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            Thử lại
          </button>
        ) : (
          <p className="mt-1.5 text-[10px] font-medium text-slate-400">{message.time}</p>
        )}
      </div>
    </div>
  );
}

function ChatPanel({ messages, onSend, isSending }) {
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
    if (!text || isSending) return;
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
          <MessageBubble key={message.id} message={message} onRetry={onSend} />
        ))}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      <form onSubmit={submit} className="border-t border-slate-100 bg-white p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
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
          <button
            type="submit"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            disabled={!value.trim() || isSending}
            aria-label="Gửi"
          >
            {isSending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            ) : (
              <Icon className="text-xl">arrow_upward</Icon>
            )}
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
          className={`flex items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-colors hover:-translate-y-0.5 hover:shadow-md ${
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

function EventCard({ event, onCalendar, onEdit, onFlag, isBusy }) {
  const urgent = event.priority === "Khẩn cấp";
  const review = !event.verified;

  return (
    <article className={`event-card card-enter rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md ${review ? "border-amber-200" : "border-slate-200"}`}>
      <div className="flex gap-3">
        <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
          event.type === "deadline" ? "bg-orange-50 text-orange-600" : review ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
        }`}>
          <Icon>{event.type === "deadline" ? "assignment" : review ? "question_mark" : "event"}</Icon>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{event.course || "Chưa rõ môn học"}</p>
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
            <span className="hidden flex-1 sm:block" />
            <button onClick={() => onEdit(event)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100">
              Chỉnh sửa
            </button>
            <button onClick={() => onFlag(event.id)} disabled={isBusy} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40">
              Đánh dấu sai
            </button>
            <button
              onClick={() => onCalendar(event.id)}
              disabled={isBusy}
              className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Icon className="text-base">calendar_add_on</Icon>Thêm vào lịch
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Connections({ platforms, onToggle, onDisconnectGuild, outlookConnecting }) {
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
        {platforms.map((platform) => {
          const isDiscord = platform.id === "discord";
          const isOutlook = platform.id === "outlook";
          const buttonLabel =
            isOutlook && outlookConnecting
              ? "Đang chờ đăng nhập…"
              : platform.connected
                ? isDiscord
                  ? "Kết nối"
                  : REVOCABLE_PLATFORM_IDS.has(platform.id)
                    ? "Hủy kết nối"
                    : "Quản lý"
                : "Kết nối";
          const isDanger = platform.connected && !isDiscord && REVOCABLE_PLATFORM_IDS.has(platform.id);
          return (
            <div key={platform.id} className="py-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600"><Icon>{platform.icon}</Icon></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink">{platform.name}</p>
                    <span className={`size-2 rounded-full ${platform.connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {isDiscord && platform.guilds?.length ? platform.guilds.map((g) => g.name).join(", ") : platform.scope}
                  </p>
                </div>
                <button
                  onClick={() => onToggle(platform.id)}
                  disabled={platform.id === "zalo" || (isOutlook && outlookConnecting)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                    isDanger
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : platform.connected
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
              {isDiscord && platform.guilds?.length ? (
                <ul className="ml-14 mt-2 space-y-1.5">
                  {platform.guilds.map((guild) => (
                    <li key={guild.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-1.5">
                      <span className="truncate text-xs font-semibold text-slate-600">{guild.name}</span>
                      <button
                        onClick={() => onDisconnectGuild(guild.id, guild.name)}
                        className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Hủy kết nối
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
        <Icon className="text-xl">shield_lock</Icon>
        <p className="text-xs leading-5"><strong>Quyền riêng tư:</strong> StudyPulse chỉ đọc nguồn bạn cấp quyền và không tự gửi email hay tin nhắn.</p>
      </div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="mt-4 space-y-3" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <div className="size-11 shrink-0 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-24 rounded bg-slate-100" />
              <div className="h-3.5 w-2/3 rounded bg-slate-100" />
              <div className="h-2.5 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineError({ onRetry }) {
  return (
    <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
      <Icon className="text-4xl text-red-400">error</Icon>
      <p className="mt-3 text-sm font-bold text-red-700">Không tải được dòng thời gian từ backend.</p>
      <p className="mt-1 text-xs text-red-500">Kiểm tra server đang chạy tại VITE_API_BASE_URL rồi thử lại.</p>
      <button onClick={onRetry} className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700">
        Thử lại
      </button>
    </div>
  );
}

function Dashboard({
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
}) {
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
            <p className="mt-2 text-sm text-slate-500">Hỏi StudyPulse ở khung chat để bắt đầu tổng hợp deadline và lịch học thật.</p>
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

function EditDialog({ event, onClose, onSave }) {
  const [time, setTime] = useState(event?.time ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTime(event?.time ?? "");
    setIsSaving(false);
  }, [event]);

  if (!event) return null;

  const submit = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsSaving(true);
    await onSave(event.id, time);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
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
          <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSaving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

function OutlookDeviceCodeDialog({ deviceCode, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [deviceCode]);

  if (!deviceCode) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(deviceCode.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the code is
      // still shown on screen for the user to type manually.
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="outlook-device-code-title">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Đăng nhập Outlook</p>
            <h2 id="outlook-device-code-title" className="mt-1 text-xl font-extrabold text-ink">Nhập mã xác thực</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Đóng"><Icon>close</Icon></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Mình đã mở trang đăng nhập Microsoft ở một tab mới. Dán mã dưới đây vào đó rồi đăng nhập bằng tài khoản Outlook của bạn:
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-4">
          <p className="flex-1 text-center font-mono text-2xl font-extrabold tracking-[0.2em] text-ink">{deviceCode.code}</p>
          <button
            type="button"
            onClick={copyCode}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${copied ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {copied ? "Đã copy" : "Copy mã"}
          </button>
        </div>
        <a
          href={deviceCode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-bold text-blue-600 hover:underline"
        >
          Tab không tự mở? Bấm vào đây: {deviceCode.url}
        </a>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <Icon className="animate-spin text-base">progress_activity</Icon>Đang chờ bạn đăng nhập xong…
        </div>
      </div>
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
  const [conversationId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState(initialMessages);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [activeAction, setActiveAction] = useState("week");
  const [showConnections, setShowConnections] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileView, setMobileView] = useState("dashboard");
  const [seededActions, setSeededActions] = useState(() => new Set());
  const [busyItemId, setBusyItemId] = useState(null);
  const [outlookConnecting, setOutlookConnecting] = useState(false);
  const [outlookDeviceCode, setOutlookDeviceCode] = useState(null);

  const {
    data: events = [],
    error: timelineError,
    isLoading: timelineLoading,
    mutate: mutateTimeline,
  } = useSWR(TIMELINE_KEY, getTimeline);

  const { trigger: triggerChat, isMutating: isSending } = useSWRMutation("studypulse-chat", (_key, { arg }) => sendChatMessage(arg));

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };

  const refreshConnections = async () => {
    try {
      const data = await getConnections();
      setPlatforms((current) =>
        current.map((platform) => {
          if (platform.id === "gmail") return { ...platform, connected: data.google.connected };
          if (platform.id === "discord") return { ...platform, connected: data.discord.connected, guilds: data.discord.guilds };
          if (platform.id === "outlook") return { ...platform, connected: data.outlook.connected };
          return platform;
        }),
      );
    } catch {
      // Backend may be offline; leave platforms as-is (mock state).
    }
  };

  // "pending"/"starting" mean the backend still has the sign-in container
  // open, waiting on the device-code login to finish — anything else is terminal.
  const applyOutlookConnectResult = (result) => {
    if (result.status === "connected") {
      setPlatforms((current) => current.map((platform) => (platform.id === "outlook" ? { ...platform, connected: true } : platform)));
      notify(result.message || "Outlook đã kết nối.");
      setOutlookConnecting(false);
      setOutlookDeviceCode(null);
    } else if (result.status === "failed" || result.status === "timeout") {
      notify(result.message || "Kết nối Outlook thất bại, thử lại sau.");
      setOutlookConnecting(false);
      setOutlookDeviceCode(null);
    } else if (result.status === "pending") {
      setOutlookConnecting(true);
      const parsed = parseOutlookDeviceCode(result.message);
      if (parsed) {
        setOutlookDeviceCode((current) => {
          if (current?.code === parsed.code) return current; // same code already shown/opened
          window.open(parsed.url, "_blank", "noopener,noreferrer");
          return parsed;
        });
      } else {
        notify(result.message || "Cần đăng nhập Outlook.");
      }
    } else {
      setOutlookConnecting(true);
    }
  };

  const pollOutlookConnectStatus = async () => {
    for (;;) {
      await new Promise((resolve) => window.setTimeout(resolve, 4000));
      let result;
      try {
        result = await getOutlookConnectStatus();
      } catch {
        continue; // backend hiccup mid-poll — keep trying, don't give up the wait
      }
      applyOutlookConnectResult(result);
      if (result.status !== "pending" && result.status !== "starting") return;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get("google_connected");
    if (googleConnected !== null) {
      notify(googleConnected === "1" ? "Đã kết nối Gmail & Google Calendar" : "Kết nối Gmail thất bại, thử lại sau.");
      params.delete("google_connected");
      params.delete("reason");
      const query = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (query ? `?${query}` : ""));
    }
    refreshConnections();
  }, []);

  useEffect(() => {
    // Re-check whenever the panel is opened — connecting Gmail (full-page
    // redirect) or Discord (opened in a new tab, no callback to us) both
    // happen outside this app, so the one-time fetch on initial load goes
    // stale as soon as either completes.
    if (showConnections) refreshConnections();
  }, [showConnections]);

  const sendMessage = async (text) => {
    const userMessageId = crypto.randomUUID();
    const loadingMessageId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: "user", text, time: formatTime() },
      { id: loadingMessageId, role: "assistant", text: "", time: "", loading: true },
    ]);

    try {
      const data = await triggerChat({ conversationId, userQuery: text });
      setMessages((current) =>
        current.map((message) =>
          message.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                text: data.response_text,
                time: formatTime(),
                needsClarification: data.requires_clarification,
                calendarEvents: data.calendar_events,
              }
            : message,
        ),
      );
      if (data.timeline_items_referenced?.length) {
        mutateTimeline();
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Không thể kết nối tới StudyPulse.";
      setMessages((current) =>
        current.map((existing) =>
          existing.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                text: `${message} Kiểm tra backend đã chạy chưa rồi thử lại.`,
                time: formatTime(),
                isError: true,
                retryText: text,
              }
            : existing,
        ),
      );
    }
  };

  const handleAction = (id) => {
    setActiveAction(id);
    setShowConnections(false);
    if (!seededActions.has(id) && QUICK_ACTION_QUERIES[id]) {
      setSeededActions((current) => new Set(current).add(id));
      sendMessage(QUICK_ACTION_QUERIES[id]);
    }
  };

  const togglePlatform = async (id) => {
    if (id === "gmail") {
      const gmail = platforms.find((platform) => platform.id === "gmail");
      if (gmail?.connected) {
        const confirmed = window.confirm(
          "Hủy kết nối Gmail & Google Calendar?\n\nStudyPulse sẽ không thể đọc email hoặc lịch của bạn cho đến khi bạn kết nối lại.",
        );
        if (!confirmed) return;
        try {
          await disconnectGoogle();
          setPlatforms((current) => current.map((platform) => (platform.id === "gmail" ? { ...platform, connected: false } : platform)));
          notify("Đã hủy kết nối Gmail & Google Calendar");
        } catch (err) {
          notify(err instanceof ApiError ? err.message : "Không thể hủy kết nối, thử lại sau.");
        }
        return;
      }
      try {
        const authUrl = await getGoogleAuthUrl();
        window.location.href = authUrl;
      } catch (err) {
        notify(err instanceof ApiError ? err.message : "Không thể bắt đầu kết nối Gmail, kiểm tra backend.");
      }
      return;
    }

    if (id === "outlook") {
      const outlook = platforms.find((platform) => platform.id === "outlook");
      if (outlook?.connected) {
        const confirmed = window.confirm(
          "Hủy kết nối Outlook?\n\nStudyPulse sẽ không thể đọc email hoặc lịch Outlook của bạn cho đến khi bạn kết nối lại.",
        );
        if (!confirmed) return;
        try {
          await disconnectOutlook();
          setPlatforms((current) => current.map((platform) => (platform.id === "outlook" ? { ...platform, connected: false } : platform)));
          notify("Đã hủy kết nối Outlook");
        } catch (err) {
          notify(err instanceof ApiError ? err.message : "Không thể hủy kết nối, thử lại sau.");
        }
        return;
      }

      // No browser-redirect OAuth here — outlook-local-mcp's Docker container
      // owns its own device-code sign-in. Clicking this actually triggers
      // that sign-in (backend keeps one container open across the wait, see
      // outlook_connection.py) rather than just checking a cached status.
      setOutlookConnecting(true);
      try {
        const initial = await startOutlookConnect();
        applyOutlookConnectResult(initial);
        if (initial.status === "pending" || initial.status === "starting") {
          await pollOutlookConnectStatus();
        }
      } catch (err) {
        notify(err instanceof ApiError ? err.message : "Không thể bắt đầu đăng nhập Outlook, kiểm tra backend.");
        setOutlookConnecting(false);
      }
      return;
    }

    if (id === "discord") {
      // Bots can be in several servers at once, so the row's main button
      // always opens the invite flow (to add another one) — disconnecting a
      // specific server happens per-row in the guild list below, not here.
      try {
        const inviteUrl = await getDiscordInviteUrl();
        window.open(inviteUrl, "_blank", "noopener,noreferrer");
        notify("Cần quản trị viên server đồng ý mời bot. Sau khi mời xong, mở lại Quản lý kết nối để kiểm tra.");
      } catch (err) {
        notify(err instanceof ApiError ? err.message : "Không thể lấy link mời bot, kiểm tra backend.");
      }
      return;
    }

    setPlatforms((current) => current.map((platform) => (platform.id === id ? { ...platform, connected: true } : platform)));
    notify("Đã kết nối nền tảng thành công");
  };

  const disconnectDiscordGuild = async (guildId, guildName) => {
    const confirmed = window.confirm(
      `Hủy kết nối server Discord "${guildName}"?\n\nBot sẽ rời khỏi server này và StudyPulse sẽ không thể đọc tin nhắn ở đó nữa cho đến khi được mời lại.`,
    );
    if (!confirmed) return;
    try {
      await disconnectDiscord(guildId);
      setPlatforms((current) =>
        current.map((platform) => {
          if (platform.id !== "discord") return platform;
          const guilds = (platform.guilds || []).filter((guild) => guild.id !== guildId);
          return { ...platform, guilds, connected: guilds.length > 0 };
        }),
      );
      notify(`Đã hủy kết nối server "${guildName}"`);
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể hủy kết nối, thử lại sau.");
    }
  };

  const flagEvent = async (id) => {
    setBusyItemId(id);
    try {
      await flagTimelineItem(id);
      await mutateTimeline();
      notify("Đã đánh dấu sai và chuyển cho TA kiểm tra");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể đánh dấu mục này, thử lại sau.");
    } finally {
      setBusyItemId(null);
    }
  };

  const addToCalendar = async (id) => {
    setBusyItemId(id);
    try {
      const result = await confirmCalendar(id);
      notify(result.detail ? `Đã thêm vào Google Calendar: ${result.detail}` : "Đã thêm sự kiện vào Google Calendar");
      await mutateTimeline();
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể thêm vào lịch, thử lại sau.");
    } finally {
      setBusyItemId(null);
    }
  };

  const saveEvent = async (id, time) => {
    try {
      await patchTimelineItem(id, { time });
      await mutateTimeline();
      setEditingEvent(null);
      notify("Đã lưu thay đổi của bạn");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Không thể lưu thay đổi, thử lại sau.");
    }
  };

  const dashboardProps = {
    events,
    timelineLoading,
    timelineError,
    onRetryTimeline: () => mutateTimeline(),
    busyItemId,
    platforms,
    activeAction,
    onAction: handleAction,
    onCalendar: addToCalendar,
    onEdit: setEditingEvent,
    onFlag: flagEvent,
    onTogglePlatform: togglePlatform,
    onDisconnectGuild: disconnectDiscordGuild,
    outlookConnecting,
    showConnections,
    setShowConnections,
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
      <Header onOpenConnections={() => { setShowConnections(true); setMobileView("dashboard"); }} />
      <div className="hidden min-h-0 flex-1 lg:flex">
        <ChatPanel messages={messages} onSend={sendMessage} isSending={isSending} />
        <Dashboard {...dashboardProps} />
      </div>
      <div className="min-h-0 flex-1 lg:hidden">
        {mobileView === "chat" ? (
          <ChatPanel messages={messages} onSend={sendMessage} isSending={isSending} />
        ) : (
          <Dashboard {...dashboardProps} />
        )}
      </div>
      <nav className="grid h-16 shrink-0 grid-cols-2 border-t border-slate-200 bg-white lg:hidden" aria-label="Điều hướng di động">
        <button onClick={() => setMobileView("dashboard")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "dashboard" ? "text-blue-600" : "text-slate-400"}`}><Icon>dashboard</Icon>Tổng quan</button>
        <button onClick={() => setMobileView("chat")} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${mobileView === "chat" ? "text-blue-600" : "text-slate-400"}`}><Icon>smart_toy</Icon>Trợ lý AI</button>
      </nav>
      <EditDialog event={editingEvent} onClose={() => setEditingEvent(null)} onSave={saveEvent} />
      <OutlookDeviceCodeDialog deviceCode={outlookDeviceCode} onClose={() => setOutlookDeviceCode(null)} />
      {toast ? <Toast text={toast} /> : null}
    </main>
  );
}
