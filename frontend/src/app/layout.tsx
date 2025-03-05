import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'テキストからプレゼン自動生成',
  description: 'テキストからプレゼンテーション資料を自動生成するアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">テキストからプレゼン自動生成</h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-100 p-4 border-t">
            <div className="container mx-auto text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} テキストからプレゼン自動生成
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
