# CollegeCompass (UniVerdict) 🎓

> A premium, full-stack college discovery and comparison platform built for Indian students. Find the perfect college, compare placement packages, filter by NIRF ranking or fees, and curate your personal dream shortlist.

---

## ⚡ Tech Stack

| Layer                | Technology                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Framework**        | Next.js 14 (App Router, Server & Client Components)                                      |
| **Styling**          | Tailwind CSS + custom brand tokens                                                       |
| **State Management** | Zustand (persistent client-side comparison tray) + TanStack Query (cached server states) |
| **Database & ORM**   | Prisma ORM with Supabase (PostgreSQL)                                                    |
| **Authentication**   | NextAuth.js v5 (Google OAuth + Middleware-protected routes)                              |
| **Validation**       | Zod (strict API input/query validations)                                                 |
| **Testing**          | Vitest (unit tests) + Playwright (end-to-end tests)                                      |
| **Quality Control**  | ESLint + Prettier + Husky (pre-commit hooks) + lint-staged                               |

---

## ✨ Features

- **🔍 Intelligent Search & Filters:**
  - Full-text search with automatic acronym expansion (e.g., matching "IIT" with "Indian Institute of Technology").
  - Multi-select filters for course type (Engineering, Medical, Management, Law, Arts, etc.) and Location (State).
  - Continuous dual-handle annual fees slider, minimum ratings, and NIRF rankings selector.
  - Full synchronization of search inputs and selected filters with URL search params for easy sharing.
- **📊 Interactive Side-by-Side Comparison:**
  - Floating compare tray managed in Zustand and persisted to `localStorage`.
  - Up to 3 colleges compared side-by-side on fees, placement package data, campus sizes, established years, and ratings.
  - Dynamically highlights differences and flags the **"Best Value"** and **"Top Rated"** choices.
  - Generated shareable URL schemas (e.g. `/compare?ids=a,b,c`).
- **🔖 Saved Shortlists & Custom Collections:**
  - Optimistic UI updates with instant heartbeat state toggles and automatic rollback on backend request failure.
  - Personalized collections (e.g. "Dream colleges", "Backup plans") to segment and organize saved items.
- **🛡️ Secure Route Guarding:**
  - Edge middleware matching for `/saved` path checking authenticated sessions in NextAuth.js.

---

## 📁 Folder Structure

```text
collegecompass/
├── app/
│   ├── (auth)/             # Authentication views
│   ├── (main)/             # Core pages (Listing, Detail, Compare, Saved)
│   ├── api/                # Zod-validated Next.js REST API routes
│   └── globals.css         # Global design layouts
├── components/
│   ├── college/            # CollegeCard, Filters, Compare client components
│   ├── layout/             # Sticky Navbar, Footer, and search overlays
│   ├── saved/              # Heart saves, collection pickers
│   └── ui/                 # Shared UI primitives
├── hooks/                  # Custom TanStack query hooks
├── lib/                    # Auth configs, Prisma instances, utility functions
├── prisma/                 # Database schema and seed scripts
├── store/                  # Client-side Zustand stores (Compare, Search)
├── tests/                  # Unit and integration test specs
├── .husky/                 # Pre-commit formatting/linting git hooks
└── tailwind.config.ts      # Custom theme color palettes
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VinitMajethiya/College_platform.git
cd College_platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Add your database connection string, NextAuth secret, Google OAuth IDs, and keys.

### 4. Build and seed the Database

```bash
# Generate Prisma Client classes
npm run db:generate

# Push schema structure to Database
npm run db:push

# Populate database with 50+ realistic Indian universities
npm run db:seed
```

### 5. Launch local server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Code Standards & Verification

- **Type Check:** `npm run typecheck`
- **Lint Code:** `npm run lint`
- **Format Check:** `npx prettier --check .` (Formatting is auto-enforced during git commits using Husky + `lint-staged`)
- **Unit Tests:** `npm run test`
- **E2E Tests:** `npm run test:e2e`
