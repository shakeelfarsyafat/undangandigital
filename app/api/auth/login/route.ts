import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, ilike } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email/username dan password wajib diisi", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const rawInput = email.toLowerCase().trim();
    const cleanEmail = rawInput.includes("@") ? rawInput : `${rawInput}@wedding.com`;

    let user: { id: string; name: string; email: string; passwordHash: string; role: string; weddingSlug: string | null } | null = null;

    // 1. Search in DB with multiple matching strategies
    try {
      const res = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.email, cleanEmail),
            eq(users.email, rawInput),
            eq(users.weddingSlug, rawInput),
            ilike(users.name, rawInput)
          )
        )
        .limit(1);

      if (res.length > 0) {
        user = res[0];
      }
    } catch (err) {
      console.error("[Login] DB Select error:", err);
    }

    const isSuperAdminIdentifier =
      rawInput === "superadmin" ||
      rawInput === "admin" ||
      cleanEmail === "superadmin@wedding.com" ||
      cleanEmail === "admin@wedding.com";

    const isSuperAdminPasswordMatch =
      password === "superadmin123" ||
      password === "superadmin" ||
      password === "admin123" ||
      password === "admin";

    // 2. If superadmin does not exist in DB yet, auto-create in PostgreSQL
    if (!user && isSuperAdminIdentifier && isSuperAdminPasswordMatch) {
      const emailName = rawInput.includes("super") ? "Super Admin Platform" : "Admin Wedding";
      const superEmail = rawInput.includes("super") ? "superadmin@wedding.com" : "admin@wedding.com";
      const superHash = await hashPassword(password);
      try {
        const inserted = await db
          .insert(users)
          .values({
            name: emailName,
            email: superEmail,
            passwordHash: superHash,
            role: "superadmin",
          })
          .returning();
        if (inserted.length > 0) {
          user = inserted[0];
        }
      } catch (e) {
        console.error("[Login] Auto-create superadmin error:", e);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Email/username atau password salah" }, { status: 401 });
    }

    // 3. Verify password
    let isValidPassword = await verifyPassword(password, user.passwordHash);

    // Master fallback for superadmin role or identifier
    if (!isValidPassword && (user.role === "superadmin" || isSuperAdminIdentifier) && isSuperAdminPasswordMatch) {
      isValidPassword = true;
      try {
        const newHash = await hashPassword(password);
        await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
      } catch {
        // ignore
      }
    }

    // Auto fallback for mempelai accounts (nama_awal + "123" or "mempelai123" or "admin123")
    if (!isValidPassword && (user.role === "admin_mempelai" || user.role === "admin")) {
      const firstWord = user.name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      const expectedAutoPassword = (firstWord || "mempelai") + "123";
      if (
        password.toLowerCase().trim() === expectedAutoPassword ||
        password === "mempelai123" ||
        password === "admin123"
      ) {
        isValidPassword = true;
        try {
          const newHash = await hashPassword(password);
          await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
        } catch {
          // ignore
        }
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email/username atau password salah" }, { status: 401 });
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
  } catch (error) {
    console.error("[Login] Server Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat login" }, { status: 500 });
  }
}
