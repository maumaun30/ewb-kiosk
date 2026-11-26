# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typecheck  # Run tsc --noEmit
```

No test framework is configured.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` — Drupal CMS base URL
- `DRUPAL_API_KEY` — API key for the Drupal REST API
- `API_ENVIRONMENT` — Controls auth mode: `LOCAL` | `STAGING` | `DEV` | `UAT` | `PRODUCTION`
- `API_BASIC_USER` / `API_BASIC_PASS` — Only used for `LOCAL` and `STAGING` environments

## Architecture

This is a Next.js 16 App Router kiosk application for EastWest Bank (Philippines), designed to run on in-branch touch-screen hardware. Data is fetched from a Drupal CMS backend.

### Key Patterns

**Server Components + Suspense**: Every page composes async Server Components that fetch from Drupal, each wrapped in `<Suspense>` with a matching skeleton fallback component (e.g., `HomeSliderSkeleton`, `PromoDetailSkeleton`).

**Data fetching in `lib/`**: All API calls live here using React's `cache()` for deduplication. Auth headers are built in `lib/api-headers.ts` — `LOCAL`/`STAGING` environments use Basic Auth + API key; `DEV`/`UAT`/`PRODUCTION` use API key only. Cache strategies vary: settings use `no-store`, promos revalidate at 60s or 300s.

**Shared TypeScript types**: `lib/types.ts` holds all shared interfaces (`Promo`, `Category`, `Location`, `CardType`, `Slide`).

**Contexts**:
- `NavigationContext` — client-side path history stack powering `BackButton` (avoids relying on `window.history`)
- `SkeletonLoadingContext` — counts active skeletons via `<SkeletonTracker>` wrappers; prevents idle-overlay flicker by knowing when all data has loaded

**Idle Overlay** (`components/layout/IdleOverlay.tsx`): Kiosk-specific feature. After configurable inactivity (default 30s) shows a fullscreen branded overlay with optional video background, Philippines clock/date, and a "Touch screen to begin" prompt. After a reset timeout (default 300s), redirects to `/`.

### Route Structure

- `/` — Home: homepage slider + category grid
- `/category` — All categories listing
- `/category/[tid]` — Category detail with promo listing and filters
- `/promo/[nid]` — Promo detail with related promos

### ESLint

The config (`eslint.config.mjs`) is very strict: no `any`, no unsafe operations, typed imports, import cycle detection. Run `npm run lint` before committing — CI (`.github/workflows/ci.yml`) runs lint + typecheck on PRs to `staging`/`main` and fails on violations.
