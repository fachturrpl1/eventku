"use client";

import { useState } from "react";

export default function TombolFavorit({ id }: { id: number }) {
  const [favorit, setFavorit] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`favorit_${id}`) === 'true';
    }
    return false;
  });

  const ubah = () => {
    const statusBaru = !favorit;
    setFavorit(statusBaru);
    localStorage.setItem(`favorit_${id}`, String(statusBaru));
  };

  return (
    <button onClick={ubah} className="mt-3 rounded border px-3 py-1.5 text-sm">
      {favorit ? " ♥ Favorit" : " ♡ Tambah favorit"}
    </button>
  );
}