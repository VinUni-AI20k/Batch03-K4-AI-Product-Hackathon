/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vlearn: {
          bg: '#f4f5f8',
          sidebar: '#f8fafc',
          border: '#e2e8f0',
          blue: '#2563eb',
          orange: '#ea580c',
          dark: '#0f172a',
          muted: '#64748b',
          cardBg: '#fffdf9',
          cardBorder: '#f1e9db',
          cyan: '#0891b2',
          purple: '#7c3aed',
          rose: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};
