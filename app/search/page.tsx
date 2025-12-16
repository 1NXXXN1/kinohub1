
export const revalidate = 3600;

import SearchClient from './search-client';

export default function Page({ searchParams }: any) {
  return <SearchClient query={searchParams?.q || ''} />;
}
