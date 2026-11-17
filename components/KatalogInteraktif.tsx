"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Event } from "@/data/events";
import { type Saringan, alamatHalaman } from "@/data/saring";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

type Props = {
  events: Event[];
  saringanAwal: Saringan;
  semuaEvent: Event[];
};

export default function KatalogInteraktif({ events, saringanAwal, semuaEvent }: Props) {
  const router = useRouter();
  const [teksCari] = useState(saringanAwal.cari);

  const updateFilter = (kunciBaru: Partial<Saringan>) => {
    const saringanBaru: Saringan = { ...saringanAwal, ...kunciBaru, hal: 1 };
    router.replace(alamatHalaman(saringanBaru, saringanBaru.hal), { scroll: false });
  };

  // Debounce: tunggu 400 ms setelah pengguna berhenti mengetik
  useEffect(() => {
    if (teksCari === saringanAwal.cari) return;
    const timer = setTimeout(() => updateFilter({ cari: teksCari }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teksCari]);

  const daftarKategori = ["Semua", ...Array.from(new Set(semuaEvent.map((e) => e.kategori)))];

  return (
    <div>
      <KontrolKatalog s={saringanAwal} daftarKategori={daftarKategori} />

      {events.length === 0 ? (
        <p className="text-slate-500">Tidak ada event yang cocok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <KartuEvent key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}