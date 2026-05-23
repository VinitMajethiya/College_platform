# UniVerdict — College Discovery Platform

## Project Specification for AI Agent

---

## Overview

Build a production-grade College Discovery Platform called **UniVerdict**. This is a full-stack web application that helps Indian students discover, compare, and save colleges. The final product must feel cohesive, polished, and production-ready — not a demo.

**Tagline:** "Find your perfect college. Make your best decision."

---

## Tech Stack (non-negotiable)

| Layer        | Technology                                       |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js 14 (App Router, TypeScript)              |
| Styling      | Tailwind CSS + shadcn/ui                         |
| State        | Zustand (client) + TanStack Query (server state) |
| Backend      | Next.js API Routes                               |
| ORM          | Prisma                                           |
| Database     | Supabase (PostgreSQL)                            |
| Auth         | NextAuth.js v5 (Google + GitHub OAuth)           |
| Validation   | Zod (all API inputs)                             |
| Deployment   | Vercel                                           |
| Testing      | Vitest (unit) + Playwright (E2E)                 |
| Code quality | ESLint + Prettier + Husky + lint-staged          |

---

## Features to Build (4 core features)

### Feature 1 — College Listing + Search

**Route:** `/colleges`

**What to build:**

- Paginated grid of college cards (12 per page, with infinite scroll on mobile)
- Each card shows: college name, location (city, state), fees (annual), NIRF ranking, rating (1–5 stars), and course count
- Full-text search bar (debounced 300ms, searches name + location + courses)
- Filter sidebar with:
  - State (multi-select)
  - Course type (Engineering, Medical, Management, Arts, Science, Law)
  - Annual fees range (slider: ₹0 – ₹20L)
  - Minimum rating (1–5 stars)
  - NIRF rank range
- Sort options: Ranking, Fees (low-high, high-low), Rating, Name (A-Z)
- URL-synced filters (shareable filter state via query params)
- Results count displayed ("Showing 48 of 312 colleges")
- Empty state with helpful suggestions when no results found
- Loading skeleton cards (not spinners)

**API:** `GET /api/colleges?search=&state=&course=&minFees=&maxFees=&minRating=&page=&sort=`

---

### Feature 2 — College Detail Page

**Route:** `/colleges/[slug]`

**What to build:**

- Hero section: college name, location, banner image placeholder (gradient), quick stats bar
- Tabbed content (Overview / Courses / Placements / Reviews):
  - **Overview tab:** About text, accreditations, campus area, established year, contact info
  - **Courses tab:** Table of courses offered — name, duration, annual fees, seats, eligibility
  - **Placements tab:** Average package, highest package, placement percentage, top recruiters (logo + name chips)
  - **Reviews tab:** User reviews with star rating, date, review text, and reviewer name. Aggregate rating breakdown (5★: X%, 4★: Y%, etc.)
- Sticky "Save College" button (heart icon) — requires login
- "Compare" button that adds to compare tray (persists across navigation)
- Breadcrumb: Home → Colleges → [College Name]
- Related colleges section (same state or course type, 3 cards)
- SEO: dynamic `<title>`, `<meta description>`, OpenGraph tags

**API:** `GET /api/colleges/[slug]` — returns full college object with courses, placements, reviews

---

### Feature 3 — Compare Colleges

**Route:** `/compare`

**What to build:**

- Floating compare tray (bottom of screen) that appears when 1+ colleges are added — shows college names + remove button, "Compare Now" CTA
- Maximum 3 colleges in comparison at once
- Full comparison page: side-by-side table with these rows:
  - College name + logo placeholder
  - Location
  - Established year
  - NIRF Ranking
  - Overall rating
  - Annual fees (range across courses)
  - Average placement package
  - Highest placement package
  - Placement percentage
  - Top courses offered
  - Accreditations
  - Campus area
- Differences highlighted: cells where values differ get a subtle amber background
- "Best value" badge on the column with lowest fees
- "Top rated" badge on the column with highest rating
- Mobile: horizontal scroll for 3-column comparison
- Share button: generates a shareable URL `/compare?ids=a,b,c`
- Empty state with college search to add colleges

