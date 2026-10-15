"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap, prefersReducedMotion } from "../lib/motion";

const EMAIL = "brexcel14@gmail.com";
const HEADLINE = ["Let’s build", "something."];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      // The closing card mirrors the hero's title sequence, once.
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } });
      tl.fromTo(
        q(".contact-title .mask > span"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }
      ).fromTo(
        q(".contact-rise"),
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 },
        0.35
      );
    }, root);
    return () => {
      ctx.revert();
      clearTimeout(resetTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" ref={ref} className="contact" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" className="contact-title">
          {HEADLINE.map((line) => (
            <span key={line} className="mask">
              <span>{line}</span>
            </span>
          ))}
        </h2>
        <p className="contact-lede contact-rise">Have a project, a role or a question? My inbox is open.</p>

        <div className="contact-actions contact-rise">
          <a href={`mailto:${EMAIL}`} className="contact-email">
            {EMAIL}
          </a>
          <button type="button" className={`copy-btn${copied ? " is-copied" : ""}`} onClick={copyEmail}>
            <span className="copy-label">Copy email</span>
            <span className="copy-done" aria-hidden={!copied}>
              Copied
            </span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </div>

        <ul className="contact-links contact-rise">
          <li>
            <a href="https://github.com/brixcel" target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <span className="contact-link-value">
                github.com/brixcel<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        </ul>

        <footer className="site-footer">
          <span>&copy; {new Date().getFullYear()} Brexcel Joe M. Orias</span>
          <a href="#home" className="back-top">
            Back to top
          </a>
        </footer>
      </div>
    </section>
  );
}
