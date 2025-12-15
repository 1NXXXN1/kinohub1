'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar(){
  const [q, setQ] = useState('');
  const router = useRouter();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search');
  };
  return (
    <form onSubmit={submit} className="relative">
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Поиск..."
        className="w-full rounded-full bg-card px-4 py-1.5 text-sm outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-white/10"
      />
      <button aria-label="Искать" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs text-gray-300 hover:bg-white/5">
        Найти
      </button>
    </form>
  );
}
