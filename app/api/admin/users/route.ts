import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// In-memory fallback store jika DB offline
let mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  weddingSlug: string | null;
  createdAt: Date;
}> = [
  {
    id: "superadmin-id",
    name: "Super Admin Platform",
    email: "superadmin@wedding.com",
    passwordHash: "$2a$10$placeholder",
    role: "superadmin",
    weddingSlug: null,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "admin-id",
    name: "Admin Platform",
    email: "admin@wedding.com",
    passwordHash: "$2a$10$placeholder",
    role: "superadmin",
    weddingSlug: null,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "mempelai-id",
    name: "Mempelai Demo",
    email: "mempelai@wedding.com",
    passwordHash: "$2a$10$placeholder",
    role: "admin_mempelai",
    weddingSlug: "demo",
    createdAt: new Date("2026-01-01"),
  },
];

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
    // Fallback ke in-memory
    return NextResponse.json({
      users: mockUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        weddingSlug: u.weddingSlug,
        createdAt: u.createdAt,
      })),
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, weddingSlug, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nama, Email, dan Password wajib diisi" }, { status: 400 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 10);
  const slug: string | null =
    weddingSlug && weddingSlug.trim()
      ? weddingSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "")
      : null;

  // Coba DB dulu
  try {
    // Check existing email
    const existingEmail = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, cleanEmail))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Check existing slug
    let finalSlug = slug;
    if (finalSlug) {
      const existingSlug = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.weddingSlug, finalSlug))
        .limit(1);
      if (existingSlug.length > 0) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const [newUser] = await db
      .insert(schema.users)
      .values({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role || "admin_mempelai",
        weddingSlug: finalSlug,
      })
      .returning();

    // Buat initial wedding settings
    try {
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
    } catch {
      // Wedding settings optional, tidak critical
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        weddingSlug: newUser.weddingSlug,
      },
      message: `Akun "${newUser.name}" berhasil dibuat!`,
    });
  } catch (dbError) {
    // Fallback: simpan ke in-memory jika DB offline
    console.warn("[POST /api/admin/users] DB offline, using in-memory fallback:", dbError);

    // Cek duplikat email di mock
    const duplicate = mockUsers.find((u) => u.email === cleanEmail);
    if (duplicate) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const newId = `mock-${Date.now()}`;
    const newMockUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: role || "admin_mempelai",
      weddingSlug: slug,
      createdAt: new Date(),
    };

    mockUsers.push(newMockUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newMockUser.id,
        name: newMockUser.name,
        email: newMockUser.email,
        role: newMockUser.role,
        weddingSlug: newMockUser.weddingSlug,
      },
      message: `Akun "${newMockUser.name}" berhasil dibuat! (Mode offline — data sementara)`,
    });
  }
}
