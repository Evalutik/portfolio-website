import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import { SmoothScroll } from '@/components/providers/SmoothScroll'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrei | AI Architect & Engineer',
  description: 'Professional portfolio of an AI Architect & Computer Scientist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" translate="no">
      <body className={inter.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
