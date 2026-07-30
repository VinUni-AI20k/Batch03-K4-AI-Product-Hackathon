export function TimelineSkeleton() {
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
