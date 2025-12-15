'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fetchTop100Films, fetchTopSeries, searchKinopoisk, fallbackPopularFromTMDB } from '../lib/client-api';

type KpFilm = {
  filmId?: number;
  kinopoiskId?: number;
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  year?: number | string;
  type?: string;
};

function titleOf(x: KpFilm) {
  return x.nameRu || x.nameEn || x.nameOriginal || "—";
}
function idOf(x: KpFilm) {
  return String(x.kinopoiskId ?? x.filmId ?? "");
}
function posterOf(x: KpFilm) {
  return x.posterUrlPreview || x.posterUrl || "";
}

export default function Home() {
  const [q, setQ] = useState('');
  const [films, setFilms] = useState<KpFilm[]>([]);
  const [serials, setSerials] = useState<KpFilm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        if (q.trim().length > 0) {
          const data = await searchKinopoisk(q.trim(), 1);
          if (cancelled) return;
          setFilms((data.films || []).filter((x: KpFilm) => (x.type || '').toLowerCase() !== 'tv_series'));
          setSerials((data.films || []).filter((x: KpFilm) => (x.type || '').toLowerCase() === 'tv_series'));
        } else {
          // Load top 100 films
          try {
            const topFilms = await fetchTop100Films(1);
            if (!cancelled) setFilms(topFilms.films || topFilms.items || []);
          } catch {
            const tmdb = await fallbackPopularFromTMDB();
            if (!cancelled) setFilms((tmdb.results || []).map((r: any) => ({
              filmId: r.id,
              nameRu: r.title || r.name,
              posterUrlPreview: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : '',
              year: r.release_date ? Number(r.release_date.slice(0,4)) : undefined
            })));
          }
          // Load top series
          try {
            const topSeries = await fetchTopSeries(1);
            if (!cancelled) setSerials(topSeries.items || topSeries.films || []);
          } catch {
            // silently ignore
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q]);

  return (
    <section className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Qidirish…"
          className="w-full rounded-xl bg-[#12121a] px-3 py-2 text-sm outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-white/10"
        />
      </div>

      {loading && <p className="text-sm text-gray-400">Yuklanmoqda…</p>}

      {films.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Mashhur filmlar</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {films.map((m) => (
              <motion.div key={idOf(m)+titleOf(m)} whileHover={{ scale: 1.02 }} className="group overflow-hidden rounded-2xl bg-[#12121a] ring-1 ring-white/5">
                <Link href={`/watch/${idOf(m)}`} className="block">
                  <div className="aspect-[2/3] relative bg-black/20">
                    {posterOf(m) ? (
                      <Image src={posterOf(m)} alt={titleOf(m)} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                    ) : (
                      <div className="grid place-content-center text-gray-500 h-full">No poster</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-1 text-sm font-medium">{titleOf(m)}</div>
                    <div className="text-xs text-gray-400">{m.year ?? '—'} · film</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {serials.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Mashhur seriallar</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {serials.map((m) => (
              <motion.div key={idOf(m)+titleOf(m)} whileHover={{ scale: 1.02 }} className="group overflow-hidden rounded-2xl bg-[#12121a] ring-1 ring-white/5">
                <Link href={`/watch/${idOf(m)}`} className="block">
                  <div className="aspect-[2/3] relative bg-black/20">
                    {posterOf(m) ? (
                      <Image src={posterOf(m)} alt={titleOf(m)} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                    ) : (
                      <div className="grid place-content-center text-gray-500 h-full">No poster</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-1 text-sm font-medium">{titleOf(m)}</div>
                    <div className="text-xs text-gray-400">{m.year ?? '—'} · serial</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!loading && films.length === 0 && serials.length === 0 && (
        <p className="text-sm text-gray-400">Hech narsa topilmadi. Kalitlarni tekshiring yoki TMDB kalitini qo‘shing.</p>
      )}
    </section>
  );
}
