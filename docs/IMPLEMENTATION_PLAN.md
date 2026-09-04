# Implementation Plan — Minimal Redesign

Version: 2.0
Status: Approved
Target style: Read.cv-style / dark minimalist / text-first personal portfolio (reference: jansencadorna.com)
Constraint: keep the two-lane identity (Software = blue, Marketing = orange)

---

# §0 Orchestrator Contract

- **Orchestrator:** Qwen 3.8 Max. **Workers:** Qwen 3.8 Flash.
- Dispatch tasks from §3 in phase order. Within a phase, tasks marked `∥` may run in parallel; everything else is sequential.
- After each phase gate, run `npm run build`. If it fails, route the failing task back to a worker before starting the next phase.
- Workers are **not allowed to**: add dependencies, add code comments, edit `src/data/resume.ts`, edit files outside their task's file list, or revisit any decision in §1.
- Worker prompt template:

```
You are a worker on the z4yed-portfolio minimal redesign.
First read docs/IMPLEMENTATION_PLAN.md §1 (decisions) and §2 (design spec).
Then execute TASK {ID} below exactly as written.
Rules:
- Touch only the files listed in the task.
- No code comments. No new dependencies. No new files unless the task says CREATE.
- Follow existing code style (Astro frontmatter, class:list, CSS variables via var(--*)).
- Preserve all data-driven rendering from src/data/resume.ts (do not hardcode data).
- Verify with `npm run build` before reporting done. Mid-phase build failures are acceptable ONLY if the task says so.
Report: files changed, build result, anything you could not complete.
```

- Definition of done (final): `npm run build` passes, §4 QA checklist fully checked, zero grep hits for deprecated classes.

---

# §1 Frozen Decisions (do not revisit)

| # | Area | Decision |
|---|------|----------|
| 1 | Routes | Keep 3 routes: `/` (minimal hub), `/software`, `/marketing`, plus `/404`. No route consolidation. |
| 2 | Layout | Single narrow column, `max-width: 672px`, centered, `padding-inline: 20px`. |
| 3 | Style | Soft minimal: text rows separated by hairlines, small 44px project thumbs, no glass, no blur-heavy nav, no grid/dot backgrounds, no gradients, no glows. |
| 4 | Case studies | Inline `<details>` expandable rows. All `<dialog>` modals deleted. |
| 5 | Two-tone | Accents are **text semantics only**: blue marks engineering items/links, orange marks marketing items/links. No accent-filled surfaces, no accent shadows. |
| 6 | Theme | Dark only. `html.light` tokens, theme toggle, and FOUC init script deleted. |
| 7 | Sticky bar | Deleted everywhere. Replaced by inline footer links. |
| 8 | Motion | Keep: subtle scroll reveal (existing `.reveal-section`), `<details>` chevron rotation. Delete: count-ups, blur-in hero animations, hover scale/glow, breathing/pulse effects, scroll-progress bar. |
| 9 | Easter egg | Keep `portal.ts` (GLaDOS portal). Trigger `#heart-trigger` moves into the new site footer. |
| 10 | Dither | Exactly ONE dither element survives: the static `DitherAvatar` nav monogram (`animate={false}`). Delete `DitherGradient`, `DitherSparkline`, `FeaturedGrowthViz`, `Sparkline`. |
| 11 | Portrait | Plain photo (96px, rounded, hairline border) in the hub hero only. Zone heroes have no photo. No trust-bar under portrait. No Caveat handwritten annotations anywhere. |
| 12 | Fonts | Satoshi (self-hosted, existing) + system mono exception. Delete Caveat Google Fonts links. No new fonts. |
| 13 | Contact | Keep `book_call.astro` form (mailto logic unchanged) restyled plain on all routes. No sticky CTA. |
| 14 | Data | `src/data/resume.ts` is immutable for this redesign. |
| 15 | Trust logos | Replaced by a plain text line listing `trustLogos[].alt` joined by ` · `. |

---

# §2 Design Spec

## 2.1 Color tokens (dark only)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#09090b` | Page background |
| `--surface` | `#101013` | Row hover fill only |
| `--border` | `#1f1f23` | Hairlines |
| `--border-strong` | `#32323a` | Hover borders, focus |
| `--text` | `#e9e9ec` | Primary text |
| `--text-muted` | `#9c9ca4` | Secondary text |
| `--text-faint` | `#63636c` | Meta, dates, eyebrows |
| `--radius` | `8px` | Only radius value in the system |
| `--mkt` | `#f97316` | Marketing lane marker/text |
| `--sw` | `#3b82f6` | Software lane marker/text |
| `--accent` | `var(--text)` on hub, `var(--sw)` on `[data-track="software"]`, `var(--mkt)` on `[data-track="marketing"]` | Links/CTAs on zones; neutral on hub |

Deleted tokens (must not appear anywhere): `--card-bg`, `--card-bg-2`, `--panel-bg`, `--motif`, `--grid`, `--shadow`, `--radius-card`, `--radius-btn`, `--radius-pill`, `--accent-2`, `--accent-soft`, `--accent-border`, `--mkt-2`, `--sw-2`, `--mkt-soft`, `--sw-soft`, `--mkt-border`, `--sw-border`.

## 2.2 Type scale (Satoshi only)

| Level | Spec |
|---|---|
| H1 | `28px` mobile / `32px` desktop, weight 700, `letter-spacing: -0.02em`, `line-height: 1.15` |
| H2 (section) | `20px`, weight 700, `letter-spacing: -0.01em` |
| H3 (row title) | `15px`, weight 600 |
| Body | `15px`, `line-height: 1.7`, `--text-muted` |
| Row subtitle | `13px`, `--text-muted`, truncate |
| Meta/date | `12px`, `--text-muted` or mono |
| Eyebrow/label | mono, `11px`, weight 700, `letter-spacing: 0.14em`, uppercase, `--text-faint` |
| Stat value | `20px`, weight 700, tabular-nums |
| Tags/chips | mono, `11px`, `--text-faint` |

