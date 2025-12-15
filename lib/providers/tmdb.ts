import { Media, MediaKind } from "../types";
const TBASE = process.env.TMDB_API_BASE!;
const TKEY = process.env.TMDB_API_KEY!;

async function tmdb(path: string) {
  const url = `${TBASE}${path}${path.includes('?')?'&':'?'}api_key=${TKEY}&language=ru-RU`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`TMDB ${r.status}`);
  return r.json();
}

function asMedia(results: any[], kind: MediaKind): Media[] {
  return results.map((x: any) => ({
    id: String(x.id),
    title: x.title ?? x.name ?? '',
    year: x.release_date ? Number(x.release_date.slice(0,4)) : x.first_air_date ? Number(x.first_air_date.slice(0,4)) : undefined,
    poster: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
    rating: x.vote_average ? Number(x.vote_average.toFixed(1)) : null,
    type: kind
  }));
}

export async function tmdbPopular(kind: MediaKind, page = 1): Promise<Media[]> {
  if (kind === 'series') {
    const d = await tmdb(`/tv/popular?page=${page}`);
    return asMedia(d.results || [], 'series');
  }
  if (kind === 'cartoon') {
    const d = await tmdb(`/discover/movie?page=${page}&with_genres=16`);
    return asMedia(d.results || [], 'cartoon');
  }
  const d = await tmdb(`/movie/popular?page=${page}`);
  return asMedia(d.results || [], 'film');
}

export async function tmdbSearch(q: string, page = 1): Promise<Media[]> {
  const d = await tmdb(`/search/multi?query=${encodeURIComponent(q)}&page=${page}`);
  return (d.results || []).filter((x: any) => ['movie','tv'].includes(x.media_type)).map((x: any) => ({
    id: String(x.id),
    title: x.title ?? x.name ?? '',
    year: x.release_date ? Number(x.release_date.slice(0,4)) : x.first_air_date ? Number(x.first_air_date.slice(0,4)) : undefined,
    poster: x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : null,
    rating: x.vote_average ? Number(x.vote_average.toFixed(1)) : null,
    type: x.media_type === 'tv' ? 'series' : 'film'
  })) as any;
}
