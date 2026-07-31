import { Icon } from "./Icons";

export default function Header({ slide }) {
  const progress = slide
    ? Math.round((slide.id / slide.totalPages) * 100)
    : 0;

  return (
    <header className="flex h-[82px] items-center justify-between border-b border-white/[0.07] bg-[#0D121E] px-8">
      <div className="flex min-w-0 items-center gap-7">
        <div className="flex shrink-0 items-center gap-2.5 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40">
            <Icon name="book" className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">VLearn</span>
        </div>

        <nav className="flex min-w-0 items-center gap-2 text-sm">
          <a className="text-blue-400 transition hover:text-blue-300" href="#">
            AI in Action
          </a>
          <span className="text-slate-600">/</span>
          <a className="text-blue-400 transition hover:text-blue-300" href="#">
            VLearn
          </a>
          <span className="text-slate-600">/</span>
          <span className="truncate font-medium text-slate-200">
            {slide?.contextLabel || "Thư viện tài liệu"}
          </span>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-7">
        {slide ? <div className="w-36">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Trang {slide.id} / {slide.totalPages}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div> : null}

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-950/30">
            <Icon name="cap" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Minh Anh</p>
            <p className="mt-0.5 text-[11px] text-slate-500">SE1842 · Khóa 4</p>
          </div>
        </div>
      </div>
    </header>
  );
}
