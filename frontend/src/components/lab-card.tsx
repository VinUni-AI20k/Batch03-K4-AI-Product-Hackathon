import Link from "next/link";
import type { Lab } from "@/data/codelabs";
import { ArrowRightIcon, ClockIcon, SlidesIcon } from "./icons";

function Badge({
  children,
  tone,
  icon,
  className,
}: {
  children: React.ReactNode;
  tone: "pending" | "deck";
  icon?: React.ReactNode;
  className?: string;
}) {
  const tones = {
    pending: "bg-pending-50 text-pending-800 dark:bg-pending-700/20 dark:text-pending-100",
    deck: "bg-deck-50 text-deck-700 dark:bg-deck-700/20 dark:text-deck-100",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${tones[tone]} ${className ?? ""}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function LabCard({ lab }: { lab: Lab }) {
  const locked = Boolean(lab.comingSoon);

  const footer = (
    <span
      className={`flex items-center justify-between text-[13px] font-semibold ${
        locked ? "text-pending-700 dark:text-pending-100" : "text-brand-600 dark:text-brand-500"
      }`}
    >
      {locked ? "Coming soon" : `Continue step ${lab.step?.current ?? 1}/${lab.step?.total ?? 1}`}
      <ArrowRightIcon className="size-4" />
    </span>
  );

  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-6 transition-colors hover:border-neutral-300 dark:border-line-dark dark:bg-surface-dark dark:hover:border-neutral-600">
      <div className="flex items-center justify-between text-[11.5px] text-neutral-500 dark:text-neutral-500">
        <span className="flex items-center gap-1.5">
          <ClockIcon className="size-3.5" />
          {lab.duration}
        </span>
        <span>{lab.updated}</span>
      </div>

      {lab.comingSoon && (
        <Badge tone="pending" className="mt-3.5">
          Coming soon
        </Badge>
      )}

      <h3 className="mt-3 text-[17px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {lab.title}
      </h3>

      {lab.kind === "presentation" && (
        <Badge tone="deck" className="mt-2.5" icon={<SlidesIcon className="size-3.5" />}>
          Presentation
        </Badge>
      )}

      <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {lab.goal}
      </p>

      {lab.tips ? (
        <p className="mt-2.5 text-[12.5px] font-medium text-pending-700 dark:text-pending-100">
          {lab.tips} optional preparation tip{lab.tips === 1 ? "" : "s"}
        </p>
      ) : null}

      <div className="mt-5">
        {locked ? (
          footer
        ) : (
          <Link href={`/codelab/${lab.slug}`} className="block hover:opacity-80">
            {footer}
          </Link>
        )}
      </div>
    </article>
  );
}
