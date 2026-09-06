# Implementation Plan v3 — Reference-Aligned Redesign

Version: 3.0
Status: Approved
Reference: https://www.jansencadorna.com/
Supersedes: `docs/IMPLEMENTATION_PLAN.md` (v2.0)

Goals:
- Copy the reference **Works** section, **faint per-section dividers**, and **subtle scroll animations**.
- Replace the top nav with a **sidebar** (deliberate divergence — the reference has no nav at all).
- Hero: **name first, title underneath**.
- Add a **quirky/signature UI layer** (sticker link pills, secret tooltips, easter eggs, UI sound).

---

## Post-implementation changes (deviations from the tasks below)

These were applied after the tasks ran, per user feedback. They supersede the matching task text.

1. **Work thumbnails are always visible** (not hover-reveal). They fade in on load via
   `html.js .card-thumb` + `.is-loaded`; hover feedback is tilt + shadow bloom + sticker peel.
2. **Expanded work cards are a case-study panel**: `.work-card` has `padding: 1rem` + transparent
   border in both states; `[open]` spans the grid, shows a 2-col summary (thumb capped at 15rem
   beside a left-aligned caption) over a hairline-separated `.card-body` with `68ch` prose.
3. **Two-font discipline**: Geist Sans for everything readable. Geist Mono survives only in the
   easter/joke voice (secret + verified tooltips, footer signature, GLaDOS terminal). De-mono'd:
   eyebrows, card chips, filter tabs, journey tech chips, timeline markers, 404 links, track
   indices, sidebar location, card initials.
4. **Track-morph toggle removed** (`track_morph.astro` deleted; `localStorage.track` no longer read).
   The accent is purely per-page via `data-track`. The sidebar section list is now a **vertical
   timeline**: hairline rail + node per section + accent progress line (`--rail-progress`, set by
   `rail.ts` from scroll-spy), plus a Zones group (`/software`, `/marketing`).
5. **Bug-fix round:** skills section switched to a 2-col grid (internal hairlines removed);
   sidebar narrowed to `--rail: 12.75rem` / `p-4` and the dither avatar + location line removed
   (name kept as a one-line home link); sound toggle icon conflict fixed (a `display` utility on
   the icon span was beating `hidden`); `.squash` removed from journey summaries (its hover
   transform misaligned the timeline tick/drop against the un-transformed rail); work-tile hairline
   now fades out on hover so the peel corner shows no stray border arc; footer rebuilt as sticker
   pills + a meta row.
6. **Sidebar round 2:** name/header and the panel divider lines removed; zones folded into the
   timeline as extra nodes (active via server-set `aria-current`). A collapse-to-strip feature was
   built then **removed entirely** per user preference — the rail is always full-width.
7. **Sidebar container direction (final): flat full-height rail, no container.** Desktop rail is
   transparent / no shadow / no border / no radius, full-height and top-packed; the left gutter is the
   container. Only the <1024px off-canvas drawer has a surface (`--rail-bg`, rounded, soft shadow).
   Timeline node fill uses `--node-bg` (page bg on desktop, drawer bg on mobile) so the rail line is
   masked behind nodes in both contexts. Zones sit between Work and Experience and carry their lane
   colour in node + label (`--node-c` / `.rail-link--tinted`).
8. **Sidebar docks to the content:** at ≥1280px the rail sits 20px left of the centred 672px column
   (`left: calc(50% - 21rem - 1.25rem - 12.75rem)`, unlayered) instead of at the viewport edge; at
   1024–1279px it stays viewport-docked with a tighter `1.5rem` gutter.
10. **Journey monogram (option 5, minimalist):** the circle replaced with a 10px solid lane dot
    (`--marker-c`), no letter, no ring; titles/company clamp to 2 lines instead of `truncate`; on touch
    (`hover: none`) the rail connectors render fully drawn rather than hover-drawn.
9. **Mobile bottom sheet (option 1 + 5):** below 1024px the rail is a full-width bottom sheet
   (`bottom-3 left-3 right-3`, `rounded-[20px]`, grabber, `max-h-[75dvh]`) parked with
   `translateY(calc(100% + 2rem))`; opens via Menu toggle, left-edge swipe-in, closes via grabber
   drag-down / backdrop / Esc / close button. Shadows toned down (sheet `0 6px 16px -4px / 0.04`,
   Menu pill `shadow-md`).

---

## Out of scope (do NOT touch)

- **Binary/asset weight optimisation is deferred.** Do not re-compress, resize, convert, or replace any
  file under `public/`. Known offenders left as-is: `public/favicon.svg` (3.2 MB), `public/favicon.ico`
  (207 KB), `public/apple-touch-icon.png` (202 KB), several `public/rivalry/*.png` (3–6.6 MB).
- No new runtime dependencies. No `<ClientRouter />`. No GSAP / Lenis / framer-motion.
- No content rewrites beyond the literal strings specified in `T01`.

---

## Audit findings baked into these tasks

| # | Defect found in planning | Correction applied |
|---|---|---|
| 1 | `astro:after-swap` is dead code — no `<ClientRouter />` in `layout.astro`, so listeners in `portal.ts:195`, `category_switcher.astro:150`, `book_call.astro` never fire | Do not add `<ClientRouter />`. New scripts use a `ready()` helper only. Leave the 3 existing listeners untouched. |
| 2 | GitHub contribution heatmap is impossible client-side (`github.com/users/:u/contributions` sends no CORS headers; real counts need GraphQL + token) | Use REST `GET /users/shaheenNawaf/events/public`. Label it **"Public activity · 90 days"**, never "contributions". Lazy fetch on first hover, skeleton, silent failure. |
| 3 | `js` class added by a deferred module script (`index.astro:95`) → content paints visible, hides, then reveals (flash of hidden content) | Moved into a blocking `<script is:inline>` in `<head>` (`T02`). |
| 4 | `filter` / `transform` on an ancestor creates a containing block for `position: fixed` → reveal wrappers would break the fixed sidebar | `data-reveal` goes on **section wrappers only**, never on/around the sidebar or anything containing a fixed descendant. |
| 5 | Skip-link would render on top of the sidebar once `body { padding-left: var(--rail) }` exists | `left: calc(var(--rail) + 1rem)` at `lg+`. |
| 6 | `<a>` inside `<summary>` is a nested-interactive bug — clicking the thumbnail would toggle the accordion instead of navigating | Card thumb is **not** a link. `<summary>` = thumb + caption + chevron. Live/GitHub/case links live only in the expanded body. |
| 7 | Count-up cannot reliably parse `"$355K+"` / `"4:1"` | Explicit `num` / `prefix` / `suffix` fields added to `hubStats` (`T01`). |
| 8 | Reveal + filter conflict — `display: none` cards never intersect, so they stay `opacity: 0` forever after being un-hidden | `filterItems()` and the "See all" toggle add `.is-in` to every element they show. |
| 9 | Tailwind v4 arbitrary-value ambiguity (`bg-[var(--x)]` can compile to the wrong property) | Mandate the repo's existing syntax: `bg-[color:var(--x)]`, `text-[color:var(--x)]`, `border-[color:var(--x)]`. |
| 10 | Two projects contain literal `"Placeholder:"` copy (`campaign-growth-automation`, `proj-esp32`) — now expandable, so it becomes publicly visible | `draft?: boolean` added to `Project`; both flagged; drafts filtered from all grids (`T01`). |
| 11 | `docs/` was pruned — only `IMPLEMENTATION_PLAN.md` remained; the old cleanup task targeted deleted files | Docs task (`T27`) targets only `README.md` + `.opencode/AGENTS.md`. |

---

## How to use this document

- **One task per session.** Finish a task completely, run its Verify, then start the next.
- **Never improvise.** If a step says "use exactly X", use X. If a value is not given, stop and ask.
- **Never hardcode portfolio content in a component.** All copy/links/metrics come from `src/data/resume.ts`
  (see `docs/00_START_HERE.md`).
