# Quick Start - Deployment Checklist

Gunakan checklist ini sebagai panduan cepat. Untuk detail lengkap, lihat [DEPLOYMENT.md](../DEPLOYMENT.md)

## ✅ Pre-Deployment

- [ ] Push semua code ke GitHub
- [ ] Pastikan `.env` tidak ter-commit
- [ ] Test build lokal berhasil

## 🚂 Railway (Backend)

1. [ ] Buat akun di [railway.app](https://railway.app)
2. [ ] New Project → Deploy from GitHub
3. [ ] Pilih repo `surveySederhana`
4. [ ] **PENTING**: Set Root Directory = `backend`
5. [ ] Tambahkan Environment Variables:
   - `PORT=3001`
   - `NODE_ENV=production`
   - `PASSWORD_ADMIN=<your-password>`
   - `CORS_ORIGIN=*` (update nanti)
6. [ ] Tambahkan Volume:
   - Mount Path: `/app/data`
   - Name: `survey-data`
7. [ ] Deploy dan catat URL Railway

## ▲ Vercel (Frontend)

1. [ ] Buat akun di [vercel.com](https://vercel.com)
2. [ ] New Project → Import dari GitHub
3. [ ] Pilih repo `surveySederhana`
4. [ ] **PENTING**: Set Root Directory = `frontend`
5. [ ] Tambahkan Environment Variable:
   - `NEXT_PUBLIC_API_URL=<railway-url>/api`
6. [ ] Deploy dan catat URL Vercel

## 🔄 Post-Deployment

1. [ ] Update `CORS_ORIGIN` di Railway dengan URL Vercel
2. [ ] Test website end-to-end
3. [ ] Test admin panel
4. [ ] Test submit survey

## 🎉 Done!

Website Anda sudah live di:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`

---

**Butuh bantuan?** Lihat [DEPLOYMENT.md](../DEPLOYMENT.md) untuk panduan lengkap.
