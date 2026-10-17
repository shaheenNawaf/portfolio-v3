import { ready } from "./ready";

const LINE_TOP = 10;

const setProgress = (nav: HTMLElement | null, active: HTMLElement | null) => {
  if (!nav) return;
  const px = active ? Math.max(0, active.offsetTop + active.offsetHeight / 2 - LINE_TOP) : 0;
  nav.style.setProperty("--rail-progress", `${px}px`);
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const initRail = () => {
  const panel = document.getElementById("rail-panel");
  const open = document.getElementById("rail-open");
  const close = document.getElementById("rail-close");
  const backdrop = document.getElementById("rail-backdrop");
  const nav = document.querySelector<HTMLElement>(".rail-nav");
  const desktopMq = window.matchMedia("(min-width: 1024px)");
  const isDesktop = () => desktopMq.matches;
  const isOpen = () => Boolean(panel?.classList.contains("is-open"));

  // Off-screen sheet must not be reachable by Tab / screen readers on mobile.
  const syncInert = () => {
    if (panel) panel.inert = !isDesktop() && !isOpen();
  };

  const setOpen = (next: boolean, restoreFocus = true) => {
    if (!panel) return;
    const was = isOpen();
    panel.classList.toggle("is-open", next);
    backdrop?.classList.toggle("opacity-0", !next);
    backdrop?.classList.toggle("pointer-events-none", !next);
    open?.setAttribute("aria-expanded", String(next));
    document.body.style.overflow = next ? "hidden" : "";
    syncInert();
    if (next) close?.focus();
    else if (was && restoreFocus) open?.focus();
  };

  open?.addEventListener("click", () => setOpen(!isOpen()));
  close?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (!panel || !isOpen()) return;
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    // Keep Tab inside the open sheet.
    if (e.key === "Tab") {
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  // Tapping a section link closes the sheet so the page can scroll to it.
  panel?.querySelectorAll<HTMLAnchorElement>(".rail-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (!isDesktop() && isOpen()) setOpen(false, false);
    });
  });
  // Rotation / resize across the breakpoint: drop the sheet state and scroll lock.
  desktopMq.addEventListener("change", () => {
    if (isOpen()) setOpen(false, false);
    syncInert();
  });
  syncInert();

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
  if (initial) setProgress(nav, initial);

  const markActive = (id: string | null) => {
    let active: HTMLElement | null = null;
    links.forEach((l) => {
      const on = id !== null && (l.dataset.spy ?? "").endsWith(`#${id}`);
      l.setAttribute("aria-current", on ? "true" : "false");
      if (on) active = l;
    });
    setProgress(nav, active);
  };

  const docTop = (el: HTMLElement) =>
    el.getBoundingClientRect().top + window.scrollY;

  const onScroll = () => {
    const line = window.scrollY + window.innerHeight * 0.5;
    let active: HTMLElement | null = null;
    for (const t of targets) {
      if (docTop(t) <= line) active = t;
    }
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2
    ) {
      active = targets[targets.length - 1] ?? active;
    }
    markActive(active ? active.id : null);
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true },
  );

  onScroll();

  window.addEventListener("resize", onScroll);
};

ready(initRail);
