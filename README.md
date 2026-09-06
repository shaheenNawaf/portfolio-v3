# Personal Portfolio

A text-first, dark-minimal portfolio built with Astro, Tailwind CSS v4, and TypeScript — a dual-lane digital resume for someone who doesn't fit neatly into one lane.

The blue lane showcases software engineering work: a live SaaS gym management platform, an AI agricultural chatbot built on RAG pipelines and Flutter, and end-to-end builds across web and mobile. The orange lane covers four years of high-performance creator partnerships, affiliate ecosystems, and community growth across the Philippine and SEA market — $355K in transaction volume, 37M combined creator reach, and deals structured with some of SEA's biggest talent agencies.

Built for recruiters who want to see both sides of the same person.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) (static output)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Programming Language:** [TypeScript](https://www.typescript.org/)
- **Font:** Self-hosted Geist Sans + Geist Mono (variable woff2 in `public/fonts/`)
- **Asset Integrations:** Google Docs Export APIs (dynamic PDF resume delivery)

## Features

- **Dual-lane identity:** blue marks software items/links, orange marks marketing items/links. The sidebar's timeline line and active node pick up the current zone's accent.
- **Sidebar navigation:** fixed 12.75rem left rail (no name, no divider, no container — it sits flat on the page background) whose single list is a vertical timeline — line + node per entry with an accent progress line — covering both on-page sections and the `/software` + `/marketing` zone pages; below 1024px it becomes a bottom sheet (grabber + left-edge swipe-in, drag-down to dismiss) opened by a bottom-left button. At ≥1280px the rail docks 20px left of the centred content column and travels with it; at 1024–1279px it docks at the viewport edge.
- **Reference-style Works grid:** 2-column cards with hover-reveal thumbnails (hidden at rest, 70% on hover), 3D tilt, shadow bloom, sticker-peel corner, and expandable full-width case-study bodies (Problem/Solution/Impact, gallery, Live/GitHub links). Featured-first with a "See all" expander on the hub.
- **Faint section dividers:** a 1px hairline between every section, revealed on scroll with its section.
- **Scroll reveals:** IntersectionObserver-driven fade + blur + rise, staggered. No animation library.
- **Light + dark themes:** class-based, system default, persisted, FOUC-free via a blocking head script.
- **Sticker link pills:** GitHub / LinkedIn / Email / resumes as brand-tinted pills with press physics and hover preview popovers.
- **Signature quirks:** verified-badge easter egg, secret dotted-underline joke tooltips, blur-crossfade text swaps, avatar sunglasses, animated stat count-ups, GitHub public-activity heatmap popover, opt-in WebAudio UI sounds, and the Portal/GLaDOS footer egg (now on every page).
- **Category filtering:** pill filters for the work grid and experience timeline, persisted per section.
- **Book-a-call form:** minimal contact form on every route; submit opens the mail client (scheduler-ready via `hub.appointmentUrl`).
- **Reduced-motion friendly:** every animation has a `prefers-reduced-motion` off-ramp; content is fully visible with JS disabled.

## Directory Structure

```text
src/
  components/
    activity_heatmap.astro   # GitHub public-activity popover trigger
    book_call.astro          # Book-a-call form (mailto logic)
    category_switcher.astro  # Pill tab filter (projects + experience)
    hero_home.astro          # Hub hero: name, title, stickers, stats
    icon.astro               # Inline SVG sprite (no icon dependency)
    identity_hero.astro      # Zone hero (name + headline + expertise + tools)
    journey_row.astro        # Expandable experience timeline row
    secret_swap.astro        # Blur-crossfade word swap
    secret_tooltip.astro     # Dotted-underline joke tooltip
    section_divider.astro    # Faint 1px per-section divider
    section_head.astro       # Section title + subtitle + See-all button
    site_footer.astro        # Data-driven footer links + easter-egg trigger
    site_sidebar.astro       # Fixed rail + mobile drawer (replaces top nav)
    skills_grid.astro        # Grouped text skills (engineering + marketing)
    sound_toggle.astro       # UI-sound mute toggle
    stat_counter.astro       # Animated proof-band metric
    sticker_pill.astro       # Brand-tinted link pill + preview popover
    theme_toggle.astro       # Light/dark toggle
    track_index.astro        # Two-lane track picker rows
    verified_badge.astro     # Spinning rosette easter egg
    work_card.astro          # Expandable project card (grid)
    dither-kit/              # Pixel-dither canvas kit (currently unused)
  data/
    resume.ts                # Single source of truth for all content
  layouts/
    layout.astro             # Global HTML shell + SEO meta + sidebar + scripts
  pages/
    index.astro              # Hub: hero, tracks, work, experience, skills, contact
    software.astro           # Software engineering zone (blue)
    marketing.astro          # Growth marketing zone (orange)
    404.astro                # Not found page
  scripts/
    card-media.ts            # Adds .is-loaded once card thumbs decode
    count-up.ts              # Stat count-up on scroll into view
    github-activity.ts       # Lazy public-activity fetch for the heatmap
    portal.ts                # GLaDOS/Companion Cube portal easter egg
    rail.ts                  # Sidebar drawer + scroll-spy
    ready.ts                 # Shared DOM-ready helper
    reveal.ts                # IntersectionObserver scroll reveals
    theme-init.js            # Blocking head script (theme + js class)
    tilt.ts                  # 3D tilt for work cards (fine pointers only)
    ui-sound.ts              # WebAudio UI clicks + mute persistence
  styles/
    global.css               # Light/dark tokens + utilities + motion
```

## Getting Started

### 1. Installation

Clone the repository and install the project dependencies:

```bash
npm install
```

### 2. Development

Run the local development server:

```bash
npm run dev
```

The site will be available to preview locally at `http://localhost:4321`.

### 3. Build

Compile a production-ready, static build of the website:

```bash
npm run build
```
