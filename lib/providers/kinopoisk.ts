import { Media, MediaKind } from "../types";

const BASE = process.env.KINOPOISK_API_BASE!;
const KEY_LIST = (process.env.KINOPOISK_API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);

// Round-robin key rotation
let keyIndex = 0;
function nextKey() {
  if (KEY_LIST.length === 0) throw new Error("No Kinopoisk API keys defined");
  const key = KEY_LIST[keyIndex % KEY_LIST.length];
  keyIndex = (keyIndex + 1) % KEY_LIST.length;
  return key;
}

async function kpFetch(path: string, init: RequestInit = {}, attempt = 0): Promise<any> {
  const key = nextKey();
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'X-API-KEY': key },
    cache: 'no-store',
    ...init
  });

  // Retry if failed or forbidden/ratelimited
  if (!res.ok && attempt < KEY_LIST.length - 1 && [401,403,429,500,502,503].includes(res.status)) {
    console.warn(`Kinopoisk key failed (${key}) status ${res.status}, retrying...`);
    return kpFetch(path, init, attempt + 1);
  }

  if (!res.ok) throw new Error(`Kinopoisk error ${res.status}: ${res.statusText}`);
  return res.json();
}

function mapType(kpType?: string): MediaKind {
  if (kpType === 'TV_SERIES' || kpType === 'MINI_SERIES') return 'series';
  if (kpType === 'CARTOON' || kpType === 'ANIME') return 'cartoon';
  return 'film';
}

export async function kpTop(kind: MediaKind, page = 1): Promise<Media[]> {
  const type = kind === 'series' ? 'TV_SERIES' : kind === 'cartoon' ? 'CARTOON' : 'FILM';
  const data = await kpFetch(`/api/v2.2/films?type=${type}&page=${page}`);
  return (data.items || data.films || data.docs || []).map((x: any) => ({
    id: String(x.kinopoiskId ?? x.filmId ?? x.id),
    title: x.nameRu ?? x.nameOriginal ?? x.nameEn ?? x.name ?? '',
    year: x.year ?? x.yearStart ?? undefined,
    poster: x.posterUrlPreview ?? x.posterUrl ?? null,
    rating: Number(x.ratingKinopoisk ?? x.rating ?? x.ratingImdb ?? NaN) || null,
    type: mapType(x.type ?? (x.typeNumber ? 'FILM' : (x.serial ? 'TV_SERIES' : 'FILM')))
  })) as Media[];
}

export async function kpSearch(query: string, page = 1): Promise<Media[]> {
  const data = await kpFetch(`/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}&page=${page}`);
  return (data.films || []).map((x: any) => ({
    id: String(x.filmId),
    title: x.nameRu ?? x.nameEn ?? x.nameOriginal ?? '',
    year: x.year ? Number(x.year) : undefined,
    poster: x.posterUrlPreview ?? x.posterUrl ?? null,
    rating: Number(x.rating) || null,
    type: mapType(x.type)
  }));
}
