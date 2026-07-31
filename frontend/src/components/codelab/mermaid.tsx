"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mermaid has no good remark plugin for runtime rendering, so ```mermaid fences
 * arrive here as source and get drawn on the client. The library is ~500KB, so
 * it loads only once a diagram is actually on the page.
 */
export function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
        });
        const { svg } = await mermaid.render(`m${Math.abs(hash(code))}`, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (failed) {
    return (
      <pre className="my-5 overflow-x-auto rounded-xl border border-line bg-page p-4 text-[12.5px] dark:border-line-dark dark:bg-page-dark">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-5 overflow-x-auto rounded-xl border border-line bg-white p-4 dark:border-line-dark dark:bg-surface-dark [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
    />
  );
}

/** Stable per-diagram id so re-renders do not collide in mermaid's registry. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
