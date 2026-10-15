"use client";

import { useEffect, useRef, useState } from "react";
import { toggleTheme } from "../lib/theme";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function DeskLamp() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      id="lamp"
      type="button"
      className="lamp"
      onClick={() => {
        ref.current?.classList.remove("is-clicked");
        // restart the little head-nod animation on every press
        void ref.current?.offsetWidth;
        ref.current?.classList.add("is-clicked");
        toggleTheme(ref.current?.querySelector<HTMLElement>(".lamp-shade"));
      }}
      aria-label="Desk lamp: switch between light and dark"
      title="Desk lamp: switch between light and dark"
    >
      <span className="lamp-figure" aria-hidden="true">
        <span className="lamp-base" />
        <span className="lamp-arm" />
        <span className="lamp-head">
          <span className="lamp-neck" />
          <span className="lamp-shade" />
          <span className="lamp-beam" />
        </span>
      </span>
      <span className="lamp-label">
        <span className="lamp-label-light">Lights on</span>
        <span className="lamp-label-dark">Lights off</span>
      </span>
    </button>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Scroll spy: the section crossing the upper third of the viewport is "current".
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Sliding indicator under the active link
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const place = () => {
      const link = nav.querySelector<HTMLElement>(`a[href="#${active}"]`);
      if (!link) return;
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Reading progress hairline
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#home" className="header-logo">
          brexcel<span className="dot">.</span>
        </a>

        <nav ref={navRef} className="desktop-nav" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav-link${active === l.id ? " is-active" : ""}`}
              aria-current={active === l.id ? "location" : undefined}
            >
              {l.label}
            </a>
          ))}
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
        </nav>

        <div className="header-tools">
          <DeskLamp />
          <button
            type="button"
            className={`menu-btn${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Sections" hidden={!menuOpen}>
        {LINKS.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={() => setMenuOpen(false)}
            className={`mobile-nav-link${active === l.id ? " is-active" : ""}`}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <span ref={progressRef} className="read-progress" aria-hidden="true" />
    </header>
  );
}
