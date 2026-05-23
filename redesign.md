# Frontend Redesign — CollegeCompass

## Complete Agent Prompt

---

## Your Mission

Redesign and rebuild the entire frontend of CollegeCompass from scratch. Do not patch or incrementally improve the existing UI — rip it out and replace it. Every page, every component, every interaction must be rebuilt to the standard described below. The existing backend APIs, Prisma schema, and NextAuth setup remain untouched. You are only changing what the user sees and experiences.

---

## Design Philosophy

**Study this reference before writing a single line of code:** https://www.collegedekho.com

CollegeDekho is your primary visual and UX inspiration. Understand what makes it work:

- Deep navy (`#1a1a2e`, `#16213e`, `#0f3460`) hero sections that feel premium and trustworthy
- Warm orange (`#F97316`, `#EA580C`) as the action/accent color — used for CTAs, highlights, hover states, active tabs
- Clean white content cards on light gray backgrounds below the hero — not everything is dark
- Information-dense layouts that don't feel cluttered — achieved through consistent spacing and clear typographic hierarchy
- Stream/category pills as horizontal scrollable filters (Engineering, Medical, Management, etc.)
- College cards with a small colored banner image area, rank badge, key chips (fees, placement, course type), and star rating
- Sticky compare tray at the bottom that builds as users add colleges
- Trust signals everywhere: NIRF ranks, Google ratings, review counts, placement stats

**Your design is NOT a clone of CollegeDekho.** It is inspired by it. Your platform is called **CollegeCompass**. It has its own identity:

- More student-voice, less corporate. Tone is like a smart senior who's been through JEE/NEET helping a junior.
- Typography is crisper and more readable. Use `Inter` from Google Fonts.
- Slightly more whitespace in card bodies.
- The accent orange is `#F97316` (Tailwind `orange-500`). The navy is `#1a1a2e`. These are your two brand colors.
- The nerdy/student energy comes from: honest copy (no marketing fluff), data-forward design (numbers and stats are heroes, not afterthoughts), and micro-interactions that feel considered.

---

## Color System

Define these as Tailwind CSS custom colors in `tailwind.config.ts`:

```ts
colors: {
  brand: {
    navy:    '#1a1a2e',
    navyMid: '#16213e',
    navyDeep:'#0f3460',
    orange:  '#F97316',
    orangeHover: '#EA580C',
    orangeLight: '#FFF7ED',
    orangeMuted: 'rgba(249,115,22,0.12)',
  }
}
```

Usage rules:

- `brand-navy` — hero backgrounds, navbar, compare tray, footer
- `brand-orange` — all primary CTAs, active states, hover borders, accent text, badges
- White (`#ffffff`) — card surfaces
- `gray-50` (`#F9FAFB`) — page background behind cards
- `gray-100` — card borders, dividers
- `gray-500` — secondary text (location, meta info)
- `gray-900` — primary text (college names, headings)

---

## Typography

Install and apply `Inter` via `next/font/google`:

```ts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
```

Scale:

- `text-xs` (12px) — meta labels, chips, tags
- `text-sm` (14px) — body copy, card descriptions, nav links
- `text-base` (16px) — card titles, section labels
- `text-lg` (18px) — section headings
- `text-2xl` (24px) — page headings
- `text-3xl`–`text-4xl` — hero headline only

Font weights: `font-normal` (400) for body, `font-medium` (500) for titles and labels, `font-semibold` (600) for hero headline only. Never use `font-bold` (700) except for numeric stats.

---

## Global Layout

### Navbar

Build a sticky top navbar. Height: 60px.

**Desktop layout:**

- Left: CollegeCompass logo (orange dot + wordmark where "Compass" is orange)
- Center: navigation links — Colleges · Compare · Saved · [if auth: My Profile]
- Right: Search icon (opens search modal on click) + Sign In button (orange pill) or User avatar dropdown

**Mobile layout:**

- Left: Logo
- Right: Search icon + Hamburger menu
- Hamburger opens a full-height slide-in drawer from the right with all nav links and auth CTA

