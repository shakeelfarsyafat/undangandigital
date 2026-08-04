import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// Initial fallback mock data
let mockGuests: Array<{
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  category: string;
  invitationStatus: string;
  openedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}> = [
  {
    id: "g-1",
    name: "Faza Mohamad",
    slug: "faza-mohamad",
    phone: "081299990001",
    category: "Teman",
    invitationStatus: "unopened",
    openedAt: null as Date | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "g-2",
    name: "Ahmad Fauzan",
    slug: "ahmad-fauzan",
    phone: "081299990002",
    category: "Keluarga",
    invitationStatus: "opened",
    openedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "g-3",
    name: "Siti Rahma",
    slug: "siti-rahma",
    phone: "081299990003",
    category: "Rekan Kerja",
    invitationStatus: "unopened",
    openedAt: null as Date | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockRsvps = [
  {
    id: "r-1",
    guestId: "g-2",
    attendanceStatus: "attending",
    guestCount: 2,
    message: "Selamat menempuh hidup baru Ahmad & Nabila! Semoga sakinah, mawaddah, wa rahmah.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockSettings = {
  id: "s-1",
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
  quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",

  giftRecipient: "Ahmad Fauzi / Nabila Putri",
  giftPhone: "081234567890",
  giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat, DKI Jakarta 10350",
  createdAt: new Date(),
  updatedAt: new Date(),
};

let mockEvents = [
  {
    id: "e-1",
    type: "akad",
    title: "Akad Nikah",
    date: "Minggu, 20 Desember 2026",
    startTime: "08.00",
    endTime: "10.00 WIB",
    venueName: "Masjid Agung Al-Azhar",
    venueAddress: "Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
    displayOrder: 1,
  },
  {
    id: "e-2",
    type: "reception",
    title: "Resepsi Pernikahan",
    date: "Minggu, 20 Desember 2026",
    startTime: "11.00",
    endTime: "15.00 WIB",
    venueName: "Ballroom Hotel Grand Mahakam",
    venueAddress: "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
    mapsUrl: "https://maps.google.com/?q=Hotel+Grand+Mahakam",
    displayOrder: 2,
  },
];

let mockBanks = [
  {
    id: "b-1",
    bankName: "BCA",
    accountNumber: "1234567890",
    accountHolder: "Ahmad Fauzi",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "b-2",
    bankName: "Mandiri",
    accountNumber: "9876543210",
    accountHolder: "Nabila Putri",
    displayOrder: 2,
    isActive: true,
  },
];

let mockStories = [
  {
    id: "ls-1",
    year: "2021",
    title: "Pertama Bertemu",
    description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi mahasiswa bersama.",
    displayOrder: 1,
  },
  {
    id: "ls-2",
    year: "2023",
    title: "Menjalin Hubungan",
    description: "Memutuskan untuk berkomitmen saling mendukung impian dan cita-cita masing-masing.",
    displayOrder: 2,
  },
  {
    id: "ls-3",
    year: "2026",
    title: "Lamaran",
    description: "Momen membahagiakan saat kedua keluarga besar bertemu dan mengikat janji suci.",
    displayOrder: 3,
  },
  {
    id: "ls-4",
    year: "2026",
    title: "Pernikahan",
    description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga bersama.",
    displayOrder: 4,
  },
];

let mockGallery = [
  {
    id: "g-img-1",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 1",
    displayOrder: 1,
  },
  {
    id: "g-img-2",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 2",
    displayOrder: 2,
  },
  {
    id: "g-img-3",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 3",
    displayOrder: 3,
  },
  {
    id: "g-img-4",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 4",
    displayOrder: 4,
  },
  {
    id: "g-img-5",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 5",
    displayOrder: 5,
  },
  {
    id: "g-img-6",
    imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80",
    altText: "Foto Prewedding 6",
    displayOrder: 6,
  },
];

// Helper functions with automatic fallback
export async function getGuestBySlug(slug: string) {
  try {
    const res = await db.select().from(schema.guests).where(eq(schema.guests.slug, slug)).limit(1);
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }
  return mockGuests.find((g) => g.slug === slug) || null;
}

export async function markGuestOpened(id: string) {
  try {
    const now = new Date();
    await db
      .update(schema.guests)
      .set({ invitationStatus: "opened", openedAt: now })
      .where(eq(schema.guests.id, id));
  } catch (e) {
    // fallback
  }
  const idx = mockGuests.findIndex((g) => g.id === id);
  if (idx !== -1 && mockGuests[idx].invitationStatus === "unopened") {
    mockGuests[idx].invitationStatus = "opened";
    mockGuests[idx].openedAt = new Date();
  }
}

export async function getAllGuests() {
  try {
    const res = await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockGuests;
}

export async function createGuest(data: { name: string; slug: string; phone?: string; category: string }) {
  const newGuest = {
    id: `g-${Date.now()}`,
    name: data.name,
    slug: data.slug,
    phone: data.phone || null,
    category: data.category,
    invitationStatus: "unopened",
    openedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const res = await db.insert(schema.guests).values(data).returning();
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }

  mockGuests.unshift(newGuest);
  return newGuest;
}

export async function deleteGuest(id: string) {
  try {
    await db.delete(schema.guests).where(eq(schema.guests.id, id));
  } catch (e) {
    // fallback
  }
  mockGuests = mockGuests.filter((g) => g.id !== id);
  mockRsvps = mockRsvps.filter((r) => r.guestId !== id);
}

export async function upsertRsvp(data: { guestId: string; attendanceStatus: string; guestCount: number; message?: string }) {
  try {
    const res = await db
      .insert(schema.rsvps)
      .values(data)
      .onConflictDoUpdate({
        target: schema.rsvps.guestId,
        set: {
          attendanceStatus: data.attendanceStatus,
          guestCount: data.guestCount,
          message: data.message,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }

  const existingIdx = mockRsvps.findIndex((r) => r.guestId === data.guestId);
  if (existingIdx !== -1) {
    mockRsvps[existingIdx] = {
      ...mockRsvps[existingIdx],
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount,
      message: data.message || "",
      updatedAt: new Date(),
    };
    return mockRsvps[existingIdx];
  } else {
    const newRsvp = {
      id: `r-${Date.now()}`,
      guestId: data.guestId,
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount,
      message: data.message || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRsvps.unshift(newRsvp);
    return newRsvp;
  }
}

export async function getAllRsvps() {
  try {
    const res = await db
      .select({
        id: schema.rsvps.id,
        guestId: schema.rsvps.guestId,
        guestName: schema.guests.name,
        attendanceStatus: schema.rsvps.attendanceStatus,
        guestCount: schema.rsvps.guestCount,
        message: schema.rsvps.message,
        createdAt: schema.rsvps.createdAt,
      })
      .from(schema.rsvps)
      .innerJoin(schema.guests, eq(schema.rsvps.guestId, schema.guests.id))
      .orderBy(desc(schema.rsvps.createdAt));
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }

  return mockRsvps.map((r) => {
    const g = mockGuests.find((guest) => guest.id === r.guestId);
    return {
      id: r.id,
      guestId: r.guestId,
      guestName: g?.name || "Tamu Undangan",
      attendanceStatus: r.attendanceStatus,
      guestCount: r.guestCount,
      message: r.message,
      createdAt: r.createdAt,
    };
  });
}

export async function getAllWishes() {
  const rsvps = await getAllRsvps();
  return rsvps.filter((r) => r.message && r.message.trim() !== "");
}

export async function getWeddingSettings() {
  try {
    const res = await db.select().from(schema.weddingSettings).limit(1);
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }
  return mockSettings;
}

export async function getEvents() {
  try {
    const res = await db.select().from(schema.events).orderBy(schema.events.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockEvents;
}

export async function getBankAccounts() {
  try {
    const res = await db.select().from(schema.bankAccounts).orderBy(schema.bankAccounts.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockBanks;
}

export async function getLoveStories() {
  try {
    const res = await db.select().from(schema.loveStories).orderBy(schema.loveStories.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockStories;
}

export async function getGallery() {
  try {
    const res = await db.select().from(schema.gallery).orderBy(schema.gallery.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockGallery;
}