## 2.3 Layout rules

- One column, `.wrap` = `max-width: 672px; margin-inline: auto; padding-inline: 1.25rem`.
- Nav: fixed top, hairline bottom border, `backdrop-filter: blur(8px)` with `color-mix(in srgb, var(--bg) 85%, transparent)`. Height 56px. No noise texture, no rim highlight, no progress bar.
- Sections separated by `mt-20` (80px) and/or a top hairline. No filled section containers.
- Rows: `border-bottom: 1px solid var(--border)`, `padding-block: 16px`, hover fill `--surface`.
- No shadows anywhere. No `backdrop-blur` except nav.

## 2.4 Accent rules

- Hub (`data-track="hub"`): neutral. Lane colors appear only as row markers/dots (8px circle: blue for software items, orange for marketing items) and on the two track-index rows.
- Zones: `--accent` = lane color. Used for: section "Book intro call" links, bullet dots in fit lists, expanded-row metric text. Never as background fill, never as box-shadow.
- `::selection` uses `color-mix(in srgb, var(--accent) 30%, transparent)`.

## 2.5 Row anatomy (the two reusable patterns)

**Work row** (`work_row.astro`, `<details>`):

```
[44px thumb | title ................ date(mono)]
[           | one-line outcome .............. ∨]
--- when open ---
  role · metric (lane color)
  Overview / Problem / Solution / Impact (whichever exist)
  tags (mono) · gallery thumbs (h-24) · video if media.type==="video"
  links: Live ↗ · GitHub ↗ · Case study ↗
```

**Journey row** (`journey_row.astro`, `<details>`):

```
[36px initials tile | title ................ date(mono)]
[                   | company · location ........... ∨]
--- when open ---
  description paragraph
  • achievement bullets (lane-colored dot)
  tech chips (mono)
```

Thumbs: `media.thumbnail ?? media.url` when present; otherwise a bordered initials tile (first letters of title, mono).

## 2.6 Motion rules

- Keep `.reveal-section` fade (0.25s) and `prefers-reduced-motion` overrides.
- Chevron rotation on `details[open]` (200ms).
- Nothing animates on scroll besides reveals. No JS-driven nav interpolation.

---

# §3 Task Graph

## Phase 1 — Foundation  `T01 → (T02 ∥ T03 ∥ T04) → GATE: npm run build passes`

### T01 — Rewrite global.css (design tokens)

**File:** `src/styles/global.css` (full replacement)

**Operations:** Replace the entire file with the structure below. Keep the three existing Satoshi `@font-face` blocks verbatim at the top, then:

```css
@import "tailwindcss";

@layer base {
  :root {
    --bg: #09090b;
    --surface: #101013;
    --border: #1f1f23;
    --border-strong: #32323a;
    --text: #e9e9ec;
    --text-muted: #9c9ca4;
    --text-faint: #63636c;
    --radius: 8px;
    --mkt: #f97316;
    --sw: #3b82f6;
    --accent: var(--text);
  }
  html[data-track="software"] { --accent: var(--sw); }
  html[data-track="marketing"] { --accent: var(--mkt); }

  html { scroll-behavior: smooth; }
  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: "Satoshi", system-ui, sans-serif;
  }
  h1, h2, h3 { text-wrap: balance; }
  ::selection { background-color: color-mix(in srgb, var(--accent) 30%, transparent); }
  .font-mono {
    font-family: ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace;
  }
  a:focus-visible, button:focus-visible, summary:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

@layer components {
  .wrap { max-width: 672px; margin-inline: auto; padding-inline: 1.25rem; }
  .fg { color: var(--text); }
  .muted { color: var(--text-muted); }
  .faint { color: var(--text-faint); }
  .hairline { border-color: var(--border); }
  .eyebrow {
    font-family: ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
  }
  .accent-marketing { color: var(--mkt); }
  .accent-software { color: var(--sw); }
  .row-hover { border-radius: var(--radius); transition: background-color 150ms ease; }
  .row-hover:hover { background-color: var(--surface); }
  .stat-number { font-variant-numeric: tabular-nums; }
  .skip-link {
    position: absolute; top: -100px; left: 1rem; z-index: 200;
    padding: 0.5rem 0.875rem; background-color: var(--text); color: var(--bg);
    border-radius: var(--radius); font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.12em; text-decoration: none;
    transition: top 0.15s ease;
  }
  .skip-link:focus { top: 1rem; }
  .book-label {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;
  }
  .book-field {
    width: 100%; border-radius: var(--radius); border: 1px solid var(--border);
    background: transparent; color: var(--text); padding: 0.65rem 0.85rem;
    font-size: 0.875rem; transition: border-color 0.2s ease;
  }
  .book-field::placeholder { color: var(--text-faint); }
  .book-field:focus { outline: none; border-color: var(--border-strong); }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 10px; }
}

details > summary { list-style: none; cursor: pointer; }
details > summary::-webkit-details-marker { display: none; }
.row-chevron { transition: transform 200ms ease; color: var(--text-faint); }
details[open] > summary .row-chevron { transform: rotate(180deg); }

.reveal-section {
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}
.reveal-section.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal-section, .row-chevron, .skip-link, .book-field { transition: none !important; }
  .reveal-section { opacity: 1; transform: none; }
  html { scroll-behavior: auto; }
}
```

