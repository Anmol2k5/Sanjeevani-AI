import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanjeevani AI - Medical Assistant',
  description: 'AI-powered preliminary diagnosis tool for rural healthcare workers.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sanjeevani AI',
  },
}

export const viewport = {
  themeColor: '#0066CC',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
