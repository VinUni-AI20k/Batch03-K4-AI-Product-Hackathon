import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VLearn — Nền tảng học tập thích ứng (Active Recall Demo)',
  description: 'Tính năng VLearn Active Recall & Misconception Diagnosis Engine - Nhóm 5tuat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased bg-slate-100 text-slate-900 select-none">
        {children}
      </body>
    </html>
  );
}
