import '../styles/globals.css'
import Link from 'next/link';

export const metadata = {
  title: 'Basketball Score Ending Game',
  description: 'Track NBA quarter scores and pick your winning slot!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white p-4">
        <Link href="/">
          <h1 className="text-3xl font-bold">Basketball Score Ending Game</h1>
        </Link>
        </header>
        <main className="p-4 bg-[#262522] text-white h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}