
export const revalidate = 3600;

export default async function Page(props: {
  searchParams?: Promise<{ q?: string }>
}) {
  const sp = await props.searchParams;
  const q = sp?.q;

  return (
    <div>
      <h1>Films</h1>
      {q && <p>Search query: {q}</p>}
    </div>
  );
}
