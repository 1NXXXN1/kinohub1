'use client';
import { Suspense } from 'react';
import SearchClient from './search-client';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-mute">Загрузка поиска…</p>}>
      <SearchClient />
    </Suspense>
  );
}
