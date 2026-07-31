"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useAnswers } from "./answer-store";

/** Directive attributes arrive as unknown props; normalise to a string. */
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

function Callout({
  tone,
  label,
  title,
  children,
}: {
  tone: "goal" | "checkpoint" | "caution";
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  const skin = {
    goal: "border-brand-500/40 bg-brand-100/40 dark:bg-brand-700/10",
    checkpoint: "border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-500/10",
    caution: "border-pending-100 bg-pending-50/80 dark:bg-pending-700/10",
  }[tone];

  const chip = {
    goal: "text-brand-700 dark:text-brand-500",
    checkpoint: "text-emerald-700 dark:text-emerald-400",
    caution: "text-pending-800 dark:text-pending-100",
  }[tone];

  return (
    <div className={`my-5 rounded-xl border px-5 py-4 ${skin}`}>
      <p className={`text-[11px] font-bold uppercase tracking-wider ${chip}`}>{label}</p>
      {title && <p className="mt-1 text-[15px] font-semibold">{title}</p>}
      <div className="mt-2 text-sm leading-relaxed [&>*:first-child]:mt-0">{children}</div>
    </div>
  );
}

export function Goal({ title, children }: { title?: unknown; children?: React.ReactNode }) {
  return (
    <Callout tone="goal" label="Mục tiêu" title={str(title) || undefined}>
      {children}
    </Callout>
  );
}

export function Caution({ title, children }: { title?: unknown; children?: React.ReactNode }) {
  return (
    <Callout tone="caution" label="Lưu ý" title={str(title) || undefined}>
      {children}
    </Callout>
  );
}

/**
 * Checkpoint lines are authored as `[ ] ...` inside the directive, which arrives
 * as plain paragraph text. Split it back into tickable lines so the learner can
 * track progress; anything that is not a `[ ]` line renders as-is.
 */
export function Checkpoint({
  title,
  children,
}: {
  title?: unknown;
  children?: React.ReactNode;
}) {
  const { ticks, toggleTick } = useAnswers();
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const scope = useId();

  useEffect(() => {
    // Splitting on the marker rather than on newlines survives whichever shape
    // the `[ ]` lines took after parsing — one paragraph, several, or a list.
    const text = ref.current?.textContent ?? "";
    const found = text
      .split(/\[\s*\]\s*/)
      .slice(1)
      .map((s) => s.trim())
      .filter(Boolean);
    if (found.length) setLines(found);
  }, [children]);

  return (
    <Callout tone="checkpoint" label="Checkpoint" title={str(title, "Hoàn thành khi")}>
      {/* Measured once for its text, then replaced by the tickable list. */}
      <div ref={ref} className={lines ? "hidden" : undefined}>
        {children}
      </div>
      {lines && (
        <ul className="list-none space-y-2 pl-0">
          {lines.map((line, i) => {
            const key = `${scope}:${i}`;
            const done = ticks[key] ?? false;
            return (
              <li key={key} className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(e) => toggleTick(key, e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-emerald-600"
                />
                <span className={done ? "text-neutral-400 line-through" : undefined}>{line}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Callout>
  );
}

/** `:::input{id target lines}` — the learner types here; `:::export` collects it. */
export function FillIn({
  id,
  target,
  lines,
  placeholder,
  children,
}: {
  id?: unknown;
  target?: unknown;
  lines?: unknown;
  placeholder?: unknown;
  children?: React.ReactNode;
}) {
  const key = str(id);
  const dest = str(target);
  const rows = Number(str(lines, "3")) || 3;
  const { answers, setAnswer, ready } = useAnswers();
  const value = answers[key]?.value ?? "";

  return (
    <div className="my-5 rounded-xl border border-line bg-white/70 px-5 py-4 dark:border-line-dark dark:bg-surface-dark/70">
      <div className="text-sm leading-relaxed [&>*:first-child]:mt-0">{children}</div>
      <textarea
        rows={rows}
        value={value}
        disabled={!ready}
        placeholder={str(placeholder, "Câu trả lời của bạn…")}
        onChange={(e) => setAnswer(key, dest, e.target.value)}
        className="mt-3 w-full resize-y rounded-lg border border-line bg-page px-3 py-2 font-mono text-[13px] leading-relaxed outline-none focus:border-brand-500 dark:border-line-dark dark:bg-page-dark"
      />
      <p className="mt-2 text-[11.5px] text-neutral-500">
        Nội dung này sẽ vào <code className="font-mono">{dest || "(chưa khai target)"}</code> khi bạn
        bấm xuất file ở bước nộp bài. Lưu trong trình duyệt, không gửi lên server.
      </p>
    </div>
  );
}

/** `:::export{targets}` — rebuilds the files the learner must commit. */
export function ExportFiles({
  targets,
  children,
}: {
  targets?: unknown;
  children?: React.ReactNode;
}) {
  const { answers } = useAnswers();
  const wanted = str(targets)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const files = wanted.map((file) => {
    const parts = Object.values(answers).filter(
      (a) => a.target === file || a.target.startsWith(`${file}#`),
    );
    const body = Object.entries(answers)
      .filter(([, a]) => a.target === file || a.target.startsWith(`${file}#`))
      .map(([, a]) => {
        const anchor = a.target.includes("#") ? a.target.split("#")[1] : null;
        return `${anchor ? `## ${anchor}\n\n` : ""}${a.value.trim()}\n`;
      })
      .join("\n");
    return { file, body, filled: parts.filter((p) => p.value.trim()).length, total: parts.length };
  });

  const download = (file: string, body: string) => {
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.split("/").pop() ?? "answers.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-5 rounded-xl border border-brand-500/40 bg-brand-100/30 px-5 py-4 dark:bg-brand-700/10">
      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-500">
        Xuất file để commit
      </p>
      <div className="mt-2 text-sm leading-relaxed [&>*:first-child]:mt-0">{children}</div>
      <ul className="mt-3 list-none space-y-2 pl-0">
        {files.map(({ file, body, filled, total }) => (
          <li key={file} className="flex flex-wrap items-center gap-3">
            <code className="font-mono text-[13px]">{file}</code>
            <span className="text-[11.5px] text-neutral-500">
              {filled}/{total} ô đã điền
            </span>
            <button
              type="button"
              onClick={() => download(file, body)}
              disabled={!filled}
              className="rounded-md bg-brand-600 px-2.5 py-1 text-[12px] font-semibold text-white disabled:opacity-40"
            >
              Tải về
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(body)}
              disabled={!filled}
              className="rounded-md border border-brand-600 px-2.5 py-1 text-[12px] font-semibold text-brand-700 disabled:opacity-40 dark:text-brand-500"
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `:::os` — one OS choice switches every command block on the page. */
export function OsTabs({ children }: { children?: React.ReactNode }) {
  const blocks = Array.isArray(children) ? children : [children];
  const tabs = blocks
    .map((node, i) => {
      const el = node as { props?: { children?: { props?: Record<string, unknown> } } };
      const code = el?.props?.children?.props ?? {};
      const label = str(code.tab) || str(code.className).replace("language-", "") || `Tuỳ chọn ${i + 1}`;
      return { label, node };
    })
    .filter((t) => t.node);

  const [active, setActive] = useState(0);
  if (!tabs.length) return <>{children}</>;

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-line dark:border-line-dark">
      <div className="flex gap-1 border-b border-line bg-page px-2 pt-2 dark:border-line-dark dark:bg-page-dark">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-t-md px-3 py-1.5 text-[12.5px] font-semibold ${
              i === active
                ? "bg-white text-brand-700 dark:bg-surface-dark dark:text-brand-500"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0">{tabs[active].node}</div>
    </div>
  );
}

/** `:::quiz{id answer}` — retrieval practice with immediate feedback. */
export function Quiz({
  id,
  answer,
  children,
}: {
  id?: unknown;
  answer?: unknown;
  children?: React.ReactNode;
}) {
  const correct = str(answer).trim().toLowerCase();
  const [picked, setPicked] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<{ key: string; text: string }[]>([]);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll("li")).map((li) => {
      const text = li.textContent?.trim() ?? "";
      const m = text.match(/^([a-z])\)\s*(.*)$/i);
      return m ? { key: m[1].toLowerCase(), text: m[2] } : { key: "", text };
    });
    const paras = Array.from(root.querySelectorAll("p")).map((p) => p.textContent?.trim() ?? "");
    if (items.some((i) => i.key)) {
      setOptions(items.filter((i) => i.key));
      setPrompt(paras[0] ?? "");
    }
  }, [children]);

  const answered = picked !== null;

  return (
    <div className="my-5 rounded-xl border border-deck-100 bg-deck-50/70 px-5 py-4 dark:border-deck-700/40 dark:bg-deck-700/10">
      <p className="text-[11px] font-bold uppercase tracking-wider text-deck-700">Tự kiểm</p>
      <div ref={ref} className={options.length ? "hidden" : "mt-2 text-sm"}>
        {children}
      </div>
      {options.length > 0 && (
        <>
          <p className="mt-1 text-[15px] font-semibold">{prompt}</p>
          <ul className="mt-3 list-none space-y-1.5 pl-0">
            {options.map((o) => {
              const isRight = o.key === correct;
              const show = answered && (o.key === picked || isRight);
              return (
                <li key={o.key}>
                  <button
                    type="button"
                    onClick={() => setPicked(o.key)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                      show
                        ? isRight
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                          : "border-red-400 bg-red-50 dark:bg-red-500/10"
                        : "border-line hover:border-deck-700 dark:border-line-dark"
                    }`}
                  >
                    <span className="font-mono text-[12px] text-neutral-500">{o.key})</span> {o.text}
                    {show && <span className="ml-2">{isRight ? "✅" : "❌"}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {answered && (
            <p className="mt-3 text-[13px]">
              {picked === correct
                ? "Đúng."
                : `Chưa đúng — đáp án là ${correct}). Đọc lại phần trên rồi thử lại.`}
            </p>
          )}
        </>
      )}
      {!options.length && <p className="mt-2 text-[12px] text-neutral-500">Quiz id: {str(id)}</p>}
    </div>
  );
}

/** `[từ](#glossary "định nghĩa")` renders as an inline definition, not a link. */
export function SmartLink({
  href,
  title,
  children,
}: {
  href?: unknown;
  title?: unknown;
  children?: React.ReactNode;
}) {
  const to = str(href);
  const tip = str(title);

  if (to === "#glossary" && tip) {
    return (
      <abbr
        title={tip}
        className="cursor-help underline decoration-brand-500 decoration-dotted decoration-2 underline-offset-2"
      >
        {children}
      </abbr>
    );
  }

  const external = to.startsWith("http");
  return (
    <a
      href={to}
      title={tip || undefined}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-brand-600 underline decoration-brand-500/40 hover:decoration-brand-500 dark:text-brand-500"
    >
      {children}
    </a>
  );
}
