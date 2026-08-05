import { NextResponse } from "next/server";
import {
  getWeddingSettings,
  updateWeddingSettings,
  getEvents,
  updateEvents,
  getBankAccounts,
  updateBankAccounts,
  getGallery,
  updateGallery,
  getLoveStories,
  updateLoveStories,
} from "@/lib/data-store";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Helper: ambil nama depan (kata pertama) lalu slug-ify
function firstNameSlug(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export async function GET() {
  try {
    const session = await getAdminSession();
    const userId = session?.userId || null;

    const settings = await getWeddingSettings(userId);
    const events = await getEvents(userId);
    const banks = await getBankAccounts(userId);
    const gallery = await getGallery(userId);
    const loveStories = await getLoveStories(userId);
    return NextResponse.json({ settings, events, banks, gallery, loveStories });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat pengaturan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const userId = session?.userId || null;

    const body = await request.json();
    let updatedSettings = null;
    let updatedEventsList = null;
    let updatedBanksList = null;
    let updatedGalleryList = null;
    let updatedStoriesList = null;

    if (body.settings) {
      updatedSettings = await updateWeddingSettings(body.settings, userId);
    } else {
      updatedSettings = await updateWeddingSettings({
        groomName: body.groomName,
        groomFullName: body.groomFullName,
        groomFather: body.groomFather,
        groomMother: body.groomMother,
        groomPhotoUrl: body.groomPhotoUrl,
        brideName: body.brideName,
        brideFullName: body.brideFullName,
        brideFather: body.brideFather,
        brideMother: body.brideMother,
        bridePhotoUrl: body.bridePhotoUrl,
        heroPhotoUrl: body.heroPhotoUrl,
        weddingDate: body.weddingDate,
      }, userId);
    }

    // Auto-update weddingSlug di tabel users berdasarkan nama depan mempelai
    const groomName = body.groomName || body.settings?.groomName;
    const brideName = body.brideName || body.settings?.brideName;

    if (groomName && brideName && session?.userId) {
      try {
        const groomSlug = firstNameSlug(groomName);
        const brideSlug = firstNameSlug(brideName);
        if (groomSlug && brideSlug) {
          let newSlug = `${groomSlug}-${brideSlug}`;

          // Cek apakah slug sudah dipakai akun lain
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.weddingSlug, newSlug))
            .limit(1);

          if (existing.length > 0 && existing[0].id !== session.userId) {
            newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
          }

          await db
            .update(users)
            .set({ weddingSlug: newSlug })
            .where(eq(users.id, session.userId));
        }
      } catch {
        // Jika gagal update slug, tetap lanjutkan
      }
    }

    if (body.events && Array.isArray(body.events)) {
      updatedEventsList = await updateEvents(body.events, userId);
    }

    if (body.banks && Array.isArray(body.banks)) {
      updatedBanksList = await updateBankAccounts(body.banks, userId);
    }

    if (body.gallery && Array.isArray(body.gallery)) {
      updatedGalleryList = await updateGallery(body.gallery, userId);
    }

    if (body.loveStories && Array.isArray(body.loveStories)) {
      updatedStoriesList = await updateLoveStories(body.loveStories, userId);
    }

    return NextResponse.json({
      settings: updatedSettings,
      events: updatedEventsList,
      banks: updatedBanksList,
      gallery: updatedGalleryList,
      loveStories: updatedStoriesList,
      message: "Pengaturan berhasil disimpan",
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