- **No comments in code** unless a step explicitly provides one.
- After **every** task: `npm run build` must exit 0.

## Global conventions

**Tailwind v4 arbitrary values — always with the type hint:**

```
bg-[color:var(--surface)]     text-[color:var(--text)]
border-[color:var(--border)]  fill-[color:var(--accent)]
```

Never `bg-[var(--surface)]`.

**Script pattern (all new `.ts` in `src/scripts/`):**

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};
```

No `astro:after-swap`. No new dependencies.

**Reduced motion:** every script starts with
`const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;`
and jumps to the end state when true. Every new CSS transition/animation gets a
`@media (prefers-reduced-motion: reduce)` override in `global.css`.

**Astro `<style>` blocks are scoped.** Classes added by JS at runtime still match scoped selectors if the
element is in the same component. If JS adds a class to an element rendered by a **different** component,
put the rule in `global.css` instead.

**Naming:** `snake_case.astro` for components, `kebab-case.ts` for scripts.

## Execution order (strict)

```
T01 → T02 → T03 → T04 → T05 → T09 → T10 → T11 → T07 → T06 → T08
    → T12 → T13 → T14 → T15 → T16 → T17
    → T20 → T21 → T22 → T23 → T24 → T18 → T19
    → T25 → T26 → T27 → T28
```

`T09`/`T10`/`T11` precede `T08` because the sidebar imports all three.
`T20`–`T24` precede `T18` because the hero imports them.

Pairing allowed for small models: `T03`+`T05`, `T20`+`T21`+`T22`, `T26`+`T27`. Everything else: one per session.

---

# PHASE A — Foundations

## T01 · Data layer: add fields, socials, secrets

**File:** `src/data/resume.ts`

1. In `interface Project`, after `caseStudyHref?: string;` add exactly:

```ts
  draft?: boolean;
```

2. Find the projects with `id: 'campaign-growth-automation'` and `id: 'proj-esp32'`. Add `draft: true,`
   as the last property of each object.

3. In `export const contact`, add `github: "github.com/shaheenNawaf",` after `linkedin`.

4. Replace the entire `export const hubStats = [ ... ] as const;` block with (adds `num`/`prefix`/`suffix`,
   drops the unused `sub`/`accent`):

```ts
export const hubStats = [
  { value: "$355K+", num: 355, prefix: "$", suffix: "K+", label: "Total transaction volume in 4 months" },
  { value: "22K+",   num: 22,  prefix: "",  suffix: "K+", label: "Community members" },
  { value: "25+",    num: 25,  prefix: "",  suffix: "+",  label: "Influencer partnerships" },
  { value: "4:1",    num: 4,   prefix: "",  suffix: ":1", label: "Validated ROAS" },
  { value: "2",      num: 2,   prefix: "",  suffix: "",   label: "Live SaaS products" },
] as const;
```

5. Append to the end of the file:

```ts
export interface Social {
  id: string;
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "doc";
  tint: "gh" | "li" | "mail" | "doc";
  external: boolean;
  popover: { handle: string; network: string; blurb: string };
}

export const socials: Social[] = [
  {
    id: "github", label: "GitHub", href: `https://${contact.github}`,
    icon: "github", tint: "gh", external: true,
    popover: { handle: "shaheenNawaf", network: "GitHub", blurb: "Flutter, Next.js, and half-finished experiments." },
  },
  {
    id: "linkedin", label: "LinkedIn", href: `https://${contact.linkedin}`,
    icon: "linkedin", tint: "li", external: true,
    popover: { handle: "in/aladwani", network: "LinkedIn", blurb: "Full-stack engineer & growth lead · Davao" },
  },
  {
    id: "email", label: "Email", href: `mailto:${contact.email}`,
    icon: "mail", tint: "mail", external: false,
    popover: { handle: contact.email, network: "Email", blurb: "Replies within 24–48 hours." },
  },
  {
    id: "resume-swe", label: "SWE Resume", href: resumes.software,
    icon: "doc", tint: "doc", external: true,
    popover: { handle: "PDF · Google Docs", network: "Resume", blurb: "Engineering track, one page." },
  },
  {
    id: "resume-mkt", label: "MKT Resume", href: resumes.marketing,
    icon: "doc", tint: "doc", external: true,
    popover: { handle: "PDF · Google Docs", network: "Resume", blurb: "Growth track, one page." },
  },
];

export const secrets = {
  location: { trigger: contact.location, reveal: "GMT+8 · probably still shipping" },
  roas: { trigger: "4:1 ROAS", reveal: "math checked out, barely" },
  present: { trigger: "Present", reveal: "still here somehow" },
  status: { trigger: hub.status, reveal: "yes, both. no, I don't sleep much" },
} as const;

export const swaps = {
  position: { from: hub.position, to: "two jobs, one person" },
  open: { from: "Open to SWE & MKT roles", to: "please hire me" },
} as const;
```

**Verify:** `npm run build` exits 0. `rg -n "draft: true" src/data/resume.ts` returns exactly 2 lines.

**Guardrail:** do not delete `trustLogos`, `softwareFit`, `marketingFit`, `skillGroups`, or any existing
field other than `sub`/`accent` inside `hubStats`.

---

## T02 · Theme system: light + dark tokens, FOUC-free init

### File 1 — `src/styles/global.css`

1. Move the existing `:root { ... }` token block so `:root` holds **light** values and a new `html.dark`
   block holds the current dark values. Use exactly:

```css
  :root {
    --bg: #fbfbfc;
    --surface: #f2f2f5;
    --border: #e3e3e8;
    --border-strong: #cfcfd6;
    --text: #1b1b1f;
    --text-muted: #5c5c66;
    --text-faint: #7c7c86;
    --radius: 8px;
    --mkt: #ea580c;
    --sw: #2563eb;
    --accent: var(--text);
    --popover: var(--surface);
    --popover-fg: var(--text);
    --tint-gh-bg: #f1f1f3;   --tint-gh-fg: #1b1b1f;   --tint-gh-bd: #e0e0e5;
    --tint-li-bg: #eaf1fb;   --tint-li-fg: #1d4ed8;   --tint-li-bd: #d5e2f7;
    --tint-mail-bg: #fdf1e7; --tint-mail-fg: #c2410c; --tint-mail-bd: #f8e0cc;
    --tint-doc-bg: #eef7f0;  --tint-doc-fg: #15803d;  --tint-doc-bd: #d8ecdd;
    --hm-0: #ebedf0; --hm-1: #9be9a8; --hm-2: #40c463; --hm-3: #30a14e; --hm-4: #216e39;
    --rail: 15rem;
    color-scheme: light;
  }
  html.dark {
    --bg: #272629;
    --surface: #302f33;
    --border: #3a393e;
    --border-strong: #4c4b52;
    --text: #e9e9ec;
    --text-muted: #9c9ca4;
    --text-faint: #90909a;
    --mkt: #f97316;
    --sw: #60a5fa;
    --tint-gh-bg: #3a393e;   --tint-gh-fg: #e9e9ec;   --tint-gh-bd: #4c4b52;
    --tint-li-bg: #172554;   --tint-li-fg: #93c5fd;   --tint-li-bd: #1e3a8a;
    --tint-mail-bg: #431407; --tint-mail-fg: #fdba74; --tint-mail-bd: #7c2d12;
    --tint-doc-bg: #052e16;  --tint-doc-fg: #86efac;  --tint-doc-bd: #14532d;
    --hm-0: #2a2a2e; --hm-1: #0e4429; --hm-2: #006d32; --hm-3: #26a641; --hm-4: #39d353;
    color-scheme: dark;
  }
```

2. **Order matters.** Inside `@layer base`, keep exactly: `:root` → `html.dark` →
   `html[data-track="software"]` → `html[data-track="marketing"]`. Do not merge them.
3. Add below the track rules:

```css
  section[id], header[id] { scroll-margin-top: 1.5rem; }
