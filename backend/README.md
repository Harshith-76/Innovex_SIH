# Land Acquisition Management System (LAMS) — Backend Service

Backend API service for SIH 2026 Problem Statement 26016 (Land Acquisition Management System), connecting MongoDB Atlas real K-GIS cadastral data (`lams_db.parcels`) to the LAMS platform.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database Driver**: Official MongoDB Node.js Driver (`mongodb: ^6.8.0`)
- **Dev Runner**: `tsx`

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB Atlas connection manager & health checks
│   ├── controllers/
│   │   └── parcelController.ts # HTTP request handlers for parcels & health
│   ├── routes/
│   │   └── parcelRoutes.ts    # Express route definitions (/api/...)
│   ├── services/
│   │   └── parcelService.ts   # Database queries & GeoJSON FeatureCollection formatting
│   ├── app.ts                 # Express application, CORS, error handling
│   │   └── server.ts          # Server bootstrap and graceful shutdown
├── .env.example               # Environment variables template
├── package.json               # Backend dependencies & npm scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Backend documentation
```

---

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your MongoDB Atlas connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/lams_db?appName=LAMS-Cluster
   PORT=5000
   DB_NAME=lams_db
   CORS_ORIGIN=http://localhost:3000
   ```

---

## 🚀 Running the Server

### Install Dependencies
```bash
cd backend
npm install
```

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 2. Query Parcels (GeoJSON FeatureCollection)
```http
GET /api/parcels
```
**Supported Query Parameters:**
- `district` (e.g. `Dakshina Kannada`)
- `taluk` (e.g. `Ullala`)
- `village` (e.g. `Konaje`)
- `survey_no` (e.g. `113`)
- `category` (e.g. `Parcel`)
- `limit` (default `100`, max `500`)

**Example Queries:**
- `GET /api/parcels?limit=5`
- `GET /api/parcels?village=Konaje`
- `GET /api/parcels?taluk=Ullala`
- `GET /api/parcels?village=Konaje&survey_no=113`
- `GET /api/parcels?category=Parcel&limit=50`

**Response Structure (RFC 7946 Standard GeoJSON):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "KA-DK-ULL-KON-113-C1589316",
      "properties": {
        "parcel_id": "KA-DK-ULL-KON-113-C1589316",
        "survey_no": "113",
        "cadastral_id": "...",
        "ulpin": "...",
        "district": "Dakshina Kannada",
        "district_code": "24",
        "taluk": "Ullala",
        "taluk_code": "09",
        "hobli": "Mangaluru B",
        "hobli_code": "02",
        "village": "Konaje",
        "village_code": "2409020010",
        "bhoomi_village_code": "2409020010",
        "state": "Karnataka",
        "area": 209.327,
        "area_unit": "acres",
        "category": "Parcel"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [74.9567, 12.8123],
            ...
          ]
        ]
      }
    }
  ]
}
```

### 3. Get Single Parcel by ID
```http
GET /api/parcels/:id
```
**Example:**
- `GET /api/parcels/KA-DK-ULL-KON-113-C1589316`

**Returns:**
- Single GeoJSON `Feature` with full metadata and geometry.
- `404 Not Found` with `{ "error": "Parcel not found with ID: ..." }` if the parcel does not exist.
