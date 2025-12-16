
'use client';

import { useEffect, useState } from 'react';

export default function SearchClient({ query }: { query: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => setItems(d.docs || []));
  }, [query]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.id} className="text-sm">
          {item.nameRu || item.name || 'No name'}
        </div>
      ))}
    </div>
  );
}
