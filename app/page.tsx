
export const revalidate = 3600;

async function getPopular(type: 'movie' | 'tv') {
  const res = await fetch(
    `https://api.kinopoisk.dev/v1.4/movie?type=${type}&limit=20`,
    {
      headers: {
        'X-API-KEY': process.env.KINOPOISK_API_KEYS!
      },
      next: { revalidate: 3600 }
    }
  );
  return res.json();
}

export default async function Page() {
  const films = await getPopular('movie');
  const series = await getPopular('tv');

  return (
    <div>
      <h2>Popular Films</h2>
      <ul>
        {films.docs?.map((f:any) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>

      <h2>Popular Series</h2>
      <ul>
        {series.docs?.map((s:any) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
}