**Styling:**

- Background: `brand-navy` with `backdrop-blur` on scroll (add `bg-opacity-95`)
- Nav links: `text-sm text-slate-400 hover:text-white transition-colors`
- Active nav link: `text-brand-orange font-medium`
- Bottom border: `border-b border-white/5`

### Footer

Three-column layout on desktop, stacked on mobile.

- Col 1: Logo + tagline + social icons (use lucide-react icons for social)
- Col 2: Quick links (Colleges, Compare, Saved, Sign In)
- Col 3: About, Contact, Privacy Policy
- Bottom bar: "© 2025 CollegeCompass · Built for students, by students"
- Background: `brand-navy`. Text: `text-slate-400`

---

## Page-by-Page Redesign

---

### Page 1 — Home (`/`)

#### Section 1: Hero

Full-width hero. Background: deep navy gradient — `from-[#1a1a2e] via-[#16213e] to-[#0f3460]`.

Add a subtle dot-grid pattern overlay using a CSS `background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)` at `background-size: 28px 28px`.

**Inside the hero:**

Top badge pill:

```
✦  India's student-first college guide
```

Styled as: `bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs px-3 py-1 inline-flex items-center gap-2`

Headline (H1):

```
Right guidance,
brighter future.
```

"brighter future." in `text-brand-orange`. Font: `text-4xl font-semibold text-white leading-tight`.

Subheading (below H1):

```
Real placement data, honest reviews, and zero sponsored fluff.
Find your college without the noise.
```

Style: `text-sm text-slate-400 leading-relaxed max-w-md`

**Search bar** (the most important element on the page):
Wrap in a card: `bg-white/8 border border-white/10 rounded-2xl p-3 max-w-2xl mx-auto mt-6`

Inside: a white inner row with search icon, text input, and orange "Search" button.

- Input placeholder: `"Search college name, course, city, or exam..."`
- On submit: navigate to `/colleges?search=[query]`

Below the search bar, quick-access tags (horizontal scroll, no scrollbar):
`IIT Delhi` · `NIT Trichy` · `AIIMS Delhi` · `MBA` · `Computer Science` · `Under ₹2L/yr`

Each tag: `text-xs px-3 py-1.5 rounded-full bg-white/6 text-slate-400 border border-white/8 hover:border-orange-500/40 hover:text-orange-400 cursor-pointer transition-all`

**Stats bar** (inside hero, at the bottom, separated by `border-t border-white/8 mt-6 pt-5`):

Four stats in equal columns:
| 512 | 28 | 60,000+ | 100% |
| Colleges indexed | States covered | Student reviews | Free forever |

Stat value: `text-2xl font-bold text-white`
Stat label: `text-xs text-slate-500`

#### Section 2: Stream Filter + Featured Colleges

Background: `bg-gray-50`.

**Stream pills** (horizontally scrollable, no scrollbar visible):
`All` · `Engineering` · `Medical` · `Management` · `Law` · `Arts & Humanities` · `Science` · `Commerce` · `Architecture` · `Pharmacy`

Active pill: `bg-orange-500 text-white`. Inactive: `bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600`

Below the pills: section heading — "Top colleges in India" with a "View all →" link in orange on the right.

**College cards grid** — 3 columns desktop, 2 tablet, 1 mobile. Show 6 featured colleges.

Each card (see Component: CollegeCard below for full spec).

#### Section 3: How It Works

3-column grid. Light white background. Section title: "Choosing a college just got easier"

Column 1: Icon (magnifying glass) + "Search & filter" + "Find colleges by stream, fees, location, and ranking."
Column 2: Icon (bar chart) + "Compare side by side" + "Put colleges next to each other. See who wins on placements, fees, and campus life."
Column 3: Icon (bookmark) + "Save your shortlist" + "Build your college list. Sign in and save colleges across sessions."

Styling: icon in `text-brand-orange`, title in `text-gray-900 font-medium`, body in `text-sm text-gray-500`.

#### Section 4: CTA Banner

