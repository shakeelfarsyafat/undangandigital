import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { getWeddingSettings, getEvents, getBankAccounts, getLoveStories } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingSlug = searchParams.get("weddingSlug");
    const guestSlug = searchParams.get("guestSlug") || searchParams.get("slug");

    let userId: string | null = null;
    let guestData: { id: string; name: string; slug: string; category: string } | null = null;

    if (weddingSlug) {
      const userRes = await db.select().from(schema.users).where(eq(schema.users.weddingSlug, weddingSlug)).limit(1);
      if (userRes.length > 0) {
        userId = userRes[0].id;
      }
    }

    if (guestSlug) {
      try {
        const guestQuery = userId
          ? await db.select().from(schema.guests).where(eq(schema.guests.slug, guestSlug)).limit(1)
          : await db.select().from(schema.guests).where(eq(schema.guests.slug, guestSlug)).limit(1);

        if (guestQuery.length > 0) {
          guestData = guestQuery[0];
          if (!userId && guestQuery[0].userId) {
            userId = guestQuery[0].userId;
          }
        }
      } catch {
        // fallback
      }
    }

    if (!guestData) {
      guestData = {
        id: "g-guest",
        name: "Tamu Undangan",
        slug: guestSlug || "tamu-undangan",
        category: "Teman",
      };
    }

    const settings = await getWeddingSettings();
    const events = await getEvents();
    const banks = await getBankAccounts();
    const loveStories = await getLoveStories();

    return NextResponse.json({
      guest: guestData,
      settings,
      events,
      banks,
      loveStories,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data undangan" }, { status: 500 });
  }
}
