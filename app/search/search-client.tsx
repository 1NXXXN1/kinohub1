'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { searchKinopoisk } from '../../lib/client-api';

type KpFilm = {
  filmId?: number;
  kinopoiskId?: number;
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  year?: number | string;
};

function titleOf(x: KpFilm) { return x.nameRu || x.nameEn || x.nameOriginal || "—"; }
function idOf(x: KpFilm) { return String(x.kinopoiskId ?? x.filmId ?? ""); }
function posterOf(x: KpFilm) { return x.posterUrlPreview || x.posterUrl || ""; }

export default function SearchClient() {
  const params = useSearchParams();
  const initial = params.get('q') || '';
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<KpFilm[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = setTimeout(async () => {
      if (!q.trim()) { setItems([]); return; }
      setLoading(true);
      try {
        const data = await searchKinopoisk(q.trim(), 1);
        setItems((data.films || []).slice(0, 30));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(h);
  }, [q]);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Поиск</h1>
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Поиск фильмов и сериалов..."
        className="w-full rounded-xl bg-card px-3 py-2 text-sm outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-white/10"
      />

      {loading && <p className="text-sm text-mute">Загрузка…</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((m) => (
          <motion.div key={idOf(m)+titleOf(m)} whileHover={{ scale: 1.02 }} className="group relative overflow-hidden rounded-2xl bg-card ring-1 ring-white/5">
            <Link href={`/watch/${idOf(m)}`} className="block">
              <div className="aspect-[2/3] relative bg-black/20">
                {posterOf(m) ? (
                  <Image src={posterOf(m)} alt={titleOf(m)} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                ) : (
                  <div className="grid place-content-center text-mute h-full">Нет постера</div>
                )}
              </div>
              <div className="p-3">
                <div className="line-clamp-1 text-sm font-medium">{titleOf(m)}</div>
                <div className="text-xs text-mute">{m.year ?? '—'}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {!loading && items.length === 0 && q.trim() && (
        <p className="text-sm text-mute">Ничего не найдено.</p>
      )}
    </section>
  );
}
