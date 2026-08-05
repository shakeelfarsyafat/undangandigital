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
    } catch {
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
