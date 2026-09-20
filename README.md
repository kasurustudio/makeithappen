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

## Setup Lokal (Quick Start dengan Docker)

Cara tercepat untuk menjalankan & mengecek aplikasi ini di komputermu sendiri:

1. Clone repo dan masuk ke foldernya:

   ```bash
   git clone https://github.com/kasurustudio/makeithappen.git
   cd makeithappen
   ```

2. Nyalakan database PostgreSQL lokal via Docker (butuh [Docker Desktop](https://www.docker.com/products/docker-desktop/) terinstall):

   ```bash
   docker compose up -d
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Salin `.env.example` menjadi `.env` — nilai default `DATABASE_URL` sudah cocok dengan `docker-compose.yml`, tidak perlu diubah untuk coba-coba lokal:

   ```bash
   cp .env.example .env
   ```

   Kalau mau ganti kredensial login, edit `ADMIN_USERNAME` / `ADMIN_PASSWORD` di `.env` (default: `admin` / `change-this-password`).

5. Jalankan migrasi database:

   ```bash
   npx prisma migrate deploy
   ```

6. (Opsional tapi disarankan) Isi data contoh biar tidak kosong saat dicek:

   ```bash
   npx prisma db seed
   ```

7. Jalankan server development:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser, login dengan kredensial dari `.env`.

Untuk mematikan database lokal: `docker compose down` (data tersimpan di volume, `docker compose down -v` untuk hapus total).

### Tanpa Docker

Kalau tidak pakai Docker, siapkan database PostgreSQL sendiri (lokal atau cloud seperti Supabase/Neon), lalu isi `DATABASE_URL` di `.env` dengan connection string-nya sebelum lanjut ke langkah 5 di atas.

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
