import './globals.css';
import Link from 'next/link';
import { NavTabs } from '../components/nav-tabs';

export const metadata = { title: 'Kino Minimal', description: 'Minimal kinopoisk client' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <div className="mx-auto max-w-7xl px-4">
          <header className="sticky top-0 z-50 -mx-4 border-b border-white/5 bg-bg/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">Kino<span className="text-mute">.uz</span></Link>
              <NavTabs />
            </div>
          </header>
          <main className="py-6">{children}</main>
          <footer className="py-10 text-center text-sm text-mute">© {new Date().getFullYear()} Kino Minimal</footer>
        </div>
      </body>
    </html>
  );
}
