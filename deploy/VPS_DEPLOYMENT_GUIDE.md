# 🚀 Panduan Lengkap Deployment VPS Ubuntu — Portfolio Web

Dokumen ini merupakan panduan *step-by-step* (runbook) resmi untuk mendeploy proyek portofolio (Frontend Next.js & Backend NestJS dengan SQLite) ke server Ubuntu VPS (Hostinger, DigitalOcean, Linode, AWS EC2, dll) menggunakan **Termius**, **PM2**, **Nginx**, **Let's Encrypt (Certbot)**, dan **TablePlus** via SSH Tunnel.

---

## 📋 Ringkasan Arsitektur Deployment

- **Domain Utama**: `erikosyah.my.id` & `www.erikosyah.my.id` ➔ Next.js (Port `3000`)
- **Subdomain API**: `api.erikosyah.my.id` ➔ NestJS REST API (Port `3001`)
- **Database**: SQLite (`database.sqlite`) tersimpan lokal di server VPS (`/var/www/portfolio/backend/database.sqlite`)
- **Process Manager**: PM2 (Cluster/Daemon manager dengan auto-restart)
- **Web Server / Reverse Proxy**: Nginx dengan kompresi & HTTP/2
- **Keamanan**: Let's Encrypt SSL (HTTPS gratis) & TablePlus via SSH Tunnel aman

---

