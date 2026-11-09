"use server";

import { events } from "@/data/events";
import { pesanan, tambahPesanan } from "@/data/pesanan";
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'

export type HasilPesan = {
  berhasil: boolean;
  pesan: string;
  galat: { nama?: string; email?: string; jumlah?: string };
  isian: { nama: string; email: string };
};

export async function pesanTiket(_sebelum: HasilPesan, formData: FormData): Promise<HasilPesan> {
  const eventId = Number(formData.get("eventId"));
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const jumlah = Number(formData.get("jumlah"));
  const isian = { nama, email };
  const toples = await cookies();

  toples.set('nama', nama, {maxAge: 60 * 60 * 24 * 30});

  console.log('pesanan masuk;', nama, jumlah);
  // pura-pura server sedang sibuk, supaya tombol "Memproses..." terlihat
  await new Promise((r) => setTimeout(r, 800));

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return { berhasil: false, pesan: "Event tidak ditemukan.", galat: {}, isian };
  }

  const sisa = event.kuota - event.terisi;
  const galat: HasilPesan["galat"] = {};
  if (nama.length < 3) galat.nama = "Nama minimal 3 huruf.";
  if (!email.includes("@")) galat.email = "Email harus memuat tanda @.";
  if (!Number.isInteger(jumlah) || jumlah < 1) galat.jumlah = "Jumlah tiket minimal 1.";
  else if (jumlah > 5) galat.jumlah = "Maksimal 5 tiket per pesanan.";
  else if (jumlah > sisa) galat.jumlah = `Sisa tiket hanya ${sisa}.`;

  if (Object.keys(galat).length > 0) {
    return { berhasil: false, pesan: "Periksa lagi isian yang merah.", galat, isian };
  }

  event.terisi += jumlah;
  const nomor = tambahPesanan({
    eventId,
    judul: event.judul,
    nama,
    email,
    jumlah,
    total: event.harga * jumlah,
    waktu: new Date().toLocaleString("id-ID"),
  });

  revalidatePath('/events');
  revalidatePath(`/events/${eventId}`)
  revalidatePath('/pesanan')

  return {
    berhasil: true,
    pesan: `Pesanan #${nomor} tersimpan: ${jumlah} tiket untuk ${nama}.`,
    galat: {},
    isian: { nama, email: "" },
  };
}

export async function batalkanTiket(formData: FormData) {
  const nomor = Number(formData.get('nomor'));
  const namaSaya = (await cookies()).get('nama')?.value;
  const i = pesanan.findIndex((p) => p.nomor === nomor);
  if (i === -1 || pesanan[i].nama !== namaSaya) return;

  const [batal] = pesanan.splice(i, 1);
  const event = events.find((e) => e.id === batal.eventId);
  if (event) event.terisi -= batal.jumlah;

  revalidatePath("/event");
  revalidatePath(`/event/${batal.eventId}`);
  revalidatePath("/pesanan");
}