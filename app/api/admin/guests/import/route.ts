import { NextResponse } from "next/server";
import { bulkCreateGuests } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.guests || !Array.isArray(body.guests)) {
      return NextResponse.json({ error: "Data tamu tidak valid" }, { status: 400 });
    }

    const created = await bulkCreateGuests(body.guests);
    return NextResponse.json({
      success: true,
      count: created.length,
      guests: created,
      message: `${created.length} tamu berhasil di-import!`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal meng-import daftar tamu" }, { status: 500 });
  }
}
