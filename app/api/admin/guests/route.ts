import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { guestSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { getAllGuests, createGuest, deleteGuest, getAllRsvps } from "@/lib/data-store";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.role === "superadmin" ? null : session.userId;
    const guests = await getAllGuests(userId);
    const rsvps = await getAllRsvps(userId);

    const rsvpMap = new Map(rsvps.map((r) => [r.guestId, r]));

    const enrichedGuests = guests.map((g) => {
      const rsvp = rsvpMap.get(g.id);
      return {
        ...g,
        rsvpStatus: rsvp ? rsvp.attendanceStatus : "pending",
        guestCount: rsvp ? rsvp.guestCount : 0,
      };
    });

    return NextResponse.json({ guests: enrichedGuests });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat daftar tamu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = guestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Input tamu tidak valid", details: parsed.error.format() }, { status: 400 });
    }

    const { name, phone, category } = parsed.data;
    const userId = session.userId;

    const baseSlug = slugify(name);
    let finalSlug = baseSlug;
    const existingGuests = await getAllGuests(userId);
    const existingSlugs = new Set(existingGuests.map((g) => g.slug));

    let count = 2;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const newGuest = await createGuest({
      userId,
      name,
      slug: finalSlug,
      phone,
      category,
    });

    return NextResponse.json({ success: true, guest: newGuest });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambahkan tamu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tamu wajib diisi" }, { status: 400 });
    }

    await deleteGuest(id);
    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus tamu" }, { status: 500 });
  }
}
