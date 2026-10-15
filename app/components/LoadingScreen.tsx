"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const VISITED_KEY = "bjo-portfolio-visited";
const WORD = "BREXCEL";

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

    // Already seen the intro this session — skip straight to the badge drop.
    let alreadyVisited = false;
    try {
      alreadyVisited = sessionStorage.getItem(VISITED_KEY) === "1";
    } catch {
      // sessionStorage unavailable — fall through to the full intro
    }

    if (reduced || alreadyVisited) {
      // Next frame, so sibling effects listening for "portfolio:ready" have mounted.
      const frame = requestAnimationFrame(() => {
        notifyReady();
        setRemoved(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const markVisited = () => {
      try {
        sessionStorage.setItem(VISITED_KEY, "1");
      } catch {}
    };

    const progress = { value: 0 };
    const letters = loader.querySelectorAll(".loader-word .ch");

    const tl = gsap.timeline();
    tl.fromTo(letters, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.04 }, 0)
      .to(
        progress,
        {
          value: 100,
          duration: 1.2,
          ease: "power1.inOut",
          onUpdate: () => {
            num.textContent = `${Math.round(progress.value)}%`;
            bar.style.transform = `scaleX(${progress.value / 100})`;
          },
        },
        0.1
      )
      .add(() => {
        notifyReady();
        markVisited();
      }, "+=0.1")
      // Letters lift away a beat ahead of the curtain
      .to(letters, { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.025 }, "<")
      .to(".loader-meta", { autoAlpha: 0, duration: 0.3 }, "<")
      .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" }, "<0.15")
      .add(() => setRemoved(true));

    return () => {
      tl.kill();
    };
  }, []);

  if (removed) return null;

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      <p className="loader-word mask">
        {WORD.split("").map((ch, i) => (
          <span key={i} className="ch">
            {ch}
          </span>
        ))}
        <span className="ch dot">.</span>
      </p>
      <div className="loader-meta">
        <div className="loader-track">
          <div ref={barRef} className="loader-bar" />
        </div>
        <span ref={numRef} className="loader-num">
          0%
        </span>
      </div>
    </div>
  );
}
