import { NextResponse } from 'next/server';

const BASE = process.env.KINOPOISK_API_BASE || 'https://kinopoiskapiunofficial.tech';

function* roundRobin<T>(arr: T[]) {
  let i = 0;
  while (true) { yield arr[i % arr.length]; i++; }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '';
  const keys = (process.env.KINOPOISK_API_KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });
  if (keys.length === 0) return NextResponse.json({ error: 'no api keys' }, { status: 500 });

  const gen = roundRobin(keys);
  for (let i = 0; i < keys.length; i++) {
    const key = gen.next().value as string;
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        const resp = NextResponse.json(data);
        resp.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        return resp;
      }
    } catch (e) {}
  }
  return NextResponse.json({ error: 'all keys failed' }, { status: 502 });
}
