"use client";

import { useState } from "react";
import { Mermaid } from "./mermaid";

/** Pulls the raw source out of react-markdown's <pre><code> pair. */
function sourceOf(children: React.ReactNode): { code: string; lang: string; tab?: string } {
  const el = children as {
    props?: { children?: unknown; className?: unknown; tab?: unknown };
  };
  const inner = el?.props?.children;
  const code = typeof inner === "string" ? inner : Array.isArray(inner) ? inner.join("") : "";
  const className = typeof el?.props?.className === "string" ? el.props.className : "";
  return {
    code: code.replace(/\n$/, ""),
    lang: className.replace("language-", ""),
    tab: typeof el?.props?.tab === "string" ? el.props.tab : undefined,
  };
}

export function Pre({ children }: { children?: React.ReactNode }) {
  const { code, lang } = sourceOf(children);
  const [copied, setCopied] = useState(false);

  if (lang === "mermaid") return <Mermaid code={code} />;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard blocked; the learner can still select the text.
    }
  };

  return (
    <div className="group relative my-4">
      {lang && (
        <span className="absolute left-3 top-2 font-mono text-[10.5px] uppercase tracking-wider text-neutral-500">
          {lang}
        </span>
      )}
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-line bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 dark:border-line-dark dark:bg-surface-dark/90 dark:text-neutral-300"
      >
        {copied ? "Đã copy" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-line bg-[#fbfaf8] px-4 pb-4 pt-7 text-[12.5px] leading-relaxed dark:border-line-dark dark:bg-[#0e0e11]">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
