"use client";

import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-divider)",
        width: "100%",
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a
          href="#home"
          className="header-logo"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            color: "var(--color-text)",
            textDecoration: "none",
            letterSpacing: "-.01em",
            flexShrink: 0,
          }}
        >
          brexcel<span style={{ color: "var(--color-accent)" }}>.</span>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="nav-menu desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexWrap: "nowrap",
          }}
        >
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Desk Lamp Button */}
          <button
            id="lamp"
            type="button"
            onClick={toggleTheme}
            aria-label="Desk lamp — switch between light and dark"
            title="Desk lamp — switch between light and dark"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              background: "transparent",
              border: 0,
              cursor: "pointer",
              padding: "2px 4px 0",
              borderRadius: 14,
              color: "var(--color-text)",
              flexShrink: 0,
            }}
          >
            <span style={{ position: "relative", display: "block", width: 44, height: 38 }}>
              <span
                style={{
                  position: "absolute",
                  left: 5,
                  bottom: 0,
                  width: 23,
                  height: 4,
                  borderRadius: 999,
                  background: "var(--color-neutral-400)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  bottom: 3,
                  width: 4,
                  height: 23,
                  borderRadius: 999,
                  background: "var(--color-neutral-400)",
                  transform: "rotate(-16deg)",
                  transformOrigin: "50% 100%",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 17,
                  top: 2,
                  width: 5,
                  height: 13,
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
                  top: 7,
                  width: 23,
                  height: 14,
                  clipPath: "polygon(0 100%, 22% 0, 78% 0, 100% 100%)",
                  transform: "rotate(14deg)",
                }}
              />
              <span
                id="lamp-beam"
                style={{
                  position: "absolute",
                  right: -4,
                  top: 21,
                  width: 38,
                  height: 28,
                  background:
                    "radial-gradient(120% 90% at 42% 0%, color-mix(in srgb, #ffd9a0 78%, transparent), transparent 72%)",
                  clipPath: "polygon(30% 0, 62% 0, 100% 100%, 0 100%)",
                  transition: "opacity .35s ease",
                }}
              />
            </span>
            <span
              className="lamp-label-container"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                paddingBottom: 2,
                whiteSpace: "nowrap",
              }}
            >
              <span className="lamp-label-light">Lights on</span>
              <span className="lamp-label-dark">Lights off</span>
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            style={{
              background: "transparent",
              border: "1px solid var(--color-divider)",
              borderRadius: "var(--radius-sm)",
              padding: "7px 9px",
              cursor: "pointer",
              color: "var(--color-text)",
              display: "none",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 36,
            }}
          >
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                transition: "transform 0.25s ease",
                transform: mobileMenuOpen ? "rotate(45deg) translate(2px, 6px)" : "none",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                opacity: mobileMenuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                transition: "transform 0.25s ease",
                transform: mobileMenuOpen ? "rotate(-45deg) translate(2px, -6px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          className="mobile-nav-drawer"
          style={{
            borderTop: "1px solid var(--color-divider)",
            background: "color-mix(in srgb, var(--color-bg) 96%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "14px 18px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <a
            href="#home"
            onClick={handleLinkClick}
            className="mobile-nav-link"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={handleLinkClick}
            className="mobile-nav-link"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={handleLinkClick}
            className="mobile-nav-link"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={handleLinkClick}
            className="mobile-nav-link"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
