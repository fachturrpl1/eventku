import Link from "next/link";
import { alamatHalaman, type Saringan } from "@/data/saring";

type Props = {
  s: Saringan;
  hal: number;
  jumlah: number;
};

export default function Halaman({ s, hal, jumlah }: Props) {
  if (jumlah <= 1) return null;

  const nomor = Array.from({ length: jumlah }, (_, i) => i + 1);

  return (
    <nav aria-label="Nomor halaman" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {hal > 1 && (
        <Link href={alamatHalaman(s, hal - 1)} className="rounded border px-3 py-1 text-sm hover:bg-slate-100">
          « Sebelumnya
        </Link>
      )}

      {nomor.map((n) => (
        <Link
          key={n}
          href={alamatHalaman(s, n)}
          aria-current={n === hal ? "page" : undefined}
          className={
            n === hal
              ? "rounded border border-blue-600 bg-blue-600 px-3 py-1 text-sm font-bold text-white"
              : "rounded border px-3 py-1 text-sm hover:bg-slate-100"
          }
        >
          {n}
        </Link>
      ))}

      {hal < jumlah && (
        <Link href={alamatHalaman(s, hal + 1)} className="rounded border px-3 py-1 text-sm hover:bg-slate-100">
          Berikutnya »
        </Link>
      )}
    </nav>
  );
}