import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { seedDefaultsForUser } from "@/lib/data-store";

// Helper: slugify
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const dbUsers = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        weddingSlug: schema.users.weddingSlug,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt));

    return NextResponse.json({ users: dbUsers });
  } catch (error) {
    console.error("[GET /api/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar pengguna" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, weddingSlug, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, Email, dan Password wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === "superadmin" ? "superadmin" : "admin_mempelai";

    // Generate unique slug
    let finalSlug: string | null = null;
    if (weddingSlug && weddingSlug.trim()) {
      finalSlug = slugify(weddingSlug);
    } else if (userRole === "admin_mempelai") {
      finalSlug = slugify(cleanName);
    }

    if (finalSlug) {
      // Ensure slug uniqueness
      const existingSlugUser = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.weddingSlug, finalSlug))
        .limit(1);

      if (existingSlugUser.length > 0) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Check if email is already registered
    const existingEmail = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, cleanEmail))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: "Email tersebut sudah terdaftar. Silakan gunakan email lain." },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(schema.users)
      .values({
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: userRole,
        weddingSlug: finalSlug,
      })
      .returning();

    const newUser = inserted[0];

    // Seed defaults in PostgreSQL for this new mempelai user
    if (userRole === "admin_mempelai" && newUser?.id) {
      await seedDefaultsForUser(newUser.id, cleanName);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        weddingSlug: newUser.weddingSlug,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: unknown) {
    console.error("[POST /api/admin/users] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server saat mendaftarkan akun" }, { status: 500 });
  }
}
