import { ready } from "./ready";

const levelFor = (n: number): number => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 5) return 3;
  return 4;
};

const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const load = async (trigger: HTMLElement) => {
  if (trigger.dataset.activityLoaded === "true") return;
  trigger.dataset.activityLoaded = "true";

  const grid = trigger.querySelector<HTMLElement>("[data-activity-grid]");
  if (!grid) return;

  const user = trigger.dataset.activityUser ?? "";
  if (!user) {
    grid.textContent = "Activity unavailable.";
    return;
  }

  try {
    // The events API returns at most 100 per page (300 total, 90 days); one page
    // only covers a few busy days, so walk pages until we pass the window.
    const since = Date.now() - 91 * 86_400_000;
    const events: Array<{ created_at?: string }> = [];
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100&page=${page}`,
      );
      if (!res.ok) {
        if (page === 1) throw new Error(`HTTP ${res.status}`);
        break;
      }
      const batch = (await res.json()) as Array<{ created_at?: string }>;
      events.push(...batch);
      const oldest = batch[batch.length - 1]?.created_at;
      if (batch.length < 100 || !oldest || Date.parse(oldest) < since) break;
    }

    const counts = new Map<string, number>();
    events.forEach((e) => {
      if (!e.created_at) return;
      const key = dayKey(new Date(e.created_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    grid.replaceChildren();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const n = counts.get(dayKey(d)) ?? 0;
      const cell = document.createElement("span");
      cell.className =
        "w-3.5 h-3.5 rounded-[3px] transition-transform hover:scale-110 motion-reduce:transition-none";
      cell.style.backgroundColor = `var(--hm-${levelFor(n)})`;
      cell.title = `${d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${n} events`;
      grid.appendChild(cell);
    }
  } catch {
    grid.textContent = "Activity unavailable.";
  }
};

ready(() => {
  document
    .querySelectorAll<HTMLElement>("[data-activity-trigger]")
    .forEach((trigger) => {
      trigger.addEventListener("pointerenter", () => void load(trigger), { once: true });
      trigger.addEventListener("focusin", () => void load(trigger), { once: true });
    });
});
