import { notFound } from "next/navigation";
import FormPesan from "@/app/components/FormPesan";
import TombolFavorit from "@/app/components/TombolFavorit";
import { events, rupiah } from "@/data/events";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Detail({ params }: PageProps) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number(id));
  if (!event) notFound();

  const sisa = event.kuota - event.terisi;

  const eventTerkait = events.filter(
    (e) => e.kategori === event.kategori && e.id !== event.id
  );

  return (
    <article className="rounded-xl border bg-white p-6">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {event.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold">{event.judul}</h1>
      <p className="mt-1 text-slate-500">
        {event.tanggal} · {event.lokasi}
      </p>
      <p className="mt-4 text-xl font-semibold">{rupiah(event.harga)}</p>
      <p className="mt-1 text-slate-600">
        Sisa {sisa} dari {event.kuota} tiket
      </p>
      
      <TombolFavorit id={event.id} />
      <FormPesan event={event} />

      <div className="mt-8 border-t pt-4">
        <h3 className="mb-2 text-lg font-semibold">Event Terkait</h3>
        {eventTerkait.length === 0 ? (
          <p className="text-slate-500">Belum ada event terkait.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {eventTerkait.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.id}`} className="text-blue-600 hover:underline">
                  {e.judul}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Link href="/events" className="text-blue-600 hover:underline">
          Kembali ke Katalog
        </Link>
      </div>
    </article>
  );
}