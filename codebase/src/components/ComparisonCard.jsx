function MiniDiagram({ type }) {
  const loose = type === "loose";

  return (
    <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0B101A]/70 p-4">
      <div className="flex items-center justify-center gap-3">
        <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200">
          Module A
        </div>
        <div className="min-w-[74px] text-center">
          <div className={loose ? "text-emerald-400" : "text-red-400"}>
            {loose ? "⟶ API ⟶" : "⟶ depends ⟶"}
          </div>
          <p className="mt-1 text-[9px] uppercase tracking-wider text-slate-600">
            {loose ? "contract" : "direct"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200">
          Module B
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-500">
        {loose
          ? "Thay đổi nội bộ không phá vỡ contract"
          : "Thay đổi A có thể buộc B sửa theo"}
      </p>
    </div>
  );
}

export default function ComparisonCard({
  tone,
  title,
  description,
  bullets,
  highlighted
}) {
  const good = tone === "good";

  return (
    <article
      className={`rounded-2xl border p-5 ${
        good
          ? "border-emerald-500/20 bg-emerald-500/[0.055]"
          : "border-red-500/20 bg-red-500/[0.055]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            good
              ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]"
              : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,.5)]"
          }`}
        />
        <h3
          className={`text-[17px] font-semibold ${
            highlighted
              ? "rounded-md bg-amber-200 px-2 py-0.5 text-slate-950"
              : "text-white"
          }`}
        >
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      <ul className="mt-4 space-y-2.5">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-2.5 text-[13px] leading-5 text-slate-300"
          >
            <span
              className={`mt-0.5 font-bold ${
                good ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {good ? "✓" : "×"}
            </span>
            {bullet}
          </li>
        ))}
      </ul>
      <MiniDiagram type={good ? "loose" : "tight"} />
    </article>
  );
}
