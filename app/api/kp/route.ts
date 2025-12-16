import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'No path' }, { status: 400 });
  }

  const keys = process.env.KINOPOISK_API_KEYS?.split(',') || [];
  let lastError: any = null;

  for (const key of keys) {
    try {
      const res = await fetch(
        `https://kinopoiskapiunofficial.tech${path}`,
        {
          headers: {
            'X-API-KEY': key.trim(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.ok) {
        const data = await res.json();
        return new NextResponse(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600'
          }
        });
      }

      lastError = await res.text();
    } catch (e) {
      lastError = e;
    }
  }

  return NextResponse.json(
    { error: 'All API keys failed', details: String(lastError) },
    { status: 502 }
  );
}
