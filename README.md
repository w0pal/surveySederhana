# Survey Prakiraan Pergerakan Masyarakat - Lebaran 2026

Sistem survei online untuk mengumpulkan data prakiraan pergerakan masyarakat dalam rangka persiapan penyelenggaraan angkutan Lebaran 2026.

## 📋 Fitur

- ✅ Form survei multi-bagian dengan conditional logic
- ✅ Auto-save jawaban
- ✅ Admin dashboard untuk melihat dan mengelola respons
- ✅ Export data ke CSV
- ✅ Statistik real-time
- ✅ Responsive design (mobile-friendly)
- ✅ SQLite database (ringan, cocok untuk VPS sederhana)

## 🏗️ Teknologi

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: SQLite (dengan better-sqlite3)
- **State Management**: Zustand

## 📁 Struktur Folder

```
surveySederhana/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities, API, store
│   └── ...
└── backend/                  # Express.js backend
    ├── src/
    │   ├── database/        # SQLite connection & init
    │   ├── models/          # Data models
    │   └── routes/          # API routes
    └── data/                # SQLite database file
```

## 🚀 Cara Menjalankan (Development)

### 1. Clone dan Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Jalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:3001`

### 4. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Admin Panel

Akses admin panel di: `http://localhost:3000/admin`

Default admin key: `admin-secret-key-change-in-production`

⚠️ **PENTING**: Ganti admin key di production!

## 🌐 Deployment ke VPS

### Opsi 1: VPS Sederhana (Recommended)

#### Persyaratan VPS:

- Minimal 1GB RAM
- Ubuntu 20.04+
- Node.js 18+

#### Langkah-langkah:

1. **Install Node.js di VPS**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone project**

```bash
git clone <your-repo-url>
cd surveySederhana
```

3. **Setup Backend**

```bash
cd backend
npm install --production
cp .env.example .env
nano .env  # Edit sesuai kebutuhan
```

4. **Setup Frontend**

```bash
cd ../frontend
npm install
npm run build
```

5. **Jalankan dengan PM2**

```bash
npm install -g pm2

# Backend
cd backend
pm2 start src/index.js --name "survey-backend"

# Frontend
cd ../frontend
pm2 start npm --name "survey-frontend" -- start
```

6. **Setup Nginx sebagai Reverse Proxy**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opsi 2: Platform Gratis

#### Railway (Recommended untuk Gratis)

- Buat akun di [railway.app](https://railway.app)
- Deploy backend dan frontend sebagai services terpisah
- Database SQLite akan tersimpan di volume

#### Vercel + Railway

- Frontend: Deploy ke [Vercel](https://vercel.com) (gratis)
- Backend: Deploy ke [Railway](https://railway.app) (500 jam/bulan gratis)

#### Render

- Buat akun di [render.com](https://render.com)
- Deploy backend sebagai Web Service
- Deploy frontend sebagai Static Site

## 💾 Database

Project ini menggunakan **SQLite** karena:

- ✅ Tidak perlu setup database server terpisah
- ✅ File-based, mudah backup (copy file `data/survey.db`)
- ✅ Ringan untuk VPS dengan resource terbatas
- ✅ Perfect untuk survei dengan traffic moderate (hingga 1000+ respons/hari)

### Backup Database

```bash
# Copy file database
cp backend/data/survey.db backup/survey-$(date +%Y%m%d).db
```

### Migrasi ke PostgreSQL (Jika Diperlukan)

Jika membutuhkan database yang lebih robust, bisa migrasi ke PostgreSQL:

- **Supabase** - PostgreSQL gratis dengan 500MB
- **Neon** - PostgreSQL serverless gratis
- **PlanetScale** - MySQL dengan free tier

## 📊 API Endpoints

### Survey API

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/api/survey/start`        | Mulai survey baru            |
| POST   | `/api/survey/:id/answers`  | Simpan jawaban               |
| POST   | `/api/survey/:id/complete` | Selesaikan survey            |
| GET    | `/api/survey/:id`          | Ambil respons (untuk resume) |

### Admin API

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| GET    | `/api/admin/responses`     | Daftar semua respons |
| GET    | `/api/admin/responses/:id` | Detail respons       |
| DELETE | `/api/admin/responses/:id` | Hapus respons        |
| GET    | `/api/admin/statistics`    | Statistik survei     |
| GET    | `/api/admin/export`        | Export JSON          |
| GET    | `/api/admin/export/csv`    | Export CSV           |

### Provinces API

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/api/provinces`               | Daftar provinsi       |
| GET    | `/api/provinces/:id/regencies` | Daftar kabupaten/kota |

## 🔒 Keamanan

1. Ganti admin key di production
2. Gunakan HTTPS
3. Set CORS origin yang benar
4. Backup database secara berkala

## 📝 Lisensi

© 2026 Badan Kebijakan Transportasi - Kementerian Perhubungan

---

Dibuat untuk Survei Prakiraan Pergerakan Masyarakat Lebaran 2026
