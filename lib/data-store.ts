import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Helper: Check if string is valid UUID
export function isUUID(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Fallback in-memory state
let mockGuests: Array<{
  id: string;
  userId?: string | null;
  name: string;
  slug: string;
  phone: string | null;
  category: string;
  invitationStatus: string;
  openedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}> = [];

let mockRsvps: Array<{
  id: string;
  guestId: string;
  attendanceStatus: string;
  guestCount: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}> = [];

// Seed default settings, events, banks, love stories, and gallery for a new user in DB
export async function seedDefaultsForUser(userId: string, coupleName: string = "Ahmad & Nabila") {
  if (!isUUID(userId)) return;

  const parts = coupleName.split("&").map((p) => p.trim());
  const groomName = parts[0] || "Ahmad";
  const brideName = parts[1] || "Nabila";

  try {
    // 1. Check existing settings
    const existingSettings = await db
      .select()
      .from(schema.weddingSettings)
      .where(eq(schema.weddingSettings.userId, userId))
      .limit(1);

    if (existingSettings.length === 0) {
      await db.insert(schema.weddingSettings).values({
        userId,
        groomName,
        groomFullName: `${groomName} Fauzi, S.T.`,
        groomFather: "Bpk. H. Rahmat",
        groomMother: "Ibu Hj. Siti",
        groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        brideName,
        brideFullName: `${brideName} Putri, S.Ked.`,
        brideFather: "Bpk. H. Hasan",
        brideMother: "Ibu Hj. Aminah",
        bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        weddingDate: "2026-12-20",
        heroPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        musicUrl: "/music/wedding.mp3",
        quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
        giftRecipient: `${groomName} & ${brideName}`,
        giftPhone: "081234567890",
        giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat, DKI Jakarta 10350",
      });
    }

    // 2. Events
    const existingEvents = await db
      .select()
      .from(schema.events)
      .where(eq(schema.events.userId, userId));

    if (existingEvents.length === 0) {
      await db.insert(schema.events).values([
        {
          userId,
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
          userId,
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
      ]);
    }

    // 3. Banks
    const existingBanks = await db
      .select()
      .from(schema.bankAccounts)
      .where(eq(schema.bankAccounts.userId, userId));

    if (existingBanks.length === 0) {
      await db.insert(schema.bankAccounts).values([
        {
          userId,
          bankName: "BCA",
          accountNumber: "1234567890",
          accountHolder: groomName,
          displayOrder: 1,
          isActive: true,
        },
        {
          userId,
          bankName: "Mandiri",
          accountNumber: "9876543210",
          accountHolder: brideName,
          displayOrder: 2,
          isActive: true,
        },
      ]);
    }

    // 4. Love Stories
    const existingStories = await db
      .select()
      .from(schema.loveStories)
      .where(eq(schema.loveStories.userId, userId));

    if (existingStories.length === 0) {
      await db.insert(schema.loveStories).values([
        {
          userId,
          year: "2021",
          title: "Pertama Bertemu",
          description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi mahasiswa bersama.",
          displayOrder: 1,
        },
        {
          userId,
          year: "2023",
          title: "Menjalin Hubungan",
          description: "Memutuskan untuk berkomitmen saling mendukung impian dan cita-cita masing-masing.",
          displayOrder: 2,
        },
        {
          userId,
          year: "2026",
          title: "Lamaran",
          description: "Momen membahagiakan saat kedua keluarga besar bertemu dan mengikat janji suci.",
          displayOrder: 3,
        },
        {
          userId,
          year: "2026",
          title: "Pernikahan",
          description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga bersama.",
          displayOrder: 4,
        },
      ]);
    }

    // 5. Gallery
    const existingGallery = await db
      .select()
      .from(schema.gallery)
      .where(eq(schema.gallery.userId, userId));

    if (existingGallery.length === 0) {
      await db.insert(schema.gallery).values([
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 1",
          displayOrder: 1,
        },
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 2",
          displayOrder: 2,
        },
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 3",
          displayOrder: 3,
        },
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 4",
          displayOrder: 4,
        },
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 5",
          displayOrder: 5,
        },
        {
          userId,
          imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80",
          altText: "Foto Prewedding 6",
          displayOrder: 6,
        },
      ]);
    }
  } catch (err) {
    console.error("[seedDefaultsForUser] Error:", err);
  }
}

