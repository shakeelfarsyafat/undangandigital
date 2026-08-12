import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { bulkCreateGuests } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.guests || !Array.isArray(body.guests)) {
      return NextResponse.json({ error: "Data tamu tidak valid" }, { status: 400 });
    }

    const userId = session.role === "superadmin" ? null : session.userId;
    const created = await bulkCreateGuests(body.guests, userId);

    return NextResponse.json({
      success: true,
      count: created.length,
      guests: created,
      message: `${created.length} tamu berhasil di-import!`,
    });
  } catch (error) {
    console.error("[POST /api/admin/guests/import] Error:", error);
    return NextResponse.json({ error: "Gagal meng-import daftar tamu" }, { status: 500 });
  }
}
