
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ docs: [] });

  const res = await fetch(
    `https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=20&query=${encodeURIComponent(q)}`,
    {
      headers: {
        'X-API-KEY': process.env.KINOPOISK_API_KEYS!
      },
      next: { revalidate: 3600 }
    }
  );

  return NextResponse.json(await res.json());
}
