# AniVerse

**AniVerse** is an AI-powered entertainment hub for anime, movies, shows, K-dramas, music, collections, communities, and personal analytics. Users discover content matched to their taste, organize watchlists and playlists, join fan communities, and track how they watch and listen over time.

This repository contains the **frontend application** — a Next.js 16 app with a polished, Figma-aligned dark UI. All pages are built and navigable; data is served from a mock layer designed to be swapped for a real API/database later.

---

## UI Completion Status

| Area | Status | Notes |
|------|--------|-------|
| Landing page | ✅ Complete | Hero, features, highlights, how-it-works, communities, reviews, stats, CTA |
| Auth (login / signup) | ✅ Complete | Credentials + optional Google/Discord OAuth UI |
| Onboarding taste test | ✅ Complete | 8-step quiz → AI taste score + personalized preview |
| Dashboard shell | ✅ Complete | Sidebar, topbar, mobile bottom nav, welcome banners |
| Dashboard routes (9) | ✅ Complete | Home, Discover, For You, Watchlist, Collections, Analytics, Notifications, Community, Settings |
| Detail pages | ✅ Complete | Content, song, artist, collection, music collection, profile, community |
| Community dashboard | ✅ Complete | Posts, chat, anime chat, watch channel, voice channel, announcements, analytics, settings |
| Global search | ✅ Complete | Autocomplete API + full results page with ranked matches |
| Notifications | ✅ Complete | Bell dropdown, panel, full page, read/unread state (client-side) |
| Analytics dashboard | ✅ Complete | 15 chart/KPI features via Recharts |
| Settings | ✅ Complete | Profile, account, taste & AI, notifications, privacy, preferences |
| Card system | ✅ Complete | Poster, music, artist, community, collection, review, episode cards |
| Carousels & grids | ✅ Complete | Horizontal scroll sections with search pills across all hubs |

**Overall UI: ~95% complete** for the planned MVP scope. What remains is mostly **backend wiring** — not missing screens.

### Not yet wired (backend / behavior)

