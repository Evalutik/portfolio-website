import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import { SmoothScroll } from '@/components/providers/SmoothScroll'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - AI Engineer & Computer Scientist',
  description: 'Modern portfolio website showcasing projects, skills, and expertise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
