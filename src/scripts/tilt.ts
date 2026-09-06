import { ready } from "./ready";

ready(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.addEventListener("pointermove", (e) => {
    const card = (e.target as Element | null)?.closest?.<HTMLElement>(".work-card");
    if (!card || card.hasAttribute("open")) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg) translateY(-2px)`;
  });

  document.querySelectorAll<HTMLElement>(".work-card").forEach((card) => {
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
});
