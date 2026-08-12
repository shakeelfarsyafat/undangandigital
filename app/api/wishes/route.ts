import { NextResponse } from "next/server";
import { getAllWishes, isUUID } from "@/lib/data-store";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");
    const weddingSlug = searchParams.get("weddingSlug");
    const guestSlug = searchParams.get("guestSlug");
    const guestId = searchParams.get("guestId");

    if (!userId && weddingSlug) {
      const userRes = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.weddingSlug, weddingSlug))
        .limit(1);
      if (userRes.length > 0) {
        userId = userRes[0].id;
      }
    }

    if (!userId && guestSlug) {
      const guestRes = await db
        .select({ userId: schema.guests.userId })
        .from(schema.guests)
        .where(eq(schema.guests.slug, guestSlug))
        .limit(1);
      if (guestRes.length > 0 && guestRes[0].userId) {
        userId = guestRes[0].userId;
      }
    }

    if (!userId && guestId && isUUID(guestId)) {
      const guestRes = await db
        .select({ userId: schema.guests.userId })
        .from(schema.guests)
        .where(eq(schema.guests.id, guestId))
        .limit(1);
      if (guestRes.length > 0 && guestRes[0].userId) {
        userId = guestRes[0].userId;
      }
    }

    const wishes = await getAllWishes(userId);
    return NextResponse.json({ wishes });
  } catch (error) {
    console.error("[GET /api/wishes] Error:", error);
    return NextResponse.json({ error: "Gagal memuat ucapan" }, { status: 500 });
  }
}