```

4. Change the `.work-card:hover` shadow so it works on light:

```css
  .work-card:hover { box-shadow: 0 6px 20px color-mix(in srgb, #000 22%, transparent); transition-duration: 0.15s; }
```

### File 2 — `src/scripts/theme-init.ts` (new)

```ts
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  let theme = "system";
  let track = "";
  try {
    theme = localStorage.getItem("theme") || "system";
    track = localStorage.getItem("track") || "";
  } catch {}
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  if (track === "software" || track === "marketing") root.dataset.track = track;
})();
```

### File 3 — `src/layouts/layout.astro`

1. Add at the top of `<head>`, immediately after `<meta name="viewport" ...>`:

```astro
    <script is:inline src="../scripts/theme-init.ts"></script>
```

2. Add directly after the canonical link:

```astro
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#fbfbfc" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#272629" media="(prefers-color-scheme: dark)" />
```

3. Delete the line `<link rel="sitemap" href="/sitemap-index.xml" />` (no sitemap integration installed).
4. Do **not** add `<ClientRouter />`.

### File 4 — `src/pages/index.astro`

Delete the line `document.documentElement.classList.add("js");` (now handled by `theme-init.ts`).
Keep the rest of that inline script.

**Verify:** `npm run build` exits 0. `npm run dev`, open `/`: renders dark or light per OS preference with
**no white flash**. In devtools `localStorage.setItem('theme','light'); location.reload()` → light palette.
`rg -n "sitemap-index" src/` returns nothing.

**Guardrail:** do not touch `.timeline`, `.journey-*`, `.card-*`, `.reveal-load` in this task.

---

## T03 · Icon sprite (zero dependencies)

**File:** `src/components/icon.astro` (new)

```astro
---
type IconName =
  | "github" | "linkedin" | "mail" | "doc" | "arrow-up-right" | "chevron-down"
  | "menu" | "close" | "sun" | "moon" | "badge-check" | "volume-on" | "volume-off";

interface Props { name: IconName; class?: string; }
const { name, class: className = "w-4 h-4" } = Astro.props;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;
---
```

Then one `<svg viewBox="0 0 24 24" aria-hidden="true" class={className}>` per name, selected with
`{name === "x" && (...)}`. Use **exactly** these paths.

| name | attrs | paths |
|---|---|---|
| `github` | `fill="currentColor"` | `M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12` |
| `linkedin` | `fill="currentColor"` | `M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z` |
| `mail` | `{...stroke}` | `<rect width="20" height="16" x="2" y="4" rx="2" />` + `m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7` |
| `doc` | `{...stroke}` | `M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z` + `M14 2v4a2 2 0 0 0 2 2h4` + `M16 13H8` + `M16 17H8` + `M10 9H8` |
| `arrow-up-right` | `{...stroke}` | `M7 7h10v10` + `M7 17 17 7` |
| `chevron-down` | `{...stroke}` | `m6 9 6 6 6-6` |
| `menu` | `{...stroke}` | `M4 6h16` + `M4 12h16` + `M4 18h16` |
| `close` | `{...stroke}` | `M18 6 6 18` + `m6 6 12 12` |
| `sun` | `{...stroke}` | `<circle cx="12" cy="12" r="4" />` + `M12 2v2` `M12 20v2` `m4.93 4.93 1.41 1.41` `m17.66 17.66 1.41 1.41` `M2 12h2` `M20 12h2` `m6.34 17.66-1.41 1.41` `m19.07 4.93-1.41 1.41` |
| `moon` | `{...stroke}` | `M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z` |
| `badge-check` | see note | path 1 (`fill="currentColor"`, `stroke="none"`): `M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z` — then path 2 with `{...stroke}` and `stroke-width="2.5"`: `m9 12 2 2 4-4` |
| `volume-on` | `{...stroke}` | `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z` + `M16 9a5 5 0 0 1 0 6` + `M19.364 18.364a9 9 0 0 0 0-12.728` |
| `volume-off` | `{...stroke}` | same speaker path as `volume-on` + `m22 9-6 6` + `m16 9 6 6` |

All svgs use `viewBox="0 0 24 24"`. `badge-check` must contain **both** paths.

**Verify:** temporarily render `<Icon name="github" class="w-6 h-6" />` in `404.astro`, run dev, **look at
it** — the octocat silhouette must be recognisable. Remove the scratch line. Repeat visually for `linkedin`
and `badge-check`.

**Guardrail:** if an icon renders as a blob or broken shape, the path was mistyped — re-copy it from this
table character by character. Do not "fix" it by redrawing.

---

# PHASE G — Motion (before the components that use it)

## T04 · Scroll reveal engine

### File 1 — `src/scripts/reveal.ts` (new)

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

const initReveal = () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
  );

  items.forEach((el) => {
    if (el.classList.contains("is-in")) return;
    io.observe(el);
  });
};

ready(initReveal);
```

### File 2 — `src/layouts/layout.astro`

Add immediately before `</body>`:

```astro
    <script src="../scripts/reveal.ts"></script>
    <script src="../scripts/portal.ts"></script>
```

(This also fixes the Portal egg only working on `/`.)

### File 3 — `src/styles/global.css`

1. Delete the `.reveal-load { ... }` rule and the `@keyframes reveal-in` block.
2. Add inside `@layer components`:

```css
  html.js [data-reveal] {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(12px);
    transition:
      opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      filter 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--i, 0) * 60ms);
    will-change: opacity, transform;
  }
  html.js [data-reveal="hero"] { transform: translateY(8px); }
  html.js [data-reveal].is-in { opacity: 1; filter: none; transform: none; }
```

3. In the reduced-motion block, replace `.reveal-load { animation: none; }` with:

```css
  html.js [data-reveal] {
    opacity: 1 !important; filter: none !important;
    transform: none !important; transition: none !important;
  }
```

### File 4 — mechanical find/replace across `src/pages/*.astro` and `src/components/*.astro`

- `class="... reveal-load"` → `class="..."` **plus** add the attribute `data-reveal` on the same element.
- `style="--i:N"` → keep as-is.
- In `hero_home.astro` and `identity_hero.astro`, use `data-reveal="hero"` instead of `data-reveal`.

Example: `<section id="work" class="mt-20 reveal-load" style="--i:2">` becomes
`<section id="work" class="mt-20" data-reveal style="--i:2">`.

**Verify:** `rg -n "reveal-load" src/` returns **zero** results. Dev server: scroll `/` slowly — each
section fades+rises **as it enters the viewport**, not on load. Disable JS → all content visible.
OS reduce-motion on → no transitions, content visible.

**Guardrail:** never put `data-reveal` on the sidebar, the drawer, or any element containing a
`position: fixed` descendant. `filter` breaks fixed positioning for descendants.

---

## T05 · Global CSS additions for motion + dividers

**File:** `src/styles/global.css` — append inside `@layer components`:

```css
  .squash {
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .squash:hover { transform: scale(0.98); transition-duration: 0.15s; transition-timing-function: ease-out; }
  .squash:active { transform: scale(0.96); }

  .section-divider {
    height: 1px; width: 100%; flex-shrink: 0;
    background-color: var(--border);
    margin-bottom: 2.5rem;
  }

  .nudge-arrow { transition: transform 0.2s ease; }
  .group\/see-all:hover .nudge-arrow { transform: translate(2px, -2px); }
```

Append to the reduced-motion block:

```css
  .squash, .squash:hover, .squash:active { transform: none !important; transition: none !important; }
  .nudge-arrow { transition: none !important; }
```

**Verify:** `npm run build` exits 0.

---

# PHASE B — Sidebar shell

## T09 · Theme toggle

**File:** `src/components/theme_toggle.astro` (new)

