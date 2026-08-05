import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validations";
import { upsertRsvp } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Format RSVP tidak valid", details: parsed.error.format() },
        { status: 400 }
      );
    }

    if (parsed.data.guestId.startsWith("demo")) {
      return NextResponse.json({
        success: true,
        rsvp: {
          id: `demo-r-${Date.now()}`,
          guestId: parsed.data.guestId,
          attendanceStatus: parsed.data.attendanceStatus,
          guestCount: parsed.data.guestCount,
          message: parsed.data.message || "",
          createdAt: new Date(),
        },
      });
    }

    const savedRsvp = await upsertRsvp(parsed.data);
    return NextResponse.json({ success: true, rsvp: savedRsvp });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan RSVP" }, { status: 500 });
  }
}
