"use client";

import { useEffect, useRef } from "react";
import IdBadge from "./id-badge/IdBadge";
import { getGsap, onPortfolioReady, prefersReducedMotion } from "../lib/motion";

const LINES = ["SOFTWARE", "DEVELOPER"];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = getGsap();
    const reduced = prefersReducedMotion();
    const q = gsap.utils.selector(root);

    if (reduced) return;

    // CSS hides these before hydration (html[data-motion]); take over that state explicitly.
    gsap.set(q(".hero-name > span"), { y: 0, yPercent: 110 });
    gsap.set(q(".hero-title .ch"), { y: 0, yPercent: 112, rotate: 7, transformOrigin: "0% 100%" });
    gsap.set(q(".hero-rise"), { y: 18, autoAlpha: 0 });
    gsap.set(q(".badge-hint"), { autoAlpha: 0 });

    let intro: gsap.core.Timeline | null = null;
    const cancelReady = onPortfolioReady(() => {
      intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .to(q(".hero-name > span"), { yPercent: 0, duration: 0.9 }, 0)
        .to(q(".hero-line:nth-child(1) .ch"), { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.035 }, 0.08)
        .to(q(".hero-line:nth-child(2) .ch"), { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.035 }, 0.26)
        .to(q(".hero-rise"), { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09, ease: "power3.out" }, 0.72)
        .to(q(".badge-hint"), { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 1.9);
    });

    // When the strap catches the badge, the type takes the hit too — barely.
    const onImpact = () => {
      gsap.fromTo(
        q(".hero-title"),
        { y: 0 },
        { y: 3, duration: 0.07, ease: "power2.out", yoyo: true, repeat: 1, clearProps: "y" }
      );
    };
    window.addEventListener("badge:impact", onImpact);

    // Scrolling away pulls the two words apart and lets the copy drift up.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      tl.to(q(".hero-line:nth-child(1)"), { xPercent: -7, ease: "none" }, 0)
        .to(q(".hero-line:nth-child(2)"), { xPercent: 5, ease: "none" }, 0)
        .to(q(".hero-copy"), { yPercent: -14, ease: "none" }, 0);
    });

    return () => {
      cancelReady();
      intro?.kill();
      mm.revert();
      window.removeEventListener("badge:impact", onImpact);
    };
  }, []);

  return (
    <section id="home" ref={rootRef} className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-name mask">
            <span>Brexcel Joe M. Orias</span>
          </p>
          <h1 className="hero-title" aria-label="SOFTWARE DEVELOPER">
            {LINES.map((line) => (
              <span key={line} className="hero-line mask" aria-hidden="true">
                {line.split("").map((ch, i) => (
                  <span key={i} className="ch">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-quote hero-rise">
            &ldquo;Building software to solve problems I actually encounter.&rdquo;
          </p>
          <div className="hero-actions hero-rise">
            <a href="#projects" className="btn btn-primary">
              See the projects
            </a>
            <a href="#contact" className="btn btn-secondary">
              Get in touch
            </a>
          </div>
        </div>
        <IdBadge />
      </div>
      <div className="hero-foot hero-rise">
        <span>Computer Engineering student, full-stack developer</span>
        <a href="#about" className="scroll-cue">
          <span className="scroll-cue-line" aria-hidden="true" />
          Scroll
        </a>
      </div>
    </section>
  );
}