- Database and REST/GraphQL API
- Route protection (dashboard is accessible without login today)
- Session-based user identity (`getCurrentUser()` returns mock data)
- CRUD actions (add to watchlist, create collection, post review, send chat, etc.)
- Settings persistence to server
- Real-time community chat / watch parties
- Production OAuth credentials and user registration

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with custom Figma design tokens |
| Auth | [NextAuth.js v5](https://authjs.dev) (Auth.js) — JWT sessions |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Variants | [class-variance-authority](https://cva.style) (button/component variants) |
| Class utils | `clsx` + `tailwind-merge` (`cn()` helper) |
| Fonts | Geist Sans (Google) + system fallbacks |

### Dev tooling

- ESLint (`eslint-config-next`)
- Prettier + `prettier-plugin-tailwindcss`
- PostCSS with `@tailwindcss/postcss`

> **Note:** `framer-motion` is installed but not yet used in source. It is available for future animations.

---

## User Flow

```
Landing (/)
    │
    ├── Browse marketing sections (features, reviews, stats…)
    │
    ├── Login (/login) ──────────────────────► Dashboard (/dashboard)
    │
    └── Signup (/signup)
            │
            ▼
        Onboarding (/onboarding)
        8-step taste quiz → AI taste profile saved to localStorage
            │
            ▼
        Dashboard (/dashboard)
            │
            ├── Discover / For You / Watchlist / Collections
            ├── Analytics / Notifications / Community / Settings
            ├── Global search (/search?q=…)
            │
            └── Detail pages
                ├── /content/[id]      anime, movies, shows
                ├── /song/[id]         songs & OSTs
                ├── /artist/[id]       artists & bands
                ├── /collection/[id]   video/content collections
                ├── /music-collection/[id]  music playlists
                ├── /profile/[id]      user profiles
                └── /community/[id]    community hubs
                        └── /community/[id]/dashboard/[section]
                            posts · chat · watch · voice · announcements…
```

---

## Routes Reference

### Public

| Route | Description |
|-------|-------------|
| `/` | Landing page with navbar anchors: Features, How It Works, Community, Reviews, Analytics |
| `/login` | Sign in (demo credentials or OAuth) |
| `/signup` | Create account → redirects to onboarding |

### Post-auth

| Route | Description |
|-------|-------------|
| `/onboarding` | Taste test: content types, genres, favorites, moods, music, artists, watch habits, goals |
| `/search?q=` | Full search results (content, songs, artists, profiles, collections, communities) |

### Dashboard (`/dashboard/*`)

Shared layout: **sidebar** (desktop) + **topbar** (search, notifications bell) + **bottom nav** (mobile).

| Route | Description |
|-------|-------------|
| `/dashboard` | Home — stats, quick links, continue watching, recommendations, trending, music, communities, collections |
| `/dashboard/discover` | Trending, recommended, new releases, continue watching/listening, music picks |
| `/dashboard/for-you` | AI-personalized carousels by mood and genre |
| `/dashboard/watchlist` | High-priority and all saved items with genre filters |
| `/dashboard/collections` | Most liked, recently added/used, your collections, global public collections |
| `/dashboard/analytics` | 15 analytics panels — KPIs, charts, rankings, milestones |
| `/dashboard/notifications` | Full notification feed grouped by unread / earlier |
| `/dashboard/community` | Favourite, active, recommended, and global community grids |
| `/dashboard/settings` | Profile, account, taste & AI, notifications, privacy, preferences, sign out |

**Sidebar nav:** Home · Discover · Collections · Watchlist · For You · Analytics · Notifications · Community · Settings

**Mobile bottom nav:** Home · Discover · For You · Watchlist · Collections · Analytics

### Detail pages (SSG with `generateStaticParams`)

| Route | Description |
|-------|-------------|
| `/content/[contentid]` | Hero, episodes/seasons, characters, OSTs, related content, collections, communities, reviews |
| `/song/[songid]` | Hero, artist/album/show links, similar tracks, collections, communities, reviews |
| `/artist/[artistid]` | Hero, KPIs, songs, albums, band members, similar artists, collections, communities, reviews |
| `/collection/[collectionid]` | Hero, all items, continue watching, most watched, music, similar collections, communities |
| `/music-collection/[collectionid]` | Hero, all tracks, continue listening, most played, similar vibes, artists, collections |
| `/profile/[userid]` | Hero, KPIs, activity, liked/watched content, music stats, collections, communities, reviews |
| `/community/[communityid]` | Hero, KPIs, dashboard preview, trending content/music, collections, similar communities |

### Community dashboard

| Route | Description |
|-------|-------------|
| `/community/[id]/dashboard` | Redirects to `…/dashboard/posts` |
| `/community/[id]/dashboard/[section]` | Full in-community dashboard |

**Sections:** `posts` · `chat` · `anime-chat` · `watch-channel` · `voice-channel` · `announcements` · `analytics` · `settings`

### API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth session handlers |
| `/api/search` | GET | Autocomplete: `?q=query&limit=8` → `{ results: [...] }` |

---

## Project Structure

```
aniverse-application/
├── app/                          # Next.js App Router pages & layouts
│   ├── (auth)/                   # Login, signup (split auth layout)
│   ├── api/                      # NextAuth + search autocomplete
│   ├── dashboard/                # 9 dashboard hub pages + shared layout
│   ├── content/                  # Content detail pages
│   ├── song/                     # Song/OST detail pages
│   ├── artist/                   # Artist detail pages
│   ├── collection/               # Video collection detail pages
│   ├── music-collection/         # Music playlist detail pages
│   ├── profile/                  # User profile pages
│   ├── community/                # Community + nested dashboard
│   ├── onboarding/               # Post-signup taste test
│   ├── search/                   # Search results page
│   ├── globals.css               # Tailwind v4 + design tokens
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── analytics/                # KPI grid, chart panels, rankings, milestones
│   ├── artist/                   # Artist hero, KPIs, trending slider
│   ├── auth/                     # Login/signup forms, showcase, social buttons
│   ├── cards/                    # Poster, music, artist, community, collection, review…
│   ├── carousel/                 # Paginated carousel + row viewport
│   ├── charts/                   # Recharts wrappers (area, bar, line, pie, radar)
│   ├── collection/               # Collection hero, spotlight slider, activity panel
│   ├── community/                # Community hero, dashboard shell, chat, watch-live
│   ├── content/                  # Content hero, episodes, reviews, page sections
│   ├── dashboard/                # Shell, sidebar, topbar, carousels, grids, filters
│   ├── landing/                  # Landing page sections
│   ├── notifications/            # Bell, panel, full view, read/unread store hook
│   ├── onboarding/               # Quiz flow, taste breakdown, goal links
│   ├── profile/                  # Profile hero, activity slider, listening panel
│   ├── search/                   # Autocomplete, results view, top results
│   ├── settings/                 # Settings sections and toggles
│   └── ui/                       # Button, chip, gradient button, glass cards, avatar stack…
│
├── hooks/
│   └── use-column-count.ts       # Responsive grid column helper
│
├── lib/
│   ├── data/                     # Mock data layer (20 modules — async accessors)
│   ├── search/                   # Search types and scoring utilities
│   ├── auth.ts                   # NextAuth v5 configuration
│   ├── onboarding-store.ts       # localStorage persistence for taste profile
│   ├── notifications-store.ts    # In-memory read/unread pub/sub store
│   ├── *-routes.ts               # Slug normalization + path builders
│   ├── accents.ts                # Accent color → CSS class maps
│   ├── card-theme.ts             # Section tint seeds for cards
│   ├── collection-media-copy.ts  # Copy variants for video vs music collections
│   └── utils.ts                  # cn() — clsx + tailwind-merge
│
├── types/
│   └── index.ts                  # Domain types (ContentItem, MusicTrack, Community…)
│
├── public/images/                # Posters, hero images (see scripts/)
├── scripts/
│   └── fetch-posters.mjs         # Dev utility — downloads poster assets
│
├── .env.example                  # Required environment variables
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json                 # Path alias: @/* → project root
└── package.json
```

---

## How It Works

### Data layer (`lib/data/`)

All page data flows through **async accessor functions** in `lib/data/`. Each module exports typed getters (e.g. `getTrendingThisWeek()`, `getContentDetail(id)`) that return static mock arrays today but share the same shape a future API would use.

```
Page (Server Component)
    └── await getXxxData()     ← lib/data/*.ts
            └── returns typed mock data
                    └── passed as props to client carousel/grid components
```

**Key data modules:**

| Module | Serves |
|--------|--------|
| `home.ts` | Dashboard home stats and carousels |
| `discover.ts` | Discover page content and music pools |
| `for-you.ts` | Personalized recommendation carousels |
| `watchlist.ts` | Watchlist stats and item grids |
| `collections.ts` | Collection hub stats and grids |
| `community.ts` | Community hub stats and grids |
| `analytics.ts` | Full analytics dataset (KPIs, chart series, rankings) |
| `notifications.ts` | Notification seed data |
| `settings.ts` | Default settings and profile shape |
| `search.ts` | Search indexing, keyword ranking, page assembly |
| `onboarding.ts` | Quiz steps, scoring engine, recommendation builder |
| `content-detail.ts` | Content detail pages |
| `song-detail.ts` | Song detail pages |
| `artist-detail.ts` | Artist detail pages |
| `collection-detail.ts` | Video collection detail |
| `music-collection-detail.ts` | Music collection detail |
| `community-detail.ts` | Community detail + dashboard data |
| `user-detail.ts` | User profile detail |
| `user.ts` | `getCurrentUser()` — mock logged-in user |
| `landing.ts` | Landing page features, reviews, stats |

### Authentication

Configured in `lib/auth.ts`, exposed at `/api/auth/[...nextauth]`.

| Provider | Behavior |
|----------|----------|
| **Credentials** | Demo mode — any email + password ≥ 6 chars signs in as `demo-user` |
| **Google** | Active only when `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` are set |
| **Discord** | Active only when `AUTH_DISCORD_ID` + `AUTH_DISCORD_SECRET` are set |

- Session strategy: **JWT**
- Custom sign-in page: `/login`
- Signup → credentials sign-in → redirect to `/onboarding`
- Login → redirect to `/dashboard`
- Settings page calls `signOut()` from `next-auth/react`

> Dashboard routes are **not middleware-protected** yet. `getCurrentUser()` always returns a hardcoded mock user regardless of session.

### Onboarding & taste profile

1. User completes signup → `/onboarding`
2. 8-step quiz collects: content types, genres, favorite titles, moods, music tastes, artists, watch habits, goals
3. Scoring engine in `lib/data/onboarding.ts` computes an **AI taste score** and builds starter recommendations
4. Result saved to **`localStorage`** via `lib/onboarding-store.ts`
5. Dashboard **AI Taste Profile bar** reads the saved score; "Retake Test" routes back to `/onboarding` with selections prefilled

### Global search

```
Topbar search input
    ├── Debounced fetch → GET /api/search?q=…&limit=8  (autocomplete dropdown)
    └── Enter / submit → /search?q=…  (full results page)

lib/data/search.ts
    ├── Indexes content, songs, artists, profiles, collections, communities
    ├── rankMatches() — partial keyword matching across all terms
    └── Assembles SearchPageData with primary type + variant sections
```

Top results use the same **PosterCard**, **MusicCard**, and **ArtistCard** components as the rest of the app.

### Notifications

- Seed data: `lib/data/notifications.ts` (10 mock notifications)
- Read/unread state: `lib/notifications-store.ts` — `useSyncExternalStore` pub/sub shared between bell dropdown and full page
- Clicking a notification in the panel navigates to `/dashboard/notifications`; unread items mark as read on click
- Full page shows expanded detail with "Open Content" links

### Analytics dashboard

15 features on `/dashboard/analytics`:

1. Headline KPI grid (8 tiles)
2. Milestones strip
3. Watch & listen hours (area chart)
4. Watchlist progress (pie chart)
5. Genre distribution (bar chart)
6. AI taste profile (radar chart)
7. Weekly activity (bar chart)
8. Peak activity hours (area chart)
9. AI match accuracy (line chart)
10. This month vs last (comparison panel)
11. Ratings distribution (bar chart)
12. Content type split (pie chart)
13. Community engagement (area chart)
14. Most watched titles (ranking list)
15. Most played artists (ranking list)

Charts use Recharts wrappers in `components/charts/` with a shared theme in `chart-theme.ts`.

### Card & carousel system

- **Cards** (`components/cards/`) — fixed slot dimensions, accent tints, hover glow
- **Carousels** (`components/carousel/`) — horizontal scroll with arrow controls and optional auto-advance
- **Section components** (`components/dashboard/`) — `ContentCarouselSection`, `MusicCarouselSection`, `CollectionGridSection`, `WatchlistGridSection`, etc. each accept a `title`, `searchPlaceholder`, and data array
- Section titles use leading emoji prefixes for visual consistency (e.g. `⏳ Continue Watching`, `🎯 Recommended For You`)

### Styling & design tokens

All design tokens live in `app/globals.css` via Tailwind v4 `@theme`:

- **Background:** dark purple `#120826`
- **Brand:** magenta `#ff00cc`, fuchsia, pink gradients
- **Glass surfaces:** `bg-glass-purple`, `bg-glass-magenta`, `bg-glass-cyan`
- **Typography scale:** `--text-heading`, `--text-title`, `--text-subtitle`
- **Shadows:** `--shadow-glow-pink`, `--shadow-card-inner`, `--shadow-section-dim`
- **Radii:** `--radius-card`, `--radius-pill`

Custom `@utility` classes provide brand gradients (`bg-gradient-brand`, `bg-gradient-blue-violet`) and chip color variants.

### Curated detail slugs

These slugs have fully bespoke detail page data:

| Entity | Slug |
|--------|------|
| Content | `jujutsu-kaisen` (+ dynamic IDs from discover pools) |
| Song | `gurenge` (+ track IDs from music pools) |
| Artist | `twice` |
| Collection | `anime-masterpieces` |
| Music collection | `kpop-essentials` |
| Community | `global-anime-community` |
| Profile | `reetam-dutta` |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn / pnpm / bun)

