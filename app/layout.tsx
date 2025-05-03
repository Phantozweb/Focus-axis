import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Focus Axis',
  description: 'Focus Axis is a web-based JCC simulator by Focus-in, built to help optometry students practice and understand cylinder axis and power refinement through interactive learning.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
