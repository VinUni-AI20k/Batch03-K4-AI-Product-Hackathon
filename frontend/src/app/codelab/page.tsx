import { CodelabBrowser } from "@/components/codelab-browser";
import { SiteHeader } from "@/components/site-header";
import { days, type Day, type Lab } from "@/data/codelabs";
import { loadCodelabEntries } from "@/lib/codelab-source";

/**
 * The listing is the hand-written clone data with real codelabs folded in, so a
 * coach who drops a `docs/CODELAB.md` into their lab repo gets a card without
 * anyone editing a second registry. Real entries win over the placeholder they
 * declare via `replaces`.
 */
async function buildDays(): Promise<Day[]> {
  const entries = await loadCodelabEntries();
  const superseded = new Set(entries.map((e) => e.replaces).filter(Boolean));

  const merged: Day[] = days.map((day) => ({
    ...day,
    labs: day.labs.filter((lab) => !superseded.has(lab.slug)),
  }));

  for (const entry of entries) {
    const lab: Lab = {
      slug: entry.slug,
      title: entry.title,
      goal: entry.goal,
      duration: entry.duration,
      updated: entry.updated,
      kind: entry.kind,
      // Deliberately no `comingSoon`: these have real content, so the card links.
      ...(entry.tips ? { tips: entry.tips } : {}),
      step: { current: 1, total: Math.max(entry.steps, 1) },
    };

    const day = merged.find((d) => d.label === entry.day);
    if (day) day.labs.push(lab);
    else merged.push({ label: entry.day, labs: [lab] });
  }

  // Day 1, Day 2, … in numeric order rather than insertion order.
  return merged.sort((a, b) => {
    const n = (s: string) => Number(s.match(/\d+/)?.[0] ?? 0);
    return n(a.label) - n(b.label);
  });
}

export default async function CodelabsPage() {
  const allDays = await buildDays();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-260 px-6 py-10 pb-24">
        <CodelabBrowser days={allDays} />
      </main>
    </>
  );
}