```astro
---
import Icon from "./icon.astro";
---

<button
  type="button"
  id="theme-toggle"
  data-ui-sound="crisp"
  aria-label="Toggle light and dark mode"
  title="Toggle light and dark mode"
  class="inline-flex w-7 h-7 items-center justify-center rounded-md muted transition-colors hover:text-[color:var(--text)]"
>
  <Icon name="sun" class="w-3.5 h-3.5 hidden dark:block" />
  <Icon name="moon" class="w-3.5 h-3.5 dark:hidden" />
</button>

<script>
  const ready = (fn: () => void) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };

  ready(() => {
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      const root = document.documentElement;
      const dark = !root.classList.contains("dark");
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
    });
  });
</script>
```

`dark:block` / `dark:hidden` require a class-based `dark` variant. Add to `src/styles/global.css`
immediately **after** `@import "tailwindcss";`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

**Verify:** clicking the toggle flips the whole page theme and survives a reload. `npm run build` exits 0.

---

## T10 · Sound toggle + UI sound engine

**File:** `src/components/sound_toggle.astro` (new)

```astro
---
import Icon from "./icon.astro";
---

<button
  type="button"
  id="sound-toggle"
  data-ui-sound="none"
  aria-pressed="false"
  aria-label="Enable interface sounds"
  class="inline-flex items-center gap-1.5 text-[12px] muted transition-colors hover:text-[color:var(--text)]"
>
  <Icon name="volume-off" class="w-3.5 h-3.5" data-icon="off" />
  <Icon name="volume-on" class="w-3.5 h-3.5 hidden" data-icon="on" />
  <span data-label>Sound off</span>
</button>
```

**File:** `src/scripts/ui-sound.ts` (new)

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

let ctx: AudioContext | null = null;
let enabled = false;

const crisp = () => {
  if (!enabled) return;
  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.05);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
};

const paint = (btn: HTMLElement) => {
  const on = btn.querySelector<HTMLElement>('[data-icon="on"]');
  const off = btn.querySelector<HTMLElement>('[data-icon="off"]');
  const label = btn.querySelector<HTMLElement>("[data-label]");
  on?.classList.toggle("hidden", !enabled);
  off?.classList.toggle("hidden", enabled);
  if (label) label.textContent = enabled ? "Sound on" : "Sound off";
  btn.setAttribute("aria-pressed", String(enabled));
  btn.setAttribute("aria-label", enabled ? "Mute interface sounds" : "Enable interface sounds");
};

ready(() => {
  const btn = document.getElementById("sound-toggle");
  if (!btn) return;
  try { enabled = localStorage.getItem("sound") === "on"; } catch {}
  paint(btn);
  btn.addEventListener("click", () => {
    enabled = !enabled;
    try { localStorage.setItem("sound", enabled ? "on" : "off"); } catch {}
    paint(btn);
    crisp();
  });
  document.addEventListener("pointerdown", (e) => {
    const hit = (e.target as Element | null)?.closest?.('[data-ui-sound="crisp"]');
    if (hit) crisp();
  });
});
```

**Verify:** sounds are **silent by default**. Clicking `Sound off` flips it to `Sound on`, icon swaps, and
subsequent clicks on any `[data-ui-sound="crisp"]` element produce a short click. Setting survives reload.
No console error before the first user gesture.

---

## T11 · Track-morph toggle

**File:** `src/components/track_morph.astro` (new)

```astro
---
---

<div>
  <p class="eyebrow mb-2">Track</p>
  <div
    id="track-morph"
    role="radiogroup"
    aria-label="Accent track"
    class="relative flex rounded-full border hairline p-0.5 text-[11px] font-medium"
  >
    <span id="track-thumb" class="absolute inset-y-0.5 left-0.5 w-[calc(50%-0.125rem)] rounded-full bg-[color:var(--accent)] transition-transform duration-300 motion-reduce:transition-none"></span>
    <button type="button" role="radio" aria-checked="false" data-track-value="software" data-ui-sound="crisp"
      class="relative z-10 flex-1 rounded-full px-2 py-1 transition-colors duration-300">Software</button>
    <button type="button" role="radio" aria-checked="false" data-track-value="marketing" data-ui-sound="crisp"
      class="relative z-10 flex-1 rounded-full px-2 py-1 transition-colors duration-300">Marketing</button>
  </div>
</div>

<script>
  const ready = (fn: () => void) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };

  ready(() => {
    const group = document.getElementById("track-morph");
    if (!group) return;
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>("[data-track-value]"));
    const thumb = document.getElementById("track-thumb");

    const paint = (value: string) => {
      buttons.forEach((b, i) => {
        const on = b.dataset.trackValue === value;
        b.setAttribute("aria-checked", String(on));
        b.style.color = on ? "var(--bg)" : "var(--text-muted)";
        if (thumb) thumb.style.transform = `translateX(${on ? i * 100 : 0}%)`;
      });
    };

    const current = document.documentElement.dataset.track === "marketing" ? "marketing" : "software";
    paint(current);

    buttons.forEach((b) => {
      b.addEventListener("click", () => {
        const value = b.dataset.trackValue!;
        document.documentElement.dataset.track = value;
        try { localStorage.setItem("track", value); } catch {}
        paint(value);
      });
    });
  });
</script>
```

**Verify:** on `/` the toggle appears; clicking **Marketing** turns every accent-derived element orange,
**Software** turns them blue; the choice survives reload and navigation. On `/software` and `/marketing`
the toggle is **absent**.

**Guardrail:** `theme-init.ts` already restores `localStorage.track`. Do not duplicate that logic here.

---

## T07 · Sticker pill component

**File:** `src/components/sticker_pill.astro` (new)

```astro
---
import type { Social } from "../data/resume";
import Icon from "./icon.astro";

interface Props { social: Social; }
const { social } = Astro.props;
const { label, href, icon, tint, external, popover, id } = social;
---

<span class={`group/social relative inline-flex align-baseline sticker-${tint}`}>
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    aria-describedby={`${id}-preview`}
    data-ui-sound="none"
    class="inline-flex w-fit items-center gap-1 rounded-full border border-[color:var(--sticker-bd)] bg-[color:var(--sticker-bg)] px-2 py-0.5 text-xs font-medium text-[color:var(--sticker-fg)] transition-transform duration-150 hover:underline active:translate-y-px active:scale-[0.98] motion-reduce:transition-none"
  >
    <Icon name={icon} class="w-3 h-3 shrink-0" />
    {label}
  </a>
  <span
    id={`${id}-preview`}
    role="tooltip"
    class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-52 translate-y-1 rounded-md border hairline bg-[color:var(--popover)] p-2 text-left text-[color:var(--popover-fg)] opacity-0 shadow-sm transition-[opacity,transform] duration-150 group-hover/social:block group-hover/social:translate-y-0 group-hover/social:opacity-100 group-focus-within/social:block group-focus-within/social:translate-y-0 group-focus-within/social:opacity-100 motion-reduce:transition-none"
  >
    <span class="block text-xs font-medium">{popover.handle}</span>
    <span class="block text-[0.7rem] muted">{popover.network}</span>
    <span class="mt-1 block text-[0.7rem] leading-snug muted">{popover.blurb}</span>
  </span>
</span>
```

**File:** `src/styles/global.css` — append inside `@layer components`:

```css
  .sticker-gh   { --sticker-bg: var(--tint-gh-bg);   --sticker-fg: var(--tint-gh-fg);   --sticker-bd: var(--tint-gh-bd); }
  .sticker-li   { --sticker-bg: var(--tint-li-bg);   --sticker-fg: var(--tint-li-fg);   --sticker-bd: var(--tint-li-bd); }
  .sticker-mail { --sticker-bg: var(--tint-mail-bg); --sticker-fg: var(--tint-mail-fg); --sticker-bd: var(--tint-mail-bd); }
  .sticker-doc  { --sticker-bg: var(--tint-doc-bg);  --sticker-fg: var(--tint-doc-fg);  --sticker-bd: var(--tint-doc-bd); }
