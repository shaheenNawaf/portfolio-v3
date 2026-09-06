import { ready } from "./ready";

const REVEAL_MS = 500;
const STAGGER_MS = 60;

const initReveal = () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in", "reveal-done"));
    return;
  }

  const finish = (el: HTMLElement) => {
    el.classList.add("is-in");
    const i = Number(getComputedStyle(el).getPropertyValue("--i")) || 0;
    window.setTimeout(
      () => el.classList.add("reveal-done"),
      REVEAL_MS + i * STAGGER_MS + 50,
    );
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        finish(entry.target as HTMLElement);
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
