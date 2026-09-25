# Migrasi Portfolio ke VPS Pribadi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyiapkan konfigurasi kode, proses PM2, reverse proxy Nginx, dan panduan migrasi lengkap untuk memindahkan Frontend Next.js, Backend NestJS, dan SQLite ke VPS Ubuntu pribadi (`erikosyah.my.id`).

**Architecture:** Frontend berjalan di port 3000, Backend NestJS di port 3001, Database SQLite lokal persisten di disk VPS, dikelola PM2 dengan auto-restart, dan diexpose ke internet menggunakan Nginx reverse proxy dengan SSL Let's Encrypt.

**Tech Stack:** Next.js 15, NestJS 11, SQLite (TypeORM), PM2, Nginx, Certbot (SSL), Ubuntu Linux.

## Global Constraints

- Backend harus mendengarkan di port 3001 (`PORT=3001`).
- Frontend harus mendengarkan di port 3000 (`-p 3000`).
- CORS backend harus mendukung `https://erikosyah.my.id`, `https://www.erikosyah.my.id`, dan `http://localhost:3000`.
- Frontend API client harus mengarah ke `https://api.erikosyah.my.id/api` saat production.
- Database SQLite lokal berada di `backend/database.sqlite`.

---

### Task 1: Backend CORS & Production Config

**Files:**
- Modify: `backend/src/main.ts`

**Interfaces:**
- Consumes: Environment variable `FRONTEND_URL` (optional)
- Produces: CORS handling for `erikosyah.my.id`, `www.erikosyah.my.id`, `http://localhost:3000`, and custom env.

- [ ] **Step 1: Update CORS configuration in `backend/src/main.ts`**

Perbarui fungsi `bootstrap()` di `backend/src/main.ts` agar mendukung domain produksi:

```typescript
// For local running / Render / persistent servers
if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://erikosyah.my.id',
      'https://www.erikosyah.my.id',
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[];

    app.enableCors({
      origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti curl, mobile app, postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Fallback fleksibel untuk custom subdomains
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on port ${port}`);
  }
  bootstrap();
}
```

- [ ] **Step 2: Build backend to verify TypeScript compilation**

Jalankan perintah build backend:
```bash
npm --prefix backend run build
```
Expected: Kompilasi selesai tanpa error dan menghasilkan direktori `backend/dist`.

- [ ] **Step 3: Commit Task 1**

```bash
git add backend/src/main.ts
git commit -m "feat(backend): configure CORS for production VPS domain"
```

---

### Task 2: Frontend Production Environment Config

**Files:**
- Create: `frontend/.env.production`

**Interfaces:**
- Consumes: Production API domain `https://api.erikosyah.my.id/api`
- Produces: Next.js public environment variable `NEXT_PUBLIC_API_URL`

- [ ] **Step 1: Create `frontend/.env.production`**

Isi file dengan:
```env
NEXT_PUBLIC_API_URL=https://api.erikosyah.my.id/api
```

- [ ] **Step 2: Build frontend to verify build pipeline**

Jalankan:
```bash
npm --prefix frontend run build
```
Expected: Build Next.js sukses tanpa error type / compilation.

- [ ] **Step 3: Commit Task 2**

```bash
git add frontend/.env.production
git commit -m "feat(frontend): set production API URL for VPS deployment"
```

---

### Task 3: PM2 Ecosystem Configuration

**Files:**
- Create: `ecosystem.config.js`

**Interfaces:**
- Consumes: Built backend `backend/dist/main.js` and frontend Next.js production server
- Produces: Multi-process definition for PM2 daemon (`portfolio-backend` and `portfolio-frontend`)

- [ ] **Step 1: Create `ecosystem.config.js` at project root**

```javascript
module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'portfolio-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

- [ ] **Step 2: Verify PM2 file syntax**

Jalankan perintah verifikasi node:
```bash
node -e "require('./ecosystem.config.js'); console.log('ecosystem.config.js valid!');"
```
Expected: Output `ecosystem.config.js valid!`.

- [ ] **Step 3: Commit Task 3**

```bash
git add ecosystem.config.js
git commit -m "feat: add PM2 ecosystem configuration for backend and frontend"
```

---

### Task 4: Nginx Server Block Configuration Template

**Files:**
- Create: `deploy/nginx-portfolio.conf`

**Interfaces:**
- Consumes: Incoming HTTP/HTTPS requests on `erikosyah.my.id` and `api.erikosyah.my.id`
- Produces: Reverse proxy to `127.0.0.1:3000` (Frontend) and `127.0.0.1:3001` (Backend) with file upload capacity and WebSocket support

- [ ] **Step 1: Create `deploy/nginx-portfolio.conf`**

```nginx
# ==============================================================================
# 1. FRONTEND: erikosyah.my.id
# ==============================================================================
server {
    listen 80;
    server_name erikosyah.my.id www.erikosyah.my.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# ==============================================================================
# 2. BACKEND API: api.erikosyah.my.id
# ==============================================================================
server {
    listen 80;
    server_name api.erikosyah.my.id;

    # Izinkan upload foto/file portofolio hingga 50MB
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- [ ] **Step 2: Commit Task 4**

```bash
git add deploy/nginx-portfolio.conf
git commit -m "feat(deploy): add Nginx reverse proxy configuration template"
```

---

### Task 5: Step-by-Step VPS Deployment Runbook

**Files:**
- Create: `deploy/VPS_DEPLOYMENT_GUIDE.md`

**Interfaces:**
- Consumes: Terminal commands on Ubuntu VPS via Termius
- Produces: Complete end-to-end instructions from git clone to live HTTPS website and TablePlus SSH connection

- [ ] **Step 1: Write `deploy/VPS_DEPLOYMENT_GUIDE.md`**

Buat panduan lengkap mencakup:
1. Setting DNS A-Record di registrar domain (`@` dan `api`).
2. Persiapan folder `/var/www/portfolio` dan git clone.
3. Upload `database.sqlite` dan `.env` via Termius SFTP.
4. Instalasi dependencies & build production.
5. Menjalankan proses via PM2 (`pm2 start ecosystem.config.js`, `pm2 save`, `pm2 startup`).
6. Pasang Nginx config ke `/etc/nginx/sites-available/` & symlink ke `sites-enabled/`.
7. Pasang SSL otomatis via Certbot (`sudo certbot --nginx -d erikosyah.my.id -d www.erikosyah.my.id -d api.erikosyah.my.id`).
8. Panduan koneksi TablePlus melalui SSH Tunnel.

- [ ] **Step 2: Commit Task 5**

```bash
git add deploy/VPS_DEPLOYMENT_GUIDE.md
git commit -m "docs(deploy): add complete VPS deployment and TablePlus guide"
```
