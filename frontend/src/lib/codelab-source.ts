import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/** The 19 frontmatter fields the codelab format contract fixes, in order. */
export type CodelabFrontmatter = {
  id: string;
  title: string;
  duration: number;
  author: string;
  updated: string;
  category: string;
  description: string;
  published: boolean;
  collection: string;
  format: string;
  day: string;
  preparationTipIds: string[];
  level: string;
  prerequisites: string[];
  outcomes: string[];
  supportedOs: string[];
  requiredTools: string[];
  commonErrors: string[];
  requiresSubmission: boolean;
};

/**
 * Codelabs live as Markdown in `content/`, one file per lab, named after the
 * frontmatter `id`. Adding a lab means dropping a file in — there is no registry
 * to keep in sync, which is the failure mode that made Day 4 invisible on the
 * listing while its page rendered fine.
 *
 * Coaches author these in their own lab repo; `npm run sync:content` copies them
 * here so the app is self-contained and can be cloned or deployed on its own.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Placeholder slugs from `data/codelabs.ts` that a real codelab supersedes.
 *
 * The listing clone was built with its own slugs (`lab-03-chatbot-vs-react-agent`)
 * while frontmatter carries a different `id`. Rather than guess the two refer to
 * the same lab, the pairing is declared here so a wrong one is visible in a single
 * place instead of silently linking to a dead card.
 */
const REPLACES: Record<string, string> = {
  "day3-lab-chatbot-vs-react-agent-e402": "lab-03-chatbot-vs-react-agent",
};

export type Codelab = {
  frontmatter: CodelabFrontmatter;
  body: string;
};

async function markdownFiles(): Promise<string[]> {
  try {
    const names = await readdir(CONTENT_DIR);
    return names.filter((n) => n.endsWith(".md"));
  } catch {
    return [];
  }
}

export async function codelabSlugs(): Promise<string[]> {
  return (await markdownFiles()).map((n) => n.replace(/\.md$/, ""));
}

export async function loadCodelab(slug: string): Promise<Codelab | null> {
  // Guard against a slug from the URL escaping the content directory.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  let raw: string;
  try {
    raw = await readFile(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  return { frontmatter: data as CodelabFrontmatter, body: stripPageChrome(content) };
}

/** A listing card derived from a real file, so adding Markdown is all it takes. */
export type CodelabEntry = {
  slug: string;
  day: string;
  /** Undefined when this codelab does not supersede any placeholder card. */
  replaces: string | undefined;
  title: string;
  goal: string;
  duration: string;
  updated: string;
  kind: "lab" | "presentation";
  published: boolean;
  steps: number;
  tips: number;
};

export async function loadCodelabEntries(): Promise<CodelabEntry[]> {
  const slugs = await codelabSlugs();

  const entries = await Promise.all(
    slugs.map(async (slug): Promise<CodelabEntry | null> => {
      const loaded = await loadCodelab(slug);
      if (!loaded) return null;
      const { frontmatter: fm, body } = loaded;
      return {
        slug,
        day: `Day ${fm.day}`,
        replaces: REPLACES[slug],
        title: fm.title,
        goal: fm.description,
        duration: `${fm.duration} phút`,
        updated: `Cập nhật ${fm.updated}`,
        kind: fm.collection === "presentations" ? "presentation" : "lab",
        published: fm.published,
        steps: (body.match(/^## \d/gm) ?? []).length,
        tips: fm.preparationTipIds?.length ?? 0,
      };
    }),
  );

  return entries.filter((e): e is CodelabEntry => e !== null);
}

/**
 * The page header already renders title, day, duration, level, category, author
 * and updated date from frontmatter. Older files repeat all of that as an H1 plus
 * a bold meta line, which showed up as a duplicated title on the page — so drop
 * them here. New files should not emit them at all.
 */
function stripPageChrome(body: string): string {
  const lines = body.split("\n");
  let i = 0;

  const skipBlank = () => {
    while (i < lines.length && lines[i].trim() === "") i++;
  };

  skipBlank();
  if (lines[i]?.startsWith("# ")) {
    i++;
    skipBlank();
    // A meta line is a single all-bold line; real content is never shaped that way.
    if (/^\*\*.+\*\*$/.test(lines[i]?.trim() ?? "")) i++;
  }

  return lines.slice(i).join("\n").trimStart();
}
