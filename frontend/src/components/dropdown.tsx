"use client";

import { useEffect, useId, useRef, useState } from "react";

type DropdownProps = {
  /** Rendered inside the trigger button. */
  label: React.ReactNode;
  /** Which edge the menu lines up with. Nav menus open left, the account menu right. */
  align?: "left" | "right";
  triggerClassName?: string;
  children: React.ReactNode;
};

/**
 * Button + anchored menu that closes on outside click, Escape, or blur out of
 * the wrapper. Used by the header's "Support" and account menus.
 */
export function Dropdown({ label, align = "right", triggerClassName, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
      >
        {label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={
            `absolute ${align === "left" ? "left-0" : "right-0"} z-50 mt-2 min-w-52 ` +
            "rounded-xl border border-line bg-white p-1.5 shadow-lg shadow-black/5 " +
            "dark:border-line-dark dark:bg-surface-dark dark:shadow-black/40"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    "block rounded-lg px-3 py-2 text-left text-sm text-neutral-700 transition-colors " +
    "hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/5";

  if (href) {
    return (
      <a role="menuitem" href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button role="menuitem" type="button" className={`w-full ${className}`}>
      {children}
    </button>
  );
}