Full-width. Background: `brand-orange`. Text white.
Headline: "Start building your college list — it's free."
Sub: "No counsellors. No spam. Just data."
Button: white pill button with orange text → links to `/colleges`

---

### Page 2 — College Listing (`/colleges`)

#### Layout

Two-panel layout on desktop:

- Left: Filters sidebar (240px wide, sticky)
- Right: Results area (flex-1)

On mobile: filters collapse into a slide-up bottom sheet triggered by a "Filters" button in a sticky top bar.

#### Sticky top bar (mobile only)

`bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-[60px] z-10`

- Left: result count — "Showing 48 colleges"
- Right: "Filters" button (outlined orange) + Sort dropdown

#### Filters sidebar (desktop)

`bg-white border border-gray-100 rounded-2xl p-5 sticky top-[76px]`

Sections (each with a subtle divider between them):

1. **Search** — text input with magnifier icon. Debounced 300ms. Syncs to URL `?search=`.

2. **Stream / Course type** — Checkbox group:
   - Engineering · Medical · Management · Law · Arts & Humanities · Science · Commerce · Architecture · Pharmacy
   - Show 5, "Show more" expands rest
   - Selected count badge on section header: "Stream (2)"

3. **Location** — State multi-select checkboxes. Same pattern.

4. **Annual fees** — Dual-handle range slider
   - Min: ₹0, Max: ₹25,00,000
   - Display: "₹0 – ₹25L" with formatted Indian number style
   - Use `react-slider` or build with two range inputs

5. **NIRF Ranking** — Single select: Top 10 · Top 25 · Top 50 · Top 100 · All

6. **Minimum rating** — Star selector (1★ to 5★, click to select minimum)

7. **Sort by** — Radio group: Ranking · Rating · Fees: Low to High · Fees: High to Low · Name (A–Z)

Filter actions at bottom: `Clear all filters` (text link in orange) — no Apply button (filters apply live via URL params with 400ms debounce).

#### Results area

**Sort bar** (desktop only, above results):
`Showing {n} colleges` on left. Sort dropdown on right.

**College cards** — 1 column on mobile, 2 columns on desktop. Full CollegeCard component (see below).

**Pagination:**

- Show 12 per page
- Pagination at bottom: Prev · 1 · 2 · 3 · ... · Next
- Active page: orange filled pill. Others: outlined gray.

**Empty state** (when filters return 0 results):

- Centered, illustrated SVG (draw a simple compass icon in orange)
- "No colleges match your filters"
- "Try removing some filters or broadening your search."
- Orange "Clear all filters" button

**Loading state** — Show 6 skeleton cards (gray pulsing placeholder cards) while fetching.

---

### Component: CollegeCard

This is the most-rendered component. Get it perfect.

```
┌─────────────────────────────────────────┐
│  [College banner — colored gradient]    │  ← 72px tall, bg varies by stream
│  [NIRF #1 badge top-left]               │
│  [♡ Save icon top-right]                │
├─────────────────────────────────────────┤
│  IIT Madras                             │  ← font-medium text-gray-900
│  📍 Chennai, Tamil Nadu                 │  ← text-xs text-gray-400
│                                         │
│  [Engineering] [₹2.2L/yr] [Avg ₹22L]   │  ← chips
│                                         │
├─────────────────────────────────────────┤
│  ★★★★★ 4.8 (2.1K reviews)   +Compare   │
└─────────────────────────────────────────┘
```

**Banner colors by stream:**

- Engineering: `from-[#1a1a2e] to-[#0f3460]`
- Medical: `from-[#064e3b] to-[#065f46]`
- Management: `from-[#1e1b4b] to-[#312e81]`
- Law: `from-[#1c1917] to-[#292524]`
- Arts: `from-[#4a1d96] to-[#6d28d9]`
- Default: `from-[#1a1a2e] to-[#16213e]`

College name in white text overlaid on the banner (bottom-left, with a `bg-gradient-to-t from-black/60 to-transparent` scrim).

**NIRF badge:** `bg-brand-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded-full absolute top-2 left-2`
Only show if `nurfRanking <= 200`.

