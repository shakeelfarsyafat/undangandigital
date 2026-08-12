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
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = (slug || "").toLowerCase().trim();

    // 1. Check Demo Slug
    if (cleanSlug === "demo") {
      return NextResponse.json({
        guest: {
          id: "demo-guest-id",
          name: "Tamu Undangan (Demo)",
          slug: "demo",
          category: "Teman",
        },
        settings: {
          groomName: "Ahmad",
          groomFullName: "Ahmad Fauzi, S.T.",
          groomFather: "Bpk. H. Rahmat",
          groomMother: "Ibu Hj. Siti",
          groomInstagram: "ahmad.fauzi",
          groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
          brideName: "Nabila",
          brideFullName: "Nabila Putri, S.Ked.",
          brideFather: "Bpk. H. Hasan",
          brideMother: "Ibu Hj. Aminah",
          brideInstagram: "nabila.putri",
          bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
          weddingDate: "2026-12-20",
          heroPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
          musicUrl: "/music/wedding.mp3",
          quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
          giftRecipient: "Ahmad & Nabila",
          giftPhone: "081234567890",
          giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat",
        },
        events: [
          {
            id: "demo-event-1",
            type: "akad",
            title: "Akad Nikah",
            date: "Minggu, 20 Desember 2026",
            startTime: "08.00",
            endTime: "10.00 WIB",
            venueName: "Masjid Agung Al-Azhar",
            venueAddress: "Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan",
            mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
          },
          {
            id: "demo-event-2",
            type: "reception",
            title: "Resepsi Pernikahan",
            date: "Minggu, 20 Desember 2026",
            startTime: "11.00",
            endTime: "15.00 WIB",
            venueName: "Ballroom Hotel Grand Mahakam",
            venueAddress: "Jl. Mahakam No. 6, Kebayoran Baru, Jakarta Selatan",
            mapsUrl: "https://maps.google.com/?q=Hotel+Grand+Mahakam",
          },
        ],
        banks: [
          { id: "demo-b-1", bankName: "BCA", accountNumber: "1234567890", accountHolder: "Ahmad Fauzi" },
          { id: "demo-b-2", bankName: "Mandiri", accountNumber: "9876543210", accountHolder: "Nabila Putri" },
        ],
        loveStories: [
          { id: "demo-s-1", year: "2021", title: "Pertama Bertemu", description: "Awal perkenalan di kampus saat kegiatan organisasi bersama." },
          { id: "demo-s-2", year: "2023", title: "Menjalin Hubungan", description: "Memutuskan berkomitmen saling mendukung impian." },
          { id: "demo-s-3", year: "2026", title: "Pernikahan", description: "Mengucap janji suci pernikahan dan mengarungi bahtera bersama." },
        ],
        gallery: [
          { id: "demo-g-1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 1" },
          { id: "demo-g-2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 2" },
          { id: "demo-g-3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 3" },
        ],
      });
    }

    // 2. Check if slug belongs to a registered guest
    let guest = await getGuestBySlug(cleanSlug);
    let guestUserId: string | null = null;

    if (guest) {
      guestUserId = (guest as { userId?: string | null }).userId || null;
      if (guest.invitationStatus === "unopened") {
        await markGuestOpened(guest.id);
      }
    } else {
      // 3. Check if slug belongs to a weddingSlug
      const userRes = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.weddingSlug, cleanSlug))
        .limit(1);

      if (userRes.length > 0) {
        guestUserId = userRes[0].id;
        guest = {
          id: `general-${cleanSlug}`,
          name: "Tamu Undangan",
          slug: cleanSlug,
          phone: null,
          category: "Tamu",
          invitationStatus: "opened",
          openedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    if (!guest) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    // 4. Load full wedding data for this specific couple
    const [settings, events, banks, loveStories, gallery] = await Promise.all([
      getWeddingSettings(guestUserId),
      getEvents(guestUserId),
      getBankAccounts(guestUserId),
      getLoveStories(guestUserId),
      getGallery(guestUserId),
    ]);

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
    console.error("[GET /api/invite/[slug]] Error:", error);
    return NextResponse.json({ error: "Gagal memuat data undangan" }, { status: 500 });
  }
}
