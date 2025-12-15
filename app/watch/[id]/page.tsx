import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getFilmData(id: string) {
  const keys = (process.env.NEXT_PUBLIC_KINOPOISK_API_KEYS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const base = process.env.NEXT_PUBLIC_KINOPOISK_API_BASE || "https://kinopoiskapiunofficial.tech";
  for (const key of keys) {
    try {
      const res = await fetch(`${base}/api/v2.2/films/${id}`, {
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (res.ok) return res.json();
    } catch {}
  }
  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getFilmData(params.id);
  if (data && (data.nameRu || data.nameOriginal)) {
    const title = `${data.nameRu || data.nameOriginal}${data.year ? ` (${data.year})` : ""} | NX`;
    return { title, description: data.description || "Film haqida ma'lumot" };
  }
  return { title: "Film | NX" };
}

export default async function Page({ params }: { params: { id: string } }){
  const data = await getFilmData(params.id);
  const title = data?.nameRu || data?.nameOriginal || "Film";
  const year = data?.year ? ` (${data.year})` : "";
  const src = `https://api.linktodo.ws/embed/kp/${encodeURIComponent(params.id)}?host=kinobd.net`;
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">{title}{year} <span className="text-gray-400">| NX</span></h1>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <iframe src={src} allowFullScreen className="h-full w-full" />
      </div>
      {data?.description && <p className="text-sm text-gray-400 leading-relaxed">{data.description}</p>}
    </section>
  );
}
