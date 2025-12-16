export async function fetchTop100() {
  const res = await fetch(
    `/api/kp?path=${encodeURIComponent(
      '/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
    )}`
  );

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function searchKinopoisk(query: string, page = 1) {
  if (!query) return { items: [] };

  const res = await fetch(
    `/api/kp?path=${encodeURIComponent(
      `/api/v2.1/films/search-by-keyword?keyword=${query}&page=${page}`
    )}`
  );

  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export function uniqueByPoster(items: any[]) {
  const seen = new Set();
  return items.filter(i => {
    const p = i.posterUrlPreview || i.posterUrl;
    if (!p || seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}
