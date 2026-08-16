# Data Referensi Proyek Portofolio

Dokumen ini berisi data lengkap untuk tiga proyek dari `E:\ZedProject`. Format dokumen ini dirancang secara terstruktur agar mempermudah proses penyalinan (*copy*) dan penempelan (*paste*) setiap kolom isian (*field*) ke dalam formulir Panel Admin situs web portofolio Anda.

---

## Panduan Penggunaan
- **Menyalin Nilai:** Gunakan tombol salin atau blok teks di dalam area kode (`code block`) untuk mendapatkan teks bersih tanpa spasi atau karakter tambahan.
- **Unggah Gambar:** Pastikan gambar terkait diunggah dengan nama file yang sesuai ke direktori `/uploads` atau melalui form unggah di panel admin.
- **Featured Checkbox:** Pilihan *Featured* bernilai `Checked`, yang berarti Anda harus mencentang kotak pilihan tersebut pada formulir.

---

## 1. Laundry POS System (KasirLaundry)

### **TITLE** (Input Teks Biasa)
```text
Laundry POS System
```

### **DESCRIPTION** (Input Textarea)
```text
A complete Point-of-Sale (POS) system for laundry businesses. Features include order tracking, transaction management, billing, laundry queue status, and automated customer notifications via WhatsApp Gateway (Fonnte) when processing is complete.
```

### **PROJECT IMAGE** (Nama File & Panduan Unggah)
- **Nama File Gambar:** `/uploads/kasir_laundry.png`
- *Panduan: Unggah file gambar kasir_laundry.png ke sistem.*

### **LIVE URL** (Link Deployment)
```text
https://laundry.erikosyah.my.id
```

### **GITHUB URL** (Link Repository GitHub)
```text
https://github.com/ErikoSyahPutra/KasirLaundry
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
Next.js, Express, Prisma ORM, MySQL, Axios, Fonnte API
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)** *(Centang kotak pilihan)*

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
1
```

---

## 2. Restaurant Scan-to-Order System (Self-Ordering System)

### **TITLE** (Input Teks Biasa)
```text
Restaurant Scan-to-Order System
```

### **DESCRIPTION** (Input Textarea)
```text
A full-stack restaurant self-ordering platform. Customers scan table QR codes to browse the menu, place orders, and pay instantly via QRIS (Midtrans). Kitchen displays update in real-time using Socket.io, and customers receive automated email receipts.
```

### **PROJECT IMAGE** (Nama File & Panduan Unggah)
- **Nama File Gambar:** `/uploads/self_ordering.png`
- *Panduan: Unggah file gambar self_ordering.png ke sistem.*

### **LIVE URL** (Link Deployment)
```text
https://order.erikosyah.my.id
```

### **GITHUB URL** (Link Repository GitHub)
```text
https://github.com/ErikoSyahPutra/Self-Ordering-System
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
Next.js, Express, Prisma ORM, PostgreSQL, Socket.io, Midtrans Gateway, Recharts, Nodemailer
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)** *(Centang kotak pilihan)*

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
2
```

---

## 3. ArenaHub (Venue Rental Platform) (SewaTempat)

### **TITLE** (Input Teks Biasa)
```text
ArenaHub (Venue Rental Platform)
```

### **DESCRIPTION** (Input Textarea)
```text
A web platform for renting spaces and booking venues. Users can browse available spaces, check booking calendars, and complete secure payments via Xendit. Admin features an analytics dashboard with interactive charts.
```

### **PROJECT IMAGE** (Nama File & Panduan Unggah)
- **Nama File Gambar:** `/uploads/sewa_tempat.png`
- *Panduan: Unggah file gambar sewa_tempat.png ke sistem.*

### **LIVE URL** (Link Deployment)
```text
https://arenahub.erikosyah.my.id
```

### **GITHUB URL** (Link Repository GitHub)
```text
https://github.com/ErikoSyahPutra/arenahub
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
Next.js, Express, Prisma ORM, MySQL, Xendit API, Recharts, Lucide React
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)** *(Centang kotak pilihan)*

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
3
```

---

## 4. TicketHub (Event Ticketing Platform)

### **TITLE** (Input Teks Biasa)
```text
TicketHub (Event Ticketing Platform)
```

### **DESCRIPTION** (Input Textarea)
```text
A full-stack event ticketing platform with role-based access for Buyers, Promoters, and Admins. Features include QR code e-tickets, event moderation, ticket scanner, multi-tier pricing, and a promoter analytics dashboard.
```

