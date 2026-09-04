/*
 * Hub page interactions: scroll reveals + stats count-up.
 * Scroll-peek removed (anti-pattern). Respects prefers-reduced-motion.
 */

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const initReveal = () => {
  const sections = document.querySelectorAll(".reveal-section");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.02, rootMargin: "0px 0px -48px 0px" },
  );
  sections.forEach((el) => io.observe(el));
};

const initCountUp = () => {
  const els = document.querySelectorAll<HTMLElement>(".stat-number");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const raw = el.dataset.value ?? "";

        if (prefersReduced) {
          el.textContent = raw;
          return;
        }

        const match = raw.match(/^(\$?)(\d+(?:\.\d+)?)(.*)/);
        if (!match) {
          el.textContent = raw;
          return;
        }
        const [, prefix, numStr, suffix] = match;
        const target = parseFloat(numStr);
        const start = performance.now();
        const duration = 1300;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const display =
            target % 1 === 0
              ? Math.round(eased * target).toLocaleString()
              : (eased * target).toFixed(1);
          el.textContent = `${prefix}${display}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
};

const initScrollSpy = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'header#site-nav nav a[href^="#"]'
  );
  if (!links.length) return;
  const sections = Array.from(links)
    .map((a) => document.getElementById(a.getAttribute("href")!.slice(1)))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!sections.length) return;
  const setActive = (id: string) => {
    links.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
    });
  };
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            a.target.getBoundingClientRect().top -
            b.target.getBoundingClientRect().top
        );
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
};

const initTrustBarObserver = () => {
  const stickyBar = document.getElementById("sticky-cta");
  const hero = document.getElementById("hero");
  if (!stickyBar || !hero) return;

  const state = { hero: true, contact: false };
  const update = () =>
    stickyBar.classList.toggle("is-hidden", state.hero || state.contact);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.target.id === "hero") state.hero = e.isIntersecting;
        if (e.target.id === "contact") state.contact = e.isIntersecting;
      });
      update();
    },
    { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
  );
  io.observe(hero);
  const contact = document.getElementById("contact");
  if (contact) io.observe(contact);
  update();
};

const initIndex = () => {
  initReveal();
  initCountUp();
  initScrollSpy();
  initTrustBarObserver();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIndex);
} else {
  initIndex();
}
document.addEventListener("astro:after-swap", initIndex);

export {};
