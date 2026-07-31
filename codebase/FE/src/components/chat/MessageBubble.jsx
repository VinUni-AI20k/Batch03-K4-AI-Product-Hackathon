import { Icon } from "../common/Icon.jsx";
import { MarkdownText } from "../common/MarkdownText.jsx";
import { MeetingCard } from "./MeetingCard.jsx";

export function MessageBubble({ message, onRetry }) {
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
