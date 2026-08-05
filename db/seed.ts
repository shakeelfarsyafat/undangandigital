import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes("dummy")) {
  console.log("⚠️ DATABASE_URL belum dikonfigurasi dengan URL Neon PostgreSQL yang valid.");
  process.exit(0);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🌱 Memulai seeding database Neon PostgreSQL...");

  // 1. Seed Super Admin & Admin Users
  const superPasswordHash = await bcrypt.hash("superadmin123", 10);
  await db
    .insert(schema.users)
    .values({
      name: "Super Admin Platform",
      email: "superadmin@wedding.com",
      passwordHash: superPasswordHash,
      role: "superadmin",
    })
    .onConflictDoNothing({ target: schema.users.email });

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await db
    .insert(schema.users)
    .values({
      name: "Admin Platform",
      email: "admin@wedding.com",
      passwordHash: adminPasswordHash,
      role: "superadmin",
    })
    .onConflictDoNothing({ target: schema.users.email });

  // 2. Seed Admin Mempelai User
  const mempelaiPasswordHash = await bcrypt.hash("mempelai123", 10);
  await db
    .insert(schema.users)
    .values({
      name: "Admin Mempelai Ahmad & Nabila",
      email: "mempelai@wedding.com",
      passwordHash: mempelaiPasswordHash,
      role: "admin_mempelai",
      weddingSlug: "ahmad-nabila",
    })
    .onConflictDoNothing({ target: schema.users.email });

  console.log("✅ User Super Admin dibuat (superadmin@wedding.com & admin@wedding.com)");
  console.log("✅ User Admin Mempelai dibuat (mempelai@wedding.com / mempelai123)");

  // 2. Seed Wedding Settings
  const existingSettings = await db.select().from(schema.weddingSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(schema.weddingSettings).values({
      groomName: "Ahmad",
      groomFullName: "Ahmad Fauzi, S.T.",
      groomFather: "Bpk. H. Rahmat",
      groomMother: "Ibu Hj. Siti",
      groomInstagram: "ahmad.fauzi",
      groomPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",

      brideName: "Nabila",
      brideFullName: "Nabila Putri, S.Ked.",
      brideFather: "Bpk. H. Hasan",
      brideMother: "Ibu Hj. Aminah",
      brideInstagram: "nabila.putri",
      bridePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",

      weddingDate: "2026-12-20",
      quoteText: "Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",

      giftRecipient: "Ahmad Fauzi / Nabila Putri",
      giftPhone: "081234567890",
      giftAddress: "Jl. Mawar No. 12, Menteng, Jakarta Pusat, DKI Jakarta 10350",
    });
    console.log("✅ Settings Pengantin dibuat");
  }

  // 3. Seed Events
  const existingEvents = await db.select().from(schema.events);
  if (existingEvents.length === 0) {
    await db.insert(schema.events).values([
      {
        type: "akad",
        title: "Akad Nikah",
        date: "Minggu, 20 Desember 2026",
        startTime: "08.00",
        endTime: "10.00 WIB",
        venueName: "Masjid Agung Al-Azhar",
        venueAddress: "Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.google.com/?q=Masjid+Agung+Al-Azhar",
        displayOrder: 1,
      },
      {
        type: "reception",
        title: "Resepsi Pernikahan",
        date: "Minggu, 20 Desember 2026",
        startTime: "11.00",
        endTime: "15.00 WIB",
        venueName: "Ballroom Hotel Grand Mahakam",
        venueAddress: "Jl. Mahakam No. 6, Kramat Pela, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.google.com/?q=Hotel+Grand+Mahakam",
        displayOrder: 2,
      },
    ]);
    console.log("✅ Event Akad & Resepsi dibuat");
  }

  // 4. Seed Bank Accounts
  const existingBanks = await db.select().from(schema.bankAccounts);
  if (existingBanks.length === 0) {
    await db.insert(schema.bankAccounts).values([
      {
        bankName: "BCA",
        accountNumber: "1234567890",
        accountHolder: "Ahmad Fauzi",
        displayOrder: 1,
        isActive: true,
      },
      {
        bankName: "Mandiri",
        accountNumber: "9876543210",
        accountHolder: "Nabila Putri",
        displayOrder: 2,
        isActive: true,
      },
    ]);
    console.log("✅ Rekening Bank dibuat");
  }

  // 5. Seed Love Stories
  const existingStories = await db.select().from(schema.loveStories);
  if (existingStories.length === 0) {
    await db.insert(schema.loveStories).values([
      {
        year: "2021",
        title: "Pertama Bertemu",
        description: "Awal perkenalan di kampus saat aktif dalam kegiatan organisasi mahasiswa bersama.",
        displayOrder: 1,
      },
      {
        year: "2023",
        title: "Menjalin Hubungan",
        description: "Memutuskan untuk berkomitmen saling mendukung impian dan cita-cita masing-masing.",
        displayOrder: 2,
      },
      {
        year: "2026",
        title: "Lamaran",
        description: "Momen membahagiakan saat kedua keluarga besar bertemu dan mengikat janji suci.",
        displayOrder: 3,
      },
      {
        year: "2026",
        title: "Pernikahan",
        description: "Mengucap janji suci pernikahan dan mengarungi bahtera rumah tangga bersama.",
        displayOrder: 4,
      },
    ]);
    console.log("✅ Love Stories dibuat");
  }

  // 6. Seed Gallery
  const existingGallery = await db.select().from(schema.gallery);
  if (existingGallery.length === 0) {
    await db.insert(schema.gallery).values([
      {
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 1",
        displayOrder: 1,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 2",
        displayOrder: 2,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 3",
        displayOrder: 3,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 4",
        displayOrder: 4,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 5",
        displayOrder: 5,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80",
        altText: "Foto Prewedding 6",
        displayOrder: 6,
      },
    ]);
    console.log("✅ Galeri Foto dibuat");
  }



  console.log("🎉 Seeding database selesai!");
}

main().catch((err) => {
  console.error("❌ Gagal seeding database:", err);
  process.exit(1);
});
