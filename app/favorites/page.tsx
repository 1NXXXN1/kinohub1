'use client';
import { useEffect, useState } from 'react';
type Media = { id:string; title:string; poster?:string; year?: number|string; type?: string };

export default function Page(){
  const [items, setItems] = useState<Media[]>([]);
  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('favorites.v1');
      const obj = raw ? JSON.parse(raw) as Record<string, Media> : {};
      setItems(Object.values(obj));
    };
    load();
    window.addEventListener('favorites:changed', load);
    return () => window.removeEventListener('favorites:changed', load);
  }, []);
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Избранное</h1>
      {items.length === 0 ? <p className="text-mute">Пока пусто.</p> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map(m => (
            <div key={m.id+m.title} className="group overflow-hidden rounded-2xl bg-card ring-1 ring-white/5">
              <a href={`/watch/${m.id}`} className="block">
                <div className="aspect-[2/3] overflow-hidden bg-black/20">
                  {m.poster ? <img src={m.poster} alt={m.title} className="h-full w-full object-cover"/> : <div className="grid h-full place-content-center text-mute">Нет постера</div>}
                </div>
                <div className="space-y-1 p-3">
                  <div className="line-clamp-1 text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-mute">{m.year ?? '—'} · {m.type ?? 'film'}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
