"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getGsap, onPortfolioReady, prefersReducedMotion } from "../lib/motion";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const q = gsap.utils.selector(root);

    // CSS hides these before hydration (html[data-motion]); take over that state explicitly.
    gsap.set(q(".hero-line > span"), { y: 0, yPercent: 105 });
    gsap.set(q(".hero-rise"), { y: 14, autoAlpha: 0 });
    gsap.set(q(".hero-scene"), { autoAlpha: 0 });
    gsap.set(q(".hero-me"), { y: 30 });

    let intro: gsap.core.Timeline | null = null;
    const cancelReady = onPortfolioReady(() => {
      // Title lines rise, the view fades in behind, and he steps up in front of the "//".
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro = tl;
      tl.to(q(".hero-line > span"), { yPercent: 0, duration: 1, stagger: 0.1 }, 0)
        .to(q(".hero-scene"), { autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 0.1)
        .to(q(".hero-me"), { y: 0, duration: 1.2 }, 0.1)
        .to(q(".hero-rise"), { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.35);
    });

    return () => {
      cancelReady();
      intro?.kill();
    };
  }, []);

  return (
    <section id="home" ref={rootRef} className="hero">
      {/* His real view (faded), the "//" brand mark, then him: the cut-out sits exactly where he stands in the photo */}
      <div className="hero-scene">
        <Image className="hero-vista" src="/assets/hero-vista-fade.webp" alt="" fill priority sizes="(max-width: 900px) 100vw, 44vw" />
        <span className="hero-slash" aria-hidden="true">
          {"//"}
        </span>
        <Image
          className="hero-me"
          src="/assets/hero-me.webp"
          alt="Brexcel Joe Orias, standing with his hands in his pockets"
          width={291}
          height={747}
          priority
          sizes="(max-width: 900px) 38vw, 300px"
        />
        <p className="hero-callout" aria-hidden="true">
          <svg width="64" height="60" viewBox="0 0 64 60">
            <path d="M0 58 L34 6 L62 6" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="62" cy="6" r="3.5" fill="currentColor" />
          </svg>
          <strong>BREXCEL ORIAS</strong>
          <em>{"// SOFTWARE DEVELOPER"}</em>
        </p>
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-prompt hero-rise" aria-hidden="true">
            &gt; brexcel@portfolio:~<span className="hero-cursor" />
          </p>
          <h1 className="hero-title">
            <span className="hero-line mask">
              <span>Software</span>
            </span>{" "}
            <span className="hero-line mask">
              <span>
                developer<span aria-hidden="true">.</span>
              </span>
            </span>
          </h1>
          <p className="hero-lede hero-rise">
            I&rsquo;m Brexcel Joe Orias. I build full&#8209;stack web apps and the pipelines that ship them.
          </p>
          <div className="hero-actions hero-rise">
            <a href="#projects" className="btn btn-primary">
              See the projects <ArrowUpRight />
            </a>
            <a href="/Brexcel-Orias-CV.pdf" download className="btn btn-secondary">
              Download CV
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
              </svg>
            </a>
          </div>
          <ul className="hero-status hero-rise">
            <li>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M22 10 12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c3 2 9 2 12 0v-5" />
              </svg>
              Computer Engineering, URS Antipolo, Class of 2027
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="1" />
                <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" />
              </svg>
              Software Engineer Trainee at Egoist Labs
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Based in the Philippines
            </li>
            <li className="hero-status-open">
              <span className="status-dot" aria-hidden="true" />
              Open to internships and freelance
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
