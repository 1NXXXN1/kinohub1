'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FilmData = {
  nameRu?: string;
  nameOriginal?: string;
  year?: number;
  description?: string;
};

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [data, setData] = useState<FilmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    async function run() {
      if (!id) return;
      setLoading(true); setErr(null);
      try {
        const res = await fetch(
          `/api/kp?path=${encodeURIComponent(`/api/v2.2/films/${id}`)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          throw new Error(`KP proxy ${res.status}`);
        }
        const json = await res.json();
        if (!aborted) setData(json);
      } catch (e: any) {
        if (!aborted) setErr(e?.message || 'Ошибка загрузки');
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    run();
    return () => { aborted = true; };
  }, [id]);

  // Title'ni clientda o'rnatamiz: "Название (год) | NX"
  useEffect(() => {
    const name = data?.nameRu || data?.nameOriginal;
    const yr = data?.year ? ` (${data.year})` : '';
    document.title = name ? `${name}${yr}` : '😓';
  }, [data]);

  const src = `https://api.linktodo.ws/embed/kp/${encodeURIComponent(String(id))}?host=kinobd.net`;

  return (
    <section className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-400">Загрузка…</p>
      ) : err ? (
        <p className="text-sm text-red-400">Ошибка: {err}</p>
      ) : (
        <>
          <h1 className="text-xl font-semibold">
            {(data?.nameRu || data?.nameOriginal || 'Фильм')}
            {data?.year ? ` (${data.year})` : ''} <span className="text-gray-400">| NX</span>
          </h1>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
            <iframe src={src} allowFullScreen className="h-full w-full" />
          </div>
          {data?.description && (
            <p className="text-sm text-gray-400 leading-relaxed">{data.description}</p>
          )}
        </>
      )}
    </section>
  );
}
