# 🚀 Panduan Deployment - Survey Prakiraan Pergerakan Masyarakat

Panduan lengkap untuk deploy aplikasi survey ini ke:
- **Frontend**: Vercel (gratis)
- **Backend**: Railway (gratis dengan limit)

---

## 📋 Persiapan Sebelum Deploy

### 1. Pastikan Project Sudah di Git Repository

```bash
# Jika belum init git
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub/GitLab
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Pastikan File `.gitignore` Sudah Benar

Pastikan file-file berikut **TIDAK** ter-commit:
- `backend/.env`
- `frontend/.env.local`
- `backend/node_modules/`
- `frontend/node_modules/`
- `backend/data/survey.db` (opsional, tergantung apakah mau deploy dengan data atau tidak)

---

## 🔧 BAGIAN 1: Deploy Backend ke Railway

Railway adalah platform PaaS yang mudah digunakan dan memiliki free tier yang cukup generous.

### Step 1: Persiapan Backend

#### 1.1. Tambahkan File `railway.json` (Opsional tapi Recommended)

Buat file baru di folder `backend/`:

**File**: `backend/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.2. Pastikan `package.json` Sudah Benar

Pastikan di `backend/package.json` ada script `start`:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

✅ Sudah ada di project Anda!

#### 1.3. Tambahkan Health Check Endpoint (Recommended)

Railway akan mengecek apakah aplikasi sudah running. Pastikan backend Anda punya endpoint health check.

Cek apakah di `backend/src/index.js` sudah ada endpoint seperti:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

Jika belum, tambahkan endpoint tersebut.

### Step 2: Deploy ke Railway

#### 2.1. Buat Akun Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Start a New Project"** atau **"Login with GitHub"**
3. Login menggunakan akun GitHub Anda
4. Authorize Railway untuk akses repository

#### 2.2. Deploy Backend

1. **Di Dashboard Railway**, klik **"New Project"**

2. Pilih **"Deploy from GitHub repo"**

3. Pilih repository **surveySederhana**

4. Railway akan mendeteksi ada 2 folder (frontend & backend). Klik **"Add Service"** → **"GitHub Repo"**

5. **PENTING**: Karena backend ada di subfolder, Anda perlu setting **Root Directory**:
   - Setelah service dibuat, klik service tersebut
   - Pergi ke **Settings** tab
   - Scroll ke **"Root Directory"**
   - Isi dengan: `backend`
   - Klik **"Save"**

6. Railway akan otomatis build dan deploy backend Anda

#### 2.3. Setup Environment Variables di Railway

1. Di Railway dashboard, klik service backend Anda
2. Pergi ke tab **"Variables"**
3. Tambahkan environment variables berikut:

| Variable Name | Value | Keterangan |
|--------------|-------|------------|
| `PORT` | `3001` | Port backend (Railway juga provide `$PORT` otomatis) |
| `NODE_ENV` | `production` | Environment mode |
| `PASSWORD_ADMIN` | `<password-admin-anda>` | Password untuk admin panel |
| `CORS_ORIGIN` | `*` | Sementara pakai `*`, nanti ganti dengan URL Vercel |

> **Note**: Railway juga menyediakan variable `$PORT` secara otomatis. Backend Anda harus bisa membaca dari `process.env.PORT`.

4. Klik **"Deploy"** untuk restart dengan environment variables baru

#### 2.4. Dapatkan URL Backend

1. Setelah deploy sukses, Railway akan memberikan URL publik
2. Pergi ke tab **"Settings"**
3. Scroll ke **"Networking"** atau **"Domains"**
4. Anda akan melihat URL seperti: `https://your-app-name.up.railway.app`
5. **SIMPAN URL INI** - Anda akan membutuhkannya untuk frontend!

#### 2.5. Test Backend

Buka browser dan test endpoint:

```
https://your-app-name.up.railway.app/health
https://your-app-name.up.railway.app/api/provinces
```

Jika berhasil, Anda akan melihat response JSON! 🎉

### Step 3: Setup Database di Railway

SQLite di Railway memerlukan **Persistent Volume** agar data tidak hilang saat restart.

#### 3.1. Tambahkan Volume

1. Di Railway dashboard, klik service backend
2. Pergi ke tab **"Settings"**
3. Scroll ke **"Volumes"**
4. Klik **"New Volume"**
5. Isi:
   - **Mount Path**: `/app/data`
   - **Name**: `survey-data`
6. Klik **"Add"**