**State:** Compare tray managed in Zustand, persisted to `localStorage`

---

### Feature 4 — Authentication + Saved Colleges

**Auth routes:** `/auth/signin`, `/auth/signout`
**Saved route:** `/saved`

**What to build:**

**Auth:**

- Sign in with Google (primary)
- Sign in with GitHub (secondary)
- Protected routes redirect to `/auth/signin?callbackUrl=...`
- User avatar + name in navbar with dropdown (Profile, Saved Colleges, Sign Out)
- Middleware-based route protection

**Saved Colleges:**

- Heart icon on every college card and detail page
- Optimistic UI: heart fills instantly, API call in background
- `/saved` page: grid of saved colleges, same card design as listing
- Remove from saved with confirmation
- Collections: users can create named collections ("Dream colleges", "Backup options") and assign saved colleges to them
- Empty state with CTA to browse colleges

**API:**

- `POST /api/saved` — save a college (auth required)
- `DELETE /api/saved/[collegeId]` — unsave (auth required)
- `GET /api/saved` — get user's saved colleges (auth required)
- `POST /api/collections` — create collection (auth required)
- `PATCH /api/collections/[id]` — add college to collection (auth required)

---

## Database Schema

```prisma
model College {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  city              String
  state             String
  country           String   @default("India")
  established       Int
  nurfRanking       Int?
  rating            Float    @default(0)
  reviewCount       Int      @default(0)
  annualFeesMin     Int
  annualFeesMax     Int
  campusAreaAcres   Float?
  about             String   @db.Text
  accreditations    String[]
  imageUrl          String?
  website           String?
  phone             String?
  email             String?
  avgPackageLPA     Float?
  highestPackageLPA Float?
  placementPercent  Float?
  topRecruiters     String[]
  courses           Course[]
  reviews           Review[]
  savedBy           SavedCollege[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Course {
  id          String  @id @default(cuid())
  collegeId   String
  college     College @relation(fields: [collegeId], references: [id])
  name        String
  type        String  // Engineering, Medical, Management, Arts, Science, Law
  duration    Int     // in years
  annualFees  Int
  seats       Int?
  eligibility String?
}

model Review {
  id         String   @id @default(cuid())
  collegeId  String
  college    College  @relation(fields: [collegeId], references: [id])
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  rating     Int      // 1-5
  title      String
  body       String   @db.Text
  createdAt  DateTime @default(now())
}

model User {
  id            String         @id @default(cuid())
  name          String?
  email         String?        @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  reviews       Review[]
  savedColleges SavedCollege[]
  collections   Collection[]
  createdAt     DateTime       @default(now())
}

model SavedCollege {
  id           String      @id @default(cuid())
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  collegeId    String
  college      College     @relation(fields: [collegeId], references: [id])
  collectionId String?
  collection   Collection? @relation(fields: [collectionId], references: [id])
  savedAt      DateTime    @default(now())
  @@unique([userId, collegeId])
}

model Collection {
  id        String         @id @default(cuid())
  userId    String
  user      User           @relation(fields: [userId], references: [id])
  name      String
  colleges  SavedCollege[]
  createdAt DateTime       @default(now())
}

// NextAuth required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

---

## Project Structure

```
collegecompass/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       └── signin/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx          # Main layout with Navbar + Footer
│   │   ├── page.tsx            # Home/landing page
│   │   ├── colleges/
│   │   │   ├── page.tsx        # Listing + search
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Detail page
│   │   ├── compare/
│   │   │   └── page.tsx
│   │   └── saved/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── colleges/
│   │   │   ├── route.ts        # GET list
│   │   │   └── [slug]/route.ts # GET detail
│   │   ├── saved/
│   │   │   ├── route.ts        # GET list, POST save
│   │   │   └── [collegeId]/route.ts  # DELETE unsave
│   │   └── collections/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── college/
│   │   ├── CollegeCard.tsx
│   │   ├── CollegeGrid.tsx
│   │   ├── CollegeFilters.tsx
│   │   ├── CollegeSearch.tsx
│   │   ├── CollegeDetailTabs.tsx
│   │   └── CompareTray.tsx
│   ├── saved/
│   │   ├── SaveButton.tsx
│   │   └── CollectionPicker.tsx
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Breadcrumb.tsx
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   ├── validations/
│   │   ├── college.ts          # Zod schemas
│   │   └── saved.ts
│   └── utils.ts
├── store/
│   └── compareStore.ts         # Zustand store for compare tray
├── hooks/
│   ├── useColleges.ts          # TanStack Query hooks
│   ├── useSaved.ts
│   └── useCompare.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # 50+ realistic Indian colleges
├── middleware.ts               # Route protection
├── .env.local                  # (gitignored)
├── .env.example                # committed, shows required vars
└── PROJECT.md
```

---

## Seed Data Requirements

The seed script (`prisma/seed.ts`) must insert at least **50 realistic Indian colleges** covering:

- IITs (at least 5 different IITs)
- NITs (at least 5)
- IIMs (at least 3)
- Private engineering colleges (DY Patil, VIT, SRM, Manipal, etc.)
- Medical colleges (AIIMS Delhi, KMC Mangalore, etc.)
- Liberal arts (Ashoka University, FLAME University, etc.)
- Spread across at least 10 Indian states

Each college must have:

- At least 3 courses
- At least 2 reviews
- Realistic fees, placement data, and rankings

---

## UI/UX Requirements

### Design system

- Color palette: Primary `#2563EB` (blue), Accent `#10B981` (green), Neutral grays
- Font: Inter (Google Fonts)
- Dark mode: supported via Tailwind `dark:` classes + `next-themes`
- Fully responsive: mobile (320px) → tablet → desktop (1440px)
- Accessible: WCAG AA — proper ARIA labels, keyboard navigation, focus rings

