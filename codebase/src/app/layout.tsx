import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VLearn - Nền tảng học thích ứng VinUni",
  description: "Nền tảng học thích ứng giúp sinh viên nhận ra đúng phần kiến thức còn yếu và luyện tập có định hướng.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-[#24679f]/20 selection:text-[#0b355f] dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
