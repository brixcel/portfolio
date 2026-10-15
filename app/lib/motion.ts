"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** GSAP with ScrollTrigger registered exactly once (client only). */
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ReadyWindow = Window & { __portfolioReady?: boolean };

/**
 * Runs `cb` once the loading screen has handed over (or immediately if it already has).
 * Falls back after `failsafeMs` so content can never stay hidden behind a stalled loader.
 */
export function onPortfolioReady(cb: () => void, failsafeMs = 2600) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };
  if ((window as ReadyWindow).__portfolioReady) {
    run();
    return () => {};
  }
  window.addEventListener("portfolio:ready", run, { once: true });
  const timer = setTimeout(run, failsafeMs);
  return () => {
    window.removeEventListener("portfolio:ready", run);
    clearTimeout(timer);
  };
}
