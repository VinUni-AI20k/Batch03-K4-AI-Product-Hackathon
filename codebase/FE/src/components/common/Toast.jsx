import { Icon } from "./Icon.jsx";

export function Toast({ text, type = "success" }) {
  if (!text) return null;

  const isError = type === "error";
  const isInfo = type === "info";
  const iconName = isError ? "error" : isInfo ? "info" : "check_circle";
  const iconColor = isError ? "text-red-400" : isInfo ? "text-blue-400" : "text-emerald-400";

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      <Icon className={`text-xl ${iconColor}`}>{iconName}</Icon>
      <span>{text}</span>
    </div>
  );
}
