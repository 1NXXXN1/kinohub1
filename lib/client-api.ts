const SITE = process.env.NEXT_PUBLIC_SITE_URL || '';
const KP_PROXY = `${SITE}/api/kp?path=`;
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

const CACHE_TTL = 30000; // 30s

function cacheKey(key: string){ return `cache.v1.${key}`; }

function getCache(key: string){
  try {
    const raw = localStorage.getItem(cacheKey(key));
    if (!raw) return null;
    const { data, time } = JSON.parse(raw);
    if (Date.now() - time < CACHE_TTL) return data;
    return null;
  } catch { return null; }
}

function setCache(key: string, data: any){
  try {
    localStorage.setItem(cacheKey(key), JSON.stringify({ data, time: Date.now() }));
  } catch {}
}

async function proxyGet(path: string, cacheTag?: string){
  if (cacheTag){
    const c = getCache(cacheTag);
    if (c) return c;
  }
  const res = await fetch(`${KP_PROXY}${encodeURIComponent(path)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Proxy error');
  const data = await res.json();
  if (cacheTag) setCache(cacheTag, data);
  return data;
}

export async function fetchTopFilms(){ return proxyGet('/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1', 'top-films'); }
export async function fetchTopSeries(){ return proxyGet('/api/v2.2/films?type=TV_SERIES&page=1', 'top-series'); }
export async function fetchTopCartoons(){
  try { return await proxyGet('/api/v2.2/films?type=CARTOON&page=1', 'top-cartoons'); }
  catch { return proxyGet('/api/v2.2/films?type=ANIMATION&page=1', 'top-cartoons'); }
}

export async function searchKinopoisk(keyword: string, page = 1){
  const q = encodeURIComponent(keyword);
  return proxyGet(`/api/v2.1/films/search-by-keyword?keyword=${q}&page=${page}`, `search-${q}-${page}`);
}

export async function fallbackPopularFromTMDB(){
  if (!TMDB_KEY) return { results: [] };
  const r = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=ru-RU`, { cache: 'no-store' });
  if (!r.ok) return { results: [] };
  return r.json();
}

export function take<T>(arr: T[], n: number){ return Array.isArray(arr) ? arr.slice(0, n) : []; }
