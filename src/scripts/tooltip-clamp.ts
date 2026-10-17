import { ready } from "./ready";

/*
 * Hover/focus popovers are positioned with CSS only (left-0 / centred), so one
 * opened near a screen edge can spill past it on phones. When a popover shows,
 * nudge it back inside the viewport with a margin offset.
 */
const GUTTER = 8;

const clamp = (host: Element) => {
  const tip = host.querySelector<HTMLElement>('[role="tooltip"], [data-tip]');
  if (!tip) return;
  tip.style.marginLeft = "";
  requestAnimationFrame(() => {
    const r = tip.getBoundingClientRect();
    if (r.width === 0) return; // not shown
    const vw = document.documentElement.clientWidth;
    let shift = 0;
    if (r.right > vw - GUTTER) shift = vw - GUTTER - r.right;
    if (r.left + shift < GUTTER) shift = GUTTER - r.left;
    if (shift !== 0) tip.style.marginLeft = `${shift}px`;
  });
};

ready(() => {
  const onShow = (e: Event) => {
    const host = (e.target as Element | null)?.closest?.("[data-tip-host]");
    if (host) clamp(host);
  };
  document.addEventListener("pointerover", onShow, { passive: true });
  document.addEventListener("focusin", onShow);
});
