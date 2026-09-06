# Project: z4yed-portfolio

Personal portfolio/resume site for Shaheen Al Adwani — dual-track professional (Software Engineering + Growth Marketing).

## Tech Stack
- **Framework:** Astro 6.3+ (SSG, static output)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin
- **Language:** TypeScript (strict mode, `astro/tsconfigs/strict`)
- **Runtime:** Node >=22.12.0
- **Package Manager:** npm
- **Build Tool:** Vite 7 (overridden in package.json)
- **Font:** Self-hosted Geist Sans + Geist Mono (variable woff2, in `public/fonts/`)
- **Formatter:** Prettier + `prettier-plugin-astro`

## Commands
- `npm run dev` — dev server at localhost:4321
- `npm run build` — production static build to `dist/`
- `npm run check` — `astro check` type diagnostics (must be 0 errors)
- `npm run preview` — preview production build

No lint or test framework. No CI/CD.

## Architecture: Dual-Track + Sidebar Shell
Four routes, each setting `data-track` on `<html>` to drive CSS custom properties:
- `/` (index.astro) — Hub/home, shows both tracks; sidebar timeline line uses the neutral accent
- `/software` — Blue accent, fixed track
- `/marketing` — Orange accent, fixed track
- `/404` — Not found

Navigation is a fixed left sidebar (`site_sidebar.astro`, rendered by the layout on every page),
not a top nav. It has no name/header and no divider line. Its single list is a **vertical timeline**
(hairline rail + node per entry + accent progress line via `--rail-progress`, set by `rail.ts` from
scroll-spy) containing both on-page sections (`/#work` … `/#contact`) and the zone pages
(`/software`, `/marketing`, active via server-set `aria-current`). It is **not collapsible**. On
desktop the rail is **flat with no container** (transparent bg, no shadow/border/radius, running to the
viewport bottom, top-packed) starting at the hero's top (`lg:top-16` matches `main`'s `md:pt-16`); at ≥1280px it docks 20px left of the centred 672px column
(`left: calc(50% - 21rem - 1.25rem - 12.75rem)`, unlayered so it beats `lg:left-0`); at 1024–1279px it
docks at the viewport edge with a reserved `calc(var(--rail) + 1.5rem)` body gutter; below 1024px it is an off-canvas rounded drawer with a
real surface (`--rail-bg` + soft shadow), opened by a bottom-left button, by a left-edge swipe-in,
or dismissed by dragging its grabber down. `rail.ts` owns open/close, drawer drag, and scroll-spy.
There is no `<ClientRouter />`; the site is a plain multi-page app, so `astro:after-swap` listeners
are dead code — do not add new ones.

All content lives in `src/data/resume.ts` — single source of truth for projects, experiences, contact,
skills, stats, socials, secrets, config. Pure Astro components, no framework islands
(`dither-kit/` is an unused pixel-avatar kit kept for reference). No animation/UI dependencies.

## Key Directories
- `src/data/resume.ts` — All content (Project, Experience types, featured IDs, stats, contact)
- `src/layouts/layout.astro` — Global HTML shell, SEO meta, theme init
- `src/components/` — 18 Astro components (no React/Vue/Svelte)
- `src/scripts/` — 4 client-side scripts
- `src/styles/global.css` — 430-line CSS with design tokens, semantic utilities, animations
- `public/` — Static assets (images per project, fonts, logos, favicons)

## CSS Design System (`global.css`)
- Light (`:root`) + dark (`html.dark`) themes; Tailwind `dark:` variant is class-based via
  `@custom-variant dark (&:where(.dark, .dark *))`
- Dual-track accent: `--sw` (software blue), `--mkt` (marketing orange); `--accent` per `data-track`
- Container: `.wrap` (672px, re-centred beside the fixed `--rail: 15rem` sidebar on desktop)
- Semantic classes: `.fg`, `.muted`, `.faint`, `.hairline`, `.eyebrow`, `.row-hover`, `.squash`,
  `.section-divider`, `.nudge-arrow`, `.sticker-*` tints, `.rail-link`
- Scroll reveals via `[data-reveal]` + `.is-in` (driven by `reveal.ts`), never `reveal-load` (removed)
- Respects `prefers-reduced-motion`; content is visible with JS disabled (`html.js` gating)

## Client Scripts (`src/scripts/`)
Pattern: `import { ready } from "./ready"` + `ready(fn)`. All are ES modules (deferred) except
`theme-init.js`, which is inlined blocking in `<head>` via `?raw` + `set:html` to prevent FOUC.
1. `theme-init.js` — theme class, `js` class, hub track restore (must stay blocking + dependency-free)
2. `reveal.ts` — IntersectionObserver scroll reveals
3. `rail.ts` — sidebar drawer + scroll-spy + timeline progress line (`--rail-progress`)
4. `tilt.ts` — work-card 3D tilt (fine pointers only)
5. `card-media.ts` — adds `.is-loaded` to `.card-media` once the thumb decodes (site-wide; without it thumbs stay `opacity: 0` and the skeleton pulses forever)
6. `count-up.ts` — stat count-ups
7. `github-activity.ts` — lazy public-activity fetch from `api.github.com` (fails silent/offline-safe)
8. `ui-sound.ts` — opt-in WebAudio clicks, default off
9. `portal.ts` — Portal/GLaDOS easter egg (click heart in footer, all pages)

## Content Model (`resume.ts`)
- `Category = 'software' | 'marketing' | 'systems'`
- `Project`: id, category, title, results, deliverables, media, liveUrl, repoUrl, problem/solution/impact, tags, gallery, `draft?` (drafts are filtered from every grid)
- `Experience`: id, category, company, title, date, details, gallery, video, tech
- Featured IDs per route in `featuredProjectIds` (hub shows featured first + "See all")
- Resume PDFs delivered via Google Docs Export API URLs
- `hubStats` — 5 proof metrics with `num`/`prefix`/`suffix` for count-ups (`value` is the no-JS fallback)
- `socials` — sticker pills (sidebar, hero, footer); `secrets`/`swaps` — joke tooltips and text swaps
- `skillGroups` — categorized skills for homepage (ATS-friendly)

## Branching
- `main` and `master` branches exist, currently identical
- No CI/CD, no test framework, no linting beyond Prettier
- Single contributor (solo project)

## Gotchas
- No `<ClientRouter />`: `astro:after-swap` never fires. Do not add such listeners.
- Tailwind v4 arbitrary values need a type hint: `bg-[color:var(--x)]`, never `bg-[var(--x)]`.
- `data-reveal` must never wrap the fixed sidebar or anything containing fixed descendants (`filter` breaks them).
- Work-card thumbs fade in on load and stay visible (`html.js .card-thumb` + `.is-loaded`); hover
  feedback is tilt + shadow bloom + peel, not a reveal.
- Never put an `<a>` inside a card `<summary>` (toggles the accordion in some browsers); card links live in the expanded body or after `</summary>`.
- `filterItems()` / "See all" must add `.is-in` to revealed cards or they stay invisible.
- CSP header restricts frame-src to self + facebook.com (video embeds).
- `public/` image weight is a known issue (multi-MB PNGs, 3.2 MB favicon.svg) — optimisation deferred, do not touch binaries.
