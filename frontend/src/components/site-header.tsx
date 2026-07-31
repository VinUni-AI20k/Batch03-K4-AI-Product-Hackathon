"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownItem } from "./dropdown";
import { ThemeToggle } from "./theme-toggle";
import {
  BookIcon,
  ChevronDownIcon,
  CoachIcon,
  ExternalLinkIcon,
  HelpIcon,
  VinUniMark,
} from "./icons";

const account = "26ai.thanhhc@vinuni.edu.vn";

function NavLink({
  href,
  icon,
  children,
  active,
}: {
  /** A route to navigate to, or "#" for sections of the site not built here. */
  href: "/codelab" | "#";
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}) {
  const className = `flex items-center gap-2 border-b-2 pb-1 text-sm font-semibold transition-colors ${
    active
      ? "border-accent-500 text-accent-500"
      : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
  }`;

  const content = (
    <>
      <span className="text-[17px]">{icon}</span>
      {children}
    </>
  );

  if (href === "#") {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={className}>
      {content}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<"EN" | "VI">("EN");

  const navButton =
    "flex items-center gap-2 border-b-2 border-transparent pb-1 text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-sm dark:border-line-dark dark:bg-surface-dark/90">
      <div className="mx-auto flex h-16 max-w-324 items-center gap-8 px-6">
        <Link href="/codelab" className="flex shrink-0 items-center gap-2">
          <VinUniMark className="size-6" />
          <span className="text-[17px] tracking-tight">
            <span className="font-extrabold">VLearn</span>{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Codelabs</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            href="/codelab"
            icon={<BookIcon className="size-4.25" />}
            active={pathname.startsWith("/codelab")}
          >
            Codelabs
          </NavLink>

          <Dropdown
            align="left"
            triggerClassName={navButton}
            label={
              <>
                <HelpIcon className="size-4.25" />
                Support
                <ChevronDownIcon className="size-3.5" />
              </>
            }
          >
            <DropdownItem href="#">Hướng dẫn sử dụng</DropdownItem>
            <DropdownItem href="#">Báo lỗi codelab</DropdownItem>
            <DropdownItem href="#">Liên hệ Lab Coach</DropdownItem>
          </Dropdown>

          <NavLink href="#" icon={<CoachIcon className="size-4.25" />} active={false}>
            LabCoaches
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://vlearn.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex dark:border-line-dark dark:text-neutral-300 dark:hover:bg-white/5"
          >
            <ExternalLinkIcon className="size-4" />
            Open VLearn
          </a>

          <button
            type="button"
            onClick={() => setLocale((l) => (l === "EN" ? "VI" : "EN"))}
            aria-label={`Language: ${locale}`}
            className="rounded-lg px-2 py-1.5 text-[13px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
          >
            {locale}
          </button>

          <ThemeToggle />

          <Dropdown
            triggerClassName="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-2.5 transition-colors hover:bg-neutral-50 dark:border-line-dark dark:hover:bg-white/5"
            label={
              <>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-700 dark:text-white">
                  {account[0].toUpperCase()}
                </span>
                <span className="hidden max-w-32 truncate text-[13px] font-medium text-neutral-600 sm:block dark:text-neutral-400">
                  {account}
                </span>
                <ChevronDownIcon className="size-3.5 text-neutral-400" />
              </>
            }
          >
            <p className="truncate px-3 py-2 text-xs text-neutral-500 dark:text-neutral-500">
              {account}
            </p>
            <div className="my-1 h-px bg-line dark:bg-line-dark" />
            <DropdownItem href="#">Tiến độ của tôi</DropdownItem>
            <DropdownItem href="#">Cài đặt</DropdownItem>
            <DropdownItem>Đăng xuất</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
