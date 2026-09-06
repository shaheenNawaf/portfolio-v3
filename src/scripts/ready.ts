export const ready = (fn: () => void) => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
