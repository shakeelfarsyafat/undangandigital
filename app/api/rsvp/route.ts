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

    const savedRsvp = await upsertRsvp(parsed.data);
    return NextResponse.json({ success: true, rsvp: savedRsvp });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan RSVP" }, { status: 500 });
  }
}
