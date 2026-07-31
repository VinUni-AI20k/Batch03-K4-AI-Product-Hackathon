import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ClockIcon } from "@/components/icons";
import { CodelabRenderer } from "@/components/codelab/renderer";
import { days, labBySlug } from "@/data/codelabs";
import { codelabSlugs, loadCodelab } from "@/lib/codelab-source";

export async function generateStaticParams() {
  const listed = days.flatMap((day) => day.labs.map((lab) => lab.slug));
  // Slugs that have real Markdown may not be in the listing clone yet.
  return [...new Set([...listed, ...(await codelabSlugs())])].map((slug) => ({ slug }));
}

function Meta({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <ul className="mt-1.5 space-y-1 text-[13px] text-neutral-600 dark:text-neutral-400">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span className="text-brand-500">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `params` is a Promise in Next 16 — see app/api-reference/file-conventions/page. */
export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const codelab = await loadCodelab(slug);
  const listed = labBySlug.get(slug);

  if (!codelab && !listed) notFound();

  const fm = codelab?.frontmatter;
  const title = fm?.title ?? listed?.title ?? slug;
  const duration = fm ? `${fm.duration} phút` : listed?.duration;
  const day = fm ? `Day ${fm.day}` : listed?.day;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-260 px-6 py-10">
        <Link
          href="/codelab"
          className="text-[13px] font-semibold text-brand-600 hover:underline dark:text-brand-500"
        >
          ← Session codelabs
        </Link>

        <h1 className="mt-4 text-[30px] font-extrabold tracking-tight">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[12.5px] text-neutral-500">
          {day && <span>{day}</span>}
          {duration && (
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5" />
              {duration}
            </span>
          )}
          {fm?.level && <span className="capitalize">{fm.level}</span>}
          {fm?.category && <span>{fm.category}</span>}
          {fm && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                fm.published
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "bg-pending-100 text-pending-800 dark:bg-pending-700/20 dark:text-pending-100"
              }`}
            >
              {fm.published ? "published" : "draft"}
            </span>
          )}
        </div>

        {(fm?.description ?? listed?.goal) && (
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {fm?.description ?? listed?.goal}
          </p>
        )}

        {!codelab ? (
          <p className="mt-10 rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm text-neutral-500 dark:border-line-dark">
            Chưa có <code className="font-mono">docs/CODELAB.md</code> cho lab này.
          </p>
        ) : (
          <div className="mt-10 gap-12 lg:flex lg:items-start">
            <article className="min-w-0 flex-1">
              <CodelabRenderer slug={slug} body={codelab.body} />
            </article>

            <aside className="mt-10 w-full shrink-0 space-y-6 lg:mt-0 lg:w-64 lg:sticky lg:top-6">
              <Meta label="Cần biết trước" items={fm?.prerequisites} />
              <Meta label="Xong sẽ làm được" items={fm?.outcomes} />
              <Meta label="Công cụ" items={fm?.requiredTools} />
              <Meta label="Lỗi thường gặp" items={fm?.commonErrors} />
              <Meta label="Hệ điều hành" items={fm?.supportedOs} />
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
