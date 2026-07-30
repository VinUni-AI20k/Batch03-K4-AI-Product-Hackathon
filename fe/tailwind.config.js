module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0B3B60',
        primaryDark: '#0F4C81',
        accent: '#E11D48',
        bgLight: '#F1F5F9',
        slateText: '#0F172A',
        muted: '#64748B',
        muted2: '#94A3B8'
      }
    },
  },
  plugins: [],
}
