import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    let weddingSlug = null;
    if (session.userId) {
      try {
        const userRes = await db
          .select({ weddingSlug: users.weddingSlug })
          .from(users)
          .where(eq(users.id, session.userId))
          .limit(1);
        if (userRes.length > 0) {
          weddingSlug = userRes[0].weddingSlug;
        }
      } catch {
        // Safely catch non-UUID IDs (e.g. superadmin-id) or query issues
      }
    }

    return NextResponse.json({
      user: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        weddingSlug,
      },
    });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
