"use client";

export default function TombolHapus() {
  return (
    <button
      type="submit"
      className="text-red-600 underline"
      onClick={(e) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
          e.preventDefault(); // Batalkan form submit jika pengguna menekan "Cancel"
        }
      }}
    >
      Hapus
    </button>
  );
}