**Save button:** Heart icon `top-2 right-2`. Filled orange if saved, outline if not. Clicking triggers optimistic UI save/unsave.

**Chips:**

- Course type: `bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded`
- Fees: `bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded`
- Avg package: `bg-orange-50 text-orange-700 text-[10px] px-2 py-0.5 rounded`

**Star rating:** `text-yellow-400` stars + rating number in `text-xs text-gray-600` + review count in `text-xs text-gray-400`

**Compare button:** `text-xs text-brand-orange hover:underline` at bottom right.

On click: adds college to compare tray (Zustand). If tray already has 3, show a toast: "Remove a college first to add another."

**Card hover state:** `hover:border-orange-300 hover:shadow-sm transition-all`

---

### Page 3 — College Detail (`/colleges/[slug]`)

#### Breadcrumb

`Home › Colleges › [College Name]`
`text-xs text-gray-400` with `›` separators. College name in `text-gray-700`.

#### Hero section

Background: the stream's banner color (same gradient as card banner). Full-width, 200px tall.

Inside:

- College name: `text-2xl font-semibold text-white`
- Location with pin icon: `text-sm text-white/70`
- Quick stat pills (inline, white/transparent outlined):
  `NIRF #1` · `★ 4.8` · `Est. 1959` · `₹2.2L – ₹3.5L/yr`

#### Actions bar (below hero, white background, sticky on scroll)

`bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-[60px] z-20`

Left: Tab navigation — **Overview** · **Courses** · **Placements** · **Reviews**
Active tab: orange bottom border (`border-b-2 border-brand-orange text-brand-orange`)
Inactive: `text-gray-500 hover:text-gray-800`

Right: Two buttons:

- `♡ Save college` — outlined orange, fills on save
- `⊞ Compare` — outlined gray, adds to tray

#### Tab content panels

**Overview tab:**

- "About" section: `text-sm text-gray-600 leading-relaxed` — college description
- Key facts grid (2×3 on desktop, 2×3 stacked mobile):
  - Established · Ownership (Govt/Private/Deemed) · Campus size · Accreditations · Website · Phone
  - Each: label in `text-xs text-gray-400` + value in `text-sm font-medium text-gray-800`
- Top recruiters section: company name chips in `bg-gray-50 border border-gray-200 rounded px-3 py-1 text-xs text-gray-700`

**Courses tab:**
Table with columns: Course · Type · Duration · Annual Fees · Seats · Eligibility

Style the table:

- Header: `bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide`
- Rows: alternating `bg-white` / `bg-gray-50/50`
- Fees column: `font-medium text-gray-900`
- Mobile: horizontal scroll wrapper

**Placements tab:**
Top stats bar — 3 cards:

- Average Package: `text-2xl font-bold text-gray-900` + `₹ X LPA`
- Highest Package: same
- Placement %: `XX%` in large text

Below: Top recruiters as a grid of logo placeholder boxes (gray rounded squares with company initial + name).

**Reviews tab:**
Aggregate rating card at top:

- Large rating number on left (`text-5xl font-bold`)
- Star breakdown bars on right (5★ to 1★ with fill bars in orange)
- Total review count below

Reviews list:
Each review: reviewer name initial avatar (colored circle) + name + date + rating stars + title + body text.
`border-b border-gray-100 py-4`

Write a review CTA at bottom (if logged in): simple inline form with star selector + title input + textarea + submit.

---

### Page 4 — Compare (`/compare`)

#### Empty state (no colleges added yet)

Centered:

- Large compass SVG illustration (draw in orange/navy)
- "Your compare tray is empty"
- "Browse colleges and tap + Compare to add them here"
- "Browse colleges →" button in orange

#### With colleges (2–3 columns)

**College selector panel** (if < 3 colleges):
Show "Add a college" column with a search input to find and add more.

**Comparison table:**

Sticky first column with row labels. Each subsequent column = one college.

College header (top of each column):

- Mini banner (stream color, 60px) with college name overlay
- "Remove" × button top-right
- "View detail →" link below name

