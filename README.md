# Undangan Pernikahan Digital Premium

Aplikasi **Undangan Pernikahan Digital Premium** dengan sistem personalisasi nama tamu dinamis (`/invite/[slug]`), tracking status pembukaan undangan, konfirmasi RSVP, buku ucapan, dan **Admin Dashboard** lengkap.

## 🚀 Teknologi Utama

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Design System (Ivory, Cream, Champagne Gold, Warm White, Dark Brown)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Neon PostgreSQL (Serverless Driver)
- **ORM**: Drizzle ORM + Drizzle Kit
- **Authentication**: JWT Session Cookies (jose) + Password Hash (bcryptjs) & Protected Middleware
- **Form & Validation**: React Hook Form + Zod

---

## 🔑 Fitur Utama

### 1. Undangan Tamu Personalisasi (`/invite/[slug]`)
- **Cover Personalisasi**: Menampilkan nama tamu secara eksplisit ("Kepada Yth. Bapak/Ibu/Saudara/i [Nama Tamu]").
- **Automatic Tracking**: Mengubah `invitationStatus` dari `unopened` menjadi `opened` serta mencatat timestamp `openedAt` saat pertama dibuka.
- **Audio Background**: Musik pernikahan otomatis diputar setelah menekan "Buka Undangan".
- **Hero & Countdown**: Hitung mundur waktu bahagia secara realtime.
- **Ayat Pernikahan**: QS. Ar-Rum: 21 dengan terjemahan dan desain elegan.
- **Bride & Groom**: Profil pengantin pria & wanita lengkap dengan nama orang tua dan akun Instagram.
- **Love Story**: Timeline kisah cinta vertikal dengan scroll animation.
- **Save The Date**: Detail Akad Nikah & Resepsi + fitur **Simpan ke Kalender** (.ics).
- **Google Maps**: Embed lokasi acara dan tombol navigasi langsung.
- **Galeri Foto**: Layout responsif grid dengan preview **Lightbox Fullscreen** (Swipe / Click / Prev / Next).
- **Wedding Gift & Hadiah Fisik**: Kartu rekening bank dengan 1-Click Copy Toast & informasi alamat kirim hadiah fisik.
- **RSVP Form**: Terkunci sesuai nama tamu (`guestId`), pilihan status kehadiran, jumlah pendamping, dan ucapan doa.
- **Ucapan & Doa**: Feed ucapan tamu dengan timestamp relatif ("2 menit yang lalu").

### 2. Admin Dashboard (`/admin`)
- **Proteksi Akses**: Login admin dengan enkripsi password bcrypt (`/admin/login`).
- **Dashboard Statistik**:
  - Total Undangan
  - Sudah Dibuka
  - Belum Dibuka
  - Konfirmasi Hadir
  - Tidak Hadir
  - Belum Konfirmasi
  - Perkiraan Kehadiran (Total Orang)
- **Manajemen Tamu (`/admin/guests`)**:
  - Form Tambah Tamu dengan **Auto-Generated Unique Slug** (`Faza Mohamad` → `faza-mohamad`, handling duplikat `faza-mohamad-2`).
  - **Copy Link 1-Click**: Menyalin URL personal `https://domain.com/invite/faza-mohamad`.
  - **Kirim WhatsApp**: Integrasi link WhatsApp langsung dengan pesan personal yang menyertakan nama dan URL undangan tamu.
  - Search, Filter Kategori, Sorting, dan Hapus Tamu.
- **Rekapitulasi RSVP (`/admin/rsvp`)**: Tabel status balasan tamu dan total perkiraan kehadiran.
- **Ucapan Tamu (`/admin/wishes`)**: Daftar ucapan dan doa yang dikirimkan tamu.
- **Pengaturan Undangan (`/admin/settings`)**: Edit data Pengantin, Acara, Rekening, dan Alamat Hadiah.

---

## 🛠️ Panduan Instalasi & Jalankan Lokal

### 1. Clone & Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root proyek (sesuai contoh `.env.example`):
```env
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="super-secret-random-key-at-least-32-characters-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Migration & Seed Database
Jalankan perintah berikut untuk menggenerasi skema Drizzle, menjalankan migrasi ke Neon PostgreSQL, dan mengisikan data awal (Seed):

```bash
# Generate Drizzle migration
npm run db:generate

# Push migration ke Neon PostgreSQL
npm run db:migrate

# Seed data awal (Admin, Data Pengantin, Acara, Rekening, Tamu Contoh)
npm run db:seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 👤 Akun Admin Default

- **Email**: `admin@wedding.com`
- **Password**: `admin123`
- **URL Admin**: `http://localhost:3000/admin/login`

---

## 💌 Contoh URL Undangan Tamu

- `http://localhost:3000/invite/faza-mohamad`
- `http://localhost:3000/invite/ahmad-fauzan`
- `http://localhost:3000/invite/siti-rahma`
