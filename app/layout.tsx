import FavoritesHydrator from '../components/FavoritesHydrator';
import './globals.css';
import Link from 'next/link';
import { SearchBar } from '../components/SearchBar';

export const metadata = { title: 'NXMedia', description: 'Минималистичный кинопортал' };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="ru">
      <body>
        <div className="mx-auto max-w-7xl px-4">
          <header className="sticky top-0 z-50 -mx-4 border-b border-white/5 bg-[#0b0b0f]/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-3 items-center">
              <div className="justify-self-start">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                  <span className="text-white">NX</span><span className="text-blue-400">Media</span>
                </Link>
              </div>
              <div className="justify-self-center w-full max-w-md">
                <SearchBar />
              </div>
              <nav className="justify-self-end">
                <Link href="/favorites" className="rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5">Избранное</Link>
              </nav>
            </div>
          </header>
          <main className="py-6">{children}</main>
          <footer className="py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} NXMedia</footer>
        </div>
        <FavoritesHydrator />
</body>
    </html>
  );
}
