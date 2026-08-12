import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const guestSchema = z.object({
  name: z.string().min(2, "Nama tamu wajib diisi"),
  phone: z.string().optional(),
  category: z.enum(["Keluarga", "Teman", "Kampus", "Organisasi", "Rekan Kerja", "Lainnya"]).default("Lainnya"),
});

export const rsvpSchema = z.object({
  guestId: z.string().min(1, "ID tamu wajib diisi"),
  attendanceStatus: z.enum(["attending", "declined"], {
    message: "Pilih status kehadiran",
  }),
  guestCount: z.number().min(1).max(10).default(1),
  message: z.string().max(1000, "Pesan maksimal 1000 karakter").optional(),
});

export const weddingSettingsSchema = z.object({
  groomName: z.string().min(1, "Nama panggilan pria wajib diisi"),
  groomFullName: z.string().min(1, "Nama lengkap pria wajib diisi"),
  groomFather: z.string().min(1, "Nama ayah pria wajib diisi"),
  groomMother: z.string().min(1, "Nama ibu pria wajib diisi"),
  groomInstagram: z.string().optional(),
  groomPhotoUrl: z.string().optional(),

  brideName: z.string().min(1, "Nama panggilan wanita wajib diisi"),
  brideFullName: z.string().min(1, "Nama lengkap wanita wajib diisi"),
  brideFather: z.string().min(1, "Nama ayah wanita wajib diisi"),
  brideMother: z.string().min(1, "Nama ibu wanita wajib diisi"),
  brideInstagram: z.string().optional(),
  bridePhotoUrl: z.string().optional(),

  weddingDate: z.string().min(1, "Tanggal pernikahan wajib diisi"),
  quoteText: z.string().optional(),

  giftRecipient: z.string().optional(),
  giftPhone: z.string().optional(),
  giftAddress: z.string().optional(),
});
