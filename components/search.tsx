'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBox(){
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') ?? '');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); router.replace(`?q=${encodeURIComponent(q)}`);}} className="mb-4 flex items-center gap-2">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Qidirish…"
        className="w-full rounded-xl bg-card px-3 py-2 text-sm outline-none ring-1 ring-white/5 focus:ring-2 focus:ring-white/10" />
      <button className="rounded-xl bg-white/10 px-3 py-2 text-sm">Izlash</button>
    </form>
  );
}
