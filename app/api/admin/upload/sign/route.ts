import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { folder, resource_type } = body;

    const timestamp = Math.round(Date.now() / 1000);
    const params: Record<string, string | number> = {
      folder: folder || "wedding/photos",
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: params.folder,
    });
  } catch (error) {
    console.error("[SIGN ERROR]", error);
    return NextResponse.json({ error: "Gagal membuat signature" }, { status: 500 });
  }
}
