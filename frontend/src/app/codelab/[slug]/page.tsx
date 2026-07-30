import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ClockIcon } from "@/components/icons";
import { days, labBySlug } from "@/data/codelabs";

export function generateStaticParams() {
  return days.flatMap((day) => day.labs.map((lab) => ({ slug: lab.slug })));
}

/** `params` is a Promise in Next 16 — see app/api-reference/file-conventions/page. */
export default async function LabPage({ params }: PageProps<"/codelab/[slug]">) {
  const { slug } = await params;
  const lab = labBySlug.get(slug);

  if (!lab) notFound();

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

        <h1 className="mt-4 text-[30px] font-extrabold tracking-tight">{lab.title}</h1>

        <div className="mt-3 flex items-center gap-4 text-[12.5px] text-neutral-500">
          <span>{lab.day}</span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-3.5" />
            {lab.duration}
          </span>
          <span>{lab.updated}</span>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {lab.goal}
        </p>

        <p className="mt-10 rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm text-neutral-500 dark:border-line-dark">
          Lab steps are not part of this listing clone.
        </p>
      </main>
    </>
  );
}
