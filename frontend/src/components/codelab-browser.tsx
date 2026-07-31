"use client";

import { useMemo, useState } from "react";
import type { Day } from "@/data/codelabs";
import { LabCard } from "./lab-card";
import { SearchIcon } from "./icons";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    // Strip diacritics so "bai toan" also matches "bài toán".
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d");
}

export function CodelabBrowser({ days }: { days: Day[] }) {
  const [query, setQuery] = useState("");

  const visibleDays = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return days;

    return days
      .map((day) => ({
        ...day,
        labs: day.labs.filter((lab) =>
          normalize(`${lab.title} ${lab.goal}`).includes(needle),
        ),
      }))
      .filter((day) => day.labs.length > 0);
  }, [days, query]);

  return (
    <>
      <section className="rounded-2xl border border-line bg-white p-8 dark:border-line-dark dark:bg-surface-dark">
        <p className="text-[11px] font-bold tracking-[0.14em] text-brand-600 dark:text-brand-500">
          VLEARN CODELABS
        </p>
        <h1 className="mt-3 text-[34px] font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Session codelabs
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Choose any lab. Day only helps you find the matching session; it never locks your path.
        </p>

        <div className="relative mt-6">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or goal..."
            aria-label="Search by title or goal"
            className="w-full rounded-lg border border-line bg-white py-2.5 pr-4 pl-10 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-line-dark dark:bg-page-dark dark:text-neutral-100"
          />
        </div>
      </section>

      {visibleDays.map((day) => (
        <section key={day.label} className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              {day.label}
            </h2>
            <span className="text-[11.5px] text-neutral-500 dark:text-neutral-500">
              {day.labs.length} labs
            </span>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {day.labs.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </section>
      ))}

      {visibleDays.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm text-neutral-500 dark:border-line-dark">
          No codelab matches <span className="font-semibold">“{query}”</span>.
        </p>
      )}
    </>
  );
}