```

**Verify:** temporarily render all 5 `socials` in `404.astro`, run dev, confirm each pill has a distinct
tint in **both** themes and the popover appears above it on hover **and** on keyboard focus. Then remove
the scratch markup.

---

## T06 · `section_divider.astro` and `section_head.astro` (new)

`src/components/section_divider.astro` — complete file:

```astro
<div role="separator" aria-orientation="horizontal" class="section-divider"></div>
```

`src/components/section_head.astro` — complete file:

```astro
---
import Icon from "./icon.astro";

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionId?: string;
}
const { title, subtitle, actionLabel, actionId } = Astro.props;
---

<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <h2 class="text-[15px] font-semibold tracking-tight">{title}</h2>
    {subtitle && <p class="mt-1 text-[13px] muted">{subtitle}</p>}
  </div>
  {actionLabel && actionId && (
    <button
      type="button"
      id={actionId}
      data-ui-sound="crisp"
      class="group/see-all inline-flex items-center text-xs font-medium muted hover:text-[color:var(--text)] transition-colors"
    >
      {actionLabel}
      <Icon name="arrow-up-right" class="nudge-arrow ml-1 w-3 h-3" />
    </button>
  )}
</div>
```

**Verify:** `npm run build` exits 0.

---

## T08 · Sidebar + drawer

**File:** `src/components/site_sidebar.astro` (new)

Frontmatter:

```astro
---
import { name, contact, socials } from "../data/resume";
import { DitherAvatar } from "./dither-kit/avatar";
import Icon from "./icon.astro";
import StickerPill from "./sticker_pill.astro";
import ThemeToggle from "./theme_toggle.astro";
import SoundToggle from "./sound_toggle.astro";
import TrackMorph from "./track_morph.astro";

interface Props { track: "hub" | "software" | "marketing"; }
const { track } = Astro.props;

const sections = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
];
---
```

Body — build in this order:

1. **Mobile launcher** (below `lg` only):
   `<button id="rail-open" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="rail-panel" class="fixed bottom-4 left-4 z-50 lg:hidden inline-flex items-center gap-2 rounded-full border hairline bg-[color:var(--surface)] px-3.5 py-2 text-[13px] font-semibold shadow-lg">`
   containing `<Icon name="menu" class="w-4 h-4" />` and the text `Menu`.
2. **Backdrop:**
   `<div id="rail-backdrop" class="fixed inset-0 z-40 bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 lg:hidden"></div>`
3. **Panel:**
   `<aside id="rail-panel" class="fixed inset-y-0 left-0 z-40 flex w-60 max-w-[85vw] -translate-x-full flex-col border-r hairline bg-[color:var(--bg)] transition-transform duration-200 lg:translate-x-0" aria-label="Primary">`

   Inside, top → bottom:
   - Close button (`lg:hidden`, `id="rail-close"`, `aria-label="Close navigation"`, `Icon name="close"`).
   - Identity: `<a href="/" class="flex items-center gap-2.5">` →
     `<span class="w-8 h-8 rounded overflow-hidden shrink-0"><DitherAvatar client:load name={name} hue={230} size={32} animate={false} /></span>` →
     `<span class="min-w-0"><span class="block text-[13px] font-bold tracking-[-0.01em] truncate">{name}</span><span class="block font-mono text-[10px] faint truncate">{contact.location}</span></span>`
   - `<nav class="mt-8 flex flex-col gap-1" aria-label="Sections">` → map `sections` to
     `<a href={s.href} data-spy={s.href} class="rail-link relative block rounded-md px-2.5 py-1.5 text-[13px] muted transition-colors hover:text-[color:var(--text)]">` + label.
   - `{track === "hub" && <div class="mt-8"><TrackMorph /></div>}`
   - `<div class="mt-8 flex flex-wrap gap-1.5">{socials.slice(0, 3).map((s) => <StickerPill social={s} />)}</div>`
   - `<div class="mt-auto flex items-center justify-between gap-2 border-t hairline pt-4"><ThemeToggle /><SoundToggle /></div>`

**File:** `src/styles/global.css` — append inside `@layer components`:

```css
  .rail-link::before {
    content: ""; position: absolute; left: 0; top: 0.375rem; bottom: 0.375rem;
    width: 2px; border-radius: 2px; background-color: var(--accent);
    transform: scaleY(0); transform-origin: center; transition: transform 0.25s ease;
  }
  .rail-link[aria-current="true"] { color: var(--text); }
  .rail-link[aria-current="true"]::before { transform: scaleY(1); }

  @media (min-width: 1024px) {
    body { padding-left: var(--rail); }
    .skip-link { left: calc(var(--rail) + 1rem); }
  }
```

**File:** `src/scripts/rail.ts` (new)

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

const initRail = () => {
  const panel = document.getElementById("rail-panel");
  const open = document.getElementById("rail-open");
  const close = document.getElementById("rail-close");
  const backdrop = document.getElementById("rail-backdrop");

  const setOpen = (next: boolean) => {
    if (!panel) return;
    panel.classList.toggle("-translate-x-full", !next);
    panel.classList.toggle("shadow-2xl", next);
    backdrop?.classList.toggle("opacity-0", !next);
    backdrop?.classList.toggle("pointer-events-none", !next);
    open?.setAttribute("aria-expanded", String(next));
    document.body.style.overflow = next ? "hidden" : "";
    if (next) close?.focus();
    else open?.focus();
  };

  open?.addEventListener("click", () => setOpen(true));
  close?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel && !panel.classList.contains("-translate-x-full")) setOpen(false);
  });
  if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-spy]"));
  const targets = links
    .map((l) => document.getElementById(l.dataset.spy!.replace(/^\/?#/, "")))
    .filter((el): el is HTMLElement => Boolean(el));

  if (targets.length > 0) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) =>
            l.setAttribute("aria-current", l.dataset.spy!.endsWith(`#${entry.target.id}`) ? "true" : "false"),
          );
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => spy.observe(t));
  }
};

ready(initRail);
```

**File:** `src/layouts/layout.astro`

1. Add `import SiteSidebar from "../components/site_sidebar.astro";` to the frontmatter.
2. Render `<SiteSidebar track={track} />` inside `<body>`, **before** the skip link.
3. Add `<script src="../scripts/rail.ts"></script>` next to the reveal/portal scripts.

**Files to delete:** `src/components/site_nav.astro`, `src/components/zone_nav.astro`.

**Files to update after deletion:**

- `src/pages/index.astro` — remove the `SiteNav` import and the `<SiteNav />` line.
- `src/pages/404.astro` — remove the `SiteNav` import and the `<SiteNav />` line.
- `src/pages/software.astro`, `src/pages/marketing.astro` — remove the `ZoneNav` import and the
  `<ZoneNav mode="..." />` line.

**Verify:** `rg -n "site_nav|zone_nav|SiteNav|ZoneNav" src/` returns **zero** results. `npm run build`
exits 0. Dev: at ≥1024px a fixed 240px rail sits on the left and the content column is centred in the
remaining space; at <1024px only the floating `Menu` pill shows and it opens/closes via button, backdrop,
and `Esc`, with body scroll locked while open. Scroll `/` — the active section link gets a 2px accent bar.

**Guardrail:** `T08` depends on `theme_toggle.astro`, `sound_toggle.astro`, `track_morph.astro` existing.
Do `T09`, `T10`, `T11` first.

---

# PHASE C — Section scaffolding

## T12 · Restructure `index.astro` main

Replace `<main id="main" class="wrap">` with:

```astro
  <main id="main" class="wrap flex flex-col gap-8 sm:gap-10 pt-10 md:pt-16 pb-4">
