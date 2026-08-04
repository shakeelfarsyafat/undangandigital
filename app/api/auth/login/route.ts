import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    let user: { id: string; name: string; email: string; passwordHash: string; role: string } | null = null;

    try {
      const res = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (res.length > 0) {
        user = res[0];
      }
    } catch (e) {
      // DB offline fallback for default admin
      if (email === "admin@wedding.com" && password === "admin123") {
        const token = await createSession({
          userId: "admin-default-id",
          email: "admin@wedding.com",
          name: "Admin Wedding",
          role: "admin",
        });

        const response = NextResponse.json({ success: true, user: { email: "admin@wedding.com", name: "Admin Wedding" } });
        response.cookies.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    if (!user) {
      // Default admin check fallback
      if (email === "admin@wedding.com" && password === "admin123") {
        const token = await createSession({
          userId: "admin-default-id",
          email: "admin@wedding.com",
          name: "Admin Wedding",
          role: "admin",
        });

        const response = NextResponse.json({ success: true, user: { email: "admin@wedding.com", name: "Admin Wedding" } });
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

    const isValidPassword = await verifyPassword(password, user.passwordHash);
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
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
