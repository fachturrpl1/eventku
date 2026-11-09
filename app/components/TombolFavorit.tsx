"use client";

import { useEffect, useState } from "react";

export default function TombolFavorit({ id }: { id: number }) {
  const [favorit, setFavorit] = useState(false);
  const [sudahMount, setSudahMount] = useState(false);

  // Tandai bahwa komponen sudah terpasang di browser
  useEffect(() => {
    setSudahMount(true);
    const nilaiSimpanan = localStorage.getItem(`favorit_${id}`);
    if (nilaiSimpanan === "true") {
      setFavorit(true);
    }
  }, [id]);

  const ubah = () => {
    const statusBaru = !favorit;
    setFavorit(statusBaru);
    localStorage.setItem(`favorit_${id}`, String(statusBaru));
  };

  // Selama belum mount (di server / render pertama), tampilkan teks default yang sama agar tidak mismatch
  if (!sudahMount) {
    return (
      <button className="mt-3 rounded border px-3 py-1.5 text-sm">
        {" ♡ Tambah favorit"}
      </button>
    );
  }

  return (
    <button onClick={ubah} className="mt-3 rounded border px-3 py-1.5 text-sm">
      {favorit ? " ♥ Favorit" : " ♡ Tambah favorit"}
    </button>
  );
}