```

Then wrap every section **after the first** as:

```astro
    <div data-reveal style="--i:N">
      <SectionDivider />
      <section id="..."> ... </section>
    </div>
```

Remove `mt-20`, `reveal-load`, and `data-reveal` from those inner `<section>` elements (the reveal now
lives on the wrapper). Apply the same to the sections rendered by `TrackIndex`, `SkillsGrid`, and
`BookCall`'s wrapper: those components must **stop** rendering their own `mt-20` and `data-reveal`, and
instead render a bare `<section id="...">`.

Add `import SectionDivider from "../components/section_divider.astro";`.

Convert the inline `<section id="work">` header block to:

```astro
      <SectionHead
        title="Selected work"
        subtitle="Products, campaigns, and systems with measurable outcomes."
        actionLabel="See all"
        actionId="work-see-all"
      />
```

and the `<section id="experience">` header to
`<SectionHead title="Experience" subtitle="Professional progression across engineering and growth." />`.

**Verify:** dev server — a 1px hairline sits between every pair of sections, spanning exactly the content
column (not full-bleed), with 2.5rem below it. Each divider fades in together with its section.

---

## T13 · Apply the same scaffolding to zone pages

**Files:** `src/pages/software.astro`, `src/pages/marketing.astro`

- Same `<main>` class change.
- Same divider+reveal wrapper on every section after `IdentityHero`.
- Remove the now-unused `mt-20 reveal-load style="--i:N"` from each `<section>`.
- Replace each hand-rolled `<h2>`+`<p>` pair with `<SectionHead />` using the existing copy verbatim.
- In `marketing.astro`, delete the unused `trustLogos` import.
- In `identity_hero.astro`, change `<header class="pt-4 reveal-load" style="--i:1">` to
  `<header class="pt-4" data-reveal="hero" style="--i:1">`.

**Verify:** `rg -n "mt-20" src/pages/ src/components/` returns zero. Both zone pages show dividers between
every section.

---

# PHASE D — Works grid

## T14 · Rewrite `src/components/work_card.astro`

Props — replace the interface with:

```ts
interface Props {
  id: string;
  title: string;
  category: Category;
  description: string;
  date?: string;
  role?: string;
  results?: string;
  impact?: string;
  problem?: string;
  solution?: string;
  tags?: readonly string[];
  deliverables?: readonly string[];
  media?: { type: "video" | "image"; url: string; thumbnail?: string };
  gallery?: readonly string[];
  liveUrl?: string;
  repoUrl?: string;
  caseStudyHref?: string;
  index?: number;
}
```

Derived values in frontmatter (exact logic):

```ts
const thumb = media?.type === "video" ? media.thumbnail ?? undefined : media?.url ?? gallery[0];
const metric = results ?? impact;
const hasDepth = Boolean(problem || solution || impact || (gallery && gallery.length > 0) || media);
const linkHref = liveUrl && liveUrl.length > 0 ? liveUrl : repoUrl && repoUrl.length > 0 ? repoUrl : caseStudyHref;
const pillLabel = liveUrl && liveUrl.length > 0
  ? new URL(liveUrl).hostname.replace(/^www\./, "")
  : category === "marketing" ? "Growth" : category === "software" ? "Software" : "Systems";
const categoryLabel = category === "marketing" ? "Growth" : category === "software" ? "Software" : "Systems";
const accentVar = category === "marketing" ? "var(--mkt)" : category === "software" ? "var(--sw)" : "var(--text)";
const initials = title.split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("");
const listItems = category === "marketing" ? deliverables ?? [] : tags ?? [];
```

Markup — outer element must be:

```astro
<details
  class="work-card group/preview"
  data-project-card={id}
  data-category={category}
  data-reveal-item
  style={`--i:${index}`}
>
```

When `hasDepth` is false, render a `<div>` with the same attributes instead of `<details>`.

Inside `<summary>` (**no `<a>` anywhere in the summary**):

1. Thumb frame:

```astro
<div class="card-media relative aspect-video w-full overflow-hidden rounded-[var(--radius)] border border-[color:color-mix(in_srgb,var(--text)_10%,transparent)] bg-[color:var(--surface)]">
  <div class="card-pulse" aria-hidden="true"></div>
  {thumb ? (
    <img src={thumb} alt={`${title} preview`} loading="lazy" decoding="async" data-fade
         class="card-thumb h-full w-full object-cover" />
  ) : (
    <div class="absolute inset-0 grid place-items-center font-mono text-sm faint">{initials}</div>
  )}
</div>
```

2. Caption (keep the existing centred block) plus a trailing chevron
   `<Icon name="chevron-down" class="row-chevron w-3.5 h-3.5 mt-2" />` when `hasDepth`.

Expanded body (only when `hasDepth`) — port verbatim from `work_row.astro`'s detail region: `role`, metric
in `accentVar`, Problem/Solution/Impact blocks, `listItems.slice(0, 8)` chips, `<video>` when
`media?.type === "video"`, gallery images, and the `Live ↗ / GitHub ↗ / Case study ↗` links using
`linkHref`, `repoUrl`, `caseStudyHref`.

**File:** `src/styles/global.css` — update the works block:

1. Replace the four `html.js .card-media img { ... }` rules with:

```css
  html.js .card-thumb { opacity: 0; transition: opacity 0.2s ease; }
  html.js .card-media.is-loaded .card-thumb { opacity: 1; }
```

(Thumbs fade in on load and stay visible. The `html.js` gate keeps them visible when JS is
disabled. Do NOT use Tailwind `opacity-0` on the image — it would hide it permanently without JS.)

2. Add:

```css
  .work-card { transition: box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); transform-style: preserve-3d; }
  .work-card:hover { transition-duration: 0.15s; }
  .work-card[open] { grid-column: 1 / -1; transform: none !important; }
  .work-card > summary { cursor: pointer; }
```

3. Keep `.card-pulse` and `.card-media.is-loaded .card-pulse { display: none }` unchanged.
4. Reduced-motion block: add
   `.work-card, .work-card:hover { transform: none !important; transition: none !important; }`

**Verify:** `npm run build` exits 0. Dev: on `/`, work thumbnails fade in on load and stay
**visible at rest** (post-launch decision: always-visible, not hover-reveal). Hover feedback is the
3D tilt + shadow bloom + sticker peel. Clicking a card with depth expands
it to full grid width showing Problem/Solution/Impact. Cards without depth render as a plain `<div>`.

**Guardrail:** thumbnail visibility is controlled by `html.js`-gated `.card-thumb` CSS, not by
Tailwind opacity classes. Never put `opacity-0` on the image.

---

## T15 · 3D tilt + sticker peel

**File:** `src/scripts/tilt.ts` (new)

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.addEventListener("pointermove", (e) => {
    const card = (e.target as Element | null)?.closest?.<HTMLElement>(".work-card");
    if (!card || card.hasAttribute("open")) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${py * -6}deg) translateY(-2px)`;
  });

  document.querySelectorAll<HTMLElement>(".work-card").forEach((card) => {
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
});
```

Add `<script src="../scripts/tilt.ts"></script>` to `layout.astro`.

**File:** `src/styles/global.css` — append inside `@layer components`:

```css
  .card-media::after {
    content: ""; position: absolute; top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid; border-width: 0 26px 26px 0;
    border-color: transparent var(--bg) transparent transparent;
    filter: drop-shadow(-1px 1px 1px rgb(0 0 0 / 0.25));
    transform: scale(0); transform-origin: top right;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  }
  .work-card:hover .card-media::after { transform: scale(1); }
```

Reduced-motion: `.card-media::after { transition: none !important; }`

**Verify:** on a mouse-driven desktop viewport, hovering a closed card tilts it ≤6° toward the cursor and
lifts 2px; leaving resets it. A peeled corner triangle appears at the frame's top-right on hover. On
touch/reduced-motion neither happens. Open cards never tilt.

---

## T16 · "See all" + filter integration

### File 1 — `src/components/category_switcher.astro`

1. Replace `const saved = defaultId;` with:

```ts
      let saved = defaultId;
      try { saved = localStorage.getItem(storageKey) || defaultId; } catch {}
