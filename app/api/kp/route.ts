import { NextResponse } from 'next/server';

const BASE = 'https://kinopoiskapiunofficial.tech';
const KEYS = (process.env.KINOPOISK_API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  for (const key of KEYS) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: {
          'X-API-KEY': key,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        return NextResponse.json(await res.json());
      }

      // agar noto‘g‘ri endpoint bo‘lsa → keyingi kalitga o‘tmaymiz
      if (res.status === 404) break;

    } catch (e) {
      // keyingi API key bilan davom etamiz
      continue;
    }
  }

  return NextResponse.json(
    { error: 'Kinopoisk API failed (check endpoint or keys)' },
    { status: 502 }
  );
}
