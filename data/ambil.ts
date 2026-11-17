import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Event } from "@/data/events";

export async function ambilEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from("events").select("*").order("tanggal");
  if (error) throw new Error("Gagal memuat event: " + error.message);
  return data as Event[];
}

export async function ambilEvent(id: number): Promise<Event | null> {
  // Isi URL bisa apa saja (misalnya /event/abc). Periksa dulu sebelum bertanya ke database.
  if (!Number.isInteger(id)) return null;
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Gagal memuat event: " + error.message);
  return data as Event | null;
}

export async function ambilTerkait(event: Event): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("kategori", event.kategori)
    .neq("id", event.id)
    .order("tanggal");
  if (error) throw new Error("Gagal memuat event terkait: " + error.message);
  return data as Event[];
}

// Pesanan berisi nama dan email orang, jadi dibaca memakai kunci rahasia (hanya di server).
export async function hitungPesanan(eventId: number): Promise<{ jumlahPesanan: number; totalTiket: number }> {
  // 1. Hitung jumlah baris pesanan
  const { count: jumlahPesanan, error: errorPesanan } = await supabaseAdmin
    .from("pesanan")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);
  
  if (errorPesanan) throw new Error("Gagal menghitung pesanan: " + errorPesanan.message);

  // 2. Ambil data jumlah tiket untuk dijumlahkan
  const { data: dataTiket, error: errorTiket } = await supabaseAdmin
    .from("pesanan")
    .select("jumlah")
    .eq("event_id", eventId);

  if (errorTiket) throw new Error("Gagal memuat data tiket: " + errorTiket.message);

  const totalTiket = dataTiket.reduce((acc, curr) => acc + curr.jumlah, 0);
  
  return { 
    jumlahPesanan: jumlahPesanan ?? 0, 
    totalTiket 
  };
}