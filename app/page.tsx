'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fetchTopFilms, fetchTopSeries, fetchTopCartoons, fallbackPopularFromTMDB, take } from '../lib/client-api';

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
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
      title={active ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {active ? '❤️' : '🤍'}
    </motion.button>
  );
}

export default function Home() {
  const [films, setFilms] = useState<KpFilm[]>([]);
  const [series, setSeries] = useState<KpFilm[]>([]);
  const [cartoons, setCartoons] = useState<KpFilm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const results = await Promise.allSettled([fetchTopFilms(), fetchTopSeries(), fetchTopCartoons()]);
        if (cancelled) return;
        const f0 = results[0].status === 'fulfilled' ? results[0].value : null;
        const s0 = results[1].status === 'fulfilled' ? results[1].value : null;
        const c0 = results[2].status === 'fulfilled' ? results[2].value : null;
        if (f0) setFilms(take((f0.films || f0.items || []), 10));
        else {
          const tmdb = await fallbackPopularFromTMDB();
          if (!cancelled) setFilms(take((tmdb.results || []).map((r: any) => ({
            filmId: r.id,
            nameRu: r.title || r.name,
            posterUrlPreview: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : '',
            year: r.release_date ? Number(r.release_date.slice(0,4)) : undefined
          })), 10));
        }
        if (s0) setSeries(take((s0.items || s0.films || []), 10));
        if (c0) setCartoons(take((c0.items || c0.films || []), 10));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  const Section = ({ title, items, tag }:{ title:string, items:KpFilm[], tag:'фильм'|'сериал'|'мультфильм'}) => (
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
                    <div className="grid place-content-center text-mute h-full">Нет постера</div>
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
      {loading && <p className="text-sm text-mute">Загрузка…</p>}
      <Section title="Популярные фильмы (ТОП 10)" items={films} tag="фильм" />
      <Section title="Популярные сериалы (ТОП 10)" items={series} tag="сериал" />
      <Section title="Популярные мультфильмы (ТОП 10)" items={cartoons} tag="мультфильм" />
      {!loading && films.length === 0 && series.length === 0 && cartoons.length === 0 && (
        <p className="text-sm text-mute">Ничего не найдено. Проверьте ключи или добавьте TMDB ключ.</p>
      )}
    </section>
  );
}
