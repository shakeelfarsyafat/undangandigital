import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllGuests, getAllRsvps } from "@/lib/data-store";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.role === "superadmin" ? null : session.userId;
    const [guests, rsvps] = await Promise.all([getAllGuests(userId), getAllRsvps(userId)]);

    const totalGuests = guests.length;
    const opened = guests.filter((g) => g.invitationStatus === "opened").length;
    const unopened = totalGuests - opened;

    const confirmedAttending = rsvps.filter((r) => r.attendanceStatus === "attending").length;
    const confirmedDeclined = rsvps.filter((r) => r.attendanceStatus === "declined").length;

    // Guests that have rsvp response vs pending
    const respondedGuestIds = new Set(rsvps.map((r) => r.guestId));
    const pendingConfirmation = guests.filter((g) => !respondedGuestIds.has(g.id)).length;

    // Total estimated head count
    const estimatedAttendees = rsvps
      .filter((r) => r.attendanceStatus === "attending")
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);

    return NextResponse.json({
      stats: {
        totalGuests,
        opened,
        unopened,
        confirmedAttending,
        confirmedDeclined,
        pendingConfirmation,
        estimatedAttendees,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/stats] Error:", error);
    return NextResponse.json({ error: "Gagal memuat statistik" }, { status: 500 });
  }
}
