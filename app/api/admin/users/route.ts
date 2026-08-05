import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const userList = await db
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

    return NextResponse.json({ users: userList });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, weddingSlug, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, Email, dan Password wajib diisi" }, { status: 400 });
    }

    // Check existing email
    const existingEmail = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).limit(1);
    if (existingEmail.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Process Slug
    let slug = weddingSlug ? weddingSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "") : "";
    if (!slug) {
      slug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    }

    // Check existing slug
    if (slug) {
      const existingSlug = await db.select().from(schema.users).where(eq(schema.users.weddingSlug, slug)).limit(1);
      if (existingSlug.length > 0) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(schema.users)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role || "admin_mempelai",
        weddingSlug: slug,
      })
      .returning();

    // Create initial empty wedding settings for this user
    await db.insert(schema.weddingSettings).values({
      userId: newUser.id,
      groomName: "Mempelai Pria",
      groomFullName: "Nama Lengkap Mempelai Pria",
      groomFather: "Ayah Mempelai Pria",
      groomMother: "Ibu Mempelai Pria",
      brideName: "Mempelai Wanita",
      brideFullName: "Nama Lengkap Mempelai Wanita",
      brideFather: "Ayah Mempelai Wanita",
      brideMother: "Ibu Mempelai Wanita",
      weddingDate: "2026-12-20",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        weddingSlug: newUser.weddingSlug,
      },
      message: `Akun admin "${newUser.name}" berhasil dibuat!`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat akun admin" }, { status: 500 });
  }
}