> **Penjelasan**: Ini akan membuat folder `/app/data` yang persistent. File database SQLite (`survey.db`) akan disimpan di sini dan tidak akan hilang saat restart.

#### 3.2. Pastikan Backend Menulis ke Path yang Benar

Pastikan di `backend/src/database/connection.js` path database mengarah ke folder yang di-mount:

```javascript
const dbPath = path.join(__dirname, '../../data/survey.db');
```

Ini akan menulis ke `/app/data/survey.db` di Railway.

### Step 4: Troubleshooting Backend Railway

#### Masalah: Build Gagal

**Solusi**:
- Cek **Logs** di Railway untuk error message
- Pastikan `package.json` ada di folder `backend/`
- Pastikan Root Directory sudah di-set ke `backend`

#### Masalah: App Crash Setelah Deploy

**Solusi**:
- Cek **Logs** di tab "Deployments"
- Pastikan semua dependencies ada di `dependencies` (bukan `devDependencies`)
- Pastikan `npm start` command benar

#### Masalah: Database Error

**Solusi**:
- Pastikan Volume sudah di-mount
- Cek path database di code
- Jalankan init database jika perlu (bisa tambahkan ke start script)

#### Masalah: CORS Error

**Solusi**:
- Pastikan `CORS_ORIGIN` sudah di-set
- Setelah deploy frontend, update `CORS_ORIGIN` dengan URL Vercel

---

## 🎨 BAGIAN 2: Deploy Frontend ke Vercel

Vercel adalah platform terbaik untuk Next.js (dibuat oleh tim yang sama).

### Step 1: Persiapan Frontend

#### 1.1. Update Environment Variable

Edit `frontend/.env.local.example`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.up.railway.app/api
```

Ganti dengan URL Railway backend Anda!

#### 1.2. Pastikan Build Berhasil Lokal

Test build di local dulu:

```bash
cd frontend
npm run build
```

Jika ada error, fix dulu sebelum deploy.

### Step 2: Deploy ke Vercel

#### 2.1. Buat Akun Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Sign Up"**
3. Login dengan **GitHub**
4. Authorize Vercel

#### 2.2. Deploy Frontend

1. Di Vercel Dashboard, klik **"Add New..."** → **"Project"**

2. **Import Git Repository**:
   - Pilih repository **surveySederhana**
   - Klik **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Klik **"Edit"** → Pilih `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Environment Variables**:
   - Klik **"Add Environment Variable"**
   - Tambahkan:
     ```
     Key: NEXT_PUBLIC_API_URL
     Value: https://your-backend-railway-url.up.railway.app/api
     ```
   - Ganti dengan URL Railway backend Anda!

5. Klik **"Deploy"**

6. Tunggu beberapa menit... ☕

7. Setelah selesai, Vercel akan memberikan URL seperti:
   ```
   https://your-app-name.vercel.app
   ```

### Step 3: Update CORS di Backend

Sekarang frontend sudah punya URL, update CORS di Railway:

1. Buka Railway dashboard
2. Klik service backend
3. Pergi ke tab **"Variables"**
4. Edit variable `CORS_ORIGIN`:
   ```
   https://your-app-name.vercel.app
   ```
5. Atau jika mau multiple origins (termasuk custom domain):
   ```
   https://your-app-name.vercel.app,https://yourdomain.com
   ```

6. Klik **"Deploy"** untuk restart backend

### Step 4: Test Aplikasi

Buka URL Vercel Anda dan test:

1. ✅ Homepage loading
2. ✅ Mulai survey
3. ✅ Isi form dan submit
4. ✅ Buka `/admin` dan login
5. ✅ Lihat responses
6. ✅ Export CSV

Jika semua berhasil, **SELAMAT!** 🎉🎉🎉

### Step 5: Custom Domain (Opsional)

#### Di Vercel:

1. Pergi ke Project Settings → **Domains**
2. Tambahkan domain Anda (misal: `survey.yourdomain.com`)
3. Ikuti instruksi untuk update DNS records
4. Tunggu propagasi DNS (5-30 menit)

#### Update CORS di Railway:

Jangan lupa tambahkan custom domain ke `CORS_ORIGIN`:

```
https://your-app-name.vercel.app,https://survey.yourdomain.com
```

---

## 🔄 Update Aplikasi Setelah Deploy

### Update Backend

1. Push changes ke GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```

2. Railway akan **otomatis** detect changes dan re-deploy! 🚀

### Update Frontend

1. Push changes ke GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```

2. Vercel akan **otomatis** detect changes dan re-deploy! 🚀

---

