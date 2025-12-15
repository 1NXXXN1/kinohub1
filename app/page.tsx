'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fetchTop100Films, fetchTopSeries, fetchTopCartoons, searchKinopoisk, fallbackPopularFromTMDB, take } from '../lib/client-api';

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

function titleOf(x: KpFilm) { return x.nameRu || x.nameEn || x.nameOriginal || "—"; }
function idOf(x: KpFilm) { return String(x.kinopoiskId ?? x.filmId ?? ""); }
function posterOf(x: KpFilm) { return x.posterUrlPreview || x.posterUrl || ""; }

function HeartButton({ item }: { item: KpFilm }){
  const id = idOf(item);
  const key = 'favorites.v1';
  const [active, setActive] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const list = JSON.parse(raw);
    setActive(!!list[id]);
  }, [id]);
  const toggle = (e: any) => {
    e.preventDefault();
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : {};
    if (list[id]) { delete list[id]; setActive(false); }
    else {
      list[id] = { id, title: titleOf(item), poster: posterOf(item), year: item.year, type: (item.type||'film').toLowerCase() };
      setActive(true);
    }
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event('favorites:changed'));
  };
  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      animate={{ scale: active ? 1.25 : 1, color: active ? '#ef4444' : '#ffffffcc' }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      className="absolute right-2 top-2 rounded-full bg-black/45 p-1.5 text-lg leading-none select-none"
      aria-label={active ? 'Saralanganlardan chiqarish' : 'Saralanganlarga qo‘shish'}
      title={active ? 'Saralanganlardan chiqarish' : 'Saralanganlarga qo‘shish'}
    >
      {active ? '❤️' : '🤍'}
    </motion.button>
  );
}

export default function Home() {
  const [q, setQ] = useState('');
  const [films, setFilms] = useState<KpFilm[]>([]);
  const [serials, setSerials] = useState<KpFilm[]>([]);
  const [cartoons, setCartoons] = useState<KpFilm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        if (q.trim().length > 0) {
          const data = await searchKinopoisk(q.trim(), 1);
          if (cancelled) return;
          const all = data.films || [];
          setFilms(take(all.filter((x: KpFilm) => (x.type || '').toLowerCase() !== 'tv_series' && (x.type || '').toLowerCase() !== 'cartoon'), 10));
          setSerials(take(all.filter((x: KpFilm) => (x.type || '').toLowerCase() === 'tv_series'), 10));
          setCartoons(take(all.filter((x: KpFilm) => (x.type || '').toLowerCase() === 'cartoon'), 10));
        } else {
          try {
            const topFilms = await fetchTop100Films(1);
            if (!cancelled) setFilms(take((topFilms.films || topFilms.items || []), 10));
          } catch {
            const tmdb = await fallbackPopularFromTMDB();
            if (!cancelled) setFilms(take((tmdb.results || []).map((r: any) => ({
              filmId: r.id,
              nameRu: r.title || r.name,
              posterUrlPreview: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : '',
              year: r.release_date ? Number(r.release_date.slice(0,4)) : undefined
            })), 10));
          }
          try {
            const topSeries = await fetchTopSeries(1);
            if (!cancelled) setSerials(take((topSeries.items || topSeries.films || []), 10));
          } catch {}
          try {
            const topCartoons = await fetchTopCartoons(1);
            if (!cancelled) setCartoons(take((topCartoons.items || topCartoons.films || []), 10));
          } catch {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q]);

  const Section = ({ title, items, tag }:{ title:string, items:KpFilm[], tag:'film'|'serial'|'cartoon'}) => (
    items.length === 0 ? null : (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => (
            <motion.div key={idOf(m)+titleOf(m)} whileHover={{ scale: 1.02 }} className="group relative overflow-hidden rounded-2xl bg-card ring-1 ring-white/5">
              <Link href={`/watch/${idOf(m)}`} className="block">
                <div className="aspect-[2/3] relative bg-black/20">
                  {posterOf(m) ? (
                    <Image src={posterOf(m)} alt={titleOf(m)} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                  ) : (
                    <div className="grid place-content-center text-mute h-full">No poster</div>
                  )}
                </div>
                <div className="p-3">
                  <div className="line-clamp-1 text-sm font-medium">{titleOf(m)}</div>
                  <div className="text-xs text-mute">{m.year ?? '—'} · {tag}</div>
                </div>
              </Link>
              <HeartButton item={m} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <section className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Qidirish…"
          className="w-full rounded-xl bg-card px-3 py-2 text-sm outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-white/10"
        />
      </div>

      {loading && <p className="text-sm text-mute">Yuklanmoqda…</p>}

      <Section title="Mashhur filmlar (TOP 10)" items={films} tag="film" />
      <Section title="Mashhur seriallar (TOP 10)" items={serials} tag="serial" />
      <Section title="Mashhur multfilmlar (TOP 10)" items={cartoons} tag="cartoon" />

      {!loading && films.length === 0 && serials.length === 0 && cartoons.length === 0 && (
        <p className="text-sm text-mute">Hech narsa topilmadi. Kalitlarni tekshiring yoki TMDB kalitini qo‘shing.</p>
      )}
    </section>
  );
}
