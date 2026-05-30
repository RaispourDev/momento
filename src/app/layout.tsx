import { AuthProvider } from '../../contexts/AuthContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}