## 📊 Monitoring & Maintenance

### Railway Monitoring

- **Logs**: Lihat real-time logs di tab "Deployments"
- **Metrics**: Lihat CPU, Memory usage di tab "Metrics"
- **Free Tier Limit**: 500 jam/bulan (cukup untuk 1 service 24/7)

### Vercel Monitoring

- **Analytics**: Lihat traffic di tab "Analytics"
- **Logs**: Lihat function logs di tab "Logs"
- **Free Tier**: Unlimited bandwidth untuk personal projects

### Backup Database

Railway tidak auto-backup. Anda perlu setup manual backup:

#### Opsi 1: Download Manual

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. Connect ke project:
   ```bash
   railway link
   ```

3. Download database:
   ```bash
   railway run cat /app/data/survey.db > backup.db
   ```

#### Opsi 2: Tambahkan Backup Endpoint

Buat endpoint di backend untuk download database (hanya untuk admin):

```javascript
// backend/src/routes/admin.js
router.get('/backup', authenticateAdmin, (req, res) => {
  const dbPath = path.join(__dirname, '../../data/survey.db');
  res.download(dbPath, `survey-backup-${Date.now()}.db`);
});
```

Akses: `https://your-backend.railway.app/api/admin/backup`

---

## ⚠️ Troubleshooting Umum

### Frontend tidak bisa connect ke Backend

**Cek**:
1. ✅ `NEXT_PUBLIC_API_URL` sudah benar di Vercel
2. ✅ Backend Railway sudah running (cek `/health`)
3. ✅ CORS sudah di-set dengan benar di Railway
4. ✅ Tidak ada typo di URL

**Test**: Buka browser console (F12) dan lihat error message

### Database Kosong Setelah Restart

**Penyebab**: Volume tidak di-mount

**Solusi**: Pastikan Volume sudah ditambahkan di Railway Settings

### Railway App Crash

**Cek Logs**:
1. Buka Railway dashboard
2. Klik service backend
3. Pergi ke tab "Deployments"
4. Klik deployment terakhir
5. Lihat logs untuk error message

**Common Issues**:
- Missing environment variables
- Database path error
- Port binding error (pastikan pakai `process.env.PORT`)

### Vercel Build Failed

**Cek**:
1. Build berhasil di local? (`npm run build`)
2. Semua dependencies ada di `package.json`?
3. TypeScript errors? (fix dulu)
4. Environment variables sudah di-set?

---

## 💰 Biaya & Limits

### Railway Free Tier

- ✅ 500 jam/bulan (cukup untuk 1 service 24/7)
- ✅ 512 MB RAM
- ✅ 1 GB disk
- ✅ Shared CPU

**Cukup untuk**: Survey dengan traffic moderate (ratusan responses/hari)

### Vercel Free Tier

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/bulan
- ✅ Serverless functions
- ✅ Automatic HTTPS

**Cukup untuk**: Hampir semua use case personal/small business

---

## 🎯 Checklist Deployment

### Pre-Deployment

- [ ] Code sudah di-push ke GitHub
- [ ] `.env` files tidak ter-commit
- [ ] Build berhasil di local (frontend & backend)
- [ ] Database schema sudah final

### Backend (Railway)

- [ ] Service dibuat di Railway
- [ ] Root directory di-set ke `backend`
- [ ] Environment variables sudah di-set
- [ ] Volume untuk database sudah ditambahkan
- [ ] Deploy sukses
- [ ] Test endpoint `/health` dan `/api/provinces`
- [ ] URL backend sudah dicatat

### Frontend (Vercel)

- [ ] Project dibuat di Vercel
- [ ] Root directory di-set ke `frontend`
- [ ] `NEXT_PUBLIC_API_URL` di-set dengan URL Railway
- [ ] Deploy sukses
- [ ] Website bisa diakses
- [ ] Form survey berfungsi
- [ ] Admin panel berfungsi

### Post-Deployment

- [ ] Update `CORS_ORIGIN` di Railway dengan URL Vercel
- [ ] Test end-to-end flow (submit survey, lihat di admin)
- [ ] Setup monitoring/alerts (opsional)
- [ ] Setup backup schedule (opsional)
- [ ] Update DNS jika pakai custom domain (opsional)

---

## 📞 Bantuan Lebih Lanjut

### Dokumentasi Resmi

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Community

- Railway Discord
- Vercel Discord
- Stack Overflow

---

**Selamat Deploy!** 🚀

Jika ada pertanyaan atau masalah, silakan buka issue di repository atau hubungi tim development.
