import '../styles/globals.css'
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Basketball Ending Last Digit',
  description: 'Track NBA quarter scores and pick your winning slot!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white p-4 flex justify-center">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            <Image src={`/assets/BELDS.png`} 
              width={0}
              height={0}
              sizes="100vh"
              style={{ width: '50%', height: 'auto' }} 
              alt="Basketball Ending Last Digits"
              className="mx-auto"/>
          </h1>
        </Link>
        </header>
        <main className="p-4 bg-[#262522] text-white min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}