import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// In-memory fallback store jika DB offline
export let mockUsers: Array<{
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
];

export function removeMockUser(id: string) {
  mockUsers = mockUsers.filter((u) => u.id !== id && u.email !== id);
}

export async function GET() {
  let dbUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    weddingSlug: string | null;
    createdAt: Date;
  }> = [];

  try {
    dbUsers = await db
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
  } catch {
    // ignore DB errors and rely on mockUsers below
  }

  const existingEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));
  const extraMock = mockUsers.filter((m) => !existingEmails.has(m.email.toLowerCase()));

  const combined = [...dbUsers, ...extraMock];
  return NextResponse.json({ users: combined });
}

export async function POST(request: Request) {
  try {
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

    const userRole = role === "superadmin" ? "superadmin" : "admin_mempelai";

    try {
      const inserted = await db
        .insert(schema.users)
        .values({
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          role: userRole,
          weddingSlug: slug,
        })
        .returning();

      return NextResponse.json({
        success: true,
        user: inserted[0],
      });
    } catch (err: unknown) {
      const errString = String(err);
      if (errString.includes("unique") || errString.includes("duplicate") || errString.includes("users_email_unique")) {
        return NextResponse.json(
          { error: "Email tersebut sudah terdaftar. Silakan gunakan nama/email lain." },
          { status: 400 }
        );
      }

      // In-memory fallback if DB unavailable
      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: userRole,
        weddingSlug: slug,
        createdAt: new Date(),
      };
      mockUsers.unshift(newUser);

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
    }
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
