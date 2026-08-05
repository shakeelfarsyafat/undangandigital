import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload via stream tanpa batas ukuran file
function uploadStream(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary tidak mengembalikan hasil"));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validasi ukuran: maksimal 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 50MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType = file.type || "application/octet-stream";

    // Tentukan resource_type berdasarkan MIME atau parameter type
    const isAudio =
      type === "music" ||
      mimeType.startsWith("audio/") ||
      mimeType === "application/ogg" ||
      /\.(mp3|wav|ogg|flac|aac|m4a|wma)$/i.test(file.name);

    const resourceType: "image" | "video" | "raw" | "auto" = isAudio ? "video" : "auto";
    const folder = isAudio ? "wedding/music" : "wedding/photos";

    const result = await uploadStream(buffer, {
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
    const errMsg = error instanceof Error ? error.message : "Gagal mengunggah file";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
