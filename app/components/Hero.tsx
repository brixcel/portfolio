"use client";

import { useEffect, useRef } from "react";
import HeroDesk from "./HeroDesk";
import { getGsap, onPortfolioReady, prefersReducedMotion } from "../lib/motion";

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
    gsap.set(q(".desk3d"), { y: 18, autoAlpha: 0 });

    let intro: gsap.core.Timeline | null = null;
    const cancelReady = onPortfolioReady(() => {
      // The lamp flicker itself plays in the 3D scene once the model has loaded (DeskScene).
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro = tl;
      tl.to(q(".hero-line > span"), { yPercent: 0, duration: 1, stagger: 0.1 }, 0)
        .to(q(".hero-rise"), { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.35)
        .to(q(".desk3d"), { y: 0, autoAlpha: 1, duration: 1 }, 0.4);
    });

    return () => {
      cancelReady();
      intro?.kill();
    };
  }, []);

  return (
    <section id="home" ref={rootRef} className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-line mask">
              <span>software</span>
            </span>{" "}
            <span className="hero-line mask">
              <span>developer</span>
            </span>
          </h1>
          <p className="hero-lede hero-rise">
            I&rsquo;m Brexcel Joe Orias. I build full&#8209;stack web apps and the pipelines that ship them.
          </p>
          <ul className="hero-status hero-rise">
            <li>Software Engineer Trainee at Egoist Labs</li>
            <li>Computer Engineering, URS Antipolo, Class of 2027</li>
            <li className="hero-status-open">
              <span className="status-dot" aria-hidden="true" />
              Open to internships and freelance
            </li>
          </ul>
          <div className="hero-actions hero-rise">
            <a href="#projects" className="btn btn-primary">
              See the projects
            </a>
            <a href="/Brexcel-Orias-CV.pdf" download className="btn btn-secondary">
              Download CV
            </a>
          </div>
        </div>
        <HeroDesk />
      </div>
    </section>
  );
}
