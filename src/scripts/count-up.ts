import { ready } from "./ready";

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-count-to]"));
  if (nodes.length === 0) return;

  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.countTo ?? "0");
    const pre = el.dataset.countPrefix ?? "";
    const suf = el.dataset.countSuffix ?? "";
    if (!Number.isFinite(to) || to <= 0) return;
    const dur = 900;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${pre}${Math.round(to * eased)}${suf}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(run);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target as HTMLElement);
      });
    },
    { threshold: 0.4 },
  );

  nodes.forEach((n) => io.observe(n));
});
