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
    const cleanSlug = (slug || "").toLowerCase().trim();

    // Fallback data demo jika slug = "demo" / "faza-mohamad" / "fulan-fulanah" atau tamu belum ada di DB
    const isDemoSlug = cleanSlug === "demo" || cleanSlug === "faza-mohamad" || cleanSlug === "fulan-fulanah";

    let guest = null;
    if (!isDemoSlug) {
      try {
        guest = await getGuestBySlug(cleanSlug);
      } catch {
        guest = null;
      }
    }

    if (!guest || isDemoSlug) {
      // Returning Fulan & Fulanah dummy demo data without touching database
      return NextResponse.json({
        guest: {
          id: "demo-guest-id",
          name: "Tamu Undangan (Demo)",
          slug: cleanSlug || "demo",
          category: "Teman",
        },
        settings: {
          groomName: "Fulan",
          groomFullName: "Fulan Ahmad, S.T.",
          groomFather: "Bpk. H. Abdullah",
          groomMother: "Ibu Hj. Aminah",
          groomInstagram: "fulan.demo",
          groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
          brideName: "Fulanah",
          brideFullName: "Fulanah Nabila, S.Ked.",
          brideFather: "Bpk. H. Ibrahim",
          brideMother: "Ibu Hj. Khadijah",
          brideInstagram: "fulanah.demo",
          bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
          weddingDate: "2026-12-20",
          heroPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
          quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
          giftRecipient: "Fulan & Fulanah",
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
          { id: "demo-b-1", bankName: "BCA", accountNumber: "1234567890", accountHolder: "Fulan" },
          { id: "demo-b-2", bankName: "Mandiri", accountNumber: "9876543210", accountHolder: "Fulanah" },
        ],
        loveStories: [
          { id: "demo-s-1", year: "2021", title: "Pertama Bertemu", description: "Awal perkenalan di kampus saat kegiatan organisasi bersama." },
          { id: "demo-s-2", year: "2023", title: "Menjalin Hubungan", description: "Memutuskan berkomitmen saling mendukung impian." },
          { id: "demo-s-3", year: "2026", title: "Pernikahan", description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga." },
        ],
        gallery: [
          { id: "demo-g-1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 1" },
          { id: "demo-g-2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 2" },
          { id: "demo-g-3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 3" },
        ],
      });
    }

    // Tracking unopened -> opened untuk tamu terdaftar di DB
    if (guest.invitationStatus === "unopened") {
      await markGuestOpened(guest.id);
    }

    const guestUserId = (guest as { userId?: string | null }).userId || null;

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
    return NextResponse.json({ error: "Gagal memuat data undangan" }, { status: 500 });
  }
}
