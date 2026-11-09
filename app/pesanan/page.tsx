import Link from 'next/link';
import { cookies } from 'next/headers';
import { pesanan } from '@/data/pesanan';
import { rupiah } from '@/data/events';
import { batalkanTiket } from '@/app/actions';

export default async function HalamanPesanan() {
    const namaCookie = (await cookies()).get("nama")?.value ?? "";

    const totalTiket = pesanan.reduce((t, p) => t + p.jumlah, 0);
    const pendapatan = pesanan.reduce((t, p) => t + p.total, 0);

    return(
        <div className="p-6">
            <h1 className='mb-2 text-2xl font-bold'>Daftar Pesanan</h1>
            
            {namaCookie && (
                <p className="mb-4 text-slate-700 font-medium">
                    Halo, {namaCookie}!
                </p>
            )}

            {pesanan.length === 0 ? (
                <p className='text-slate-500'>Belum ada pesanan.{" "}
                    <Link href='/event' className="text-blue-600 hover:underline">
                        Pilih event
                    </Link>
                </p>
            ) : (
                <>
                    <p className="mb-3 text-sm text-slate-500">
                      {pesanan.length} pesanan · {totalTiket} tiket · pendapatan {rupiah(pendapatan)}
                    </p>
                    <table className="w-full rounded-xl border bg-white text-sm">
                      <thead className="bg-slate-100 text-left">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Event</th>
                          <th className="p-2">Pemesan</th>
                          <th className="p-2">Tiket</th>
                          <th className="p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pesanan.map((p) => {
                          // 3. Cek apakah pesanan ini milik pengguna yang cookie-nya aktif
                          const milikSaya = namaCookie && p.nama.toLowerCase() === namaCookie.toLowerCase();
                          
                          return (
                            <tr key={p.nomor} className="border-t">
                              <td className="p-2">{p.nomor}</td>
                              <td className="p-2">{p.judul}</td>
                              <td className="p-2 flex items-center gap-2">
                                {p.nama}
                                {/* 4. Tampilkan label hijau "Kamu" jika cocok */}
                                {milikSaya && (
                                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                                    Kamu
                                  </span>
                                )}
                              </td>
                              <td className="p-2">{p.jumlah}</td>
                              <td className="p-2">{rupiah(p.total)}</td>
                              <td className='p-2'>
                                {milikSaya && (
                                    <form action={batalkanTiket}>
                                        <input type="hidden" name="nomor" value={p.nomor} />
                                        <button className="text-red-600 underline text-xs">Batalkan</button>
                                    </form>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                </>
            )}
        </div>
    );
}