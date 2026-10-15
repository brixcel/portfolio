"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "../lib/motion";

const STATEMENT =
  "4th-year Computer Engineering student working toward becoming a fullstack developer, sharpening that craft at Egoist Labs with the goal of ranking among the top 1% of software engineers.";

const FACTS = [
  { term: "Studying", detail: "Computer Engineering, 4th year" },
  { term: "Practising at", detail: "Egoist Labs" },
  { term: "Working toward", detail: "Full-stack development" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      // Each word inks in as the statement passes through the reading line.
      gsap.fromTo(
        q(".about-statement .w"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: q(".about-statement")[0], start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(q(".about-facts > div"), {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: q(".about-facts")[0], start: "top 88%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="about section">
      <div className="container about-grid">
        <h2 className="section-label">About</h2>
        <div>
          <p className="about-statement">
            {STATEMENT.split(" ").map((word, i) => (
              <span key={i} className="w">
                {word}{" "}
              </span>
            ))}
          </p>
          <dl className="about-facts">
            {FACTS.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
