'use client';
import { Media } from '../lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function MediaCard({ m }: { m: Media }){
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-2xl bg-card ring-1 ring-white/5">
      <Link href={`/watch/${m.id}`} className="block">
        <div className="aspect-[2/3] overflow-hidden bg-black/20">
          {m.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.poster} alt={m.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
          ) : (
            <div className="grid h-full place-content-center text-mute">No poster</div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <div className="line-clamp-1 text-sm font-medium">{m.title}</div>
          <div className="text-xs text-mute">{m.year ?? '—'} · {m.type}</div>
        </div>
      </Link>
      <FavButton id={m.id} media={m} />
    </motion.div>
  );
}

function FavButton({ id, media }: { id: string, media: Media }){
  const key = 'favorites.v1';
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const raw = localStorage.getItem(key);
    const list: Record<string, Media> = raw ? JSON.parse(raw) : {};
    if (list[id]) delete list[id]; else list[id] = media;
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event('favorites:changed'));
  };
  return (
    <button onClick={onClick} className="absolute right-2 top-2 rounded-full bg-black/40 p-1 text-xs text-white/80 hover:bg-black/60">
      ♥
    </button>
  );
}