Rows (grouped into sections with section headers):

**Overview**

- NIRF Ranking
- Overall Rating (stars)
- Established
- Ownership

**Fees**

- Min Annual Fees
- Max Annual Fees

**Placements**

- Average Package
- Highest Package
- Placement %

**Courses**

- Available streams (chips)

Highlight rules:

- Best value (lowest min fees): cell gets `bg-green-50 text-green-800 font-medium`
- Top rated (highest rating): cell gets `bg-orange-50 text-orange-800 font-medium`
- Best placement: cell gets `bg-blue-50 text-blue-800 font-medium`
- Add a legend below the table explaining the color coding

**Share button:**
`🔗 Share this comparison` — copies URL `/compare?ids=a,b,c` to clipboard, shows toast "Link copied!"

---

### Page 5 — Saved (`/saved`)

**If not logged in:**

- Full-page centered state
- "Sign in to save colleges"
- Subtext: "Create a free account to save colleges, build shortlists, and track your college journey."
- Google sign-in button (outlined with Google colors) + GitHub sign-in button
- Below: "Continue browsing →" text link

**If logged in, no saved colleges:**

- Centered empty state with bookmark illustration
- "You haven't saved any colleges yet"
- "Browse colleges →" button

**If logged in, has saved colleges:**

Collections selector at top:

- "All saved" tab (default) + each collection as a tab
- "+ New collection" button — opens a modal with just a text input for collection name

College grid (same CollegeCard component, but with a "Remove" option via right-click or long-press menu on mobile, or a visible × button on hover desktop).

Under each card, collection assignment: small dropdown "Move to collection →"

---

## Component: Compare Tray (Global)

Appears fixed to the bottom of the viewport when 1+ college is in compare store.

```
┌──────────────────────────────────────────────────────┐
│ Compare  [IIT Madras ×] [IIT Bombay ×] [+ Add one]  │  [Compare now →]
└──────────────────────────────────────────────────────┘
```

Styling: `bg-[#1a1a2e] border-t border-white/10 px-6 py-3`
College pills: `bg-orange-500/15 text-orange-400 border border-orange-500/25 text-xs px-3 py-1 rounded-full`
× button inside pill: `text-orange-300 hover:text-white ml-1`
Compare button: `bg-brand-orange text-white text-sm px-5 py-2 rounded-lg hover:bg-orange-600`

This tray should animate in from the bottom with `transform: translateY(0)` transition when colleges are added.

---

## Component: Search Modal (Global)

Triggered by clicking the search icon in the navbar. Overlays the entire screen.

`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24`

Inner container: `bg-white rounded-2xl w-full max-w-xl mx-4 overflow-hidden`

- Large search input at top (48px tall, `text-base`, orange focus ring)
- Below: "Popular searches" section — same quick tags as homepage
- As user types: live results list (3–5 college names, fetched from `/api/colleges?search=&limit=5`)
- Each result row: college name + location + NIRF rank
- Keyboard navigable (↑↓ arrows, Enter to go to detail page)
- Escape to close

---

## Micro-interactions & Animation

Use `tailwindcss-animate` or `framer-motion` (lightweight, only for these cases):

1. **Compare tray** — slides up from bottom when first college is added (`translateY(100%) → translateY(0)`, 200ms ease-out)
2. **Save button** — heart icon scales up briefly on click (`scale-125` for 150ms) before settling into filled state
3. **College cards** — subtle `translateY(-2px)` on hover (CSS only, `transition-transform duration-150`)
4. **Page transitions** — `opacity-0 → opacity-100` fade (150ms) on route change via `layout` in App Router
5. **Filter changes** — skeleton cards fade in while new results load
6. **Toast notifications** — slide in from top-right, auto-dismiss after 3s (use `sonner` library)
7. **Tab switching** on detail page — orange underline slides between tabs (`transition-transform`)

Keep all animations under 250ms. No bouncy spring physics. Clean, purposeful, fast.

---

## Loading & Error States

### Skeleton pattern

