import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteGuest } from "@/lib/data-store";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID tamu wajib diisi" }, { status: 400 });
    }

    await deleteGuest(id);
    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/admin/guests/[id]] Error:", error);
    return NextResponse.json({ error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
