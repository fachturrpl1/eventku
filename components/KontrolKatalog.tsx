import React from "react";

interface KontrolKatalogProps {
  cari: string;
  setCari: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  urut: string;
  handleUrutChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  adaTiket: boolean;
  setAdaTiket: (val: boolean) => void;
  daftarKategori: string[];
  jumlahDitemukan: number;
  rataRataHargaText: string;
  totalSisaTiket: number;
}

export default function KontrolKatalog({
  cari,
  setCari,
  kategori,
  setKategori,
  urut,
  handleUrutChange,
  adaTiket,
  setAdaTiket,
  daftarKategori,
  jumlahDitemukan,
  rataRataHargaText,
  totalSisaTiket,
}: KontrolKatalogProps) {
  return (
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
        <p className="text-sm text-slate-500">{jumlahDitemukan} event ditemukan</p>
        <p className="text-sm text-slate-700 font-medium">
          Rata-rata harga {rataRataHargaText} Total sisa tiket {totalSisaTiket}
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
  );
}