import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mockUsers } from "@/app/api/admin/users/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format input tidak valid", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const rawEmail = email.toLowerCase().trim();
    // Allow entering just prefix (e.g. "novianti" -> "novianti@wedding.com")
    const cleanEmail = rawEmail.includes("@") ? rawEmail : `${rawEmail}@wedding.com`;

    let user: { id: string; name: string; email: string; passwordHash: string; role: string } | null = null;

    // 1. Search in DB first
    try {
      const res = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
      if (res.length > 0) {
        user = res[0];
      }
    } catch {
      // Fallback below
    }

    // 2. Search in mockUsers fallback if not found in DB
    if (!user) {
      const mockFound = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (mockFound) {
        user = mockFound;
      }
    }

    const isSuperAdminEmail = cleanEmail === "superadmin@wedding.com" || cleanEmail === "admin@wedding.com";
    const isSuperAdminPasswordMatch = password === "superadmin123" || password === "superadmin" || password === "admin123" || password === "admin";

    // 3. Superadmin or default fallback if user doesn't exist
    if (!user) {
      if (isSuperAdminEmail && isSuperAdminPasswordMatch) {
        const emailName = cleanEmail === "admin@wedding.com" ? "Admin Platform" : "Super Admin Platform";
        const token = await createSession({
          userId: "superadmin-id",
          email: cleanEmail,
          name: emailName,
          role: "superadmin",
        });

        const response = NextResponse.json({
          success: true,
          user: { id: "superadmin-id", email: cleanEmail, name: emailName, role: "superadmin" },
        });

        response.cookies.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }

      if (cleanEmail === "mempelai@wedding.com" && (password === "mempelai123" || password === "mempelai")) {
        const token = await createSession({
          userId: "mempelai-default-id",
          email: "mempelai@wedding.com",
          name: "Admin Mempelai",
          role: "admin_mempelai",
        });

        const response = NextResponse.json({
          success: true,
          user: { id: "mempelai-default-id", email: "mempelai@wedding.com", name: "Admin Mempelai", role: "admin_mempelai" },
        });

        response.cookies.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }

      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // 4. Verify password
    let isValidPassword = await verifyPassword(password, user.passwordHash);

    // Master fallback if superadmin email matches
    if (!isValidPassword && isSuperAdminEmail && isSuperAdminPasswordMatch) {
      isValidPassword = true;
    }

    // Auto fallback for mempelai accounts (nama_awal + "123")
    if (!isValidPassword && user.role === "admin_mempelai") {
      const firstWord = user.name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      const expectedAutoPassword = (firstWord || "mempelai") + "123";
      if (password.toLowerCase().trim() === expectedAutoPassword || password === "mempelai123") {
        isValidPassword = true;
        // Sync password hash in DB if possible
        try {
          const newHash = await hashPassword(expectedAutoPassword);
          await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
        } catch {
          // ignore
        }
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server saat login" }, { status: 500 });
  }
}
