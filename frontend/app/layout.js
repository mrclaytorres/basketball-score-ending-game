export const metadata = {
  title: 'Basketball Score Ending Game',
  description: 'Track NBA quarter scores and pick your winning slot!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-3xl font-bold">Basketball Score Ending Game</h1>
        </header>
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  )
}