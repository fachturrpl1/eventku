import { NextResponse, type NextRequest } from "next/server";
import { NAMA_COOKIE, tokenSah } from "@/lib/sesi";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(NAMA_COOKIE)?.value;
  if (await tokenSah(token)) return NextResponse.next();

  const tujuan = new URL("/login", request.url);
  tujuan.searchParams.set("dari", request.nextUrl.pathname);
  return NextResponse.redirect(tujuan);
}

//hanya jalan untuk alamat yang diambil /admin
export const config = {
  matcher: ["/admin/:path*"],
};
