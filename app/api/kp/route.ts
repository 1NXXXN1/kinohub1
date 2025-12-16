import { NextResponse } from 'next/server';

const BASE = 'https://api.kinopoiskapi.uz';
const KEYS = (process.env.KINOPOISK_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json(
      { error: 'Missing path' },
      { status: 400 }
    );
  }

  if (!KEYS.length) {
    return NextResponse.json(
      { error: 'No API keys configured' },
      { status: 500 }
    );
  }

  let keyIndex = 0;

  for (let i = 0; i < KEYS.length; i++) {
    const key = KEYS[keyIndex];

    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: {
          'X-API-KEY': key,
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        // API muvaffaqiyatli javob berdi
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
      }

      // 404 bo‘lsa endpoint noto‘g‘ri → qolgan kalitlarni sinab ko‘rmaymiz
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'Endpoint not found' },
          { status: 404 }
        );
      }

      // 401 / 429 / 500 / 502 kabi xatolarda keyni o‘zgartiramiz
      keyIndex = (keyIndex + 1) % KEYS.length;

    } catch (e) {
      // Fetch xatosi bo‘lsa → keyni almashtiramiz
      keyIndex = (keyIndex + 1) % KEYS.length;
    }
  }

  return NextResponse.json(
    { error: 'All API keys failed' },
    { status: 502 }
  );
}