## 📑 Daftar Isi
1. [Tahap 1: Konfigurasi DNS di Cloudflare / Registrar](#tahap-1-konfigurasi-dns-di-cloudflare--registrar)
2. [Tahap 2: Persiapan VPS & Clone Repository](#tahap-2-persiapan-vps--clone-repository)
3. [Tahap 3: Migrasi Database & File Env via Termius SFTP](#tahap-3-migrasi-database--file-env-via-termius-sftp)
4. [Tahap 4: Build Proyek di VPS (Backend & Frontend)](#tahap-4-build-proyek-di-vps-backend--frontend)
5. [Tahap 5: Menjalankan Aplikasi dengan PM2](#tahap-5-menjalankan-aplikasi-dengan-pm2)
6. [Tahap 6: Pasang Nginx Reverse Proxy](#tahap-6-pasang-nginx-reverse-proxy)
7. [Tahap 7: Pasang Sertifikat SSL Gratis (Certbot)](#tahap-7-pasang-sertifikat-ssl-gratis-certbot)
8. [Tahap 8: Mengakses & Mengelola Database via TablePlus (SSH Tunnel)](#tahap-8-mengakses--mengelola-database-via-tableplus-ssh-tunnel)
9. [Bonus: Prosedur Update Kode di Masa Depan (CI/CD Manual)](#bonus-prosedur-update-kode-di-masa-depan-cicd-manual)

---

## Tahap 1: Konfigurasi DNS di Cloudflare / Registrar

Sebelum server dapat diakses dengan domain, arahkan domain ke alamat IP Publik VPS Anda.

1. Buka dashboard penyedia DNS Anda (misal: **Cloudflare**, Niagahoster, Namecheap, DomaiNesia, dll).
2. Tambahkan **DNS Records** berikut:

| Tipe | Nama (Name) | Target / IPv4 Address | Proxy Status (Cloudflare) | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `<IP_VPS_ANDA>` (contoh: `103.123.45.67`) | **DNS Only (Gray Cloud)** * | Auto |
| **A** | `www` | `<IP_VPS_ANDA>` | **DNS Only (Gray Cloud)** * | Auto |
| **A** | `api` | `<IP_VPS_ANDA>` | **DNS Only (Gray Cloud)** * | Auto |

> 💡 **PENTING (Khusus Cloudflare)**:
> Matikan icon awan oranye menjadi **Gray Cloud (DNS Only)** saat setup awal. Jika Proxy diaktifkan sebelum sertifikat SSL dipasang di VPS, proses verifikasi Certbot/Let's Encrypt dapat gagal atau mengalami *Too Many Redirects*. Setelah SSL berhasil dipasang pada Tahap 7, Anda dapat mengaktifkan Cloudflare Proxy (Orange Cloud) kembali dengan mode enkripsi **Full (Strict)**.

3. **Verifikasi Propagasi DNS**:
   Buka terminal di komputer lokal atau gunakan web seperti [dnschecker.org](https://dnschecker.org):
   ```bash
   ping erikosyah.my.id
   ping api.erikosyah.my.id
   ```
   Pastikan IP yang muncul sudah sesuai dengan IP VPS Anda.

---

## Tahap 2: Persiapan VPS & Clone Repository

### 2.1 Login ke VPS via Termius
1. Buka aplikasi **Termius** di komputer Anda.
2. Klik **New Host**:
   - **Label**: `Ubuntu Portfolio VPS`
   - **Address**: `<IP_VPS_ANDA>`
   - **Username**: `root` (atau username sudoer Anda, misal: `ubuntu`)
   - **Password** atau **Key**: Masukkan kredensial login Anda.
3. Klik ganda pada host untuk membuka sesi SSH terminal.

---

### 2.2 Update Sistem & Install Kebutuhan Dasar
Jalankan perintah berikut di terminal VPS:

```bash
# Update package list & upgrade sistem
sudo apt update && sudo apt upgrade -y

# Install dependensi dasar
sudo apt install -y curl wget git build-essential ufw software-properties-common
```

---

### 2.3 Konfigurasi Swap Memory (Sangat Direkomendasikan untuk VPS RAM 1GB - 2GB)
Build Next.js membutuhkan memori yang cukup intensif. Membuat swap mencegah error *JavaScript heap out of memory* atau proses di-kill oleh sistem (OOM Killer):

```bash
# Buat file swap 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Buat permanen agar tetap aktif saat VPS reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Cek swap
free -h
```

---

### 2.4 Install Node.js (v20 LTS), PM2, dan Nginx

```bash
# Install Node.js 20.x LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi versi node dan npm
node -v   # Minimal v20.x.x
npm -v    # Minimal 10.x.x

# Install PM2 secara global
sudo npm install -g pm2

# Install Nginx Web Server
sudo apt install -y nginx

# Install Certbot (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

---

### 2.5 Buat Direktori Kerja & Clone Repository

```bash
# Buat folder target aplikasi
sudo mkdir -p /var/www/portfolio

# Ubah kepemilikan folder ke user yang sedang aktif agar tidak perlu 'sudo' terus-menerus
sudo chown -R $USER:$USER /var/www/portfolio

# Clone repository ke dalam folder tersebut
git clone https://github.com/ErikoSyahPutra/portoku.git /var/www/portfolio

# Masuk ke direktori proyek
cd /var/www/portfolio
```

> 📌 *Catatan*: Jika repository bersifat **private**, buat GitHub Personal Access Token (PAT) atau tambahkan SSH Key VPS Anda (`cat ~/.ssh/id_rsa.pub`) ke menu **Settings > SSH and GPG keys** di akun GitHub Anda.

---

## Tahap 3: Migrasi Database & File Env via Termius SFTP

File `backend/database.sqlite` (berisi konten portofolio Anda) dan `backend/.env` (berisi secret API key ImageKit dan SMTP email) tidak disimpan di repositori publik Git demi alasan keamanan. Kita akan memindahkannya dari komputer lokal ke VPS via Termius SFTP.

### 3.1 Membuka SFTP di Termius
1. Di Termius, klik tab menu **SFTP** di sisi kiri.
2. Di panel **kiri** (Local Machine):
   - Navigasikan ke folder lokal proyek Anda:
     `D:\MAHESA\Proyek Web\web-porto\backend\`
3. Di panel **kanan** (Remote VPS):
   - Pilih koneksi VPS Anda.
   - Navigasikan ke direktori remote:
     `/var/www/portfolio/backend/`

---

### 3.2 Drag & Drop File
Pindahkan file-file berikut dari panel kiri ke panel kanan:
1. **`database.sqlite`** ➔ Copy ke `/var/www/portfolio/backend/database.sqlite`
2. **`.env`** ➔ Copy ke `/var/www/portfolio/backend/.env`
3. *(Opsional)* Jika Anda memiliki file di folder `backend/uploads/` lokal, upload seluruh isi folder tersebut ke `/var/www/portfolio/backend/uploads/`.

---

### 3.3 Pastikan Permission File Benar di VPS
Kembali ke terminal SSH VPS dan jalankan:

```bash
cd /var/www/portfolio/backend

# Buat folder uploads jika belum ada
mkdir -p uploads

# Berikan hak akses baca & tulis untuk database dan folder uploads
chmod 664 database.sqlite
chmod -R 775 uploads

# Periksa apakah file .env dan database.sqlite sudah ada
ls -la
```

---

## Tahap 4: Build Proyek di VPS (Backend & Frontend)

### 4.1 Install & Build Backend (NestJS)

```bash
cd /var/www/portfolio/backend

# Install dependensi backend
npm install --omit=dev=false

# Build project menjadi JavaScript siap produksi di folder dist/
npm run build
```

✅ **Verifikasi**: Pastikan folder `/var/www/portfolio/backend/dist/main.js` telah berhasil terbuat tanpa error.

---

### 4.2 Install & Build Frontend (Next.js)

```bash
cd /var/www/portfolio/frontend

# Install dependensi frontend
npm install

# Build Next.js untuk production
npm run build
```

✅ **Verifikasi**: Build Next.js akan menampilkan tanda centang hijau untuk semua rute statis dan SSR (`○ / (Static)` dll) serta membentuk folder `/var/www/portfolio/frontend/.next`.

---

## Tahap 5: Menjalankan Aplikasi dengan PM2

Proyek ini telah dilengkapi file konfigurasi [ecosystem.config.js](file:///D:/MAHESA/Proyek%20Web/web-porto/ecosystem.config.js) di root direktori. File ini akan menjalankan Backend di port `3001` dan Frontend di port `3000` secara bersamaan.

### 5.1 Jalankan Aplikasi

```bash
cd /var/www/portfolio

# Start kedua aplikasi sesuai konfigurasi ecosystem
pm2 start ecosystem.config.js
```

---

### 5.2 Cek Status & Log Aplikasi

```bash
# Periksa status proses PM2 (keduanya harus berstatus 'online')
pm2 status

# Melihat log aplikasi secara realtime (tekan Ctrl+C untuk keluar dari log)
pm2 logs
```

---

### 5.3 Tes Endpoint Lokal (Self-Check)

Jalankan perintah `curl` dari dalam terminal VPS:

```bash
# Tes Frontend Next.js (harus me-return HTML)
curl -I http://127.0.0.1:3000

# Tes Backend NestJS (harus me-return response API)
curl -I http://127.0.0.1:3001/api
```

---

### 5.4 Konfigurasi Auto-Start Saat VPS Reboot
Agar aplikasi otomatis menyala saat VPS dimatikan atau di-restart oleh provider:

```bash
# Simpan daftar proses yang sedang berjalan
pm2 save

# Daftarkan PM2 ke system startup script
pm2 startup
```

> ⚠️ **Perhatian**: Jika perintah `pm2 startup` menampilkan perintah tambahan (misal: `sudo env PATH=$PATH...`), salin dan jalankan perintah tersebut di terminal, lalu jalankan `pm2 save` sekali lagi.

---

## Tahap 6: Pasang Nginx Reverse Proxy

Nginx bertindak sebagai gerbang terdepan yang menerima request dari pengunjung internet (port 80/443), meneruskannya ke port lokal aplikasi (`3000` atau `3001`), dan menangani SSL/TLS.

### 6.1 Pasang Konfigurasi Nginx
Proyek sudah menyediakan file template di `deploy/nginx-portfolio.conf`. Salin file ini ke direktori konfigurasi Nginx:

```bash
# Salin konfigurasi ke sites-available
sudo cp /var/www/portfolio/deploy/nginx-portfolio.conf /etc/nginx/sites-available/portfolio.conf

# Buat symlink ke sites-enabled untuk mengaktifkannya
sudo ln -sf /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/portfolio.conf

# Hapus konfigurasi default Nginx agar tidak bentrok
sudo rm -f /etc/nginx/sites-enabled/default
```

---

### 6.2 Uji & Reload Nginx

```bash
# Uji apakah sintaks konfigurasi Nginx valid
sudo nginx -t
```
*Jika output menampilkan:*
`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok`
`nginx: configuration file /etc/nginx/nginx.conf test is successful`

Maka lakukan reload Nginx:
```bash
sudo systemctl reload nginx
```

---

### 6.3 Atur Firewall (UFW)
Pastikan port HTTP (80) dan HTTPS (443) serta SSH (22) dibuka pada firewall Ubuntu:

```bash
# Izinkan akses SSH agar Anda tidak terkunci keluar
sudo ufw allow OpenSSH

# Izinkan akses Nginx Full (Port 80 & 443)
sudo ufw allow 'Nginx Full'

# Aktifkan firewall (tekan 'y' jika ditanya konfirmasi)
sudo ufw enable

# Cek status firewall
sudo ufw status
```

---

## Tahap 7: Pasang Sertifikat SSL Gratis (Certbot)

Gunakan Certbot untuk menerbitkan sertifikat Let's Encrypt resmi dan gratis. Certbot akan secara otomatis mengonfigurasi SSL dan redirect HTTPS di Nginx.

### 7.1 Eksekusi Certbot Satu Baris

```bash
sudo certbot --nginx -d erikosyah.my.id -d www.erikosyah.my.id -d api.erikosyah.my.id
```

### 7.2 Interaksi Prompt Certbot:
1. **Enter email address**: Masukkan email aktif Anda (misal: `erikosyahputraf@gmail.com`) untuk pemberitahuan pembaruan sertifikat.
2. **Terms of Service**: Ketik `Y` lalu tekan Enter untuk menyetujui.
3. **Share email with EFF**: Ketik `N` (atau `Y` jika ingin menerima buletin EFF).
4. Certbot akan melakukan verifikasi domain via HTTP Challenge dan otomatis menambahkan sertifikat SSL ke Nginx!

---

### 7.3 Uji Auto-Renewal Sertifikat
Sertifikat Let's Encrypt berlaku selama 90 hari dan diperbarui otomatis oleh sistem cron/timer Ubuntu. Uji fitur ini dengan perintah:

```bash
sudo certbot renew --dry-run
```
Jika muncul pesan `Congratulations, all simulated renewals succeeded`, maka SSL otomatis aman selamanya!

---

## Tahap 8: Mengakses & Mengelola Database via TablePlus (SSH Tunnel)

Karena database Anda adalah **SQLite** yang berada di dalam server Linux remote, Anda **TIDAK PERLU** menginstal DBMS berat (seperti MySQL/PostgreSQL) atau membuka port database ke internet. **TablePlus** dapat terhubung langsung ke file SQLite di VPS secara aman melalui **SSH Tunnel**.

### 8.1 Langkah Konfigurasi TablePlus
1. Buka aplikasi **TablePlus** di Windows/macOS.
2. Klik **Create a new connection...** di layar utama.
3. Pilih tipe koneksi: **SQLite**.
4. Beri nama koneksi: `Portfolio VPS Production`.

---

### 8.2 Konfigurasi SSH Tunnel (Over SSH)
Di bagian bawah jendela koneksi TablePlus, centang atau klik tab **Over SSH** (atau tombol toggle SSH):

Isi form SSH Tunnel sebagai berikut:
- **Server**: Masukkan IP VPS Anda (contoh: `103.123.45.67`) atau hostname Anda.
- **Port**: `22` (default port SSH).
- **User**: User SSH VPS Anda (misal: `root` atau `ubuntu`).
- **Auth Type**:
  - Jika menggunakan Password: Pilih **Password** dan masukkan password akun VPS Anda.
  - Jika menggunakan SSH Key: Pilih **Private Key**, klik ikon folder, dan pilih file key Anda (misal: `~/.ssh/id_rsa` atau file `.pem`).

---

### 8.3 Konfigurasi File Database SQLite
Di bagian atas form utama TablePlus (kolom database file):
- **Database Path / File**: Ketikkan path absolut file database di VPS:
  ```text
  /var/www/portfolio/backend/database.sqlite
  ```

---

### 8.4 Test & Hubungkan
1. Klik tombol **Test** di sudut kanan bawah.
2. Indikator lampu status akan menyala **Hijau**:
   - `SSH Tunnel: OK`
   - `SQLite Connection: OK`
3. Klik tombol **Save**, lalu klik **Connect**.
4. 🎉 **Selesai!** Anda sekarang dapat:
   - Melihat tabel: `projects`, `experiences`, `academics`, `blogs`, `awards`, `profile`, `contacts`, dll.
   - Mengedit data langsung di tabel seperti spreadsheet (klik **Cmd+S** atau **Ctrl+S** untuk menyimpan perubahan).
   - Menjalankan custom query SQL.
   - Melakukan export / backup database ke format SQL atau CSV langsung dari laptop Anda.

---

## Bonus: Prosedur Update Kode di Masa Depan (CI/CD Manual)

Ketika Anda melakukan perubahan kode di komputer lokal, commit, dan push ke GitHub, ikuti langkah berikut untuk memperbarui aplikasi di VPS:

```bash
# 1. Masuk ke direktori proyek di VPS
cd /var/www/portfolio

# 2. Tarik update terbaru dari GitHub
git pull origin main

# 3. Update backend jika ada perubahan di backend
cd /var/www/portfolio/backend
npm install
npm run build

# 4. Update frontend jika ada perubahan di frontend
cd /var/www/portfolio/frontend
npm install
npm run build

# 5. Reload aplikasi tanpa downtime menggunakan PM2
cd /var/www/portfolio
pm2 reload ecosystem.config.js

# 6. Cek status
pm2 status
```

---

## 🛠️ Cheat Sheet Pemecahan Masalah (Troubleshooting)

| Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| **502 Bad Gateway** di browser | Aplikasi Next.js atau NestJS mati / belum online di port 3000/3001 | Jalankan `pm2 status` dan `pm2 logs` untuk melihat pesan error aplikasi. |
| **Database is locked / Read-only error** | Hak akses file `database.sqlite` atau folder `backend` belum mengizinkan write | Jalankan `chmod 664 /var/www/portfolio/backend/database.sqlite` dan pastikan kepemilikan user sesuai (`chown -R $USER:$USER /var/www/portfolio`). |
| **Build Next.js gagal (SIGKILL / OOM)** | RAM VPS habis saat proses kompilasi | Pastikan Swap Memory sudah aktif (ikuti [Tahap 2.3](#23-konfigurasi-swap-memory-sangat-direkomendasikan-untuk-vps-ram-1gb---2gb)). |
| **Certbot gagal verifikasi domain** | DNS A-Record belum mengarah ke IP VPS atau Cloudflare Proxy (Awan Oranye) aktif | Pastikan Cloudflare dalam mode **DNS Only (Awan Abu-abu)** saat pertama kali menjalankan certbot. |
| **Image / File Upload error** | Ukuran file melebihi batas default Nginx (1MB) | Konfigurasi `client_max_body_size 50M;` sudah terpasang di `nginx-portfolio.conf` untuk backend API. Pastikan Nginx sudah di-reload. |

---
*Dokumentasi ini dibuat untuk deployment sistem portofolio Eriko Syah Putra.*
