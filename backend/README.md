# Portfolio Backend (Golang)

High-performance, minimal-footprint Go backend built with **Gin** + **GORM**.

## Fitur & Modul
- **Database**: SQLite (default zero-CGO) atau PostgreSQL (`DATABASE_URL`).
- **Autentikasi**: JWT + Scrypt (100% kompatibel dengan hash password NestJS).
- **Modul**:
  - `Profile` (`/api/profile`)
  - `Projects` (`/api/projects`, `/api/projects/featured`, `/api/projects/:id`)
  - `Academics` (`/api/academics`, `/api/academics/:id`)
  - `Experiences` (`/api/experiences`, `/api/experiences/:id`)
  - `Blogs` (`/api/blogs`, `/api/blogs/all`, `/api/blogs/slug/:slug`, `/api/blogs/:id`)
  - `Awards` (`/api/awards`, `/api/awards/:id`)
  - `Organizations` (`/api/organizations`, `/api/organizations/:id`)
  - `Contacts` (`/api/contacts`, `/api/contacts/:id/read`)
  - `Upload` (`/api/upload` - multipart form)
  - `Auth` (`/api/auth/login`, `/api/auth/me`)

## Cara Menjalankan

### 1. Menggunakan Go Local
Pastikan Go 1.22+ terinstall:
```bash
cd backend-go
go mod tidy
go run ./cmd/server
```

### 2. Menggunakan Docker
```bash
cd backend-go
docker build -t porto-backend-go .
docker run -p 3001:3001 porto-backend-go
```

### Akun Administrator Default
- Username: `admin`
- Password: `admin`
