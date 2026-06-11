import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'knitters (니터즈)',
  description: '뜨개 기록 & 커뮤니티 모바일 앱',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
