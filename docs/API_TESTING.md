# 🧪 Testing Backend API (Tanpa Frontend)

Panduan untuk test backend API secara langsung menggunakan curl, Postman, atau browser.

## 📋 Available Endpoints

### Health Check
```bash
GET /api/health
```

### Survey Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/survey/start` | Mulai survey baru |
| POST | `/api/survey/:responseId/answers` | Simpan jawaban |
| POST | `/api/survey/:responseId/complete` | Selesaikan survey |
| GET | `/api/survey/:responseId` | Ambil data response |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/responses` | List semua responses |
| GET | `/api/admin/responses/:id` | Detail response |
| DELETE | `/api/admin/responses/:id` | Hapus response |
| GET | `/api/admin/statistics` | Statistik survey |
| GET | `/api/admin/export` | Export JSON |
| GET | `/api/admin/export/csv` | Export CSV |

### Provinces Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/provinces` | List provinsi |
| GET | `/api/provinces/:id/regencies` | List kabupaten/kota |

---

## 🔧 Testing dengan cURL

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2026-02-03T05:40:00.000Z"
}
```

### 2. Start Survey

```bash
curl -X POST http://localhost:3001/api/survey/start \
  -H "Content-Type: application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-02-03T05:40:00.000Z"
  }
}
```

**SIMPAN ID INI** untuk request berikutnya!

### 3. Save Answers

```bash
curl -X POST http://localhost:3001/api/survey/YOUR_RESPONSE_ID/answers \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "question_id": "q1",
        "answer": "Ya"
      },
      {
        "question_id": "q2",
        "answer": "Jakarta"
      }
    ]
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Jawaban berhasil disimpan"
}
```

### 4. Complete Survey

```bash
curl -X POST http://localhost:3001/api/survey/YOUR_RESPONSE_ID/complete \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp_number": "081234567890"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Survey berhasil diselesaikan. Terima kasih atas partisipasi Anda!"
}
```

### 5. Get Provinces

```bash
curl http://localhost:3001/api/provinces
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "11",
      "name": "ACEH"
    },
    {
      "id": "12",
      "name": "SUMATERA UTARA"
    }
    // ... more provinces
  ]
}
```

### 6. Get Admin Statistics (Requires Auth)

```bash
curl http://localhost:3001/api/admin/statistics \
  -H "X-Admin-Key: YOUR_PASSWORD_ADMIN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "total_responses": 10,
    "completed_responses": 8,
    "incomplete_responses": 2
  }
}
```

---

## 🌐 Testing dengan Browser

### Endpoints yang Bisa Diakses via Browser (GET)

1. **Health Check**:
   ```
   http://localhost:3001/api/health
   ```

2. **Provinces**:
   ```
   http://localhost:3001/api/provinces
   ```

3. **Regencies** (ganti `11` dengan province ID):
   ```
   http://localhost:3001/api/provinces/11/regencies
   ```

4. **Admin Statistics** (perlu auth header, lebih mudah pakai curl):
   ```
   http://localhost:3001/api/admin/statistics
   ```

### Endpoints yang TIDAK Bisa via Browser (POST/DELETE)

Browser hanya support GET request secara default. Untuk POST/DELETE, gunakan:
- cURL (command line)
- Postman
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)

---

## 🧪 Testing dengan Postman

### Setup

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new Collection: "Survey API"
3. Set Base URL: `http://localhost:3001`

### Request Examples

#### 1. Start Survey

- **Method**: POST
- **URL**: `{{baseUrl}}/api/survey/start`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: (empty)

#### 2. Save Answers

- **Method**: POST
- **URL**: `{{baseUrl}}/api/survey/{{responseId}}/answers`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "answers": [
      {
        "question_id": "q1",
        "answer": "Ya"
      }
    ]
  }
  ```

#### 3. Admin Statistics

- **Method**: GET
- **URL**: `{{baseUrl}}/api/admin/statistics`
- **Headers**: 
  - `X-Admin-Key: YOUR_PASSWORD_ADMIN`

---

## 🚀 Testing Railway Backend

Ganti `http://localhost:3001` dengan URL Railway Anda:

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Start survey
curl -X POST https://your-backend.railway.app/api/survey/start \
  -H "Content-Type: application/json"

# Get provinces
curl https://your-backend.railway.app/api/provinces
```

---

## 📝 Complete Test Flow

Berikut flow lengkap untuk test survey dari awal sampai selesai:

```bash
# 1. Health check
curl http://localhost:3001/api/health

# 2. Start survey (simpan response ID)
RESPONSE_ID=$(curl -X POST http://localhost:3001/api/survey/start \
  -H "Content-Type: application/json" \
  | jq -r '.data.id')

echo "Response ID: $RESPONSE_ID"

# 3. Save answers
curl -X POST http://localhost:3001/api/survey/$RESPONSE_ID/answers \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_id": "q1", "answer": "Ya"},
      {"question_id": "q2", "answer": "Jakarta"}
    ]
  }'

# 4. Complete survey
curl -X POST http://localhost:3001/api/survey/$RESPONSE_ID/complete \
  -H "Content-Type: application/json" \
  -d '{"whatsapp_number": "081234567890"}'

# 5. Check admin statistics
curl http://localhost:3001/api/admin/statistics \
  -H "X-Admin-Key: YOUR_PASSWORD_ADMIN"
```

---

## 🔍 Troubleshooting

### Error: "Endpoint tidak ditemukan"

**Penyebab**: URL endpoint salah

**Solusi**: Pastikan pakai endpoint yang benar:
- ✅ `http://localhost:3001/api/health`
- ✅ `http://localhost:3001/api/survey/start`
- ❌ `http://localhost:3001/api/survey` (tidak ada)
- ❌ `http://localhost:3001/survey` (tidak ada)

### Error: CORS

**Penyebab**: Request dari browser dengan origin yang tidak diizinkan

**Solusi**: 
- Gunakan cURL (tidak ada CORS di command line)
- Atau update `CORS_ORIGIN` di backend `.env`

### Error: "Not allowed by CORS"

**Penyebab**: Origin tidak ada di `CORS_ORIGIN`

**Solusi**: Tambahkan origin ke `CORS_ORIGIN` atau gunakan cURL

---

## 💡 Tips

1. **Gunakan jq** untuk format JSON response:
   ```bash
   curl http://localhost:3001/api/health | jq
   ```

2. **Save response ID** untuk test berikutnya:
   ```bash
   RESPONSE_ID="your-id-here"
   ```

3. **Test Railway backend** sebelum deploy frontend untuk pastikan backend working

4. **Check logs** di terminal backend untuk lihat request masuk

---

**Happy Testing!** 🧪
