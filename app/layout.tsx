import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '抽奖 - 大营销平台展示',
//  description: '星球「码农会锁」第8个实战项目',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body style={{fontFamily: 'sans-serif'}}>{children}</body>
      </html>
  )
}
