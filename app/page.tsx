import Link from "next/dist/client/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-4xl font-bold ">
        Temukan event seru di sekolahmu
      </h1>
      <p className="textmt-3 text-slate-600">
        Workshop, lomba, musik dan bazar. pesan tiketnya di sini.
      </p>
      <Link href="/event" className="mt-6 inline-block rounded-lg bg-emerald-600 px-2.5 font-medium text-white hover:bg-blue-700"> 
        Lihat semua event 
      </Link>
    </section>
  );
}
