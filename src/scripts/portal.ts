/*
 * Portal Easter Egg: Spawns glowing ceiling and floor portal rings,
 * drops an infinitely looping Companion Cube, and displays GLaDOS dialog.
 */
const initPortalEgg = () => {
  const trigger = document.getElementById("heart-trigger");
  if (!trigger) return;

  let activated = false;
  const spawned: HTMLElement[] = [];
  let onKey: ((e: KeyboardEvent) => void) | null = null;

  /** Tear everything down so the page is usable again (and the egg can re-run). */
  const cleanup = () => {
    spawned.splice(0).forEach((el) => el.remove());
    document.querySelectorAll(".glados-terminal").forEach((el) => el.remove());
    if (onKey) document.removeEventListener("keydown", onKey);
    onKey = null;
    activated = false;
  };

  const run = () => {
    if (activated) return;
    activated = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // 1. Inject fully isolated hardware-accelerated Portal styles (once)
    if (!document.getElementById("portal-egg-style")) {
      const style = document.createElement("style");
      style.id = "portal-egg-style";
      style.innerHTML = `
      .portal-ring {
        position: fixed;
        left: 50%;
        transform: translateX(-50%) rotateX(75deg);
        width: 100px;
        height: 35px;
        border-radius: 50%;
        z-index: 99999;
        pointer-events: none;
        border: 4px solid;
      }
      .portal-blue {
        top: 2px;
        border-color: #3b82f6;
        box-shadow: 0 0 20px #3b82f6, inset 0 0 20px #3b82f6;
        animation: portal-spin 4s linear infinite;
      }
      .portal-orange {
        bottom: 2px;
        border-color: #f97316;
        box-shadow: 0 0 20px #f97316, inset 0 0 20px #f97316;
        animation: portal-spin 4s linear infinite;
      }
      @keyframes portal-spin {
        from { transform: translateX(-50%) rotateX(75deg) rotate(0deg); }
        to { transform: translateX(-50%) rotateX(75deg) rotate(360deg); }
      }
      .companion-cube {
        position: fixed;
        left: 50%;
        margin-left: -20px;
        width: 40px;
        height: 40px;
        z-index: 99998;
        pointer-events: auto;
        cursor: grab;
        animation: terminal-velocity 2.2s linear 6;
      }
      @keyframes terminal-velocity {
        0% {
          top: -40px;
          transform: rotate(0deg) scaleY(1.15);
          opacity: 0;
        }
        5% {
          opacity: 1;
          transform: rotate(18deg) scaleY(1);
        }
        95% {
          opacity: 1;
          transform: rotate(342deg) scaleY(1);
        }
        100% {
          top: calc(100vh + 40px);
          transform: rotate(360deg) scaleY(1.15);
          opacity: 0;
        }
      }
      .glados-terminal {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(12, 12, 12, 0.95);
        border: 1px solid #f97316;
        color: #f97316;
        font-family: monospace;
        padding: 16px;
        border-radius: 12px;
        font-size: 11px;
        max-width: 90%;
        width: 320px;
        z-index: 100000;
        box-shadow: 0 10px 35px rgba(0,0,0,0.8);
        pointer-events: none;
        opacity: 0;
        animation: glados-fade 6.5s ease-in-out forwards;
      }
      @keyframes glados-fade {
        0% { opacity: 0; transform: translate(-50%, -10px); }
        10%, 85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -10px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .portal-blue, .portal-orange { animation: none; }
        .companion-cube { display: none; }
        .glados-terminal { animation: none; opacity: 1; }
      }
    `;
      document.head.appendChild(style);
    }

    // 2. Create ceiling (Blue) and floor (Orange) Portal elements
    const bluePortal = document.createElement("div");
    bluePortal.className = "portal-ring portal-blue";
    document.body.appendChild(bluePortal);
    spawned.push(bluePortal);

    const orangePortal = document.createElement("div");
    orangePortal.className = "portal-ring portal-orange";
    document.body.appendChild(orangePortal);
    spawned.push(orangePortal);

    // 3. Create the flat-vector Weighted Companion Cube SVG
    const cube = document.createElement("div");
    cube.className = "companion-cube";
    cube.innerHTML = `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="80" height="80" rx="12" fill="#52525b" stroke="#18181b" stroke-width="6"/>
        <rect x="15" y="15" width="20" height="20" rx="4" fill="#a1a1aa"/>
        <rect x="65" y="15" width="20" height="20" rx="4" fill="#a1a1aa"/>
        <rect x="15" y="65" width="20" height="20" rx="4" fill="#a1a1aa"/>
        <rect x="65" y="65" width="20" height="20" rx="4" fill="#a1a1aa"/>
        <circle cx="50" cy="50" r="22" fill="#e4e4e7" stroke="#18181b" stroke-width="4"/>
        <path d="M50 60 C42 50, 42 43, 50 37 C58 43, 58 50, 50 60 Z" fill="#ec4899"/>
      </svg>
    `;
    document.body.appendChild(cube);
    spawned.push(cube);
    // The cube falls a fixed number of loops, then the whole egg packs itself away.
    cube.addEventListener("animationend", cleanup);

    // 4. Create the GLaDOS console container
    const terminal = document.createElement("div");
    terminal.className = "glados-terminal";
    terminal.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">[GLaDOS v3.5-Flash]:</div>
      <div id="glados-text"></div>
    `;
    document.body.appendChild(terminal);
    spawned.push(terminal);
    if (reduced) window.setTimeout(cleanup, 8000);

    onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cleanup();
    };
    document.addEventListener("keydown", onKey);

    const quotes = [
      "Hello and again welcome to the Aperture Science computer-aided enrichment center.",
      "The Enrichment Center reminds you that the Weighted Companion Cube will never threaten to stab you and, in fact, cannot speak.",
      "Please note that we have added a consequence for failure. Any contact with the chamber floor will result in an unsatisfactory mark.",
      "The cake is a lie. But Shaheen's marketing experience and full-stack architecture is 100% certified.",
    ];

    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const textContainer = document.getElementById("glados-text");
    if (textContainer && reduced) {
      textContainer.textContent = selectedQuote;
    } else if (textContainer) {
      let charIndex = 0;
      const typeWriter = () => {
        if (charIndex < selectedQuote.length) {
          textContainer.textContent += selectedQuote.charAt(charIndex);
          charIndex++;
          setTimeout(typeWriter, 35);
        }
      };
      typeWriter();
    }

    // 5. Interactive click on the cube: spikes loop velocity and prints reactions
    cube.addEventListener("click", (e) => {
      e.stopPropagation();
      cube.style.animationDuration = "1.1s"; // Double acceleration speed
      setTimeout(() => {
        cube.style.animationDuration = "2.2s"; // Restore default speed
      }, 2200);

      const reactions = [
        "Stop that. We must proceed with the software testing.",
        "Enrichment Center regulations forbid aggressive interaction with the Cube.",
        "Excellent speed index. The portal loops are running within stable parameters.",
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];

      const existingTerminal = document.querySelector(".glados-terminal");
      if (existingTerminal) {
        existingTerminal.remove();
      }

      const newTerminal = document.createElement("div");
      newTerminal.className = "glados-terminal";
      newTerminal.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">[GLaDOS v3.5-Flash]:</div>
        <div>${reaction}</div>
      `;
      document.body.appendChild(newTerminal);
    });
  };

  trigger.addEventListener("click", run);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      run();
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortalEgg);
} else {
  initPortalEgg();
}

export {};
