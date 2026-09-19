# Make It Happen — Wedding Backoffice

Backoffice pribadi untuk memanage persiapan pernikahan: vendor, budget & pembayaran, tamu & RSVP, dan checklist/timeline. Dibuat dengan Next.js (App Router), TypeScript, Tailwind CSS, dan Prisma (SQLite).

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
- [Prisma](https://www.prisma.io) + SQLite

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env` dan sesuaikan:

   ```bash
   cp .env.example .env
   ```

   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — kredensial login backoffice. **Wajib diganti** dari nilai default.
   - `SESSION_SECRET` — string acak panjang untuk menandatangani session cookie.
   - `COOKIE_SECURE` — set `"true"` jika aplikasi di-deploy di belakang HTTPS.

3. Jalankan migrasi database (membuat file SQLite lokal):

   ```bash
   npx prisma migrate deploy
   ```

4. Jalankan server development:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000), login dengan kredensial dari `.env`.

## Build untuk Produksi

```bash
npm run build
npm start
```

Karena database menggunakan SQLite (`prisma/dev.db`), pastikan file ini persisten (tidak ikut terhapus) saat deploy ulang — misalnya dengan volume/disk yang persisten di hosting pilihanmu.

## Struktur Data

Skema database (`prisma/schema.prisma`) mencakup: `Vendor`, `BudgetCategory`, `Payment`, `Guest`, `ChecklistTask`, dan `Settings` (nama pasangan, tanggal pernikahan, total budget).
