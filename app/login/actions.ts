"use server";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NAMA_COOKIE, UMUR_SESI, buatToken } from "@/lib/sesi";

export type HasilMasuk = { pesan: string };

const COOKIE_PERCOBAAN = "gagal_login";
const MAKS_PERCOBAAN = 5;
const WAKTU_BLOKIR = 60; // 1 menit (dalam detik)

// Fungsi bantuan untuk membandingkan kata sandi secara aman dari timing attack
function bandingkanSandiAman(inputSandi: string, sandiAsli: string): boolean {
  const bufInput = Buffer.from(inputSandi);
  const bufAsli = Buffer.from(sandiAsli);

  // timingSafeEqual mewajibkan panjang byte kedua buffer sama persis
  if (bufInput.length !== bufAsli.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufInput, bufAsli);
}

// Apa itu Timing Attack dan fungsi crypto.timingSafeEqual?

// Apa itu Timing Attack:
// Operasi perbandingan teks biasa (!== atau ===) bekerja dengan mencocokkan karakter satu per satu dari kiri ke kanan, lalu langsung berhenti begitu menemukan karakter yang tidak cocok. Artinya, jika karakter pertama salah, prosesnya selesai dalam hitungan nanodetik; jika 5 karakter pertama benar dan karakter ke-6 salah, prosesnya memakan waktu sedikit lebih lama. Penyerang dapat mengukur selisih waktu respons server yang sangat kecil ini untuk menebak kata sandi huruf demi huruf.

// Fungsi crypto.timingSafeEqual: 
// Fungsi bawaan modul crypto di Node.js ini membandingkan seluruh byte dari kedua data dalam waktu yang selalu konstan (sama persis), terlepas dari di posisi mana perbedaan karakter ditemukan. Dengan begitu, penyerang tidak bisa memanfaatkan selisih waktu respons untuk menebak kata sandi.

export async function masuk(_sebelum: HasilMasuk, formData: FormData): Promise<HasilMasuk> {
  const cookieStore = await cookies();
  const sandi = String(formData.get("sandi") ?? "");
  const dari = String(formData.get("dari") ?? "");
  const sandiAsli = process.env.ADMIN_PASSWORD ?? "";

  // 1. Cek jumlah percobaan gagal dari cookie
  const jumlahGagal = Number(cookieStore.get(COOKIE_PERCOBAAN)?.value ?? 0);
  if (jumlahGagal >= MAKS_PERCOBAAN) {
    return { pesan: "Terlalu banyak percobaan gagal. Coba lagi dalam 1 menit." };
  }

  // 2. Bandingkan kata sandi menggunakan timingSafeEqual
  if (!bandingkanSandiAman(sandi, sandiAsli)) {
    const gagalBaru = jumlahGagal + 1;
    
    // Simpan hitungan gagal ke cookie dengan masa berlaku 1 menit (60 detik)
    cookieStore.set(COOKIE_PERCOBAAN, String(gagalBaru), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: WAKTU_BLOKIR,
    });

    const sisa = MAKS_PERCOBAAN - gagalBaru;
    if (sisa <= 0) {
      return { pesan: "Terlalu banyak percobaan gagal. Akun dikunci selama 1 menit." };
    }
    return { pesan: `Kata sandi salah. Sisa percobaan: ${sisa} kali.` };
  }

  // 3. Jika berhasil masuk, hapus cookie penghitung gagal dan buat cookie sesi
  cookieStore.delete(COOKIE_PERCOBAAN);
  cookieStore.set(NAMA_COOKIE, await buatToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });

  redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluar() {
  (await cookies()).delete(NAMA_COOKIE);
  redirect("/login");
}