All skeletons use:

```tsx
<div className="animate-pulse bg-gray-200 rounded" style={{ height: Xpx }} />
```

Skeleton cards must match the exact dimensions and structure of real CollegeCards — placeholder for banner, name, location, chips, and footer.

### Error pattern

If an API call fails, show an inline error state (not a full-page error):

- Gray warning icon
- "Something went wrong loading colleges."
- "Try again →" button that retries the query (TanStack Query `.refetch()`)

Never show raw error messages or stack traces to the user.

---

## Responsiveness Rules

| Breakpoint              | Behavior                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `< 640px` (mobile)      | 1-column card grid, filter bottom sheet, hamburger nav, horizontal-scroll stream pills |
| `640px–1024px` (tablet) | 2-column card grid, filter bottom sheet, full nav                                      |
| `> 1024px` (desktop)    | 3-column card grid, sticky filter sidebar, full nav                                    |

Test every page at 375px (iPhone SE), 768px (iPad), and 1440px (desktop).

---

## Accessibility Requirements

- All interactive elements reachable by keyboard (Tab / Shift+Tab)
- Focus rings: `ring-2 ring-brand-orange ring-offset-2` on all focusable elements
- All images have `alt` attributes (college banner: `alt="${college.name} campus"`)
- Star ratings: `aria-label="4.8 out of 5 stars"`
- Search input: `aria-label="Search colleges"`
- Compare tray: `role="region" aria-label="Compare tray"`
- Color is never the only indicator (chips also have text labels, not just colors)
- WCAG AA contrast on all text/background combinations

---

## Implementation Order

Execute in this exact sequence. Do not skip ahead.

1. **Global setup** — Install Inter font, configure Tailwind custom colors, install `sonner` for toasts, install `framer-motion` (or `tailwindcss-animate`), create `cn()` utility, set up `next-themes` for light/dark toggle.

2. **Design tokens** — Create `lib/design-tokens.ts` exporting stream color maps, chip color maps, and any shared constants.

3. **Navbar + Footer** — Build these first as they wrap every page. Test at all 3 breakpoints before moving on.

4. **CollegeCard component** — This gets used on 3 pages. Build it once, perfectly.

5. **Compare Tray** — Global component. Wire to Zustand store. Animate it.

6. **Search Modal** — Global. Wire to live API.

7. **Home page** — Hero → Stream filter → Card grid → How it works → CTA banner.

8. **Colleges listing page** — Filters sidebar (desktop) + bottom sheet (mobile) → Results grid → Pagination → Empty + loading states.

9. **College detail page** — Hero → Actions bar → All 4 tabs → Related colleges.

10. **Compare page** — Empty state → Full comparison table → Share button.

11. **Saved page** — Unauthenticated state → Empty state → Collections → Card grid.

12. **Polish pass** — Go through every page and every component. Check: hover states, focus rings, loading states, empty states, error states, mobile layout, dark mode, animation timing.

---

## What NOT to Do

- Do not use any UI component library other than `shadcn/ui` + Tailwind. No Material UI, no Chakra, no Ant Design.
- Do not add any new API routes or change the Prisma schema.
- Do not use `<table>` for layout — only for actual tabular data (courses table, comparison table).
- Do not hardcode any data — all content comes from existing API routes.
- Do not add loading spinners — use skeleton loaders.
- Do not use `!important` in CSS.
- Do not install any animation library heavier than `framer-motion`.
- Do not use placeholder images from external services (picsum, unsplash) — use CSS gradient banners.
- Do not ship any TypeScript errors. Run `tsc --noEmit` before considering any page done.
- Do not use `any` type in TypeScript.

---

## Definition of Done

Each page is done when:

- [ ] Renders correctly at 375px, 768px, and 1440px
- [ ] All interactive states work: hover, focus, active, loading, error, empty
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Accessible by keyboard
- [ ] Data is live from the API (no hardcoded mock data)
- [ ] Dark mode (if implemented) does not break layout

The full redesign is done when all 5 pages + 3 global components pass the above checklist.
