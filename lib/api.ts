import { kpTop, kpSearch } from './providers/kinopoisk';
import { tmdbPopular, tmdbSearch } from './providers/tmdb';
import { Media, MediaKind } from './types';

const hasTMDB = Boolean(process.env.TMDB_API_KEY);

export async function getTop(kind: MediaKind, page = 1): Promise<Media[]> {
  try {
    const primary = await kpTop(kind, page);
    if (!hasTMDB) return primary;
    const secondary = await tmdbPopular(kind, page);
    const byTitle = new Map(primary.map(m => [m.title.toLowerCase(), m]));
    for (const x of secondary) {
      const key = x.title.toLowerCase();
      if (!byTitle.has(key)) byTitle.set(key, x);
    }
    return Array.from(byTitle.values());
  } catch {
    return hasTMDB ? tmdbPopular(kind, page) : [];
  }
}

export async function searchAll(query: string, page = 1): Promise<Media[]> {
  const results: Media[] = [];
  const tasks = [kpSearch(query, page).catch(() => [] as Media[])];
  if (hasTMDB) tasks.push(tmdbSearch(query, page).catch(() => [] as Media[]));
  const [kp, tm] = await Promise.all(tasks);
  const merged = [...kp, ...(tm || [])];
  const dedup = new Map<string, Media>();
  for (const m of merged) {
    const k = `${m.title.toLowerCase()}_${m.year ?? ''}_${m.type}`;
    if (!dedup.has(k)) dedup.set(k, m);
  }
  return Array.from(dedup.values());
}
