# Panduan Integrasi ImageKit.io

Dokumen ini menjelaskan langkah-langkah untuk mendaftarkan, mengambil kredensial API, dan menyambungkan layanan **ImageKit.io** ke website portfolio Anda (baik di lingkungan lokal maupun saat di-deploy ke Vercel).

---

## 1. Mendaftar & Mengambil API Keys di ImageKit.io

1. **Buat Akun Gratis**:
   - Pergi ke [ImageKit.io](https://imagekit.io) dan daftar untuk akun gratis.
   
2. **Masuk ke Dashboard**:
   - Setelah pendaftaran selesai dan email terverifikasi, masuk ke dashboard ImageKit Anda.

3. **Buka Developer Options**:
   - Klik ikon gerigi (Settings) di pojok kiri bawah, lalu pilih menu **Developer Options**.
   - Di halaman ini, Anda akan melihat bagian **API Keys**.

4. **Salin Kredensial**:
   - Salin tiga nilai berikut ke catatan Anda:
     - **URL-endpoint** (Contoh: `https://ik.imagekit.io/username/`)
     - **Public Key** (Contoh: `public_abcdef1234567890`)
     - **Private Key** (Contoh: `private_abcdef1234567890`)

---

## 2. Konfigurasi Lingkungan Lokal (Local Development)

Untuk menjalankan dan menguji upload gambar secara lokal menggunakan ImageKit:

1. **Buat File `.env`**:
   - Buka direktori `/backend` pada proyek Anda.
   - Buat file baru bernama `.env` (atau salin dari `.env.example`).

2. **Isi API Keys**:
   - Masukkan kunci yang telah Anda salin tadi ke dalam file `.env` sebagai berikut:
     ```env
     IMAGEKIT_PUBLIC_KEY=public_abcdef1234567890
     IMAGEKIT_PRIVATE_KEY=private_abcdef1234567890
     IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/username/
     ```

3. **Jalankan Ulang Server**:
   - Matikan server backend lokal Anda jika sedang berjalan, lalu jalankan kembali menggunakan perintah:
     ```bash
     npm run dev
     ```
   - Server backend NestJS Anda kini otomatis memuat kunci tersebut lewat `dotenv` dan akan mengalihkan proses upload ke ImageKit.

---

## 3. Konfigurasi Lingkungan Produksi (Vercel)

Karena backend NestJS Anda dideploy di Vercel, Anda perlu memasukkan API Keys tersebut di dashboard Vercel agar fitur upload berjalan di internet.

1. **Masuk ke Vercel**:
   - Buka [Vercel Dashboard](https://vercel.com) dan buka proyek backend portfolio Anda.

2. **Buka Menu Environment Variables**:
   - Pergi ke tab **Settings** -> pilih menu **Environment Variables** di sidebar kiri.

3. **Tambahkan 3 Variabel Baru**:
   - Tambahkan variabel berikut satu per satu (pastikan centang semua opsi Environment: *Production*, *Preview*, *Development*):
     
     * **Variabel 1**:
       - **Key**: `IMAGEKIT_PUBLIC_KEY`
       - **Value**: `[Isi dengan Public Key ImageKit Anda]`
       
     * **Variabel 2**:
       - **Key**: `IMAGEKIT_PRIVATE_KEY`
       - **Value**: `[Isi dengan Private Key ImageKit Anda]`
       
     * **Variabel 3**:
       - **Key**: `IMAGEKIT_URL_ENDPOINT`
       - **Value**: `[Isi dengan URL-endpoint ImageKit Anda]`

4. **Deploy Ulang**:
   - Agar Vercel menerapkan variabel lingkungan yang baru ditambahkan, lakukan deploy ulang (*Redeploy*) proyek backend Anda melalui tab **Deployments** di Vercel, lalu pilih **Redeploy** pada deployment terbaru.

---

## 4. Verifikasi Integrasi Berhasil

Setelah konfigurasi di atas selesai:

1. Masuk ke **Panel Admin** website portfolio Anda.
2. Coba upload gambar baru (misalnya mengganti avatar atau gambar project).
3. Jika berhasil, gambar akan terupload dan backend akan mengembalikan URL gambar yang berawalan dari ImageKit (seperti `https://ik.imagekit.io/...`).
4. Anda juga dapat masuk ke dashboard ImageKit -> **Media Library**, lalu cek folder `/portfolio`. Gambar yang baru saja Anda upload akan muncul di folder tersebut.
