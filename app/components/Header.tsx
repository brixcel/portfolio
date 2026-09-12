"use client";

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "light" ? "dark" : "light";

  localStorage.setItem("bjo-portfolio-theme", next);
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.setProperty("--icon-invert", next === "dark" ? "1" : "0");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  document.querySelectorAll(".bjo-flash").forEach((n) => n.remove());
  const lamp = document.querySelector("#lamp");
  const flash = document.createElement("div");
  flash.className = "bjo-flash";
  flash.style.cssText = "position:fixed; inset:0; z-index:90; pointer-events:none";
  document.body.appendChild(flash);

  const r = lamp
    ? lamp.getBoundingClientRect()
    : { left: window.innerWidth - 60, top: 40, width: 40, height: 40 };
  const cx = (((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(1) + "%";
  const cy = (((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(1) + "%";
  const bg = next === "light" ? "#f5ead8" : "#201e1d";
  const glow = next === "light" ? "#fff6e6" : "#2e2b25";

  flash.style.transition = "none";
  flash.style.background = `radial-gradient(circle at ${cx} ${cy}, ${glow} 0%, ${bg} 55%)`;
  flash.style.clipPath = `circle(0% at ${cx} ${cy})`;
  flash.style.opacity = ".92";
  setTimeout(() => {
    flash.style.transition = "clip-path .62s cubic-bezier(.33,0,.2,1), opacity .62s ease-out";
    flash.style.clipPath = `circle(150% at ${cx} ${cy})`;
    flash.style.opacity = "0";
    setTimeout(() => flash.remove(), 800);
  }, 24);
}

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <style>{`
        #lamp-shade { background: var(--color-accent-600); }
        :root[data-theme="dark"] #lamp-shade { background: var(--color-neutral-500); }
        #lamp-beam { opacity: 1; }
        :root[data-theme="dark"] #lamp-beam { opacity: 0; }
        .lamp-label-dark { display: none; }
        :root[data-theme="dark"] .lamp-label-light { display: none; }
        :root[data-theme="dark"] .lamp-label-dark { display: inline; }
      `}</style>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <a
          href="#home"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 19,
            color: "var(--color-text)",
            textDecoration: "none",
            letterSpacing: "-.01em",
          }}
        >
          brexcel<span style={{ color: "var(--color-accent)" }}>.</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>
        <button
          id="lamp"
          type="button"
          onClick={toggleTheme}
          aria-label="Desk lamp — switch between light and dark"
          title="Desk lamp — switch between light and dark"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "4px 6px 0",
            borderRadius: 14,
            color: "var(--color-text)",
          }}
        >
          <span style={{ position: "relative", display: "block", width: 52, height: 44 }}>
            <span
              style={{
                position: "absolute",
                left: 6,
                bottom: 0,
                width: 26,
                height: 5,
                borderRadius: 999,
                background: "var(--color-neutral-400)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 17,
                bottom: 3,
                width: 5,
                height: 26,
                borderRadius: 999,
                background: "var(--color-neutral-400)",
                transform: "rotate(-16deg)",
                transformOrigin: "50% 100%",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 20,
                top: 2,
                width: 6,
                height: 16,
                borderRadius: 999,
                background: "var(--color-neutral-400)",
                transform: "rotate(52deg)",
                transformOrigin: "0 0",
              }}
            />
            <span
              id="lamp-shade"
              style={{
                position: "absolute",
                right: 1,
                top: 9,
                width: 26,
                height: 17,
                clipPath: "polygon(0 100%, 22% 0, 78% 0, 100% 100%)",
                transform: "rotate(14deg)",
              }}
            />
            <span
              id="lamp-beam"
              style={{
                position: "absolute",
                right: -4,
                top: 24,
                width: 44,
                height: 34,
                background:
                  "radial-gradient(120% 90% at 42% 0%, color-mix(in srgb, #ffd9a0 78%, transparent), transparent 72%)",
                clipPath: "polygon(30% 0, 62% 0, 100% 100%, 0 100%)",
                transition: "opacity .35s ease",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
              paddingBottom: 2,
            }}
          >
            <span className="lamp-label-light">Lights on</span>
            <span className="lamp-label-dark">Lights off</span>
          </span>
        </button>
      </div>
    </header>
  );
}
