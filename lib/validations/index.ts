import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const guestSchema = z.object({
  name: z.string().min(1, "Nama tamu wajib diisi"),
  phone: z.string().optional().nullable(),
  category: z.string().default("Teman"),
});

export const rsvpSchema = z.object({
  guestId: z.string().min(1, "ID tamu wajib diisi"),
  attendanceStatus: z.enum(["attending", "declined"], {
    message: "Pilih status kehadiran",
  }),
  guestCount: z.number().min(1).max(10).default(1),
  message: z.string().max(1000, "Pesan maksimal 1000 karakter").optional().nullable(),
});

export const weddingSettingsSchema = z.object({
  groomName: z.string().min(1, "Nama panggilan pria wajib diisi"),
  groomFullName: z.string().min(1, "Nama lengkap pria wajib diisi"),
  groomFather: z.string().min(1, "Nama ayah pria wajib diisi"),
  groomMother: z.string().min(1, "Nama ibu pria wajib diisi"),
  groomInstagram: z.string().optional().nullable(),
  groomPhotoUrl: z.string().optional().nullable(),

  brideName: z.string().min(1, "Nama panggilan wanita wajib diisi"),
  brideFullName: z.string().min(1, "Nama lengkap wanita wajib diisi"),
  brideFather: z.string().min(1, "Nama ayah wanita wajib diisi"),
  brideMother: z.string().min(1, "Nama ibu wanita wajib diisi"),
  brideInstagram: z.string().optional().nullable(),
  bridePhotoUrl: z.string().optional().nullable(),

  weddingDate: z.string().min(1, "Tanggal pernikahan wajib diisi"),
  heroPhotoUrl: z.string().optional().nullable(),
  musicUrl: z.string().optional().nullable(),
  quoteText: z.string().optional().nullable(),

  giftRecipient: z.string().optional().nullable(),
  giftPhone: z.string().optional().nullable(),
  giftAddress: z.string().optional().nullable(),
});
