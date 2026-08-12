import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllRsvps } from "@/lib/data-store";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.role === "superadmin" ? null : session.userId;
    const rsvps = await getAllRsvps(userId);
    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error("[GET /api/admin/rsvp] Error:", error);
    return NextResponse.json({ error: "Gagal memuat RSVP" }, { status: 500 });
  }
}
