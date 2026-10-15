"use client";

export const THEME_KEY = "bjo-portfolio-theme";

type Theme = "light" | "dark";

function applyTheme(next: Theme) {
  const root = document.documentElement;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage unavailable — the theme still applies for this visit
  }
  root.setAttribute("data-theme", next);
  root.style.setProperty("--icon-invert", next === "dark" ? "1" : "0");
}

/**
 * Desk-lamp theme switch. The new theme spreads outward from the lamp as a
 * circle of light (View Transitions), falling back to a radial flash where the
 * API is missing. Reduced motion switches instantly.
 */
export function toggleTheme(origin?: HTMLElement | null) {
  const root = document.documentElement;
  const next: Theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    applyTheme(next);
    return;
  }

  const r = origin?.getBoundingClientRect() ?? { left: window.innerWidth - 60, top: 20, width: 40, height: 40 };
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };

  if (doc.startViewTransition) {
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("theme-switching");
    const vt = doc.startViewTransition(() => applyTheme(next));
    vt.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 720, easing: "cubic-bezier(.33,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(() => {});
    vt.finished.finally(() => root.classList.remove("theme-switching"));
    return;
  }

  applyTheme(next);
  document.querySelectorAll(".bjo-flash").forEach((n) => n.remove());
  const flash = document.createElement("div");
  flash.className = "bjo-flash";
  const cx = `${((x / window.innerWidth) * 100).toFixed(1)}%`;
  const cy = `${((y / window.innerHeight) * 100).toFixed(1)}%`;
  const glow = next === "light" ? "#fff6e6" : "#2e2b25";
  const bg = next === "light" ? "#f7f5f0" : "#201e1d";
  flash.style.cssText = `position:fixed;inset:0;z-index:90;pointer-events:none;opacity:.92;background:radial-gradient(circle at ${cx} ${cy}, ${glow} 0%, ${bg} 55%);clip-path:circle(0% at ${cx} ${cy})`;
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    flash.style.transition = "clip-path .62s cubic-bezier(.33,0,.2,1), opacity .62s ease-out";
    flash.style.clipPath = `circle(150% at ${cx} ${cy})`;
    flash.style.opacity = "0";
    setTimeout(() => flash.remove(), 800);
  });
}
