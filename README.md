# Make It Happen — Wedding Backoffice

Backoffice pribadi untuk memanage persiapan pernikahan: vendor, budget & pembayaran, tamu & RSVP, dan checklist/timeline. Dibuat dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Prisma (PostgreSQL).

Ini adalah aplikasi internal untuk kebutuhan pribadi — bukan replika publik dari platform manapun, hanya terinspirasi dari fitur-fitur umum backoffice vendor pernikahan.

## Fitur

- **Dashboard** — ringkasan budget, status vendor, RSVP tamu, dan tugas mendatang, lengkap dengan countdown hari pernikahan.
- **Vendor** — kelola daftar vendor (kategori, kontak, status negosiasi, harga disepakati) beserta riwayat pembayaran per vendor.
- **Budget** — atur total budget & tanggal pernikahan, buat kategori anggaran, catat pembayaran (terhubung ke vendor/kategori atau umum).
- **Tamu & RSVP** — kelola daftar tamu, jumlah pax, status RSVP, nomor meja, dan status undangan.
- **Checklist** — to-do list persiapan dengan kategori, tenggat waktu, prioritas, dan status.

Login tunggal (single-user) dengan username/password dari environment variable — cocok untuk pemakaian pribadi.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- TypeScript
- Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL

## Setup Lokal

1. Siapkan database PostgreSQL (lokal via Docker, atau pakai instance cloud seperti Vercel Postgres/Neon/Supabase).

2. Install dependencies:

   ```bash
   npm install
   ```

3. Salin `.env.example` menjadi `.env` dan sesuaikan:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — connection string PostgreSQL, format `postgresql://user:password@host:5432/dbname`.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — kredensial login backoffice. **Wajib diganti** dari nilai default.
   - `SESSION_SECRET` — string acak panjang untuk menandatangani session cookie.
   - `COOKIE_SECURE` — set `"true"` jika aplikasi diakses via HTTPS.

4. Jalankan migrasi database:

   ```bash
   npx prisma migrate deploy
   ```

5. Jalankan server development:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000), login dengan kredensial dari `.env`.

## Deploy ke Vercel

1. Import repo ini ke Vercel.
2. Tambahkan database Postgres lewat **Storage** tab di project Vercel (mis. Vercel Postgres/Neon), sehingga `DATABASE_URL` otomatis terisi. Kalau nama variabelnya berbeda (misal `POSTGRES_URL`), tambahkan manual environment variable `DATABASE_URL` yang menunjuk ke nilai yang sama.
3. Tambahkan environment variable berikut di **Project Settings → Environment Variables** (untuk Production, dan Preview bila dipakai):
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `COOKIE_SECURE` = `true`
4. Deploy. Script `build` (`prisma migrate deploy && next build`) otomatis menjalankan migrasi database di setiap deploy, dan `postinstall` (`prisma generate`) memastikan Prisma Client selalu ter-generate saat instalasi dependency.

## Struktur Data

Skema database (`prisma/schema.prisma`) mencakup: `Vendor`, `BudgetCategory`, `Payment`, `Guest`, `ChecklistTask`, dan `Settings` (nama pasangan, tanggal pernikahan, total budget).