**Deleted (must not remain):** `html.light` block, per-track `--motif`/radius overrides, `body::before` grid/dots, `body::after` vignette, `.surface`, `.surface-2`, `.panel`, `.zone-surface`, `.zone-heading`, `.zone-motif`, `.track-accent*`, `.track-btn`, `.track-ring`, `.floating-glass`, `.project-card:hover`, `.radius-*`, `dialog`/`.modal` styles, theme-toggle display rules, `#trust-bar` filter rule, all keyframes except none (reveals are transition-based).

**Do not touch:** Satoshi `@font-face` blocks (keep byte-for-byte).
**Acceptance:** file matches spec; no token from the deleted list remains.
**Note:** pages will look broken after this task until later phases land. That is expected; build must still pass.

---

### T02 — Layout shell: dark-only, delete theme + main.ts

**Files:** `src/layouts/layout.astro`; DELETE `src/components/theme_toggle.astro`, `src/scripts/theme-init.ts`, `src/scripts/main.ts`

**Operations:**
1. In `layout.astro`: remove the `ThemeToggle` import, the `hideToggle` prop, `{!hideToggle && <ThemeToggle />}`, the `<script src="../scripts/theme-init.ts">` tag, the `<script src="../scripts/main.ts">` tag, the `selectionClass` const and its use in `<html class:list>` (selection is now global CSS), and the Caveat `<link rel="preconnect">`/`<link ... family=Caveat>` tags.
2. Keep: all meta/OG/twitter/canonical/favicon/sitemap tags, `data-track={track}`, skip-link, `<slot />`, `track` prop with default `"hub"`.
3. Delete the three files listed above.

**Do not touch:** pages still pass `hideToggle={true}` — leave those props alone; Astro ignores unknown props. They are removed when pages are rewritten.
**Build note:** build FAILS after this task until T03/T04 land (site_nav/zone_nav import ThemeToggle). This is acceptable mid-phase.
**Acceptance:** no reference to theme, Caveat, or main.ts remains in the layout; the three files are deleted.

---

### T03 — site_nav.astro slim-down

**File:** `src/components/site_nav.astro`

**Read first:** current file; §2.3 nav spec.

**Operations:**
1. Keep: `DitherAvatar` import + usage but set `animate={false}` (both instances); the three `navLinks`; mobile overlay structure and its focus-trap script logic.
2. Restyle header: fixed top, 56px height, `border-bottom: 1px solid var(--border)`, `background-color: color-mix(in srgb, var(--bg) 85%, transparent)`, `backdrop-filter: blur(8px)`. Inner container uses `.wrap` width (672px).
3. Left: monogram (20px) + name wordmark (`text-sm font-bold`).
4. Center links (desktop ≥768px): `text-[13px] muted hover:text` plain links; keep `is-active` → `fg` color only (no underline bar).
5. Right: replace the filled `.nav-cta` with a plain text link `text-[13px] font-semibold fg` labeled `Book a call` with a `→` character. Remove ThemeToggle usage.
6. Mobile overlay: same links `text-2xl font-semibold`, CTA becomes plain `text-lg font-semibold fg` link to `#contact`. Remove the accent-filled button styling.
7. Script: delete the `--np` hero IntersectionObserver logic and the scroll-progress computation; keep the mobile menu open/close/focus-trap logic and `astro:after-swap` handler. Delete `.nav-progress-track`/`.nav-progress-bar` markup.
8. `<style>`: delete `::before` noise, `::after` rim, `--np`/`--scroll-progress` usages, progress bar styles, `.nav-cta` glow styles. Keep reduced-motion block adapted to what remains.

**Acceptance:** nav renders name + 3 links + book link; no blur > 8px, no noise, no progress bar, no ThemeToggle; mobile overlay opens/closes with focus trap.

---

### T04 — zone_nav.astro slim-down

**File:** `src/components/zone_nav.astro`

**Operations:**
1. Remove the `ThemeToggle` import and its usage.
2. Replace the three `surface` pill buttons with plain text links:
   - `← Home` (href `/`): `text-[13px] muted hover:fg`
   - `Switch to {otherLabel}` (hidden below sm, `→ {otherLabel}` on mobile): `text-[13px] faint hover:fg`
   - `Book intro call` (href `#book-call`): `text-[13px] font-semibold` colored `var(--sw)` on software / `var(--mkt)` on marketing (keep the existing `mode` prop logic)
3. Layout: `flex justify-between items-center py-6`, inside the page's `.wrap`.

**Acceptance:** nav shows 3 text links, lane-colored booking link, no ThemeToggle, no pills.

**GATE P1:** `npm run build` passes. No theme/Caveat references anywhere (`rg -i "caveat|theme-toggle|theme-init|light" src/` → only unrelated hits allowed).

---

## Phase 2 — New primitives  `(T05 ∥ T06 ∥ T07 ∥ T08) → GATE`

All four are new files. None has consumers yet, so order is free.

### T05 — CREATE work_row.astro

**File:** CREATE `src/components/work_row.astro`

**Props:** identical to current `project_card.astro` Props (`id, title, date, role, color, category, description, results?, deliverables?, gallery?, tags?, media?, liveUrl?, repoUrl?, problem?, solution?, impact?, caseStudyHref?`). Copy the interface verbatim from `project_card.astro`.

**Frontmatter logic:**
- `thumb = media?.type === "video" ? media.thumbnail ?? undefined : media?.url`
- `accentVar = category === "marketing" ? "var(--mkt)" : category === "software" ? "var(--sw)" : "var(--text)"`
- `metric = results ?? impact`
- `listItems = category === "marketing" ? deliverables : tags` (same rule as project_card)

