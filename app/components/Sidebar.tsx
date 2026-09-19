"use client";

import { useState, useEffect } from "react";

export function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "light" ? "dark" : "light";

  localStorage.setItem("bjo-portfolio-theme", next);
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.setProperty("--icon-invert", next === "dark" ? "1" : "0");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  document.querySelectorAll(".bjo-flash").forEach((n) => n.remove());
  const lamp = document.querySelector("#lamp") || document.querySelector("#lamp-mobile");
  const flash = document.createElement("div");
  flash.className = "bjo-flash";
  flash.style.cssText = "position:fixed; inset:0; z-index:90; pointer-events:none";
  document.body.appendChild(flash);

  const r = lamp
    ? lamp.getBoundingClientRect()
    : { left: 40, top: window.innerHeight - 80, width: 40, height: 40 };
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

function DeskLampIcon({ id = "lamp" }: { id?: string }) {
  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label="Desk lamp — switch between light and dark"
      title="Desk lamp — switch between light and dark"
      className="lamp-toggle-btn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "color-mix(in srgb, var(--color-surface) 65%, transparent)",
        border: "1px solid var(--color-divider)",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: 12,
        color: "var(--color-text)",
        width: "100%",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
      }}
    >
      <span style={{ position: "relative", display: "block", width: 34, height: 28, flexShrink: 0 }}>
        <span
          style={{
            position: "absolute",
            left: 3,
            bottom: 0,
            width: 18,
            height: 3,
            borderRadius: 999,
            background: "var(--color-neutral-400)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 10,
            bottom: 2,
            width: 3,
            height: 18,
            borderRadius: 999,
            background: "var(--color-neutral-400)",
            transform: "rotate(-16deg)",
            transformOrigin: "50% 100%",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 12,
            top: 1,
            width: 4,
            height: 11,
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
            top: 5,
            width: 18,
            height: 11,
            clipPath: "polygon(0 100%, 22% 0, 78% 0, 100% 100%)",
            transform: "rotate(14deg)",
          }}
        />
        <span
          id="lamp-beam"
          style={{
            position: "absolute",
            right: -3,
            top: 15,
            width: 28,
            height: 20,
            background:
              "radial-gradient(120% 90% at 42% 0%, color-mix(in srgb, #ffd9a0 78%, transparent), transparent 72%)",
            clipPath: "polygon(30% 0, 62% 0, 100% 100%, 0 100%)",
            transition: "opacity .35s ease",
          }}
        />
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".04em",
          color: "color-mix(in srgb, var(--color-text) 75%, transparent)",
        }}
      >
        <span className="lamp-label-light">Lights on</span>
        <span className="lamp-label-dark">Lights off</span>
      </span>
    </button>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "contact"];
      const scrollY = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ==================== DESKTOP FIXED SIDEBAR ==================== */}
      <aside
        className="bjo-sidebar"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          zIndex: 60,
          background: "var(--color-bg)",
          borderRight: "1px solid var(--color-divider)",
          padding: "28px 20px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
        }}
      >
        {/* Top Section */}
        <div>
          {/* Brand / Logo */}
          <div style={{ marginBottom: 32 }}>
            <a
              href="#home"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                color: "var(--color-text)",
                textDecoration: "none",
                letterSpacing: "-.02em",
                display: "inline-block",
              }}
            >
              Brexcel Joe<span style={{ color: "var(--color-accent)" }}>.</span>
            </a>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "color-mix(in srgb, var(--color-text) 50%, transparent)",
                fontWeight: 600,
              }}
            >
              Software Developer
            </p>
          </div>

          {/* Primary Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 28 }}>
            <a
              href="#home"
              className={`sidebar-nav-item ${activeSection === "home" ? "is-active" : ""}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </a>
            <a
              href="#about"
              className={`sidebar-nav-item ${activeSection === "about" ? "is-active" : ""}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About</span>
            </a>
            <a
              href="#projects"
              className={`sidebar-nav-item ${activeSection === "projects" ? "is-active" : ""}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Projects</span>
            </a>
            <a
              href="#contact"
              className={`sidebar-nav-item ${activeSection === "contact" ? "is-active" : ""}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Contact</span>
            </a>
          </nav>

          {/* Featured Projects Links */}
          <div style={{ marginBottom: 28 }}>
            <p className="sidebar-group-title">Featured Work</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <a href="#projects" className="sidebar-sub-item">
                <span style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.45, fontFamily: "var(--font-mono, monospace)", minWidth: 16 }}>01</span>
                <span className="sidebar-dot" style={{ background: "var(--color-accent)" }} />
                <span>Synctask</span>
              </a>
              <a href="#ursachub-social" className="sidebar-sub-item">
                <span style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.45, fontFamily: "var(--font-mono, monospace)", minWidth: 16 }}>02</span>
                <span className="sidebar-dot" style={{ background: "#0284c7" }} />
                <span>UrsacHub Social</span>
              </a>
              <a href="#ursachub" className="sidebar-sub-item">
                <span style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.45, fontFamily: "var(--font-mono, monospace)", minWidth: 16 }}>03</span>
                <span className="sidebar-dot" style={{ background: "var(--color-accent-2)" }} />
                <span>UrsacHub</span>
              </a>
              <a href="#ursac-dsa" className="sidebar-sub-item">
                <span style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.45, fontFamily: "var(--font-mono, monospace)", minWidth: 16 }}>04</span>
                <span className="sidebar-dot" style={{ background: "#2563eb" }} />
                <span>DSA Workbench</span>
              </a>
              <a href="#photobooth" className="sidebar-sub-item">
                <span style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.45, fontFamily: "var(--font-mono, monospace)", minWidth: 16 }}>05</span>
                <span className="sidebar-dot" style={{ background: "#b83253" }} />
                <span>Photo Booth</span>
              </a>
            </div>
          </div>

          {/* Connect / Socials */}
          <div>
            <p className="sidebar-group-title">Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <a
                href="https://github.com/brixcel"
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-sub-item"
              >
                <span>GitHub</span>
                <span style={{ fontSize: 11, opacity: 0.5 }}>↗</span>
              </a>
              <a
                href="mailto:brexcel14@gmail.com"
                className="sidebar-sub-item"
              >
                <span>Email</span>
                <span style={{ fontSize: 11, opacity: 0.5 }}>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ paddingTop: 20, borderTop: "1px solid var(--color-divider)" }}>
          {/* Desk Lamp Toggle */}
          <div style={{ marginBottom: 16 }}>
            <DeskLampIcon id="lamp" />
          </div>

          {/* Contact Blurb */}
          <div style={{ fontSize: 11.5, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", lineHeight: 1.45 }}>
            <p style={{ margin: "0 0 3px" }}>For work &amp; collaboration:</p>
            <a
              href="mailto:brexcel14@gmail.com"
              style={{
                color: "var(--color-text)",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
                wordBreak: "break-all",
              }}
            >
              <span>✉</span> brexcel14@gmail.com
            </a>
          </div>
        </div>
      </aside>

      {/* ==================== MOBILE TOP NAVBAR ==================== */}
      <header
        className="mobile-topbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 70,
          background: "color-mix(in srgb, var(--color-bg) 92%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--color-divider)",
          padding: "12px 18px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <a
          href="#home"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            color: "var(--color-text)",
            textDecoration: "none",
            letterSpacing: "-.01em",
          }}
        >
          Brexcel Joe<span style={{ color: "var(--color-accent)" }}>.</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            id="lamp-mobile"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: "transparent",
              border: "1px solid var(--color-divider)",
              borderRadius: 8,
              padding: "5px 8px",
              cursor: "pointer",
              fontSize: 14,
              color: "var(--color-text)",
            }}
          >
            💡
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: "transparent",
              border: "1px solid var(--color-divider)",
              borderRadius: 8,
              padding: "7px 9px",
              cursor: "pointer",
              color: "var(--color-text)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                transition: "transform 0.2s ease",
                transform: mobileOpen ? "rotate(45deg) translate(2px, 6px)" : "none",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              style={{
                width: 18,
                height: 2,
                background: "currentColor",
                borderRadius: 99,
                transition: "transform 0.2s ease",
                transform: mobileOpen ? "rotate(-45deg) translate(2px, -6px)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: "fixed",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 69,
            background: "var(--color-bg)",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <a
              href="#home"
              onClick={() => setMobileOpen(false)}
              className="sidebar-nav-item"
              style={{ fontSize: 16, padding: "12px 14px" }}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileOpen(false)}
              className="sidebar-nav-item"
              style={{ fontSize: 16, padding: "12px 14px" }}
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileOpen(false)}
              className="sidebar-nav-item"
              style={{ fontSize: 16, padding: "12px 14px" }}
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="sidebar-nav-item"
              style={{ fontSize: 16, padding: "12px 14px" }}
            >
              Contact
            </a>
          </nav>

          <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid var(--color-divider)" }}>
            <p style={{ fontSize: 12, margin: "0 0 6px", color: "color-mix(in srgb, var(--color-text) 60%, transparent)" }}>
              Contact:
            </p>
            <a
              href="mailto:brexcel14@gmail.com"
              style={{ color: "var(--color-text)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}
            >
              brexcel14@gmail.com
            </a>
          </div>
        </div>
      )}
    </>
  );
}
