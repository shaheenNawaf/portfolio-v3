import { ready } from "./ready";

const LINE_TOP = 10;

const setProgress = (active: HTMLElement | null) => {
  const nav = active?.closest<HTMLElement>(".rail-nav");
  if (!nav) return;
  const px = active ? Math.max(0, active.offsetTop + active.offsetHeight / 2 - LINE_TOP) : 0;
  nav.style.setProperty("--rail-progress", `${px}px`);
};

const initRail = () => {
  const panel = document.getElementById("rail-panel");
  const open = document.getElementById("rail-open");
  const close = document.getElementById("rail-close");
  const backdrop = document.getElementById("rail-backdrop");

  const setOpen = (next: boolean) => {
    if (!panel) return;
    panel.classList.toggle("is-open", next);
    backdrop?.classList.toggle("opacity-0", !next);
    backdrop?.classList.toggle("pointer-events-none", !next);
    open?.setAttribute("aria-expanded", String(next));
    document.body.style.overflow = next ? "hidden" : "";
    if (next) close?.focus();
    else open?.focus();
  };

  open?.addEventListener("click", () => {
    if (!panel) return;
    setOpen(!panel.classList.contains("is-open"));
  });
  close?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel && panel.classList.contains("is-open")) {
      setOpen(false);
    }
  });
  if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  /* Option 5: swipe inward from the left edge to open (mobile only) */
  let edgeX: number | null = null;
  document.addEventListener(
    "touchstart",
    (e) => {
      if (isDesktop() || panel?.classList.contains("is-open")) return;
      if (e.touches[0].clientX < 28) edgeX = e.touches[0].clientX;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      if (edgeX === null) return;
      if (e.touches[0].clientX - edgeX > 60) {
        setOpen(true);
        edgeX = null;
      }
    },
    { passive: true },
  );
  document.addEventListener("touchend", () => {
    edgeX = null;
  });

  /* Drag the grabber down to dismiss the sheet (mobile only) */
  const grab = document.getElementById("rail-grab");
  grab?.addEventListener("pointerdown", (e) => {
    if (!panel?.classList.contains("is-open") || isDesktop()) return;
    let startY = e.clientY;
    let dy = 0;
    panel.style.transition = "none";
    const move = (ev: PointerEvent) => {
      dy = Math.max(0, ev.clientY - startY);
      if (panel) panel.style.transform = `translateY(${dy}px)`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (panel) {
        panel.style.transition = "";
        panel.style.transform = "";
      }
      if (dy > 90) setOpen(false);
      startY = 0;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  });

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-spy]"));
  const targets = links
    .map((l) => document.getElementById((l.dataset.spy ?? "").replace(/^\/?#/, "")))
    .filter((el): el is HTMLElement => Boolean(el));

  if (links.length === 0) return;

  const initial = links.find((l) => l.getAttribute("aria-current") === "true");
  if (initial) setProgress(initial);

  const markActive = (id: string | null) => {
    let active: HTMLElement | null = null;
    links.forEach((l) => {
      const on = id !== null && (l.dataset.spy ?? "").endsWith(`#${id}`);
      l.setAttribute("aria-current", on ? "true" : "false");
      if (on) active = l;
    });
    setProgress(active);
  };

  if (targets.length > 0 && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    targets.forEach((t) => spy.observe(t));
  }

  window.addEventListener("resize", () => {
    const current = links.find((l) => l.getAttribute("aria-current") === "true");
    setProgress(current ?? null);
  });
};

ready(initRail);
