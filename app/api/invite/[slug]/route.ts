import { NextResponse } from "next/server";
import {
  getGuestBySlug,
  markGuestOpened,
  getWeddingSettings,
  getEvents,
  getBankAccounts,
  getLoveStories,
  getGallery,
} from "@/lib/data-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const guest = await getGuestBySlug(slug);

    if (!guest) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    // Tracking unopened -> opened
    if (guest.invitationStatus === "unopened") {
      await markGuestOpened(guest.id);
    }

    const settings = await getWeddingSettings();
    const events = await getEvents();
    const banks = await getBankAccounts();
    const loveStories = await getLoveStories();
    const gallery = await getGallery();

    return NextResponse.json({
      guest: {
        id: guest.id,
        name: guest.name,
        slug: guest.slug,
        category: guest.category,
      },
      settings,
      events,
      banks,
      loveStories,
      gallery,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data undangan" }, { status: 500 });
  }
}
