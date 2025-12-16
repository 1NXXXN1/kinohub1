

export async function fallbackPopularFromTMDB() {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular');
  return res.json();
}