**Markup:** a `<details class="group border-b hairline" data-project-card={id} data-category={category}>` containing (the `data-project-card` attribute is required — it is the filter itemSelector target):

`<summary class="row-hover flex items-center gap-4 py-4 px-2 -mx-2">`:
1. Thumb: `thumb ? <img src={thumb} alt={title} loading="lazy" class="w-11 h-11 rounded-[var(--radius)] object-cover border hairline shrink-0">` : initials tile `<span class="w-11 h-11 rounded-[var(--radius)] border hairline grid place-items-center font-mono text-[10px] faint shrink-0">{first letters of each word of title, max 2}</span>`
2. Middle `div.flex-1.min-w-0`:
   - line 1: `flex items-baseline justify-between gap-3` → `<h3 class="text-[15px] font-semibold fg truncate">{title}</h3>` + `<span class="font-mono text-[11px] faint shrink-0">{date}</span>`
   - line 2: `<p class="text-[13px] muted truncate">{metric ?? description}</p>`
3. Chevron svg (`class="row-chevron w-4 h-4 shrink-0"`, path `M6 9l6 6 6-6`, stroke currentColor).

Expanded content `<div class="pb-6 pt-2 pl-[60px] space-y-4 text-[14px]">`:
1. `<p class="text-[12px] faint">{role}</p>`
2. if `metric`: `<p class="text-[14px] font-semibold" style={`color: ${accentVar}`}>{metric}</p>`
3. Overview block: if `problem || solution || impact` exist, render labeled blocks for each that exists (`<p class="eyebrow mb-1">Problem</p><p class="muted leading-[1.7]">…</p>`); else render `<p class="muted leading-[1.7]">{description}</p>`
4. if `listItems.length`: mono tag row `flex flex-wrap gap-1.5` → `<span class="px-2 py-0.5 border hairline rounded-[var(--radius)] font-mono text-[11px] faint">{item}</span>` (max 8)
5. if `media?.type === "video"`: `<video src={media.url} poster={media.thumbnail} controls class="w-full rounded-[var(--radius)] border hairline"></video>`
6. if `gallery.length`: `flex flex-wrap gap-2` → `<img src={g} loading="lazy" class="h-24 w-auto rounded-[var(--radius)] border hairline">`
7. Links row `flex gap-5 text-[13px] font-semibold`: `liveUrl → "Live ↗"`, `repoUrl → "GitHub ↗"`, `caseStudyHref → "Case study ↗"` — each `target="_blank" rel="noopener noreferrer"`, color `accentVar`.

**Acceptance:** renders for all 13 projects without errors when consumed; no images above the summary except the 44px thumb; zero filled accent surfaces.

---

### T06 — CREATE journey_row.astro

**File:** CREATE `src/components/journey_row.astro`

**Props:** mirror current `experience_card.astro` Props: `id, category, title, company, date, location, description, details, gallery?, video?, tech?` (copy from `experience_card.astro`; `experienceTech` lookup is done by the consumer, so include `tech?: readonly string[]` as a prop).

**Frontmatter:** `accentVar` same lane rule as T05; `initials` = first letter of first two words of `company`, uppercased.

**Markup:** `<details class="group border-b hairline" data-category={category}>`:

`<summary class="row-hover flex items-center gap-4 py-4 px-2 -mx-2">`:
1. `<span class="w-9 h-9 rounded-[var(--radius)] border hairline grid place-items-center font-mono text-[10px] muted shrink-0">{initials}</span>`
2. Middle: line 1 `h3 text-[15px] font-semibold fg truncate` = `{title}` + right `<span class="font-mono text-[11px] faint shrink-0">{date}</span>`; line 2 `p text-[13px] muted truncate` = `{company} · {location}`
3. Chevron (same as T05).

Expanded `<div class="pb-6 pt-2 pl-[52px] space-y-3">`:
1. `<p class="text-[14px] muted leading-[1.7]">{description}</p>`
2. bullets: `ul space-y-2` → `li flex items-start gap-2 text-[14px] muted leading-[1.7]` with `<span class="mt-[7px] w-1 h-1 rounded-full shrink-0" style={`background-color: ${accentVar}`}>`
3. if `tech?.length`: mono chips like T05.4
4. if `video`: `<video src={video} controls class="w-full rounded-[var(--radius)] border hairline">`
5. if `gallery?.length`: image row like T05.6

**Acceptance:** renders all 8 experiences; expand/collapse native; no JS required.

---

### T07 — CREATE track_index.astro

**File:** CREATE `src/components/track_index.astro`

**Data:** import `hubStats` from `../data/resume`. Use `hubStats[4]` (2 SaaS) for the software sub and `hubStats[0]` ($355K+) for the marketing sub.

**Markup:**

```astro
<section id="tracks" class="mt-20">
  <h2 class="text-xl font-bold tracking-tight">Tracks</h2>
  <p class="mt-1 text-[13px] muted">Two lanes, one owner. Pick the seat you're hiring for.</p>
  <div class="mt-6 border-t hairline">
    <a href="/software" class="group flex items-center gap-4 py-5 border-b hairline row-hover px-2 -mx-2">
      <span class="w-2 h-2 rounded-full shrink-0" style="background-color: var(--sw)"></span>
      <span class="font-mono text-[11px] faint w-7 shrink-0">01</span>
      <span class="flex-1 min-w-0">
        <span class="block text-[15px] font-semibold fg">Software Engineering</span>
        <span class="block text-[13px] muted truncate">{hubStats[4].value} {hubStats[4].label.toLowerCase()}</span>
      </span>
      <span class="text-[13px] faint group-hover:text-[color:var(--text)] transition-colors shrink-0">→</span>
    </a>
    (identical second row for /marketing: dot var(--mkt), 02, "Growth Marketing", hubStats[0] value + "transaction volume in 4 months")
  </div>
</section>
```

