import './globals.css'
import { AppProvider } from '../context/AppContext'

export const metadata = {
  title: 'VLearn – VinUni AI Thực Chiến',
  description: 'Không gian học tập VLearn',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#F1F5F9] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
