import './globals.css'

export const metadata = {
  title: 'VLearn – Clone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