### 1. Install dependencies

```bash
cd aniverse-application
npm install
```

### 2. Environment variables

Copy the example file and fill in at minimum `AUTH_SECRET`:

```bash
cp .env.example .env.local
```

```env
# Required — generate with: npx auth secret
AUTH_SECRET="your-secret-here"

# Optional — enables OAuth buttons when set
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""

# Future — not used yet
DATABASE_URL=""
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Demo login

On `/login`, enter any email and a password with at least 6 characters to sign in via the demo credentials provider.

### 5. (Optional) Fetch poster images

```bash
node scripts/fetch-posters.mjs
```

Downloads anime posters (Jikan API) and song covers (iTunes) into `public/images/posters/`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build (65 static/dynamic routes) |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

---

## Key Dependencies

```json
{
  "next": "16.2.10",
  "react": "19.2.4",
  "next-auth": "^5.0.0-beta.31",
  "tailwindcss": "^4",
  "recharts": "^3.9.2",
  "lucide-react": "^1.24.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0",
  "framer-motion": "^12.42.2"
}
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **App Router + RSC** | Server components fetch mock data at render time; client components handle scroll, search input, toggles |
| **Mock data layer** | Same async accessor pattern as a real API — swap `lib/data/*.ts` implementations without touching pages |
| **Client stores for ephemeral state** | `onboarding-store` (localStorage) and `notifications-store` (in-memory pub/sub) for cross-component sync |
| **SSG detail pages** | `generateStaticParams` pre-renders known slugs; dynamic IDs built from discover pools at build time |
| **Tailwind v4 `@theme`** | Single `globals.css` source of truth for Figma tokens — no separate `tailwind.config` |
| **Shared card components** | One card design system used in carousels, grids, search results, and detail page sections |

---

## What's Next (Backend Phase)

1. **Database** — wire `DATABASE_URL` (PostgreSQL recommended) with Prisma or Drizzle
2. **API routes** — replace `lib/data/` accessors with fetch calls to your API
3. **Auth middleware** — protect `/dashboard/*` and detail mutation actions
4. **Session user** — replace `getCurrentUser()` mock with session-derived identity
5. **CRUD** — wire watchlist add/remove, collection create, review post, community join
6. **Real-time** — WebSockets or SSE for community chat and watch parties
7. **OAuth production** — configure Google/Discord apps and env vars

---

## License

Private project — all rights reserved.
