"use client";

import { useState } from "react";
import { rupiah, type Event } from "@/data/events";
import KartuEvent from "./KartuEvent";

export default function KatalogInteraktif({ events }: { events: Event[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  
  const [urut, setUrut] = useState(() => {
    if (typeof window === "undefined") return "tanggal";
    return localStorage.getItem("urut") ?? "tanggal";
  });
  
  const [adaTiket, setAdaTiket] = useState(false);

  const handleUrutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nilaiBaru = e.target.value;
    setUrut(nilaiBaru);
    if (typeof window !== "undefined") {
      localStorage.setItem("urut", nilaiBaru);
    }
  };

  const daftarKategori = ["Semua", ...new Set(events.map((e) => e.kategori))];
  const hasil = events.filter(
    (e) =>
      e.judul.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || e.kategori === kategori) &&
      (!adaTiket || e.kuota - e.terisi > 0),
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === 'murah') return a.harga - b.harga;
    if (urut === 'mahal') return b.harga - a.harga;
    if (urut === "nama") return a.judul.localeCompare(b.judul);
    return a.tanggal.localeCompare(b.tanggal);
  });

  const totalSisaTiket = tersusun.reduce((acc, e) => acc + (e.kuota - e.terisi), 0);
  const totalHarga = tersusun.reduce((acc, e) => acc + e.harga, 0);
  const rataRataHarga = tersusun.length > 0 ? totalHarga / tersusun.length : 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari event..."
          className="rounded border bg-white px-3 py-2"
        />
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded border bg-white px-3 py-2"
        >
          {daftarKategori.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={urut}
          onChange={handleUrutChange}
          className="rounded border bg-white px-3 py-2"
        >
          <option value="tanggal">Tanggal terdekat</option>
          <option value="murah">Harga termurah</option>
          <option value="mahal">Harga termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
        
        <div className="w-full">
          <p className="text-sm text-slate-500">{tersusun.length} event ditemukan</p>
          <p className="text-sm text-slate-700 font-medium">
            Rata-rata harga {rupiah(rataRataHarga)} Total sisa tiket {totalSisaTiket}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={adaTiket}
            onChange={(e) => setAdaTiket(e.target.checked)}
          />
          Hanya yang masih ada tiket.
        </label>
      </div>
      
      {tersusun.length === 0 ? (
        <p className="text-slate-500">Tidak ada event yang cocok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.map((e) => (
            <KartuEvent key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}