```

2. Inside the click handler, after `filterItems(category);` add:

```ts
          try { localStorage.setItem(storageKey, category); } catch {}
```

3. In `filterItems`, after `el.style.display = "";` add `el.classList.add("is-in");`

### File 2 — `src/pages/index.astro`

1. In the frontmatter add:

```ts
import { featuredProjectIds } from "../data/resume";

const visible = projects.filter((p) => !p.draft);
const featuredSet = new Set<string>([
  ...featuredProjectIds.marketing,
  ...featuredProjectIds.software,
  ...featuredProjectIds.systems,
]);
```

2. Change the grid map to:

```astro
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" data-project-grid>
        {visible.map((p, i) => (
          <WorkCard {...p} index={i} data-featured={featuredSet.has(p.id) ? "true" : "false"} />
        ))}
      </div>
```

3. Add an inline `<script>` at the bottom of `index.astro`:

```astro
<script>
  const ready = (fn: () => void) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };

  ready(() => {
    const btn = document.getElementById("work-see-all");
    const grid = document.querySelector<HTMLElement>("[data-project-grid]");
    if (!btn || !grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-project-card]"));
    let expanded = false;

    const apply = () => {
      cards.forEach((c) => {
        if (!expanded && c.dataset.featured !== "true") c.style.display = "none";
        else if (expanded) { c.style.display = ""; c.classList.add("is-in"); }
      });
      btn.textContent = expanded ? "Show less" : "See all";
    };

    btn.addEventListener("click", () => { expanded = !expanded; apply(); });
    apply();
  });
</script>
```

4. When a non-`all` category is chosen, the inline `display: none` from `apply()` is cleared because
   `filterItems` sets `el.style.display = ""` for matches. No further change needed.

**Verify:** `/` initially shows the featured cards only; clicking **See all** reveals the rest and the label
becomes **Show less**; the two `draft: true` projects never appear. Choosing a category pill filters
correctly and the choice persists across reloads. No card stays invisible after being revealed.

---

## T17 · Zone pages use the grid; delete `work_row.astro`

**Files:** `src/pages/software.astro`, `src/pages/marketing.astro`

1. Replace `import WorkRow from "../components/work_row.astro";` with
   `import WorkCard from "../components/work_card.astro";`.
2. Replace each `<div class="mt-6 border-t hairline">{featured.map((p) => p && <WorkRow {...p} />)}</div>`
   with:

```astro
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {featured.map((p, i) => p && <WorkCard {...p} index={i} />)}
      </div>
```

3. Same for the `moreProjects` block.
4. Add `const visible = projects.filter((p) => !p.draft);` and use `visible` wherever `projects` was
   filtered for `moreProjects`.
5. Delete `src/components/work_row.astro`.

**Verify:** `rg -n "work_row|WorkRow" src/` returns zero. `npm run build` exits 0. Both zone pages show a
card grid; clicking a card with depth expands it full-width with all Problem/Solution/Impact/gallery/video
content intact.

---

# PHASE F — Quirky layer

## T20 · `secret_tooltip.astro`

```astro
---
interface Props { trigger: string; reveal: string; id?: string; }
const { trigger, reveal, id = `secret-${Math.random().toString(36).slice(2, 8)}` } = Astro.props;
---

<span class="group/secret relative inline-flex align-baseline">
  <button type="button" data-ui-sound="none" aria-describedby={id}
    class="inline-flex appearance-none items-baseline border-0 border-b border-dotted border-current bg-transparent p-0 font-[inherit] leading-[inherit] text-[inherit] muted hover:text-[color:var(--text)] transition-colors">
    {trigger}
  </button>
  <span id={id} role="tooltip"
    class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-56 -translate-x-1/2 translate-y-1 rounded-md border hairline bg-[color:var(--popover)] px-2 py-1 font-mono text-[0.7rem] leading-tight text-[color:var(--popover-fg)] opacity-0 shadow-sm transition-[opacity,transform] duration-150 group-hover/secret:block group-hover/secret:translate-y-0 group-hover/secret:opacity-100 group-focus-within/secret:block group-focus-within/secret:translate-y-0 group-focus-within/secret:opacity-100 motion-reduce:transition-none">
    {reveal}
  </span>
</span>
```

Wire it onto: the location line, the `hub.status` eyebrow in the contact section, and the `Present` date
pill inside `journey_row.astro` (only when the `date` prop equals `"Present"`).

## T21 · `secret_swap.astro`

```astro
---
interface Props { from: string; to: string; }
const { from, to } = Astro.props;
---

<span class="group/swap inline-grid items-baseline">
  <span class="col-start-1 row-start-1 transition-[opacity,transform,filter] duration-200 group-hover/swap:-translate-y-1 group-hover/swap:opacity-0 group-hover/swap:blur-[2px] motion-reduce:transition-none">{from}</span>
  <span aria-hidden="true" class="col-start-1 row-start-1 translate-y-1 opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-200 group-hover/swap:translate-y-0 group-hover/swap:opacity-100 group-hover/swap:blur-none motion-reduce:transition-none">{to}</span>
</span>
```

## T22 · `verified_badge.astro`

```astro
---
import Icon from "./icon.astro";
---

<span class="group/secret relative inline-flex align-baseline whitespace-nowrap">
  <button type="button" data-ui-sound="none" aria-label="Verified profile" aria-describedby="verified-tip"
    class="group/badge inline-flex appearance-none items-baseline border-0 bg-transparent p-0">
    <Icon name="badge-check" class="w-4 h-4 shrink-0 text-[color:#3b82f6] transition-transform duration-500 group-hover/badge:rotate-[360deg] motion-reduce:transition-none" />
  </button>
  <span id="verified-tip" role="tooltip"
    class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max -translate-x-1/2 translate-y-1 rounded-md border hairline bg-[color:var(--popover)] px-2 py-1 font-mono text-[0.7rem] leading-tight text-[color:var(--popover-fg)] opacity-0 shadow-sm transition-[opacity,transform] duration-150 group-hover/secret:block group-hover/secret:translate-y-0 group-hover/secret:opacity-100 group-focus-within/secret:block group-focus-within/secret:translate-y-0 group-focus-within/secret:opacity-100 motion-reduce:transition-none">
    source: trust me bro
  </span>
</span>
```

## T23 · `stat_counter.astro` + `src/scripts/count-up.ts`

Component renders:

```astro
<span class="stat-number text-lg font-bold fg" data-count-to={stat.num} data-count-prefix={stat.prefix} data-count-suffix={stat.suffix}>
  {stat.value}
