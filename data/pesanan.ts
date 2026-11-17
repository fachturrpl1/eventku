export type Pesanan = {
    nomor : number;
    event_Id: number;
    judul: string;
    nama: string;
    email: string;
    jumlah: number;
    total:  number;
    dibuat: string;
    events: { judul : string } | null
};

//disimpan di memori server: hilang setiap server dimatikan
export const pesanan: Pesanan[] = [];

let nomorTerakhir = 0;

// Perbaiki Onit menjadi Omit di sini
export function tambahPesanan(data: Omit<Pesanan, 'nomor'>) {
    nomorTerakhir += 1;
    pesanan.unshift({ nomor:  nomorTerakhir, ...data})
    return nomorTerakhir;
}