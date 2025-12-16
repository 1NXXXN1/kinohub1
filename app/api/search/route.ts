import { NextResponse } from 'next/server';

const BASE = 'https://api.kinopoiskapi.uz';
const KEYS = (process.env.KINOPOISK_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

let keyIndex = 0;

async function fetchWithRotation(path: string) {
  if (!KEYS.length) {
    return null;
  }

  for (let i = 0; i < KEYS.length; i++) {
    const key = KEYS[keyIndex];

    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: {
          'X-API-KEY': key,
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        return res.json();
      }

      // Kalitni almashtiramiz
      if ([401, 429, 500, 502].includes(res.status)) {
        keyIndex = (keyIndex + 1) % KEYS.length;
        continue;
      }

      // Boshqa xatolarni to‘g‘ridan qaytaramiz
      return { error: `KP API status ${res.status}` };
    } catch {
      keyIndex = (keyIndex + 1) % KEYS.length;
    }
  }

  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ docs: [] });
  }

  // kinopoiskapi.uz da qidirish
  // /api/v2.2/films?keyword={q}&page=1
  const result = await fetchWithRotation(
    `/api/v2.2/films?keyword=${encodeURIComponent(q)}&page=1`
  );

  if (!result) {
    return NextResponse.json(
      { docs: [] },
      { status: 502 }
    );
  }

  return NextResponse.json(result);
}

