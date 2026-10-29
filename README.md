# Rentals Kenya (Rentals.ke)

A modern, secure, and production-ready real estate discovery and lead-generation platform for **Rentals Kenya** (`Rentals.ke`), specializing in Airbnb-ready and rental investment properties across Kenya.

---

## 🚀 Quick Start (How to Run)

### Method 1: Double-Click (Windows)
Double-click `run.bat` in the project root directory. It will automatically start the local server on `http://localhost:3000`.

### Method 2: Command Line (PowerShell / Command Prompt)

1. Open PowerShell or Terminal and navigate to the project directory:
   ```powershell
   cd c:\xampp\htdocs\ict-ams-main\RentalsKe
   ```

2. Start the development server:
   ```powershell
   npm.cmd run dev
   ```
   *(Or `npm run dev` in standard terminal)*

3. Open your browser and visit:
   - **Public Website:** [http://localhost:3000](http://localhost:3000)
   - **Properties Discovery:** [http://localhost:3000/properties](http://localhost:3000/properties)
   - **Interactive ROI Calculator:** [http://localhost:3000/calculator](http://localhost:3000/calculator)
   - **Investment Locations:** [http://localhost:3000/locations](http://localhost:3000/locations)
   - **Admin CRM Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Admin Credentials

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email:** `admin@rentals.ke` (created by `prisma/seed.js`)
- **Password:** set `ADMIN_SEED_PASSWORD` in your local `.env` before seeding. Never commit real credentials, and change the admin password immediately on any shared or production database.

---

## 🛠️ Tech Stack & Key Features

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons.
- **Database & ORM:** Prisma ORM with SQLite (`prisma/dev.db`), ready for one-click migration to Supabase/PostgreSQL.
- **Brand Identity:** Deep Navy (`#0B192C`), Royal Navy (`#1B365D`), Sky Blue Accent (`#0284C7` / `#38BDF8`), architectural SVG logo.
- **Currency:** Default Kenyan Shillings (`KES X,XXX,XXX`).
- **Lead Generation:**
  - Direct WhatsApp conversion links with pre-filled property titles & locations.
  - Enquiry forms with Zod validation.
  - On-site viewing scheduler.
  - Interactive Airbnb investment & ROI simulator.
- **Admin CRM & CMS:**
  - KPI Overview dashboard (Total listings, available, sold, enquiries, viewings).
  - 5-step property wizard (Basic info, Location, Airbnb forecasts, Amenities checkboxes, Media upload, SEO).
  - Lead management pipeline with internal follow-up notes.
  - Dynamic site settings (Phone, WhatsApp number, office address, SEO defaults).
  - Security audit logs.

---

## 🔄 Database Commands (Optional)

If you ever need to reset or re-seed the demo properties:

```powershell
# Sync database schema
npx.cmd prisma db push

# Populate demo properties, amenities, and settings
node prisma/seed.js
```

---

## 📦 Production Deployment

To build and run the optimized production build:

```powershell
npm.cmd run build
npm.cmd start
```
