export const revalidate = 3600;

import { getTop, searchAll } from '../../../lib/api';
import { Grid } from '../../../components/grid';
import { MediaCard } from '../../../components/media-card';
import { SearchBox } from '../../../components/search';

export default async function Page({ searchParams }: { searchParams: { q?: string }} ){
  const q = searchParams?.q;
  const base = q ? await searchAll(q) : await getTop('cartoon');
  const data = base.filter(x => x.type === 'cartoon');
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Multfilmlar</h1>
      <SearchBox />
      <Grid>{data.map(m => <MediaCard key={m.id+m.title} m={m} />)}</Grid>
    </section>
  );
}
