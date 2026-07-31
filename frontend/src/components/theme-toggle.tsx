"use client";

import { MoonIcon, SunIcon } from "./icons";

const STORAGE_KEY = "vlearn-theme";

/**
 * Which icon shows is decided by CSS from the `dark` class on <html>, not by
 * React state — the inline script in the root layout sets that class before
 * hydration, so state here would disagree with the server HTML.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private mode / storage disabled — the toggle still works for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark theme"
      className="grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-100"
    >
      <MoonIcon className="size-4.5 dark:hidden" />
      <SunIcon className="hidden size-4.5 dark:block" />
    </button>
  );
}
