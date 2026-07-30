import { Icon } from "./icons";

export function StatCard({ icon, label, value }: { icon: "book" | "activity"; label: string; value: string }) {
  return (
    <article className="stat-card">
      <div className="flex items-center gap-3.5">
        <div className="dashboard-icon"><Icon name={icon} className="size-5" /></div>
        <div>
          <p className="text-[11px] font-bold uppercase text-[#94a3b8]">{label}</p>
          <p className="mt-0.5 text-lg font-black text-slate-950">{value}</p>
        </div>
      </div>
    </article>
  );
}
