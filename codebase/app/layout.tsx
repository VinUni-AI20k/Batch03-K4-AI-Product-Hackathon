import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLearn · AI Tutor",
  description: "Học từ slide nhanh hơn với giải thích ngắn và trích dẫn rõ ràng.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
