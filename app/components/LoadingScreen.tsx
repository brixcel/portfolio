"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VISITED_KEY = "bjo-portfolio-visited";

export default function LoadingScreen() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const loader = loaderRef.current;
    const bar = barRef.current;
    const num = numRef.current;
    if (!loader || !bar || !num) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const notifyReady = () => {
      (window as unknown as { __portfolioReady?: boolean }).__portfolioReady = true;
      window.dispatchEvent(new CustomEvent("portfolio:ready"));
    };

    // Already seen the intro this session (e.g. navigating back to "/") — skip
    // straight to the badge drop instead of replaying the progress curtain.
    let alreadyVisited = false;
    try {
      alreadyVisited = sessionStorage.getItem(VISITED_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode, disabled storage) — fall through to full intro
    }

    if (reduced || alreadyVisited) {
      // Defer to the next frame so sibling effects (e.g. IdBadge's own
      // "portfolio:ready" listener) have mounted before this fires — dispatching
      // synchronously here can race ahead of them and get missed entirely.
      requestAnimationFrame(() => {
        notifyReady();
      });
      setRemoved(true);
      return;
    }

    const markVisited = () => {
      try {
        sessionStorage.setItem(VISITED_KEY, "1");
      } catch {
        // ignore — first-run intro will just replay next time
      }
    };

    const progressObj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        notifyReady();
        markVisited();
        // Smooth upward curtain exit
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.55,
          ease: "power3.inOut",
          onComplete: () => {
            setRemoved(true);
          },
        });
      },
    });

    // 0% -> 100% smooth counter and bar growth
    tl.to(progressObj, {
      value: 100,
      duration: 1.25,
      ease: "power1.inOut",
      onUpdate: () => {
        const rounded = Math.round(progressObj.value);
        if (num) num.textContent = `${rounded}%`;
        if (bar) bar.style.width = `${progressObj.value}%`;
      },
    });

    // Brief hold at 100% before exit
    tl.to({}, { duration: 0.12 });

    return () => {
      tl.kill();
    };
  }, []);

  if (removed) return null;

  return (
    <div
      ref={loaderRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--color-bg)",
        color: "var(--color-text)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        pointerEvents: "auto",
        transition: "background-color 0.3s ease",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(30px, 5.5vw, 46px)",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          margin: "0 0 20px",
          color: "var(--color-text)",
        }}
      >
        BREXCEL<span style={{ color: "var(--color-accent)" }}>.</span>
      </p>

      {/* Progress Track */}
      <div
        style={{
          width: 170,
          maxWidth: "75vw",
          height: 2.5,
          background: "var(--color-divider)",
          borderRadius: 999,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            width: "0%",
            background: "var(--color-accent)",
            borderRadius: 999,
            transition: "none",
          }}
        />
      </div>

      {/* Numerical Indicator */}
      <span
        ref={numRef}
        style={{
          marginTop: 10,
          fontFamily: "monospace",
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: ".1em",
          color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
        }}
      >
        0%
      </span>
    </div>
  );
}
