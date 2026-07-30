import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
    >
      {children}
    </a>
  ),
  code: ({ children }) => <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-100 last:mb-0">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-slate-300 pl-3 italic text-slate-500 last:mb-0">{children}</blockquote>
  ),
  h1: ({ children }) => <p className="mb-1 text-base font-extrabold">{children}</p>,
  h2: ({ children }) => <p className="mb-1 text-[15px] font-extrabold">{children}</p>,
  h3: ({ children }) => <p className="mb-1 text-sm font-extrabold">{children}</p>,
  hr: () => <hr className="my-2 border-slate-200" />,
};

export function MarkdownText({ text }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {text}
    </ReactMarkdown>
  );
}
