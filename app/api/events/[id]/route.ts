// import { events } from "@/data/events";
import { NextResponse } from "next/server";
import { ambilEvent } from '@/data/ambil'

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  // const event = events.find((e) => e.id === Number(id));
  const event =  await ambilEvent(Number(id));

  if (!event) {
    return NextResponse.json(
      { pesan: "Event tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}