**Acceptance:** two rows, lane-colored dots, links work, no images/canvas.

---

### T08 — CREATE site_footer.astro

**File:** CREATE `src/components/site_footer.astro`

**Data:** import `name, contact, resumes` from `../data/resume`.

**Markup:**

```astro
<footer class="mt-24 border-t hairline">
  <div class="wrap py-10 flex flex-col gap-5 text-[13px]">
    <nav class="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
      <a href={`mailto:${contact.email}`} class="muted hover:text-[color:var(--text)] transition-colors">Email</a>
      <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">LinkedIn ↗</a>
      <a href={resumes.software} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">SWE Resume ↗</a>
      <a href={resumes.marketing} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">MKT Resume ↗</a>
    </nav>
    <div class="flex flex-wrap items-center justify-between gap-3 text-[12px]">
      <span class="faint">© {new Date().getFullYear()} {name} · {contact.location}</span>
      <span
        id="heart-trigger"
        class="font-mono text-[10px] font-bold faint uppercase tracking-widest cursor-pointer hover:text-red-500 transition-colors"
        role="button"
        tabindex="0"
        aria-label="Easter egg"
      >made with ❤ -shaheen</span>
    </div>
  </div>
</footer>
```

**Acceptance:** `#heart-trigger` exists exactly once per page that includes the footer; portal.ts can bind to it.

**GATE P2:** build passes; the four new files exist and are internally consistent with §2.

---

## Phase 3 — Hub  `(T09 ∥ T10) → T11 → GATE`

### T09 — hero_home.astro rewrite (text hero)

**File:** `src/components/hero_home.astro` (full replacement)

**Data:** `name, contact, hub, hubStats` from `../data/resume`.

**Markup:**

```astro
<section id="hero" class="pt-28 md:pt-36">
  <div class="flex items-start justify-between gap-8">
    <div class="min-w-0">
      <p class="eyebrow">{name} · {contact.location}</p>
      <h1 class="mt-3 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-[1.15]">
        {hub.position}
      </h1>
      <p class="mt-5 text-[15px] muted leading-[1.7] max-w-[52ch]">{hub.subtext}</p>
      <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
        <a href="#contact" class="font-semibold fg hover:opacity-70 transition-opacity">{hub.ctaPrimary} →</a>
        <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">LinkedIn ↗</a>
        <a href={`mailto:${contact.email}`} class="muted hover:text-[color:var(--text)] transition-colors">Email</a>
      </div>
    </div>
    <img
      src={contact.profileImage}
      alt={`Portrait of ${name}`}
      width="96" height="96"
      class="w-20 h-20 md:w-24 md:h-24 rounded-[var(--radius)] object-cover border hairline shrink-0"
      loading="eager"
    />
  </div>

  <div class="mt-12 pt-8 border-t hairline grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
    {hubStats.map((s) => (
      <div class="flex flex-col gap-1">
        <span class="stat-number text-xl font-bold fg">{s.value}</span>
        <span class="text-[12px] muted leading-snug">{s.label}</span>
      </div>
    ))}
  </div>
</section>
```

**Delete entirely:** the `<style>` block (all hero keyframes), all Caveat annotations, trust bar, word-splitting animation logic.
**Acceptance:** static text hero, portrait right, 5 plain metrics, no `data-value`, no animation classes, no Caveat.

---

### T10 — category_switcher.astro reskin

**File:** `src/components/category_switcher.astro`

**Operations:**
1. Keep: Props interface, data attributes, the `<script>` filter logic (filterItems, ARIA states, keyboard nav), `astro:after-swap` init.
2. Replace markup: container becomes `flex gap-5` (role tablist preserved); buttons become plain text: `class="category-btn text-[13px] muted pb-1 transition-colors"`, active state styled by CSS below. Remove the `.category-indicator` div.
3. Replace `<style>` with:

```css
.category-btn { background: none; border: none; cursor: pointer; white-space: nowrap; border-bottom: 1.5px solid transparent; }
.category-btn:hover { color: var(--text); }
.category-btn[aria-selected="true"] { color: var(--text); border-bottom-color: var(--border-strong); }
```

4. Script: delete all `updateIndicator` code and the resize listener; keep filtering + ARIA + keyboard nav. Remove the opacity/scale animation in `filterItems` (hide with `display:none` immediately).

**Acceptance:** filters still work for projects and experiences lists; looks like plain text tabs.

---

### T11 — index.astro rewrite (hub assembly)

**File:** `src/pages/index.astro` (full replacement)

**Read first:** T05–T10 outputs; current `index.astro` for the scripts at the bottom.

**Frontmatter imports:** `BaseLayout, SiteNav, HeroHome, TrackIndex, CategorySwitcher, WorkRow, JourneyRow, SkillsGrid, BookCall, SiteFooter` + `{ name, projects, experiences, experienceTech, hub }` from data.

**Structure:**

