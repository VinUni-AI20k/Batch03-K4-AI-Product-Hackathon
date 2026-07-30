import { Icon } from "../common/Icon.jsx";
import { formatEventRange } from "../../utils/formatters.js";

export function MeetingCard({ event }) {
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
