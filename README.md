# UniVerdict

College discovery platform for Indian students, built with Next.js 14, TypeScript, Tailwind CSS, Prisma, NextAuth, Zustand, and TanStack Query.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and OAuth credentials.

4. Generate Prisma and seed the database:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the dev server:

```bash
npm run dev
```

## Implemented

- Home page, college listing, filters, search, pagination, cards, detail pages, compare tray, compare page, sign-in page, saved empty state.
- API routes for colleges, college detail, saved colleges, and collections with Zod validation.
- Prisma schema and seed script for 50+ realistic Indian colleges.

## Notes

The app ships with an in-memory sample data layer so the discovery experience works before Supabase is connected. The Prisma schema and seed script are ready for PostgreSQL.