```astro
<BaseLayout title={`${name} | Full-stack Engineer & Growth Marketer`} description="..." track="hub">
  <SiteNav />
  <main id="main" class="wrap">
    <HeroHome />
    <TrackIndex />

    <section id="work" class="mt-20 reveal-section">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold tracking-tight">Selected work</h2>
          <p class="mt-1 text-[13px] muted">Products, campaigns, and systems with measurable outcomes.</p>
        </div>
      </div>
      <div class="mt-6"><CategorySwitcher /></div>
      <div class="mt-4 border-t hairline" data-project-grid>
        {projects.map((p) => <WorkRow {...p} />)}
      </div>
    </section>

    <section id="experience" class="mt-20 reveal-section">
      <h2 class="text-xl font-bold tracking-tight">Experience</h2>
      <p class="mt-1 text-[13px] muted">Professional progression across engineering and growth.</p>
      <div class="mt-6"><CategorySwitcher targetSelector="[data-experience-list]" itemSelector="[data-experience-row]" storageKey="experience-category" categories={[{id:"all",label:"All"},{id:"software",label:"Software"},{id:"marketing",label:"Growth"}]} /></div>
      <div class="mt-4 border-t hairline" data-experience-list>
        {experiences.map((exp) => (
          <div data-experience-row data-category={exp.category}>
            <JourneyRow {...exp} tech={experienceTech[exp.id] ?? []} />
          </div>
        ))}
      </div>
    </section>

    <SkillsGrid />

    <section id="contact" class="mt-20 reveal-section">
      <p class="eyebrow">{hub.status}</p>
      <h2 class="mt-3 text-xl font-bold tracking-tight">Let's talk</h2>
      <p class="mt-1 text-[13px] muted">Send a short note or book a time. Replies within 24–48 hours.</p>
      <div class="mt-8"><BookCall defaultInterest="hybrid" /></div>
    </section>
  </main>
  <SiteFooter />
</BaseLayout>

<script src="../scripts/index-page.ts"></script>
<script src="../scripts/portal.ts"></script>
```

**Notes for the worker:**
- Astro components do not forward arbitrary HTML attributes — that is why each `JourneyRow` is wrapped in a `<div data-experience-row data-category>` above. Do not attempt to pass `data-*` props into components.
- The work list needs no wrapper: `WorkRow`'s root `<details>` already carries `data-project-card` and `data-category` (see T05), matching `CategorySwitcher`'s default selectors.
- Remove `hideToggle` prop usage (layout no longer declares it).
- Delete: ProofBand, TrackFork, ProjectCard grid, hardcoded Rivalry featured card, ProjectModal list, WhyHire, StickyBar, ExperienceTimeline usage, the old contact section markup, `#hero-trigger` div.

**Acceptance:** hub renders hero → tracks → work rows (13) → experience rows (8) → skills → contact form → footer; filters work on both lists; easter egg binds; no modals, no sticky bar.

**GATE P3:** build passes; hub complete and navigable at `npm run dev`.

---

## Phase 4 — Zones  `(T12 ∥ T13) → (T14 ∥ T15) → T16 → GATE`

### T12 — identity_hero.astro rewrite (text version)

**File:** `src/components/identity_hero.astro` (full replacement)

**Props:** keep interface but REMOVE `image`. Keep: `name, headline, summary, skills, contact, mode, impactBadge?, resumeUrl?`.

**Markup:**

```astro
<header class="pt-4">
  {impactBadge && <p class="eyebrow">{impactBadge}</p>}
  <h1 class="mt-3 text-[28px] md:text-[32px] font-bold tracking-[-0.02em] leading-[1.15]">{headline}</h1>
  <p class="mt-5 text-[15px] muted leading-[1.7] max-w-[60ch]">{summary}</p>
  <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
    <a href="#book-call" class="font-semibold transition-opacity hover:opacity-70" style={`color: var(--accent)`}>Book intro call →</a>
    <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">LinkedIn ↗</a>
    {resumeUrl && <a href={resumeUrl} target="_blank" rel="noopener noreferrer" class="muted hover:text-[color:var(--text)] transition-colors">Resume ↗</a>}
  </div>
  <div class="mt-10 border-t hairline pt-6">
    <p class="eyebrow mb-3">Expertise</p>
    <p class="text-[13px] muted leading-relaxed">{skills.join(" · ")}</p>
  </div>
  <div class="mt-6 border-t hairline pt-6">
    <p class="eyebrow mb-3">Tools</p>
    <p class="text-[13px] muted leading-relaxed">{tools list joined by " · "}</p>
  </div>
</header>
```

Keep the existing hardcoded tools lists per mode (Cursor & VS Code… / Meta Business Suite…) as a `const tools = mode === "software" ? [...] : [...]` array plus the shared `"Claude, ChatGPT & n8n"` entry.
**Delete:** photo, zone-surface/zone-motif wrappers, chips, filled buttons.
**Acceptance:** pure text header, lane-colored booking link via `--accent`, no image prop consumers break (T14/T15 update call sites).

---

### T13 — book_call.astro reskin

**File:** `src/components/book_call.astro`

**Operations:**
1. Outer `<section>`: replace `zone-surface relative overflow-hidden p-8 md:p-10` with plain `<section id={id} class="pt-2" data-appointment-url=... data-contact-email=...>`. Delete the radial-gradient overlay div.
2. Heading: `h2` → `text-xl font-bold tracking-tight` (remove `zone-heading`); subtitle stays `muted text-[13px]`.
3. Submit button: replace `track-btn ... rounded-xl` classes with `inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] border hairline text-[13px] font-semibold fg hover:border-[color:var(--border-strong)] transition-colors`.
4. Inputs keep `.book-field` / `.book-label` (already restyled in T01). Remove `track-ring` classes.
5. Keep the entire `<script>` block unchanged (validation, mailto, appointmentUrl logic).

**Acceptance:** form works identically (submit opens mailto), looks plain, no glow/wash.

---

### T14 — software.astro rewrite

**File:** `src/pages/software.astro` (full replacement)

**Frontmatter:** same data queries as current file (featured/moreProjects/softwareExp) plus `experienceTech`; imports `BaseLayout, ZoneNav, IdentityHero, WorkRow, JourneyRow, BookCall, SiteFooter` + `{ trustLogos }`.

