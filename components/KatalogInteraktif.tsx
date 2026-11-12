"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import { rupiah, type Event } from "@/data/events";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogInteraktif({ events }: { events: Event[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  
  // 1. Set default awal selalu 'terbaru' untuk menyamakan server & client saat render pertama
  const [urut, setUrut] = useState("terbaru");

  // 2. Ambil dari localStorage setelah komponen terpasang di browser
  useEffect(() => {
    const nilaiSimpanan = localStorage.getItem('urut');
    if (nilaiSimpanan) {
      setUrut(nilaiSimpanan);
    }
  }, []);

  const [adaTiket, setAdaTiket] = useState(false);

  const daftarKategori = ["Semua", ...Array.from(new Set(events.map((e) => e.kategori)))];

  const handleUrutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nilaiBaru = e.target.value;
    setUrut(nilaiBaru);
    if (typeof window !== "undefined") {
      localStorage.setItem("urut", nilaiBaru);
    }
  };

  const hasil = events.filter(
    (e) =>
      e.judul.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || e.kategori === kategori) &&
      (!adaTiket || e.kuota - e.terisi > 0),
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.judul.localeCompare(b.judul);
    return a.tanggal.localeCompare(b.tanggal);
  });

  const totalSisaTiket = tersusun.reduce((acc, e) => acc + (e.kuota - e.terisi), 0);
  const totalHarga = tersusun.reduce((acc, e) => acc + e.harga, 0);
  const rataRataHarga = tersusun.length > 0 ? totalHarga / tersusun.length : 0;

  return (
    <div>
      <KontrolKatalog
        cari={cari}
        setCari={setCari}
        kategori={kategori}
        setKategori={setKategori}
        urut={urut}
        handleUrutChange={handleUrutChange}
        adaTiket={adaTiket}
        setAdaTiket={setAdaTiket}
        daftarKategori={daftarKategori}
        jumlahDitemukan={tersusun.length}
        rataRataHargaText={rupiah(rataRataHarga)}
        totalSisaTiket={totalSisaTiket}
      />
      
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