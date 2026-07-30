export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="VLearn">
      <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M6 10.5 15.1 5v11.1l6.2 6.5L34 10.8v10.6L21.3 34 6 20Z" fill="#124f8c" />
        <path d="m15.1 5 6.2 6.2L34 4.7v6.1L21.3 22.6l-6.2-6.5Z" fill="#d6222f" />
      </svg>
      <div className="text-xl font-bold tracking-[-.025em]">
        <span className="text-[#d6222f]">V</span><span className="text-[#123f6f]">Learn</span>
      </div>
    </div>
  );
}