**Structure:**

```astro
<BaseLayout title="Shaheen | Software Engineering" description="..." track="software">
  <main id="main" class="wrap pt-24 md:pt-28 pb-4">
    <ZoneNav mode="software" />
    <IdentityHero name={name} headline="Full-stack Software Engineer & Project Manager" summary={softwareSummary} skills={softwareSkills} contact={contact} mode="software" impactBadge="Dean's List · Ateneo de Davao" resumeUrl={resumes.software} />
    <p class="mt-6 text-[12px] faint">Partnerships include: {trustLogos.map((l) => l.alt).join(" · ")}</p>

    <section class="mt-16">
      <h2 class="text-xl font-bold tracking-tight">Flagship builds</h2>
      <p class="mt-1 text-[13px] muted">Depth over volume. Live systems and real users.</p>
      <div class="mt-6 border-t hairline">
        {featured.map((p) => p && <WorkRow {...p} />)}
      </div>
    </section>

    <section class="mt-16">
      <h2 class="text-xl font-bold tracking-tight">Good fit when you need</h2>
      <ul class="mt-5 space-y-3">
        {softwareFit.map((item) => (
          <li class="flex items-start gap-3 text-[14px] muted leading-[1.7]">
            <span class="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style="background-color: var(--sw)"></span>
            {item}
          </li>
        ))}
      </ul>
    </section>

    {moreProjects.length > 0 && (
      <section class="mt-16">
        <h2 class="text-xl font-bold tracking-tight">More projects</h2>
        <div class="mt-6 border-t hairline">{moreProjects.map((p) => <WorkRow {...p} />)}</div>
      </section>
    )}

    <section class="mt-16">
      <h2 class="text-xl font-bold tracking-tight">Engineering history</h2>
      <div class="mt-6 border-t hairline">
        {softwareExp.map((exp) => <JourneyRow {...exp} tech={experienceTech[exp.id] ?? []} />)}
      </div>
    </section>

    <section id="book-call" class="mt-20">
      <BookCall defaultInterest="software" title="Book a lab intro" subtitle="Talk product, stack, and how I ship. Full-time preferred." />
    </section>
  </main>
  <SiteFooter />
</BaseLayout>
```

**Delete:** `#hero-trigger` div, trust-strip card with logos, `zone-surface` fit panel, StickyBar, ProjectModal list, `hideToggle`, `max-w-4xl` shell (`.wrap` replaces it), `hub` import if unused.
**Acceptance:** zone renders nav → text hero → trust line → flagship rows → fit list → more rows → history rows → book form → footer; all blue accents via `--accent`/`--sw`.

---

### T15 — marketing.astro rewrite

**File:** `src/pages/marketing.astro` (full replacement)

Identical structure to T14 with these substitutions: `mode="marketing"`, `track="marketing"`, title `"Shaheen | Creator Partnerships"`, `headline="Growth Marketing"`, `impactBadge="$355K+ Managed Volume in 4 months"`, `resumeUrl={resumes.marketing}`, summaries/skills/fit from marketing exports, section titles `Flagship campaigns` / `More campaigns` / `Professional history`, BookCall `defaultInterest="marketing"` `title="Book a studio intro"` `subtitle="Talk growth systems, creator ops, and SEA markets. Full-time preferred."`, fit bullets use `var(--mkt)`, trust copy: `Creator partnerships, community systems, and performance plays that move volume.`

**Acceptance:** mirror of T14 with orange lane.

---

### T16 — Dead component purge

**Files:** DELETE all of:
- `src/components/sticky_bar.astro`
- `src/components/project_card.astro`
- `src/components/project_modal.astro`
- `src/components/experience_card.astro`
- `src/components/experience_timeline.astro`
- `src/components/proof_band.astro`
- `src/components/track_fork.astro`
- `src/components/why_hire.astro`
- `src/components/work_card.astro`
- `src/components/project_showcase.astro`
- `src/components/react/Sparkline.tsx`
- `src/components/react/FeaturedCard.tsx`
- `src/components/react/FeaturedGrowthViz.tsx`
- `src/components/react/DitherSparkline.tsx`
- `src/components/dither-kit/gradient.tsx`

**Pre-check (worker must verify before deleting):** `rg "<StickyBar|ProjectCard|ProjectModal|ExperienceCard|ExperienceTimeline|ProofBand|TrackFork|WhyHire|DitherGradient|DitherSparkline|FeaturedCard|FeaturedGrowthViz|Sparkline" src/pages src/components src/layouts` must return zero hits outside the files being deleted. If any hit remains, fix the importer first.
**Keep:** `dither-kit/avatar.tsx`, `dither-kit/palette.ts`, `dither-kit/pixel.ts`, `dither-kit/lib.ts` (avatar used by site_nav).
**Acceptance:** `npm run build` passes with the files gone.

**GATE P4:** build passes; all three routes render text-first.

---

## Phase 5 — Scripts, remaining reskins, docs  `(T17 ∥ T18 ∥ T19 ∥ T20) → GATE`

### T17 — index-page.ts slim-down

**File:** `src/scripts/index-page.ts`

**Operations:** delete `initCountUp` and `initTrustBarObserver` functions and their calls in `initIndex`. Keep `initReveal`, `initScrollSpy`, the DOMContentLoaded/`astro:after-swap` bootstrap, `prefersReduced` guard.
**Acceptance:** reveals + scrollspy still run; no reference to `sticky-cta` or `.stat-number`.

---

### T18 — skills_grid.astro reskin

**File:** `src/components/skills_grid.astro`

