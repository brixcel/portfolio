"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "../lib/motion";

// Each fact is something an interviewer can check (PRODUCT.md).
const FACTS = [
  { value: "37", label: "C# scripts in AR-DUINO" },
  { value: "3–5 min", label: "Deploys, down from 15–30 manual" },
  { value: "5", label: "Person team led" },
];

const FOCUS = [
  {
    title: "Reliable software",
    text: "Code that keeps working after the demo, shipped through a pipeline instead of by hand.",
  },
  {
    title: "Understanding systems",
    text: "How the database, the API, the interface and the deploy fit together, so a fix lands in the right layer.",
  },
  {
    title: "Getting better each build",
    text: "Every project teaches the next one. I would rather understand why something broke than patch around it.",
  },
];

const INTERESTS = [
  "Full-stack web",
  "Backend & APIs",
  "Database design",
  "DevOps & CI/CD",
  "Software architecture",
  "Automation",
  "3D simulation & AR",
  "Hardware projects",
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.from(q(".about-reveal"), {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="about sec"
      aria-labelledby="about-title"
    >
      {/* Full-width grid: copy sits on the container's left edge, the portrait frame runs to the screen edge. */}
      <div className="about-top">
        <div className="about-copy">
          <h2 id="about-title" className="about-title">
            About me
          </h2>
          <div className="about-text about-reveal">
            <p>
              I&rsquo;m <strong>Brexcel Orias</strong>, a Computer Engineering
              student at URS Antipolo and a Software Engineer Intern at Egoist
              Labs, where I write the GitHub Actions workflows that deploy our
              frontends.
            </p>
            <p>On our AR-DUINO thesis I built the 3D circuit simulation.</p>
          </div>
          <a className="about-journey about-reveal" href="#journey">
            My Journey
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
        <figure className="about-stage">
          <span className="about-stage-slab" aria-hidden="true" />
          <span className="about-stage-tile" aria-hidden="true" />
          <span className="about-stage-corner" aria-hidden="true" />
          <span className="about-stage-frame" aria-hidden="true" />
          <span className="about-stage-person">
            <Image
              src="/assets/about-portrait-wicker.webp"
              alt="Brexcel Orias seated, looking to the side"
              fill
              sizes="(max-width: 860px) 110vw, 60vw"
            />
          </span>
          <span className="about-stage-base" aria-hidden="true" />
          <span className="about-stage-line" aria-hidden="true" />
          <span className="about-stage-block" aria-hidden="true" />
        </figure>
        <dl className="about-facts about-reveal">
          {FACTS.map((f) => (
            <div key={f.value}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="container">
        <div className="about-focus">
          <h3 className="mono-label">What I care about</h3>
          <ol>
            {FOCUS.map((f, i) => (
              <li key={f.title} className="about-reveal">
                <span className="about-focus-n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="about-interests about-reveal">
          <h3 className="mono-label">Exploring</h3>
          <ul>
            {INTERESTS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
