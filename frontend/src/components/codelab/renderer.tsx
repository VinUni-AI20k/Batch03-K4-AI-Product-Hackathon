"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { directiveToHast } from "@/lib/directive-to-hast";
import { AnswerStore } from "./answer-store";
import { Caution, Checkpoint, ExportFiles, FillIn, Goal, OsTabs, Quiz, SmartLink } from "./blocks";
import { Pre } from "./code-block";

type CodelabStep = {
  number: number;
  title: string;
  markdown: string;
};

function splitSteps(body: string): { intro: string; steps: CodelabStep[] } {
  const matches = [...body.matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)];
  if (!matches.length) return { intro: body, steps: [] };

  const intro = body.slice(0, matches[0].index).replace(/\n---\s*$/, "").trim();
  const steps = matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? body.length;
    return {
      number: Number(match[1]),
      title: match[2].trim(),
      markdown: body.slice(start, end).replace(/\n---\s*$/, "").trim(),
    };
  });

  return { intro, steps };
}

const markdownComponents = {
  "d-goal": Goal,
  "d-checkpoint": Checkpoint,
  "d-caution": Caution,
  "d-input": FillIn,
  "d-export": ExportFiles,
  "d-os": OsTabs,
  "d-quiz": Quiz,
  a: SmartLink,
  pre: Pre,
} as Components;

function MarkdownBody({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkDirective, directiveToHast]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={markdownComponents}
    >
      {children}
    </Markdown>
  );
}

/**
 * Owns the remark/rehype pipeline. Plugins are functions, which cannot cross the
 * server/client boundary as props, so the page passes only the Markdown string
 * and this component does the parsing.
 *
 * `rehypeRaw` is what lets authors use plain `<details>` for hidden hints — the
 * one interactive affordance that also works when the file is read on GitHub.
 */
export function CodelabRenderer({ slug, body }: { slug: string; body: string }) {
  const { intro, steps } = useMemo(() => splitSteps(body), [body]);
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);

  const selectStep = useCallback(
    (index: number, shouldFocus = true) => {
      const step = steps[index];
      if (!step) return;
      setActiveIndex(index);
      window.history.replaceState(null, "", `#step-${step.number}`);
      if (shouldFocus) {
        requestAnimationFrame(() => stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    },
    [steps],
  );

  useEffect(() => {
    const selectFromHash = () => {
      const number = Number(window.location.hash.replace("#step-", ""));
      const index = steps.findIndex((step) => step.number === number);
      if (index >= 0) {
        setActiveIndex(index);
        requestAnimationFrame(() => stepRef.current?.scrollIntoView({ block: "start" }));
      }
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [steps]);

  return (
    <AnswerStore slug={slug}>
      <div className="codelab-prose">
        {intro && <MarkdownBody>{intro}</MarkdownBody>}

        {steps.length ? (
          <div className="codelab-workspace">
            <nav className="codelab-stepper" aria-label="Các bước của lab" role="tablist">
              <div className="codelab-stepper__progress">
                <span>Tiến độ</span>
                <strong>
                  {activeIndex + 1}/{steps.length}
                </strong>
              </div>
              <div className="codelab-stepper__list">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-controls={`step-panel-${step.number}`}
                    onClick={() => selectStep(index)}
                    className={index === activeIndex ? "is-active" : undefined}
                  >
                    <span className="codelab-stepper__number">{step.number}</span>
                    <span className="codelab-stepper__title">{step.title}</span>
                  </button>
                ))}
              </div>
            </nav>

            <section
              ref={stepRef}
              id={`step-${steps[activeIndex].number}`}
              role="tabpanel"
              aria-label={`Bước ${steps[activeIndex].number}: ${steps[activeIndex].title}`}
              className="codelab-step-panel"
            >
              <div className="codelab-step-panel__meta">
                <span>
                  Bước {activeIndex + 1} / {steps.length}
                </span>
                <span>{steps[activeIndex].title}</span>
              </div>
              <MarkdownBody>{steps[activeIndex].markdown}</MarkdownBody>
              <footer className="codelab-step-panel__controls">
                <button
                  type="button"
                  onClick={() => selectStep(activeIndex - 1)}
                  disabled={activeIndex === 0}
                >
                  ← Quay lại
                </button>
                <span>
                  {activeIndex + 1} / {steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => selectStep(activeIndex + 1)}
                  disabled={activeIndex === steps.length - 1}
                >
                  Tiếp →
                </button>
              </footer>
            </section>
          </div>
        ) : (
          <MarkdownBody>{body}</MarkdownBody>
        )}
      </div>
    </AnswerStore>
  );
}
