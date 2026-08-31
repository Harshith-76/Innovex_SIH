# Land Acquisition Management System (LAMS)
### SIH 2026 · Problem Statement 26016

A centralized digital platform for government authorities to manage, monitor, and accelerate the complete land acquisition lifecycle for major infrastructure and development projects (highways, railways, airports, irrigation canals, and industrial corridors).

---

## 📁 Repository Structure

```text
land-acquisition-platform/
├── backend/                 # Express & MongoDB Backend API (Node.js + TypeScript + MongoDB Atlas)
│   ├── src/
│   │   ├── config/          # Database connection manager (database.ts)
│   │   ├── controllers/     # API request controllers (parcelController.ts)
│   │   ├── routes/          # Express route definitions (parcelRoutes.ts)
│   │   ├── services/        # Cadastral GeoJSON formatting service (parcelService.ts)
│   │   ├── app.ts           # Express application & CORS setup
│   │   └── server.ts        # Server entry point & graceful shutdown
│   ├── .env.example         # Environment template with placeholders
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Frontend Web Application (React + TypeScript + Vite + Leaflet)
│   ├── src/
│   │   ├── components/      # UI components (Layout, Common, GIS Inspector & Map)
│   │   ├── context/         # Central application state (AppContext.tsx)
│   │   ├── data/            # Mock datasets & realistic cadastral state (mockData.ts)
│   │   ├── pages/           # 11 Core Functional Administrative Pages
│   │   ├── services/        # API Client Layer (api.ts)
│   │   ├── styles/          # Institutional Indian Gov Design System (index.css)
│   │   ├── types/           # Strongly-typed domain interfaces (index.ts)
│   │   └── utils/           # GeoJSON to Leaflet adapter (geoAdapter.ts)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md                # Project documentation & quick start guide
└── .gitignore               # Root git ignore rules
```

---

## 🏛️ Key Capabilities

- **National / State Acquisition Dashboard**: Real-time KPI indicators, statutory milestone stepper, GIS preview, and operational alerts.
- **GIS Cadastral Mapping**: High-precision parcel boundary polygons with RFCTLARR status coloring (Acquired, Under Acquisition, Notification, Compensation Pending, Possession Pending, R&R Pending), Right-of-Way alignment overlays, and survey detail inspector.
- **Projects Directory & 360 Workspace**: Comprehensive project management with multi-attribute filtering (State, District, Department, Stage, Risk) and sub-tabs for timelines, village progress, compensation ledgers, and gazette archives.
- **Acquisition Workflow Engine**: 9-stage statutory pipeline (Proposal → Verification → Approval → Notification → Award → Compensation → Possession → R&R → Completed) tracking responsible authorities and compliance orders.
- **Compensation & DBT Ledger**: Direct Benefit Transfer management with e-Kuber integration tracking, Khata entries, and beneficiary payment reconciliations.
- **Affected Families & R&R Portal**: Socio-economic entitlement tracking, housing layout allotments, subsistence allowances, and ITI livelihood training monitoring.
- **Document & Records Repository**: Cryptographically verified (SHA-256) archive for Section 3A/3D Gazettes, SIA reports, Joint Measurement Surveys, and DC Award Orders.
- **Predictive Risk & Delay Analytics**: Transparent, rule-based 0–100 risk scoring based on empirical bottleneck factors with historical trend analysis.
- **Multi-Tier RBAC Administration**: Role-based access control for Central Ministries, State Secretariats, District Collectorates, CALA Authorities, and PIAs (NHAI/Railways).

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Mapping & GIS**: Leaflet, GeoJSON Cadastral Polygons
- **Backend API**: Node.js, Express, MongoDB Node Driver, TypeScript
- **Database**: MongoDB Atlas (`lams_db.parcels` real K-GIS dataset)
- **Design System**: Vanilla CSS institutional government design tokens
- **Icons**: Lucide React

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/samhoon000/land-acquisition-platform.git
cd land-acquisition-platform
```

### 2. Configure Backend Environment & Start Backend (Terminal 1)
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
---

## 🌿 Git Branch & Push Workflow

### ⚠️ Important

**Do not push directly to `main`.**

Each team member should create their own feature branch, make changes there, and then create a Pull Request to merge into `main`.

### 1. Make sure you are on `main`

```bash
git checkout main
```

### 2. Get the latest changes

Before starting any new work, always pull the latest version of `main`.

```bash
git pull origin main
```

### 3. Create a new branch

Create a branch for the feature or task you are working on.

```bash
git checkout -b feature/your-task-name
```

For example:

```bash
git checkout -b feature/project-management
```

Other examples:

```bash
git checkout -b feature/login
git checkout -b feature/team-tasks
git checkout -b feature/land-map
git checkout -b feature/acquisition
git checkout -b feature/documents
git checkout -b feature/mobile-ui
```

### 4. Work on your feature

Make your changes and test them locally.

Check what files were changed:

```bash
git status
```

### 5. Add your changes

```bash
git add .
```

### 6. Commit your changes

Use a clear commit message describing what you changed.

```bash
git commit -m "Add project management page"
```

Examples:

```bash
git commit -m "Add login page"
git commit -m "Add parcel map filters"
git commit -m "Add acquisition workflow"
git commit -m "Add document upload"
```

### 7. Push your branch to GitHub

```bash
git push -u origin feature/your-task-name
```

For example:

```bash
git push -u origin feature/project-management
```

### 8. Create a Pull Request

After pushing:

1. Open the GitHub repository.
2. Go to **Pull Requests**.
3. Click **New Pull Request**.
4. Select your branch as the **compare** branch.
5. Select `main` as the **base** branch.
6. Add a short description of your changes.
7. Create the Pull Request.
8. Get it reviewed before merging.

Your Pull Request should look like:

```text
feature/project-management  →  main
```

### 9. After the Pull Request is merged

Update your local `main`:

```bash
git checkout main
git pull origin main
```

For your next feature, create a new branch again:

```bash
git checkout -b feature/next-feature
```

---

### 🔄 Complete Workflow

Every time you start a new feature, follow:

```text
main
 ↓
git pull origin main
 ↓
Create feature branch
 ↓
Work on feature
 ↓
git add .
 ↓
git commit
 ↓
git push
 ↓
Create Pull Request
 ↓
Review
 ↓
Merge into main
 ↓
git checkout main
 ↓
git pull origin main
```

### 📌 Team Rules

* ❌ Do not push directly to `main`
* ❌ Do not work directly on another member's branch
* ✅ Create a separate branch for each feature/task
* ✅ Pull the latest `main` before starting
* ✅ Test your changes before creating a Pull Request
* ✅ Use descriptive commit messages
* ✅ Keep Pull Requests focused on one feature/task
* ✅ Review Pull Requests before merging
* ✅ Keep `main` stable
