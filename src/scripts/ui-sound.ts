import { ready } from "./ready";

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
    osc.connect(gain);
    gain.connect(ctx.destination);
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
  try {
    enabled = localStorage.getItem("sound") === "on";
  } catch {}
  paint(btn);
  btn.addEventListener("click", () => {
    enabled = !enabled;
    try {
      localStorage.setItem("sound", enabled ? "on" : "off");
    } catch {}
    paint(btn);
    crisp();
  });
  document.addEventListener("pointerdown", (e) => {
    const hit = (e.target as Element | null)?.closest?.('[data-ui-sound="crisp"]');
    if (hit) crisp();
  });
});
