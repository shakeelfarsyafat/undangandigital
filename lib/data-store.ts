import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Initial fallback mock data (Clean empty states)
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

let mockSettings: {
  id: string;
  userId?: string | null;
  groomName: string;
  groomFullName: string;
  groomFather: string;
  groomMother: string;
  groomInstagram?: string | null;
  groomPhotoUrl?: string | null;
  brideName: string;
  brideFullName: string;
  brideFather: string;
  brideMother: string;
  brideInstagram?: string | null;
  bridePhotoUrl?: string | null;
  weddingDate: string;
  heroPhotoUrl?: string | null;
  quoteText?: string | null;
  giftRecipient?: string | null;
  giftPhone?: string | null;
  giftAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
} = {
  id: "s-1",
  userId: null,
  groomName: "Nama Groom",
  groomFullName: "Nama Lengkap Mempelai Pria",
  groomFather: "Nama Ayah",
  groomMother: "Nama Ibu",
  groomInstagram: "",
  groomPhotoUrl: "",

  brideName: "Nama Bride",
  brideFullName: "Nama Lengkap Mempelai Wanita",
  brideFather: "Nama Ayah",
  brideMother: "Nama Ibu",
  brideInstagram: "",
  bridePhotoUrl: "",

  weddingDate: "2026-12-20",
  heroPhotoUrl: "",
  quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",

  giftRecipient: "Mempelai Pria & Wanita",
  giftPhone: "",
  giftAddress: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

let mockEvents: Array<{
  id: string;
  userId?: string | null;
  type: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  displayOrder: number;
}> = [
  {
    id: "e-1",
    userId: null,
    type: "akad",
    title: "Akad Nikah",
    date: "Minggu, 20 Desember 2026",
    startTime: "08.00",
    endTime: "10.00 WIB",
    venueName: "Nama Tempat / Masjid",
    venueAddress: "Alamat Lengkap Lokasi Akad Nikah",
    mapsUrl: "",
    displayOrder: 1,
  },
  {
    id: "e-2",
    userId: null,
    type: "reception",
    title: "Resepsi Pernikahan",
    date: "Minggu, 20 Desember 2026",
    startTime: "11.00",
    endTime: "15.00 WIB",
    venueName: "Nama Tempat / Gedung",
    venueAddress: "Alamat Lengkap Lokasi Resepsi",
    mapsUrl: "",
    displayOrder: 2,
  },
];

let mockBanks: Array<{
  id: string;
  userId?: string | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  displayOrder: number;
  isActive: boolean;
}> = [];

let mockStories: Array<{
  id: string;
  userId?: string | null;
  year: string;
  title: string;
  description: string;
  displayOrder: number;
}> = [];

let mockGallery: Array<{
  id: string;
  userId?: string | null;
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
}> = [];

// Helper functions with automatic fallback & multi-tenant userId support
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

export async function getAllGuests(userId?: string | null) {
  try {
    const query = userId
      ? db.select().from(schema.guests).where(eq(schema.guests.userId, userId)).orderBy(desc(schema.guests.createdAt))
      : db.select().from(schema.guests).orderBy(desc(schema.guests.createdAt));
    const res = await query;
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return userId ? mockGuests.filter((g) => !g.userId || g.userId === userId) : mockGuests;
}

export async function createGuest(data: { name: string; slug: string; phone?: string; category: string; userId?: string | null }) {
  const newGuest = {
    id: `g-${Date.now()}`,
    userId: data.userId || null,
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
    const res = await db.insert(schema.guests).values({
      userId: data.userId || null,
      name: data.name,
      slug: data.slug,
      phone: data.phone || null,
      category: data.category,
    }).returning();
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }

  mockGuests.unshift(newGuest);
  return newGuest;
}

export async function bulkCreateGuests(
  guestsList: Array<{ name: string; phone?: string; category?: string }>,
  userId?: string | null
) {
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

    const guestObj = {
      id: `g-${Date.now()}-${i}`,
      userId: userId || null,
      name: item.name.trim(),
      slug,
      phone: item.phone ? item.phone.trim() : null,
      category: item.category ? item.category.trim() : "Lainnya",
      invitationStatus: "unopened",
      openedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await db
        .insert(schema.guests)
        .values({
          userId: userId || null,
          name: guestObj.name,
          slug: guestObj.slug,
          phone: guestObj.phone,
          category: guestObj.category,
        })
        .returning();
      if (res.length > 0) createdList.push(res[0]);
      else createdList.push(guestObj);
    } catch (e) {
      createdList.push(guestObj);
    }

    mockGuests.unshift(guestObj);
  }
  return createdList;
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

export async function getAllRsvps(userId?: string | null) {
  try {
    const query = userId
      ? db
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
          .orderBy(desc(schema.rsvps.createdAt))
      : db
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

    const res = await query;
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

export async function getAllWishes(userId?: string | null) {
  const rsvps = await getAllRsvps(userId);
  return rsvps.filter((r) => r.message && r.message.trim() !== "");
}

export async function getWeddingSettings(userId?: string | null) {
  try {
    if (userId) {
      const res = await db.select().from(schema.weddingSettings).where(eq(schema.weddingSettings.userId, userId)).limit(1);
      if (res.length > 0) return res[0];
    }
    const res = await db.select().from(schema.weddingSettings).orderBy(desc(schema.weddingSettings.updatedAt)).limit(1);
    if (res.length > 0) return res[0];
  } catch (e) {
    // fallback
  }
  return mockSettings;
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
  try {
    const existing = userId
      ? await db.select().from(schema.weddingSettings).where(eq(schema.weddingSettings.userId, userId)).limit(1)
      : await db.select().from(schema.weddingSettings).limit(1);

    if (existing.length > 0) {
      const res = await db
        .update(schema.weddingSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(schema.weddingSettings.id, existing[0].id))
        .returning();
      if (res.length > 0) {
        mockSettings = { ...mockSettings, ...res[0] };
        return res[0];
      }
    } else if (userId) {
      const res = await db
        .insert(schema.weddingSettings)
        .values({
          ...data,
          userId,
          groomName: data.groomName || "Mempelai Pria",
          groomFullName: data.groomFullName || "Nama Lengkap Mempelai Pria",
          groomFather: data.groomFather || "Ayah Mempelai Pria",
          groomMother: data.groomMother || "Ibu Mempelai Pria",
          brideName: data.brideName || "Mempelai Wanita",
          brideFullName: data.brideFullName || "Nama Lengkap Mempelai Wanita",
          brideFather: data.brideFather || "Ayah Mempelai Wanita",
          brideMother: data.brideMother || "Ibu Mempelai Wanita",
          weddingDate: data.weddingDate || "2026-12-20",
        })
        .returning();
      if (res.length > 0) {
        mockSettings = { ...mockSettings, ...res[0] };
        return res[0];
      }
    }
  } catch (e) {
    // fallback
  }

  mockSettings = {
    ...mockSettings,
    ...data,
    userId: userId || mockSettings.userId,
    updatedAt: new Date(),
  };
  return mockSettings;
}

export async function getEvents(userId?: string | null) {
  try {
    const query = userId
      ? db.select().from(schema.events).where(eq(schema.events.userId, userId)).orderBy(schema.events.displayOrder)
      : db.select().from(schema.events).orderBy(schema.events.displayOrder);
    const res = await query;
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockEvents;
}

export async function updateEvents(
  eventsList: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
    mapsUrl: string;
  }>,
  userId?: string | null
) {
  for (const item of eventsList) {
    try {
      const existing = userId
        ? await db.select().from(schema.events).where(and(eq(schema.events.id, item.id), eq(schema.events.userId, userId))).limit(1)
        : await db.select().from(schema.events).where(eq(schema.events.id, item.id)).limit(1);

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
            updatedAt: new Date(),
          })
          .where(eq(schema.events.id, existing[0].id))
          .returning();
        if (res.length > 0) {
          const idx = mockEvents.findIndex((e) => e.id === item.id);
          if (idx !== -1) mockEvents[idx] = { ...mockEvents[idx], ...res[0] };
        }
      } else if (userId) {
        await db.insert(schema.events).values({
          ...item,
          userId,
        });
      }
    } catch (e) {
      // fallback
    }

    const idx = mockEvents.findIndex((e) => e.id === item.id);
    if (idx !== -1) {
      mockEvents[idx] = {
        ...mockEvents[idx],
        ...item,
      };
    }
  }

  return mockEvents;
}

export async function getBankAccounts(userId?: string | null) {
  try {
    const query = userId
      ? db.select().from(schema.bankAccounts).where(eq(schema.bankAccounts.userId, userId)).orderBy(schema.bankAccounts.displayOrder)
      : db.select().from(schema.bankAccounts).orderBy(schema.bankAccounts.displayOrder);
    const res = await query;
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockBanks;
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
  const updatedList = [];
  for (let i = 0; i < banksList.length; i++) {
    const item = banksList[i];
    const bankId = item.id || `b-${Date.now()}-${i}`;
    const bankObj = {
      id: bankId,
      userId: userId || null,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      accountHolder: item.accountHolder,
      displayOrder: i + 1,
      isActive: item.isActive ?? true,
    };

    try {
      const existing = await db.select().from(schema.bankAccounts).where(eq(schema.bankAccounts.id, bankId)).limit(1);
      if (existing.length > 0) {
        const res = await db
          .update(schema.bankAccounts)
          .set({
            bankName: item.bankName,
            accountNumber: item.accountNumber,
            accountHolder: item.accountHolder,
            displayOrder: i + 1,
            updatedAt: new Date(),
          })
          .where(eq(schema.bankAccounts.id, bankId))
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(bankObj);
      } else {
        const res = await db
          .insert(schema.bankAccounts)
          .values({
            ...bankObj,
            userId: userId || null,
          })
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(bankObj);
      }
    } catch (e) {
      updatedList.push(bankObj);
    }
  }

  mockBanks = updatedList;
  return mockBanks;
}

export async function getLoveStories(userId?: string | null) {
  try {
    const query = userId
      ? db.select().from(schema.loveStories).where(eq(schema.loveStories.userId, userId)).orderBy(schema.loveStories.displayOrder)
      : db.select().from(schema.loveStories).orderBy(schema.loveStories.displayOrder);
    const res = await query;
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockStories;
}

export async function getGallery(userId?: string | null) {
  try {
    const query = userId
      ? db.select().from(schema.gallery).where(eq(schema.gallery.userId, userId)).orderBy(schema.gallery.displayOrder)
      : db.select().from(schema.gallery).orderBy(schema.gallery.displayOrder);
    const res = await query;
    if (res.length > 0) return res;
  } catch (e) {
    // fallback
  }
  return mockGallery;
}

export async function updateGallery(
  galleryList: Array<{
    id?: string;
    imageUrl: string;
    altText?: string;
    displayOrder?: number;
  }>,
  userId?: string | null
) {
  const updatedList = [];
  for (let i = 0; i < galleryList.length; i++) {
    const item = galleryList[i];
    const itemObj = {
      id: item.id || `g-img-${Date.now()}-${i}`,
      userId: userId || null,
      imageUrl: item.imageUrl,
      altText: item.altText || `Foto Prewedding ${i + 1}`,
      displayOrder: i + 1,
    };

    try {
      const existing = await db.select().from(schema.gallery).where(eq(schema.gallery.id, itemObj.id)).limit(1);
      if (existing.length > 0) {
        const res = await db
          .update(schema.gallery)
          .set({
            imageUrl: item.imageUrl,
            altText: item.altText || `Foto Prewedding ${i + 1}`,
            displayOrder: i + 1,
            updatedAt: new Date(),
          })
          .where(eq(schema.gallery.id, itemObj.id))
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(itemObj);
      } else {
        const res = await db
          .insert(schema.gallery)
          .values({
            ...itemObj,
            userId: userId || null,
          })
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(itemObj);
      }
    } catch (e) {
      updatedList.push(itemObj);
    }
  }

  mockGallery = updatedList;
  return mockGallery;
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
  const updatedList = [];
  for (let i = 0; i < storiesList.length; i++) {
    const item = storiesList[i];
    const storyId = item.id || `ls-${Date.now()}-${i}`;
    const storyObj = {
      id: storyId,
      userId: userId || null,
      year: item.year,
      title: item.title,
      description: item.description,
      displayOrder: i + 1,
    };

    try {
      const existing = await db.select().from(schema.loveStories).where(eq(schema.loveStories.id, storyId)).limit(1);
      if (existing.length > 0) {
        const res = await db
          .update(schema.loveStories)
          .set({
            year: item.year,
            title: item.title,
            description: item.description,
            displayOrder: i + 1,
            updatedAt: new Date(),
          })
          .where(eq(schema.loveStories.id, storyId))
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(storyObj);
      } else {
        const res = await db
          .insert(schema.loveStories)
          .values({
            ...storyObj,
            userId: userId || null,
          })
          .returning();
        if (res.length > 0) updatedList.push(res[0]);
        else updatedList.push(storyObj);
      }
    } catch (e) {
      updatedList.push(storyObj);
    }
  }

  mockStories = updatedList;
  return mockStories;
}

// Aliases for compatibility
export const getAllEvents = getEvents;
export const getAllBanks = getBankAccounts;
export const getAllLoveStories = getLoveStories;
