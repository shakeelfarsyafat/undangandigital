import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { removeMockUser } from "../route";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    removeMockUser(id);

    if (uuidRegex.test(id)) {
      try {
        await db.delete(schema.users).where(eq(schema.users.id, id));
      } catch (dbErr) {
        console.warn("[DELETE /api/admin/users] DB delete error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal menghapus akun" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newPassword, name, weddingSlug } = body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (weddingSlug !== undefined) updates.weddingSlug = weddingSlug || null;
    if (newPassword) {
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (uuidRegex.test(id)) {
      try {
        await db.update(schema.users).set(updates).where(eq(schema.users.id, id));
      } catch (dbErr) {
        console.warn("[PATCH /api/admin/users] DB update error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Akun berhasil diperbarui" });
  } catch (error) {
    console.error("[PATCH /api/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui akun" }, { status: 500 });
  }
}
