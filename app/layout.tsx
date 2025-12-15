import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'KinoHub', description: 'Minimal kino sayti' };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="uz">
      <body>
        <div className="mx-auto max-w-7xl px-4">
          <header className="sticky top-0 z-50 -mx-4 border-b border-white/5 bg-[#0b0b0f]/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">Kino<span className="text-gray-400">Hub</span></Link>
              <nav className="flex items-center gap-3">
                <Link href="/favorites" className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5">Saralanganlar</Link>
              </nav>
            </div>
          </header>
          <main className="py-6">{children}</main>
          <footer className="py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} KinoHub</footer>
        </div>
      </body>
    </html>
  );
}