### **DETAILED CONTENT** (Rich Text / Markdown)
```text
TicketHub is a comprehensive event ticketing web application built as a portfolio mockup to demonstrate full-stack engineering capabilities across three distinct user roles.

**Key Features:**
- 🎫 **E-Ticket System** — Buyers can purchase tickets across multiple price tiers. Each ticket generates a unique QR code and is downloadable as a printable PDF-style page.
- 👤 **Role-Based Access** — Three roles with separate dashboards: Buyer (ticket wallet, purchase history), Promoter (event management, attendee list), and Admin (event moderation queue, promoter management).
- 🛡️ **Event Moderation** — Promoters submit events for review. Admins can Approve or Reject with a reason. Editing an approved event resets it to Pending.
- 📊 **Promoter Dashboard** — Analytics showing total revenue, tickets sold per event, and a QR code scanner for attendee check-in at the gate.
- 🖨️ **Print All Tickets** — Users can print all tickets from a single transaction in one click, with each ticket auto-formatted on a separate page.
- 🔐 **JWT Authentication** — Secure stateless authentication with HTTP-only cookie sessions.
- 🎨 **Premium Dark UI** — Glassmorphic dark-mode design with smooth CSS animations, gradient accents, and a responsive card-based layout.

**Tech Stack:**
Next.js 16 (App Router), Prisma ORM v7, SQLite (better-sqlite3), JWT, Lucide React, QRCode library, TypeScript.

**Deployment:**
Deployed on Vercel with a pre-seeded SQLite database bundled at build time. The database is copied to /tmp at runtime to enable write operations in Vercel's serverless environment — making it a fully interactive mockup without requiring an external cloud database.
```

### **PROJECT IMAGE** (Nama File & Panduan Unggah)
- **Nama File Gambar:** `/uploads/tickethub.png`
- *Panduan: Screenshot halaman utama atau halaman tiket, lalu unggah sebagai tickethub.png.*

### **LIVE URL** (Link Deployment)
```text
https://tickethub.erikosyah.my.id
```

### **GITHUB URL** (Link Repository GitHub)
```text
https://github.com/ErikoSyahPutra/web-ticketing
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
Next.js, Prisma ORM, SQLite, TypeScript, JWT, QRCode, Lucide React, Vercel
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)** *(Centang kotak pilihan)*

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
4
```

---

## 5. PayFlex Mobile Banking (UI/UX Case Study)

### **TITLE** (Input Teks Biasa)
```text
PayFlex Mobile Banking App
```

### **DESCRIPTION** (Input Textarea)
```text
End-to-end UI/UX design & interactive prototype for a modern mobile banking app. Focused on simplifying P2P transfers, expense analytics, dark mode aesthetics, and micro-interactions.
```

### **CATEGORY** (Kategori Proyek: web, ui_ux, mobile, other)
```text
ui_ux
```

### **FIGMA URL** (Link Figma Prototype)
```text
https://www.figma.com/proto/sample-banking-app
```

### **BEHANCE URL** (Link Case Study / Behance)
```text
https://www.behance.net/gallery/payflex-banking-case-study
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
Figma, Design System, User Research, Wireframing, High-Fidelity Prototype, Micro-Animations
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)**

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
5
```

---

## 6. FitPulse Fitness & Diet Tracker (Mobile App)

### **TITLE** (Input Teks Biasa)
```text
FitPulse Health & Workout Tracker
```

### **DESCRIPTION** (Input Textarea)
```text
Cross-platform mobile application for tracking workouts, daily caloric intake, and body metrics. Features real-time step counter, custom workout plans, and health progress graphs.
```

### **CATEGORY** (Kategori Proyek: web, ui_ux, mobile, other)
```text
mobile
```

### **LIVE URL** (Link App Store / Play Store)
```text
https://play.google.com/store/apps/details?id=com.fitpulse.app
```

### **GITHUB URL** (Link Repository GitHub)
```text
https://github.com/ErikoSyahPutra/fitpulse-mobile
```

### **TECHNOLOGIES** (Daftar Teknologi, Pisahkan dengan Koma)
```text
React Native, Expo, TypeScript, Redux Toolkit, SQLite, Firebase
```

### **Featured** (Checkbox)
- **Status:** **Checked (True)**

### **SORT ORDER** (Urutan Tampilan - Numerik)
```text
6
```

