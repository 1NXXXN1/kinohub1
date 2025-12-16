
'use client';
import { useEffect } from 'react';
import { useFavoritesStore } from '@/lib/store/favorites';

export default function FavoritesHydrator() {
  const hydrate = useFavoritesStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return null;
}
