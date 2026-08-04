import { NextResponse } from "next/server";
import { getAllWishes } from "@/lib/data-store";

export async function GET() {
  try {
    const wishes = await getAllWishes();
    return NextResponse.json({ wishes });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat ucapan" }, { status: 500 });
  }
}
