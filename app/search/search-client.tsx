'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchKinopoisk } from '../../lib/client-api';

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!q) return;
    searchKinopoisk(q).then(d => setItems(d.items || []));
  }, [q]);

  if (!q) return <p>Введите название</p>;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(i => (
        <div key={i.kinopoiskId}>{i.nameRu}</div>
      ))}
    </div>
  );
}
