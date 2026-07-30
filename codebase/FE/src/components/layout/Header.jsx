import { Icon } from "../common/Icon.jsx";

export function Header({ onOpenConnections }) {
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
