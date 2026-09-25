# Spec: Migrasi Portfolio (Next.js + NestJS + SQLite) ke VPS Ubuntu Pribadi

## 1. Ringkasan Eksekutif
Proyek ini memigrasikan web portofolio pribadi (`erikosyah.my.id`) dari arsitektur serverless Vercel ke VPS Ubuntu pribadi (2 vCPU, 2 GB RAM, 40 GB Storage). Migrasi ini mengatasi masalah *cold start* lambat pada Vercel dan batas ephemeral storage, serta menyatukan Frontend Next.js, Backend NestJS, dan SQLite ke dalam satu server yang terkelola dengan PM2 dan Nginx reverse proxy ber-SSL Let's Encrypt.

---

## 2. Spesifikasi Lingkungan Server
* **OS**: Ubuntu (Linux)
* **Resource**: 2 vCPU, 2 GB RAM, 6 GB Swap (Aktif), 40 GB Storage
* **Web Server**: Nginx (sudah aktif di port 80 & 443)
* **Ketersediaan Resource**: RAM Available 1.1 GB (Next.js + NestJS memakan ~180MB RAM)
* **Port yang Digunakan**:
  * Next.js Frontend: Port `3000` (terverifikasi bebas)
  * NestJS Backend: Port `3001` (terverifikasi bebas)
* **Akses Remote**: Termius (SSH & SFTP), TablePlus (Over SSH tunnel)

---

## 3. Arsitektur Domain & Routing
* **Domain Utama**: `erikosyah.my.id`
  * Nginx reverse proxy ke `http://127.0.0.1:3000` (Next.js)
* **Domain API**: `api.erikosyah.my.id`
  * Nginx reverse proxy ke `http://127.0.0.1:3001` (NestJS)
* **Protokol**: HTTPS via Certbot Let's Encrypt SSL
* **DNS Records**:
  * `A` record `@` -> IP VPS
  * `A` record `api` -> IP VPS

---

## 4. Komponen & Database
* **Database**: SQLite lokal
  * Lokasi file: `/var/www/portfolio/backend/database.sqlite`
  * Zero-daemon, zero-RAM overhead, sub-millisecond query time.
  * Migrasi data: Upload file `database.sqlite` yang sudah berisi data (122 KB) via Termius SFTP atau `scp`.
  * GUI Inspection: TablePlus via SSH Tunnel ke path file di VPS.
* **Media / File Upload**: ImageKit CDN (tetap aktif via `.env`) + fallback static folder `uploads/`.

---

## 5. Process Manager (PM2)
File `ecosystem.config.js` di root `/var/www/portfolio` mengelola 2 proses:
1. `portfolio-backend`:
   * Script: `backend/dist/main.js`
   * Cwd: `/var/www/portfolio/backend`
   * Port: `3001`
   * Autorestart: true
2. `portfolio-frontend`:
   * Script: `node_modules/next/dist/bin/next`
   * Args: `start -p 3000`
   * Cwd: `/var/www/portfolio/frontend`
   * Port: `3000`
   * Autorestart: true

---

## 6. Perubahan Kode & File Konfigurasi Baru
1. **`backend/src/main.ts`**:
   * Perbarui konfigurasi CORS pada `bootstrap()` agar mengizinkan `https://erikosyah.my.id`, `https://www.erikosyah.my.id`, atau variabel `FRONTEND_URL`.
2. **`frontend/.env.production`**:
   * Tambahkan `NEXT_PUBLIC_API_URL=https://api.erikosyah.my.id/api`.
3. **`ecosystem.config.js`**:
   * Buat file konfigurasi PM2 standar produksi.
4. **`deploy/nginx-portfolio.conf`**:
   * Template Nginx server block untuk `erikosyah.my.id` dan `api.erikosyah.my.id`.
5. **Panduan Deploy (Cheat-sheet)**:
   * Langkah demi langkah git clone / sync, npm install, build, PM2 start, dan Certbot.
