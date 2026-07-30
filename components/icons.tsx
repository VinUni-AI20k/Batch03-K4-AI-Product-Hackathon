import type { SVGProps } from "react";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
    book: <><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v16H7a2.5 2.5 0 0 0-2.5 2.5z" /><path d="M4.5 5.5v16M8 7h8M8 11h7" /></>,
    bookOpen: <><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v16H5.5A2.5 2.5 0 0 0 3 21.5z" /><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v16h5.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    home: <><path d="m3 10 9-7 9 7v10H4z" /><path d="M9 20v-7h6v7" /></>,
    activity: <path d="M3 12h4l2-8 4 16 2-8h6" />,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    arrowLeft: <><path d="M19 12H5M10 7l-5 5 5 5" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    chevronDown: <path d="m7 9 5 5 5-5" />,
    chevronUp: <path d="m7 15 5-5 5 5" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    bot: <><rect x="5" y="7" width="14" height="11" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M9 16h6" /></>,
    send: <><path d="m3 3 18 9-18 9 4-9z" /><path d="M7 12h14" /></>,
    pen: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z" /><path d="m14 7 3 3" /></>,
    highlighter: <><path d="m5 16 8-8 4 4-8 8H5zM13 8l2-2 4 4-2 2M4 21h10" /></>,
    minus: <path d="M6 12h12" />,
    plus: <><path d="M6 12h12M12 6v12" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5M9 12h6M9 16h5" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    sparkles: <><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3z" /><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}
