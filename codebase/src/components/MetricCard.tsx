import type { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  helper: string;
  accent?: "blue" | "red" | "amber" | "green";
}

const accentClasses = {
  blue: "bg-[#edf3fb] text-[#2e5596]",
  red: "bg-[#fff0f0] text-[#bd3b3b]",
  amber: "bg-[#fff6df] text-[#a66610]",
  green: "bg-[#eaf7f2] text-[#17775d]",
};

export function MetricCard({
  icon,
  label,
  value,
  helper,
  accent = "blue",
}: MetricCardProps) {
  return (
    <article className="flex min-h-[118px] items-center gap-4 rounded-[18px] border border-[#dce4ee] bg-white p-5 shadow-[0_8px_24px_rgba(15,35,64,0.06)]">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-[15px] ${accentClasses[accent]}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold uppercase tracking-[0.07em] text-[#8794a9]">
          {label}
        </p>
        <div className="mt-1 flex items-end gap-2">
          <strong className="text-[30px] leading-none tracking-[-0.04em] text-[#0b1730]">
            {value}
          </strong>
          <span className="pb-0.5 text-[11px] font-medium text-[#8995a8]">
            {helper}
          </span>
        </div>
      </div>
    </article>
  );
}