// 1. Guests
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
  if (isUUID(id)) {
    try {
      const now = new Date();
      await db
        .update(schema.guests)
        .set({ invitationStatus: "opened", openedAt: now })
        .where(eq(schema.guests.id, id));
    } catch (e) {
      // fallback
    }
  }
  const idx = mockGuests.findIndex((g) => g.id === id);
  if (idx !== -1 && mockGuests[idx].invitationStatus === "unopened") {
    mockGuests[idx].invitationStatus = "opened";
    mockGuests[idx].openedAt = new Date();
  }
}

export async function getAllGuests(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      return await db
        .select()
        .from(schema.guests)
        .where(eq(schema.guests.userId, userId))
        .orderBy(desc(schema.guests.createdAt));
    }
    return await db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
  } catch (e) {
    // fallback
  }
  return userId ? mockGuests.filter((g) => !g.userId || g.userId === userId) : mockGuests;
}

export async function createGuest(data: {
  name: string;
  slug: string;
  phone?: string | null;
  category: string;
  userId?: string | null;
}) {
  const validUserId = isUUID(data.userId) ? data.userId : null;

  try {
    const res = await db
      .insert(schema.guests)
      .values({
        userId: validUserId,
        name: data.name.trim(),
        slug: data.slug.trim(),
        phone: data.phone ? data.phone.trim() : null,
        category: data.category,
      })
      .returning();
    if (res.length > 0) return res[0];
  } catch (e) {
    console.error("[createGuest] DB Insert error:", e);
  }

  const newGuest = {
    id: `g-${Date.now()}`,
    userId: validUserId,
    name: data.name,
    slug: data.slug,
    phone: data.phone || null,
    category: data.category,
    invitationStatus: "unopened",
    openedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockGuests.unshift(newGuest);
  return newGuest;
}

export async function bulkCreateGuests(
  guestsList: Array<{ name: string; phone?: string | null; category?: string }>,
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;
  const createdList = [];

  for (let i = 0; i < guestsList.length; i++) {
    const item = guestsList[i];
    if (!item.name || !item.name.trim()) continue;

    let baseSlug = item.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    if (!baseSlug) baseSlug = `tamu-${Date.now()}-${i}`;
    let slug = baseSlug;
    let count = 1;
    while (mockGuests.some((g) => g.slug === slug)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    try {
      const res = await db
        .insert(schema.guests)
        .values({
          userId: validUserId,
          name: item.name.trim(),
          slug,
          phone: item.phone ? item.phone.trim() : null,
          category: item.category ? item.category.trim() : "Lainnya",
        })
        .returning();
      if (res.length > 0) {
        createdList.push(res[0]);
        continue;
      }
    } catch (e) {
      console.error("[bulkCreateGuests] DB Error:", e);
    }

    const guestObj = {
      id: `g-${Date.now()}-${i}`,
      userId: validUserId,
      name: item.name.trim(),
      slug,
      phone: item.phone ? item.phone.trim() : null,
      category: item.category ? item.category.trim() : "Lainnya",
      invitationStatus: "unopened",
      openedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGuests.unshift(guestObj);
    createdList.push(guestObj);
  }

  return createdList;
}

export async function deleteGuest(id: string) {
  if (isUUID(id)) {
    try {
      await db.delete(schema.guests).where(eq(schema.guests.id, id));
    } catch (e) {
      console.error("[deleteGuest] DB Error:", e);
    }
  }
  mockGuests = mockGuests.filter((g) => g.id !== id);
  mockRsvps = mockRsvps.filter((r) => r.guestId !== id);
}

// 2. RSVPs & Wishes
export async function upsertRsvp(data: {
  guestId: string;
  attendanceStatus: string;
  guestCount: number;
  message?: string | null;
}) {
  if (isUUID(data.guestId)) {
    try {
      const res = await db
        .insert(schema.rsvps)
        .values({
          guestId: data.guestId,
          attendanceStatus: data.attendanceStatus,
          guestCount: data.guestCount,
          message: data.message || "",
        })
        .onConflictDoUpdate({
          target: schema.rsvps.guestId,
          set: {
            attendanceStatus: data.attendanceStatus,
            guestCount: data.guestCount,
            message: data.message || "",
            updatedAt: new Date(),
          },
        })
        .returning();
      if (res.length > 0) return res[0];
    } catch (e) {
      console.error("[upsertRsvp] DB Error:", e);
    }
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

export async function getAllRsvps(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      return await db
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
        .where(eq(schema.guests.userId, userId))
        .orderBy(desc(schema.rsvps.createdAt));
    }

    return await db
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
  } catch (e) {
    console.error("[getAllRsvps] DB Query Error:", e);
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

export async function getAllWishes(userId?: string | null) {
  const rsvps = await getAllRsvps(userId);
  return rsvps.filter((r) => r.message && r.message.trim() !== "");
}

// 3. Wedding Settings
export async function getWeddingSettings(userId?: string | null, weddingSlug?: string | null) {
  try {
    let targetUserId = userId;

    if (!targetUserId && weddingSlug) {
      const userRes = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.weddingSlug, weddingSlug))
        .limit(1);
      if (userRes.length > 0) {
        targetUserId = userRes[0].id;
      }
    }

    if (targetUserId && isUUID(targetUserId)) {
      const res = await db
        .select()
        .from(schema.weddingSettings)
        .where(eq(schema.weddingSettings.userId, targetUserId))
        .limit(1);
      if (res.length > 0) return res[0];

      // Auto seed defaults for this user if not found yet
      await seedDefaultsForUser(targetUserId);
      const seeded = await db
        .select()
        .from(schema.weddingSettings)
        .where(eq(schema.weddingSettings.userId, targetUserId))
        .limit(1);
      if (seeded.length > 0) return seeded[0];
    }

    // Default global fallback
    const res = await db
      .select()
      .from(schema.weddingSettings)
      .orderBy(desc(schema.weddingSettings.updatedAt))
      .limit(1);
    if (res.length > 0) return res[0];
  } catch (e) {
    console.error("[getWeddingSettings] DB Query Error:", e);
  }

  return {
    id: "default-settings",
    userId: null,
    groomName: "Ahmad",
    groomFullName: "Ahmad Fauzi, S.T.",
    groomFather: "Bpk. H. Rahmat",
    groomMother: "Ibu Hj. Siti",
    groomInstagram: "",
    groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    brideName: "Nabila",
    brideFullName: "Nabila Putri, S.Ked.",
    brideFather: "Bpk. H. Hasan",
    brideMother: "Ibu Hj. Aminah",
    brideInstagram: "",
    bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    weddingDate: "2026-12-20",
    heroPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    musicUrl: "/music/wedding.mp3",
    quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
    giftRecipient: "Ahmad & Nabila",
    giftPhone: "081234567890",
    giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateWeddingSettings(
  data: {
    groomName?: string;
    groomFullName?: string;
    groomFather?: string;
    groomMother?: string;
    groomInstagram?: string | null;
    groomPhotoUrl?: string | null;
    brideName?: string;
    brideFullName?: string;
    brideFather?: string;
    brideMother?: string;
    brideInstagram?: string | null;
    bridePhotoUrl?: string | null;
    weddingDate?: string;
    heroPhotoUrl?: string | null;
    musicUrl?: string | null;
    quoteText?: string | null;
    giftRecipient?: string | null;
    giftPhone?: string | null;
    giftAddress?: string | null;
  },
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;

  try {
    if (validUserId) {
      const existing = await db
        .select()
        .from(schema.weddingSettings)
        .where(eq(schema.weddingSettings.userId, validUserId))
        .limit(1);

      if (existing.length > 0) {
        const res = await db
          .update(schema.weddingSettings)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(schema.weddingSettings.id, existing[0].id))
          .returning();
        if (res.length > 0) return res[0];
      } else {
        const res = await db
          .insert(schema.weddingSettings)
          .values({
            ...data,
            userId: validUserId,
            groomName: data.groomName || "Ahmad",
            groomFullName: data.groomFullName || "Ahmad Fauzi, S.T.",
            groomFather: data.groomFather || "Bpk. H. Rahmat",
            groomMother: data.groomMother || "Ibu Hj. Siti",
            brideName: data.brideName || "Nabila",
            brideFullName: data.brideFullName || "Nabila Putri, S.Ked.",
            brideFather: data.brideFather || "Bpk. H. Hasan",
            brideMother: data.brideMother || "Ibu Hj. Aminah",
            weddingDate: data.weddingDate || "2026-12-20",
          })
          .returning();
        if (res.length > 0) return res[0];
      }
    } else {
      const existing = await db
        .select()
        .from(schema.weddingSettings)
        .orderBy(desc(schema.weddingSettings.updatedAt))
        .limit(1);
      if (existing.length > 0) {
        const res = await db
          .update(schema.weddingSettings)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.weddingSettings.id, existing[0].id))
          .returning();
        if (res.length > 0) return res[0];
      }
    }
  } catch (e) {
    console.error("[updateWeddingSettings] DB Error:", e);
  }

  return { ...data, userId: validUserId, updatedAt: new Date() };
}

// 4. Events
export async function getEvents(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      const res = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.userId, userId))
        .orderBy(schema.events.displayOrder);
      if (res.length > 0) return res;

      // Auto seed
      await seedDefaultsForUser(userId);
      return await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.userId, userId))
        .orderBy(schema.events.displayOrder);
    }

    const res = await db.select().from(schema.events).orderBy(schema.events.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    console.error("[getEvents] DB Error:", e);
  }

  return [
    {
      id: "e-akad",
      userId: null,
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
      id: "e-reception",
      userId: null,
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
}

export async function updateEvents(
  eventsList: Array<{
    id?: string;
    type: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
    mapsUrl: string;
    displayOrder?: number;
  }>,
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;
  const updatedResults = [];

  for (let i = 0; i < eventsList.length; i++) {
    const item = eventsList[i];
    const displayOrder = item.displayOrder ?? i + 1;

    try {
      if (item.id && isUUID(item.id)) {
        const res = await db
          .update(schema.events)
          .set({
            title: item.title,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            venueName: item.venueName,
            venueAddress: item.venueAddress,
            mapsUrl: item.mapsUrl,
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(schema.events.id, item.id))
          .returning();
        if (res.length > 0) {
          updatedResults.push(res[0]);
          continue;
        }
      }

      // Check if event with matching type exists for this userId
      if (validUserId) {
        const existing = await db
          .select()
          .from(schema.events)
          .where(and(eq(schema.events.userId, validUserId), eq(schema.events.type, item.type)))
          .limit(1);

        if (existing.length > 0) {
          const res = await db
            .update(schema.events)
            .set({
              title: item.title,
              date: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              venueName: item.venueName,
              venueAddress: item.venueAddress,
              mapsUrl: item.mapsUrl,
              displayOrder,
              updatedAt: new Date(),
            })
            .where(eq(schema.events.id, existing[0].id))
            .returning();
          if (res.length > 0) {
            updatedResults.push(res[0]);
            continue;
          }
        }
      }

      // Insert new event
      const res = await db
        .insert(schema.events)
        .values({
          userId: validUserId,
          type: item.type,
          title: item.title,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          venueName: item.venueName,
          venueAddress: item.venueAddress,
          mapsUrl: item.mapsUrl,
          displayOrder,
        })
        .returning();
      if (res.length > 0) {
        updatedResults.push(res[0]);
      }
    } catch (e) {
      console.error("[updateEvents] DB Error:", e);
    }
  }

  return updatedResults.length > 0 ? updatedResults : await getEvents(userId);
}

// 5. Bank Accounts
export async function getBankAccounts(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      const res = await db
        .select()
        .from(schema.bankAccounts)
        .where(eq(schema.bankAccounts.userId, userId))
        .orderBy(schema.bankAccounts.displayOrder);
      if (res.length > 0) return res;

      await seedDefaultsForUser(userId);
      return await db
        .select()
        .from(schema.bankAccounts)
        .where(eq(schema.bankAccounts.userId, userId))
        .orderBy(schema.bankAccounts.displayOrder);
    }

    const res = await db.select().from(schema.bankAccounts).orderBy(schema.bankAccounts.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    console.error("[getBankAccounts] DB Error:", e);
  }

  return [
    { id: "b-1", bankName: "BCA", accountNumber: "1234567890", accountHolder: "Ahmad Fauzi", displayOrder: 1, isActive: true },
    { id: "b-2", bankName: "Mandiri", accountNumber: "9876543210", accountHolder: "Nabila Putri", displayOrder: 2, isActive: true },
  ];
}

export async function updateBankAccounts(
  banksList: Array<{
    id?: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    displayOrder?: number;
    isActive?: boolean;
  }>,
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;
  const processedIds = new Set<string>();

  for (let i = 0; i < banksList.length; i++) {
    const item = banksList[i];
    const displayOrder = item.displayOrder ?? i + 1;

    try {
      if (item.id && isUUID(item.id)) {
        const res = await db
          .update(schema.bankAccounts)
          .set({
            bankName: item.bankName,
            accountNumber: item.accountNumber,
            accountHolder: item.accountHolder,
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(schema.bankAccounts.id, item.id))
          .returning();
        if (res.length > 0) {
          processedIds.add(res[0].id);
          continue;
        }
      }

      // Insert new
      const res = await db
        .insert(schema.bankAccounts)
        .values({
          userId: validUserId,
          bankName: item.bankName,
          accountNumber: item.accountNumber,
          accountHolder: item.accountHolder,
          displayOrder,
          isActive: item.isActive ?? true,
        })
        .returning();
      if (res.length > 0) {
        processedIds.add(res[0].id);
      }
    } catch (e) {
      console.error("[updateBankAccounts] DB Error:", e);
    }
  }

  // Clean up removed accounts if validUserId
  if (validUserId && processedIds.size > 0) {
    try {
      const allUserBanks = await db
        .select({ id: schema.bankAccounts.id })
        .from(schema.bankAccounts)
        .where(eq(schema.bankAccounts.userId, validUserId));
      for (const b of allUserBanks) {
        if (!processedIds.has(b.id)) {
          await db.delete(schema.bankAccounts).where(eq(schema.bankAccounts.id, b.id));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return await getBankAccounts(userId);
}

// 6. Love Stories
export async function getLoveStories(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      const res = await db
        .select()
        .from(schema.loveStories)
        .where(eq(schema.loveStories.userId, userId))
        .orderBy(schema.loveStories.displayOrder);
      if (res.length > 0) return res;

      await seedDefaultsForUser(userId);
      return await db
        .select()
        .from(schema.loveStories)
        .where(eq(schema.loveStories.userId, userId))
        .orderBy(schema.loveStories.displayOrder);
    }

    const res = await db.select().from(schema.loveStories).orderBy(schema.loveStories.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    console.error("[getLoveStories] DB Error:", e);
  }

  return [
    { id: "ls-1", year: "2021", title: "Pertama Bertemu", description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi.", displayOrder: 1 },
    { id: "ls-2", year: "2023", title: "Menjalin Hubungan", description: "Memutuskan untuk berkomitmen saling mendukung impian.", displayOrder: 2 },
    { id: "ls-3", year: "2026", title: "Lamaran", description: "Momen membahagiakan saat kedua keluarga besar bertemu.", displayOrder: 3 },
    { id: "ls-4", year: "2026", title: "Pernikahan", description: "Mengucap janji suci pernikahan dan mengarungi bahtera bersama.", displayOrder: 4 },
  ];
}

export async function updateLoveStories(
  storiesList: Array<{
    id?: string;
    year: string;
    title: string;
    description: string;
    displayOrder?: number;
  }>,
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;
  const processedIds = new Set<string>();

  for (let i = 0; i < storiesList.length; i++) {
    const item = storiesList[i];
    const displayOrder = item.displayOrder ?? i + 1;

    try {
      if (item.id && isUUID(item.id)) {
        const res = await db
          .update(schema.loveStories)
          .set({
            year: item.year,
            title: item.title,
            description: item.description,
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(schema.loveStories.id, item.id))
          .returning();
        if (res.length > 0) {
          processedIds.add(res[0].id);
          continue;
        }
      }

      const res = await db
        .insert(schema.loveStories)
        .values({
          userId: validUserId,
          year: item.year,
          title: item.title,
          description: item.description,
          displayOrder,
        })
        .returning();
      if (res.length > 0) {
        processedIds.add(res[0].id);
      }
    } catch (e) {
      console.error("[updateLoveStories] DB Error:", e);
    }
  }

  // Clean up removed stories
  if (validUserId && processedIds.size > 0) {
    try {
      const allUserStories = await db
        .select({ id: schema.loveStories.id })
        .from(schema.loveStories)
        .where(eq(schema.loveStories.userId, validUserId));
      for (const s of allUserStories) {
        if (!processedIds.has(s.id)) {
          await db.delete(schema.loveStories).where(eq(schema.loveStories.id, s.id));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return await getLoveStories(userId);
}

// 7. Gallery
export async function getGallery(userId?: string | null) {
  try {
    if (userId && isUUID(userId)) {
      const res = await db
        .select()
        .from(schema.gallery)
        .where(eq(schema.gallery.userId, userId))
        .orderBy(schema.gallery.displayOrder);
      if (res.length > 0) return res;

      await seedDefaultsForUser(userId);
      return await db
        .select()
        .from(schema.gallery)
        .where(eq(schema.gallery.userId, userId))
        .orderBy(schema.gallery.displayOrder);
    }

    const res = await db.select().from(schema.gallery).orderBy(schema.gallery.displayOrder);
    if (res.length > 0) return res;
  } catch (e) {
    console.error("[getGallery] DB Error:", e);
  }

  return [
    { id: "g-1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 1", displayOrder: 1 },
    { id: "g-2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 2", displayOrder: 2 },
    { id: "g-3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80", altText: "Foto Prewedding 3", displayOrder: 3 },
  ];
}

export async function updateGallery(
  galleryList: Array<{
    id?: string;
    imageUrl: string;
    altText?: string | null;
    displayOrder?: number;
  }>,
  userId?: string | null
) {
  const validUserId = isUUID(userId) ? userId : null;
  const processedIds = new Set<string>();

  for (let i = 0; i < galleryList.length; i++) {
    const item = galleryList[i];
    const displayOrder = item.displayOrder ?? i + 1;

    try {
      if (item.id && isUUID(item.id)) {
        const res = await db
          .update(schema.gallery)
          .set({
            imageUrl: item.imageUrl,
            altText: item.altText || `Foto Prewedding ${displayOrder}`,
            displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(schema.gallery.id, item.id))
          .returning();
        if (res.length > 0) {
          processedIds.add(res[0].id);
          continue;
        }
      }

      const res = await db
        .insert(schema.gallery)
        .values({
          userId: validUserId,
          imageUrl: item.imageUrl,
          altText: item.altText || `Foto Prewedding ${displayOrder}`,
          displayOrder,
        })
        .returning();
      if (res.length > 0) {
        processedIds.add(res[0].id);
      }
    } catch (e) {
      console.error("[updateGallery] DB Error:", e);
    }
  }

  // Clean up removed gallery items
  if (validUserId && processedIds.size > 0) {
    try {
      const allUserGallery = await db
        .select({ id: schema.gallery.id })
        .from(schema.gallery)
        .where(eq(schema.gallery.userId, validUserId));
      for (const g of allUserGallery) {
        if (!processedIds.has(g.id)) {
          await db.delete(schema.gallery).where(eq(schema.gallery.id, g.id));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return await getGallery(userId);
}

// Aliases
export const getAllEvents = getEvents;
export const getAllBanks = getBankAccounts;
export const getAllLoveStories = getLoveStories;
