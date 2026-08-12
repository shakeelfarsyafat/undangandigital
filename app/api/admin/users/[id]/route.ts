import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { isUUID } from "@/lib/data-store";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isUUID(id)) {
      await db.delete(schema.users).where(eq(schema.users.id, id));
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

    if (isUUID(id)) {
      await db.update(schema.users).set(updates).where(eq(schema.users.id, id));
    }

    return NextResponse.json({ success: true, message: "Akun berhasil diperbarui" });
  } catch (error) {
    console.error("[PATCH /api/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui akun" }, { status: 500 });
  }
}
