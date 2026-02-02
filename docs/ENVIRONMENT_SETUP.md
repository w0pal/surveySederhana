# 🔧 Environment Setup Guide

Panduan setup environment variables untuk development dan production.

## 📝 Backend Environment Variables

### Development (Local)

File: `backend/.env`

```env
PORT=3001
PASSWORD_ADMIN=your-secure-password
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Production (Railway)

Set di Railway Dashboard → Variables:

| Variable | Value | Keterangan |
|----------|-------|------------|
| `PORT` | `3001` | Port backend |
| `PASSWORD_ADMIN` | `<your-password>` | Password admin panel |
| `NODE_ENV` | `production` | Environment mode |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | URL frontend Vercel |

### Multiple CORS Origins

Jika ingin support multiple origins (development + production), pisahkan dengan koma:

```env
CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
```

Backend akan otomatis parse dan allow semua origins yang di-list.

---

## 🎨 Frontend Environment Variables

### Development (Local)

File: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Production (Vercel)

Set di Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Keterangan |
|----------|-------|------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` | URL Railway backend |

---

## 🔄 Workflow: Development vs Production

### Skenario 1: Development Lokal (Frontend + Backend)

**Backend** (`backend/.env`):
```env
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Skenario 2: Frontend Lokal + Backend Production

**Backend Railway** (Variables):
```env
CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Skenario 3: Full Production (Vercel + Railway)

**Backend Railway** (Variables):
```env
CORS_ORIGIN=https://your-app.vercel.app
```

**Frontend Vercel** (Environment Variables):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error di Browser

**Error**:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource
```

**Penyebab**: Frontend origin tidak ada di `CORS_ORIGIN` backend

**Solusi**:
1. Cek URL frontend yang muncul di error
2. Tambahkan URL tersebut ke `CORS_ORIGIN` di backend
3. Restart backend

**Contoh Fix**:
```env
# Sebelum
CORS_ORIGIN=https://your-app.vercel.app

# Sesudah (tambahkan localhost)
CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
```

### Issue 2: Frontend Connect ke Backend yang Salah

**Gejala**: Frontend di Vercel masih connect ke `localhost:3001`

**Penyebab**: `NEXT_PUBLIC_API_URL` di Vercel belum di-set atau salah

**Solusi**:
1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Pastikan `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api`
3. Redeploy frontend (Deployments → ... → Redeploy)

### Issue 3: Backend Railway "Endpoint tidak ditemukan"

**Penyebab**: Backend crash atau tidak running

**Solusi**:
1. Cek Railway Logs (Deployments → Latest → Logs)
2. Pastikan tidak ada error saat startup
3. Test health endpoint: `https://your-backend.railway.app/api/health`
4. Jika masih error, cek:
   - Environment variables sudah benar?
   - Volume untuk database sudah di-mount?
   - Root directory = `backend`?

---

## 🧪 Testing

### Test Backend

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Get provinces
curl https://your-backend.railway.app/api/provinces
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-02-03T..."
}
```

### Test Frontend

1. Buka `https://your-app.vercel.app`
2. Klik "Mulai Survey"
3. Cek browser console (F12) - tidak boleh ada CORS error
4. Isi form dan submit
5. Buka `/admin` dan cek data masuk

---

## 📋 Checklist Setup

### Local Development

- [ ] Backend `.env` file exists
- [ ] `CORS_ORIGIN=http://localhost:3000` di backend
- [ ] Frontend `.env.local` file exists
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:3001/api` di frontend
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] Test: buka `http://localhost:3000` dan submit survey

### Production (Railway + Vercel)

- [ ] Railway backend deployed
- [ ] Railway environment variables set (PORT, NODE_ENV, PASSWORD_ADMIN, CORS_ORIGIN)
- [ ] Railway volume mounted (`/app/data`)
- [ ] Railway health check OK: `https://your-backend.railway.app/api/health`
- [ ] Vercel frontend deployed
- [ ] Vercel environment variable set: `NEXT_PUBLIC_API_URL`
- [ ] Test: buka Vercel URL dan submit survey
- [ ] Check admin panel: data masuk

---

## 🔐 Security Notes

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong passwords** for `PASSWORD_ADMIN`
3. **Don't use `CORS_ORIGIN=*`** in production - specify exact domains
4. **Use HTTPS** in production (Railway & Vercel provide this automatically)

---

## 📞 Need Help?

Jika masih ada masalah:
1. Cek Railway logs untuk backend errors
2. Cek Vercel logs untuk frontend errors
3. Cek browser console (F12) untuk client-side errors
4. Pastikan semua environment variables sudah benar
