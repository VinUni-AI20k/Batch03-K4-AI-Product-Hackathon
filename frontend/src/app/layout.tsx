import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const metadata: Metadata = {
  title: "VLearn Codelabs | Hackathon",
  description:
    "Session codelabs for the VLearn hackathon — choose any lab; the day only helps you find the matching session.",
};

/**
 * Runs while the browser parses the HTML, so a dark-mode reload never paints
 * the light theme first. See next docs: app/guides/preventing-flash-before-hydration.
 */
const themeScript = `(function(){try{
var s=localStorage.getItem("vlearn-theme");
var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
if(d)document.documentElement.classList.add("dark");
}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body className="min-h-full bg-page font-sans text-neutral-900 dark:bg-page-dark dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
