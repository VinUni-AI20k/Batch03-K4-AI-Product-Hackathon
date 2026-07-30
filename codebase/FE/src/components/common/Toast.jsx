import { Icon } from "./Icon.jsx";

export function Toast({ text }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
      <Icon className="text-xl text-emerald-400">check_circle</Icon>{text}
    </div>
  );
}