**Data:** `skillGroups` from `../data/resume` (structure: `engineering` and `marketing` groups of `{ label, items }`-style subgroups — read the current component to confirm exact shape).

**Markup:**

```astro
<section id="skills" class="mt-20 reveal-section">
  <h2 class="text-xl font-bold tracking-tight">Skills</h2>
  <div class="mt-6 border-t hairline">
    <div class="py-6 border-b hairline">
      <p class="eyebrow mb-4">Engineering</p>
      <div class="space-y-3">
        {each engineering subgroup:
          <p class="text-[14px] leading-relaxed"><span class="fg font-semibold">{label}:</span> <span class="muted">{items.join(", ")}</span></p>}
      </div>
    </div>
    <div class="py-6">
      <p class="eyebrow mb-4">Marketing</p>
      (same pattern for marketing subgroups)
    </div>
  </div>
</section>
```

**Delete:** all brand icons, chip gloss, hover glows, two-card layout.
**Acceptance:** plain grouped text; every skill from `skillGroups` still present.

---

### T19 — 404.astro reskin

**File:** `src/pages/404.astro` (full replacement)

**Structure:** `BaseLayout` (track hub, no hideToggle) → `SiteNav` → centered `<main id="main" class="wrap min-h-[70dvh] flex items-center justify-center">` containing: eyebrow `404` → h1 `Page not found` (`text-[28px] font-bold`) → muted copy → text links row (`Back to home →`, `LinkedIn ↗`, `Resume ↗`, `text-[13px]`, gap-6) → mono lane row (`Engineering / Growth / email`, `text-[12px] font-mono faint`) → `SiteFooter`.
**Delete:** StickyBar, track-btn/panel button styles, `hideToggle`.
**Acceptance:** plain centered 404 with working links and footer easter-egg trigger.

---

### T20 — Docs + README update

**Files:** `docs/02_IA.md`, `docs/03_DESIGN_SYSTEM.md`, `docs/08_DESIGN_DECISIONS.md`, `README.md`

**Operations:**
1. `03_DESIGN_SYSTEM.md`: replace Colors/Typography/Components/Cards sections with §1–§2 of this plan (token table, type scale, row-based components, "no large screenshots, no hover elevation, no shadows"). Keep the one-font rule; note mono exception.
2. `02_IA.md`: update Reading Pattern (text-first scanning, rows over cards), Section 3 (rows + inline expansion instead of tabs/screenshots), Non-Goals unchanged, Navigation Strategy (fixed hairline bar, no glass interpolation).
3. `08_DESIGN_DECISIONS.md`: append Decisions 010–016 reflecting §1 items 3, 4, 5, 6, 8, 10, 11 with one-line reasons.
4. `README.md`: rewrite Features/Directory Structure to match the v2 component list (work_row, journey_row, track_index, site_footer; no modals/sticky/dither-viz); keep tech stack + getting started.
5. Carry forward both items from `docs/TODO.md` unchanged.

**Acceptance:** docs no longer contradict the shipped design; no mention of deleted components.

**GATE P5:** build passes; `npm run dev` spot-check all 4 routes.

---

## Phase 6 — QA (orchestrator-run, no worker dispatch unless fixes needed)

Run `npm run build`, then `npm run dev`, then execute §4 below. Any failure → create a fix task scoped to the offending file(s), dispatch to a worker, re-run the checklist item.

---

# §4 QA Checklist

**Build & residue**
- [ ] `npm run build` passes with zero warnings about missing imports
- [ ] `rg "surface|panel|zone-|track-btn|track-accent|floating-glass|radius-card|radius-btn|radius-pill|--card-bg|--panel-bg|--motif" src/` → zero hits
- [ ] `rg -i "caveat|theme-toggle|theme-init|html.light|sticky-cta|data-modal-id|data-project-card|data-project-modal" src/` → zero hits
- [ ] `rg "countup|count-up" src/` → zero hits
- [ ] Only one `DitherAvatar` usage site (site_nav), `animate={false}`
- [ ] `rg "<dialog" src/` → zero hits

**Visual per route (375px + 1440px)**
- [ ] Single 672px column everywhere; no glass, no shadows, no gradients, no accent fills
- [ ] Hub: hero text + 96px portrait + 5 static metrics → tracks rows → 13 work rows → 8 journey rows → skills → contact form → footer
- [ ] Software: blue accents only; Marketing: orange accents only
- [ ] Rows: 44px thumbs (or initials tile), hairline dividers, chevron rotates on expand
- [ ] Nav: hairline bar, monogram, links, plain "Book a call"; mobile overlay works with focus trap

**Behavior**
- [ ] Category filters work on hub work + experience lists (All/Software/Growth)
- [ ] `<details>` rows expand/collapse; keyboard accessible (Enter/Space on summary)
- [ ] BookCall submits → mailto opens with correct subject/body on all 3 routes
- [ ] Footer `#heart-trigger` click on `/` launches the portal easter egg exactly as before
- [ ] Resume PDF links open (both lanes); LinkedIn link correct
- [ ] 404 at any unknown path renders the new page
- [ ] `prefers-reduced-motion`: reveals disabled, everything readable

**A11y & polish**
- [ ] Focus outlines visible on all links/buttons/summaries
- [ ] Contrast: `--text-muted` on `--bg` ≥ 4.5:1 (15px body), faint only for ≥11px uppercase labels or decorative meta
- [ ] No horizontal overflow at 320px
- [ ] No console errors on any route

---

# §5 Carry-forward (post-redesign, out of scope here)

From `docs/TODO.md`:
1. Resume PDFs should deep-link back to `/software` and `/marketing`.
2. `hub.appointmentUrl` is empty — add a real scheduler link so the CTA books directly.
