"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Holds what the learner typed into `:::input` blocks so `:::export` can rebuild
 * the files they have to commit. Answers stay in localStorage: they are the
 * learner's own words and never leave the browser.
 *
 * Keyed by `codelab:<slug>` so two labs never collide.
 */
type Answer = { target: string; value: string };
type Store = {
  answers: Record<string, Answer>;
  setAnswer: (id: string, target: string, value: string) => void;
  /** Checkpoint ticks, kept here so progress survives a reload too. */
  ticks: Record<string, boolean>;
  toggleTick: (id: string, next: boolean) => void;
  ready: boolean;
};

const AnswerContext = createContext<Store | null>(null);

export function AnswerStore({ slug, children }: { slug: string; children: React.ReactNode }) {
  const storageKey = `codelab:${slug}`;
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [ticks, setTicks] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  // Read once on mount. Doing this in an effect (not during render) keeps the
  // server and first client render identical, so there is no hydration mismatch.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { answers?: typeof answers; ticks?: typeof ticks };
        setAnswers(parsed.answers ?? {});
        setTicks(parsed.ticks ?? {});
      }
    } catch {
      // Corrupt or blocked storage: start empty rather than break the page.
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers, ticks }));
    } catch {
      // Private mode or quota: the lab still works, it just will not persist.
    }
  }, [ready, storageKey, answers, ticks]);

  const setAnswer = useCallback((id: string, target: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: { target, value } }));
  }, []);

  const toggleTick = useCallback((id: string, next: boolean) => {
    setTicks((prev) => ({ ...prev, [id]: next }));
  }, []);

  const value = useMemo(
    () => ({ answers, setAnswer, ticks, toggleTick, ready }),
    [answers, setAnswer, ticks, toggleTick, ready],
  );

  return <AnswerContext.Provider value={value}>{children}</AnswerContext.Provider>;
}

export function useAnswers(): Store {
  const ctx = useContext(AnswerContext);
  if (!ctx) throw new Error("useAnswers must be used inside <AnswerStore>");
  return ctx;
}