### Component standards

- All interactive elements have hover + focus + active states
- Loading states: skeleton loaders (not spinners) for content, button loading states for actions
- Error states: friendly error messages with retry options
- Empty states: illustrated (SVG) with clear CTAs
- Toast notifications (via sonner) for: save/unsave, collection actions, auth errors

### Pages

**Home (`/`):**

- Hero with search bar (large, centered) — searching redirects to `/colleges?search=`
- Stats bar: "500+ colleges · 20+ states · 50K+ student reviews"
- Featured colleges section (6 cards, curated)
- Feature highlights section (3 columns: Search, Compare, Save)
- CTA section: "Start exploring" button

**Navbar:**

- Logo (left) + navigation links (Colleges, Compare, Saved) + auth button
- Mobile: hamburger menu with slide-out drawer
- Search icon that expands to inline search on mobile
- Compare badge showing count of colleges in compare tray

---

## API Design

All API routes must:

- Validate input with Zod (return 400 with validation errors)
- Return consistent response shape: `{ data: ..., error: null }` or `{ data: null, error: { message: ... } }`
- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Protected routes check session via `getServerSession(authOptions)`
- Paginated endpoints return: `{ data: [...], pagination: { page, pageSize, total, totalPages } }`

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

---

## Quality Checklist (must pass before demo)

- [ ] All 4 features fully functional end-to-end
- [ ] Auth flow works (sign in, sign out, protected routes redirect)
- [ ] Search + filters work with real database queries (not mock data)
- [ ] Compare tray persists across page navigation
- [ ] Save/unsave works with optimistic UI
- [ ] All pages mobile responsive
- [ ] Dark mode works across all pages
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] ESLint passes with zero warnings
- [ ] Deployed and live on Vercel
- [ ] Seed data loaded in production DB
- [ ] `.env.example` committed, `.env.local` gitignored
- [ ] README.md with setup instructions and live URL

---

## What NOT to build

- Payment / fees collection
- College application submission
- Admin dashboard
- Email notifications
- Real-time chat
- Mobile app

Keep scope tight. Four features done exceptionally well beats eight features done poorly.
