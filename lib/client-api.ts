const KP_BASE = process.env.NEXT_PUBLIC_KINOPOISK_API_BASE || "https://kinopoiskapiunofficial.tech";
const KP_KEYS = (process.env.NEXT_PUBLIC_KINOPOISK_API_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

function* roundRobin(arr: string[]) { let i = 0; while (true) { yield arr[i % arr.length]; i++; } }
const keyGen = roundRobin(KP_KEYS);

async function kpFetch(path: string): Promise<any> {
  if (KP_KEYS.length === 0) throw new Error("NEXT_PUBLIC_KINOPOISK_API_KEYS not provided");
  const tries = KP_KEYS.length;
  for (let n = 0; n < tries; n++) {
    const key = keyGen.next().value as string;
    try {
      const res = await fetch(`${KP_BASE}${path}`, { headers: { "X-API-KEY": key, "Content-Type": "application/json" }, cache: "no-store" });
      if (res.ok) return res.json();
    } catch {}
  }
  throw new Error("All Kinopoisk keys failed");
}

export async function fetchTop100Films(page = 1) {
  return kpFetch(`/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=${page}`);
}
export async function fetchTopSeries(page = 1) {
  return kpFetch(`/api/v2.2/films?type=TV_SERIES&page=${page}`);
}
export async function fetchTopCartoons(page = 1) {
  try { return await kpFetch(`/api/v2.2/films?type=CARTOON&page=${page}`); }
  catch { return kpFetch(`/api/v2.2/films?type=ANIMATION&page=${page}`); }
}
export async function searchKinopoisk(keyword: string, page = 1) {
  const q = encodeURIComponent(keyword);
  return kpFetch(`/api/v2.1/films/search-by-keyword?keyword=${q}&page=${page}`);
}
export async function fallbackPopularFromTMDB() {
  if (!TMDB_KEY) return { results: [] };
  const r = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=ru-RU`, { cache: "no-store" });
  if (!r.ok) return { results: [] };
  return r.json();
}
export function take(arr: any[], n: number){ return Array.isArray(arr) ? arr.slice(0, n) : []; }
