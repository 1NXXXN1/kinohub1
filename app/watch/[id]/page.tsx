import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: `Tomosha: ${params.id}` };
}
export default function Page({ params }: { params: { id: string } }){
  const { id } = params;
  const src = `https://api.linktodo.ws/embed/kp/${encodeURIComponent(id)}?host=kinobd.net`;
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Pleyer</h1>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <iframe src={src} allowFullScreen className="h-full w-full"/>
      </div>
      <p className="text-xs text-mute">Manba: linktodo.ws · ID Kinopoisk API dan olinadi.</p>
    </section>
  );
}
