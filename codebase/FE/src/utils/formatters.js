export function formatTime() {
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const eventDateFormat = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const eventTimeFormat = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" });

export function formatEventRange(event) {
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
