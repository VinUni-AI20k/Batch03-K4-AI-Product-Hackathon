import {
  Bell,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Home,
  MessageSquareText,
  NotebookTabs,
} from "lucide-react";

const navItems = [
  { label: "Trang chủ", icon: Home },
  { label: "Khóa học", icon: GraduationCap },
  { label: "Trợ lý học tập", icon: MessageSquareText },
  { label: "Sổ tay học tập", icon: NotebookTabs, active: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dce4ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <a
          href="#main-content"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2e5596]"
          aria-label="VLearn - về nội dung chính"
        >
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] bg-[#284f8e] shadow-sm">
            <span className="absolute -right-1 -top-1 h-4 w-4 rotate-45 rounded-[3px] bg-[#c83b3b]" />
            <BookOpen aria-hidden="true" className="relative h-4 w-4 text-white" />
          </span>
          <span className="text-[21px] font-extrabold tracking-[-0.04em] text-[#16325f]">
            V<span className="text-[#c83b3b]">Learn</span>
          </span>
        </a>

        <nav
          className="hidden h-full flex-1 items-center justify-center gap-1 md:flex"
          aria-label="Điều hướng chính"
        >
          {navItems.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href={active ? "#learning-trace" : "#"}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-full items-center gap-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-[#2e5596] ${
                active
                  ? "text-[#173b72]"
                  : "text-[#71809a] hover:text-[#173b72]"
              }`}
            >
              <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              <span>{label}</span>
              {active ? (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#c83b3b]" />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-[#536784] transition-colors hover:bg-[#f1f5f9] hover:text-[#173b72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e5596]"
            aria-label="Thông báo, có 2 thông báo mới"
          >
            <Bell aria-hidden="true" className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#c83b3b]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e5596]"
            aria-label="Mở menu tài khoản Trần Nghĩa"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e7eef8] text-sm font-extrabold text-[#234d88]">
              TN
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-xs font-bold text-[#13233f]">
                Trần Nghĩa
              </span>
              <span className="block text-[11px] text-[#7a879c]">Học viên</span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="hidden h-4 w-4 text-[#7a879c] sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
