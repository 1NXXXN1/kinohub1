'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchTop100, uniqueByPoster } from '../lib/client-api';

export default function Home() {
  const [films, setFilms] = useState<any[]>([]);

  useEffect(() => {
    fetchTop100().then(data => {
      const all = uniqueByPoster(data.films || []);
      setFilms(all.slice(0, 10));
    });
  }, []);

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 p-4">
      {films.map(f => (
        <Link key={f.kinopoiskId} href={`/watch/${f.kinopoiskId}`}>
          <Image
            src={f.posterUrlPreview}
            alt={f.nameRu}
            width={200}
            height={300}
            loading="lazy"
          />
          <div className="text-sm">{f.nameRu}</div>
        </Link>
      ))}
    </section>
  );
}
