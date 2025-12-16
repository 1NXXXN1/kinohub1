const kp = (path: string) =>
  fetch(`/api/kp?path=${encodeURIComponent(path)}`, {
    cache: 'no-store',
  }).then((r) => {
    if (!r.ok) throw new Error(`KP ${r.status}`);
    return r.json();
  });

export const fetchTopFilms = () =>
  kp('/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1');

export const fetchTopSeries = () =>
  kp('/api/v2.2/films/collections?type=TOP_250_TV_SHOWS');

export const fetchTopCartoons = () =>
  kp('/api/v2.2/films/collections?type=KIDS_ANIMATION_THEME');

export const take = <T,>(arr: T[], n: number) => arr.slice(0, n);
