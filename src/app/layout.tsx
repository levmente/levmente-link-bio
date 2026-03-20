import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PostHogInit from '@/components/PostHogInit'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LevMente — Julio Giani',
  description:
    'Portal de entrada para pessoas com TDAH que querem destravar sua mente e viver com mais leveza, foco e intenção.',
  openGraph: {
    title: 'LevMente — Julio Giani',
    description: 'Sua mente não está quebrada. Ela só funciona diferente.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LevMente — Julio Giani',
    description: 'Sua mente não está quebrada. Ela só funciona diferente.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0A0A0F] text-white">
        <PostHogInit />
        {children}
      </body>
    </html>
  )
}
