
'use client';
import { useEffect } from 'react';
import { useFavoritesStore } from '../lib/store/favorites';
export default function FavoritesHydrator(){
  const h=useFavoritesStore(s=>s.hydrate);
  useEffect(()=>{h()},[h]);
  return null;
}
