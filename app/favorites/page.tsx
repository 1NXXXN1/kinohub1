'use client';
import { useEffect, useState } from 'react';
import { Grid } from '../../components/grid';
import { MediaCard } from '../../components/media-card';
import type { Media } from '../../lib/types';

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
      <h1 className="text-xl font-semibold">Saralanganlar</h1>
      {items.length === 0 ? (
        <p className="text-mute">Hozircha hech narsa yo'q.</p>
      ) : (
        <Grid>{items.map(m => <MediaCard key={m.id+m.title} m={m} />)}</Grid>
      )}
    </section>
  );
}