</span>
```

The **server-rendered text must be the final `stat.value`** so no-JS and reduced-motion users see the real
number. The script only animates when it will run:

```ts
const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-count-to]"));
  if (nodes.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      io.unobserve(el);
      const to = Number(el.dataset.countTo ?? "0");
      const pre = el.dataset.countPrefix ?? "";
      const suf = el.dataset.countSuffix ?? "";
      const dur = 900;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${pre}${Math.round(to * eased)}${suf}`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  nodes.forEach((n) => io.observe(n));
});
```

Register the script in `layout.astro`.

## T24 · `activity_heatmap.astro` + `src/scripts/github-activity.ts`

- Trigger phrase in the hero bio: wrap a phrase in a `group/activity` span; the popover sits at
  `top-full mt-2`.
- Popover: `role="status"`, header text `Public activity · last 90 days`, grid
  `grid grid-flow-col grid-rows-7 gap-1`, cells
  `w-3.5 h-3.5 rounded-[3px] transition-transform hover:scale-110 motion-reduce:transition-none`,
  background from `--hm-0..4`.
- Script: on **first** `pointerenter` of the trigger,
  `fetch("https://github.com/users/shaheenNawaf/events/public?per_page=100")`, wrapped in `try/catch`.
  On non-200 or throw, leave the popover showing `Activity unavailable.` and never retry.
  Bucket `created_at` by local date, count events/day, map count → level
  (`0→0, 1→1, 2-3→2, 4-5→3, 6+→4`). Build 91 cells ending today. Set each cell's `title` to
  `"Mon D, YYYY: N events"`.
- Add `data-activity-user="shaheenNawaf"` on the trigger and read it from the script — no hardcoded
  username in the script.

**Verify:** hovering the phrase shows a skeleton, then a 7-row grid of green cells within ~1s on a normal
connection. Turn off network in devtools → the popover reads `Activity unavailable.` and there is no
unhandled rejection in the console. Copy says **"Public activity"**, never "contributions".

---

# PHASE E — Hero

## T18 · `hero_home.astro` — name, then title

Rewrite the top block to (exact order):

```astro
<section id="hero" class="pt-2" data-reveal="hero" style="--i:0">
  <div class="flex items-center gap-3 leading-relaxed">
    <button type="button" id="avatar-egg" aria-label={`${name} profile picture`} data-ui-sound="none"
      class="relative w-12 h-12 shrink-0 cursor-default overflow-hidden rounded-full">
      <img src={contact.profileImage} alt="" width="48" height="48"
           class="w-full h-full object-cover" loading="eager" />
      <span aria-hidden="true" id="avatar-shades"
        class="absolute top-[38%] left-1/2 flex -translate-x-1/2 items-center opacity-0 transition-opacity duration-150">
        <span class="h-2.5 w-4 bg-black [clip-path:polygon(0_0,100%_0,88%_100%,22%_100%)]"></span>
        <span class="h-0.5 w-1 bg-black"></span>
        <span class="h-2.5 w-4 bg-black [clip-path:polygon(0_0,100%_0,78%_100%,12%_100%)]"></span>
      </span>
    </button>
    <div class="flex flex-col min-w-0">
      <h1 id="hero-name" class="flex items-center gap-1 text-[22px] md:text-[26px] font-medium tracking-[-0.01em] leading-[1.2]">
        {name}
        <VerifiedBadge />
      </h1>
      <span class="muted"><SecretSwap from={swaps.position.from} to={swaps.position.to} /></span>
    </div>
  </div>
```

Then, in order:

- `<p class="mt-6 text-[15px] muted leading-[1.7] max-w-[52ch]">{hub.subtext}</p>`
- A bio line containing the sticker pills inline:

```astro
  <p class="mt-4 text-[15px] muted leading-[1.9] max-w-[56ch]">
    You can find me shipping on <StickerPill social={socials[0]} />, hiring-side on
    <StickerPill social={socials[1]} />, or reach me at <StickerPill social={socials[2]} />.
  </p>
```

- Location as a secret tooltip:
  `<p class="mt-4 text-[13px]"><SecretTooltip trigger={secrets.location.trigger} reveal={secrets.location.reveal} /></p>`
- CTA row (`hub.ctaPrimary` → `#contact`, plus the two resume stickers).
- Proof band:
  `<div class="mt-10 pt-6 border-t hairline grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6">`
  mapping `hubStats` to `<StatCounter stat={s} />`.
- `<ActivityHeatmap />` under the proof band.

Add the sunglasses toggle in an inline `<script>` in this component:

```astro
<script>
  document.getElementById("avatar-egg")?.addEventListener("click", () => {
    document.getElementById("avatar-shades")?.classList.toggle("opacity-100");
  });
</script>
```

**Verify:** the H1 reads **"Shaheen Al Adwani"** with the role **underneath** it. The proof band shows all 5
stats without awkward wrapping. Clicking the avatar toggles pixel sunglasses.

## T19 · `identity_hero.astro` — same inversion

Change `<h1 class="mt-3 ...">{headline}</h1>` so the H1 is `{name}` (the prop already exists but is unused)
and `{headline}` renders in a `<span class="muted">` directly beneath it, matching `T18`'s typography
classes.

**Verify:** `/software` and `/marketing` H1s are the person's name with the role underneath.

---

# PHASE H — Cleanup & verification

## T25 · Footer, skills, track index, journey row consistency

1. `site_footer.astro`: replace the four hardcoded links with a map over `socials` (all 5). Keep
   `#heart-trigger` exactly as-is. Remove its `mt-20` if present (the layout gap now handles spacing) —
   verify it doesn't double-space.
2. `track_index.astro`: remove `mt-20 reveal-load` → keep a bare `<section id="tracks">`; add
   `class="squash"` to both `<a>` rows.
3. `skills_grid.astro`: remove `mt-20 reveal-load` → bare `<section id="skills">`.
4. `journey_row.astro`: when `date === "Present"`, render the `.journey-pill` through `SecretTooltip`.
5. `book_call.astro`: drop its own `pt-2` only if it causes a visible gap change — otherwise leave untouched.

## T26 · Dependency & config cleanup

1. `npm uninstall motion d3-scale d3-shape @types/d3-scale @types/d3-shape geist`
2. Delete `tailwind.config.mjs` and `components.json`.
3. `npm install -D typescript @astrojs/check`, then add to `package.json` scripts: `"check": "astro check"`.
4. Run `npm run check`. Fix every reported error. Do **not** suppress with `// @ts-ignore`.
5. Run `npm run build`.

## T27 · Docs refresh

Update `README.md` and `.opencode/AGENTS.md` to reflect reality: Geist (not Satoshi), sidebar (not top
nav), light+dark theming, `src/scripts/` =
`theme-init.ts, reveal.ts, rail.ts, tilt.ts, ui-sound.ts, count-up.ts, github-activity.ts, portal.ts`,
no `<ClientRouter />`, and the new `npm run check` script. Add a one-line note at the top of
`docs/IMPLEMENTATION_PLAN.md` marking it superseded.

## T28 · Final verification matrix

Run `npm run build` and `npm run check` — both must exit 0. Then, in a browser, confirm every row:

| Check | `/` | `/software` | `/marketing` | `/404` |
|---|---|---|---|---|
| Fixed rail at ≥1024px, drawer <1024px | ☐ | ☐ | ☐ | ☐ |
| Dividers between every section pair | ☐ | ☐ | ☐ | n/a |
| Sections reveal on scroll, not load | ☐ | ☐ | ☐ | ☐ |
| H1 = name, role underneath | ☐ | ☐ | ☐ | n/a |
| Work thumbs visible at rest (fade in on load) | ☐ | ☐ | ☐ | n/a |
| Card tilt on fine pointers only | ☐ | ☐ | ☐ | n/a |
| Card expands full-width | ☐ | ☐ | ☐ | n/a |
| Sticker pills + popovers (hover **and** keyboard focus) | ☐ | ☐ | ☐ | ☐ |
| Track morph (hub only) | ☐ | absent | absent | absent |
| Theme toggle, persists across reload | ☐ | ☐ | ☐ | ☐ |
| Sound off by default, toggle persists | ☐ | ☐ | ☐ | ☐ |
| Count-ups run once | ☐ | n/a | n/a | n/a |
| Activity heatmap + offline fallback | ☐ | n/a | n/a | n/a |
| Secret tooltips / swap / verified badge | ☐ | ☐ | ☐ | n/a |
| Portal egg fires from footer | ☐ | ☐ | ☐ | ☐ |
| Sunglasses on avatar click | ☐ | n/a | n/a | n/a |
| Draft projects never render | ☐ | ☐ | ☐ | n/a |

Then repeat the whole table with: **light theme**, **OS reduce-motion on**, **JS disabled**,
**keyboard-only** (Tab reaches every link/button; focus rings visible; no trap in the drawer), and
**375px viewport**.

Zero console errors in all combinations.
