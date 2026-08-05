import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image"; // "image" | "music"

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const resourceType = type === "music" || mimeType.startsWith("audio/") ? "video" : "image";
    const folder = type === "music" ? "wedding/music" : "wedding/photos";

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      message: "Upload berhasil",
    });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Pastikan format file didukung." },
      { status: 500 }
    );
  }
}
