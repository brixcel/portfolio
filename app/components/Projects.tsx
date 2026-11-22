"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "../data";
import { getGsap } from "../lib/motion";
import ProjectCase from "./ProjectCase";
import SectionHead from "./SectionHead";

// The index lists the full write-ups; the other projects follow under "Also built".
const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

/**
 * Project index (doubles as in-page navigation) followed by each case study.
 * On fine pointers, hovering a row floats that project's first screenshot
 * beside the cursor.
 */
export default function Projects() {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const { gsap } = getGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const xTo = gsap.quickTo(preview, "x", { duration: reduced ? 0 : 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: reduced ? 0 : 0.55, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    list.addEventListener("pointermove", onMove);
    return () => list.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section id="projects" className="projects sec" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          id="projects-title"
          index="Projects"
          title="Selected work"
          sub="Three projects told in full, then four more I’ve built and learned from."
        />
        <div className="projects-index-wrap">
          <ol ref={listRef} className="projects-index" onPointerLeave={() => setHovered(null)}>
            {featured.map((p, i) => (
              <li key={p.id} style={{ ["--tone" as string]: `var(--project-${p.tone})` }}>
                <a
                  href={`#${p.id}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                  onFocus={() => setHovered(null)}
                >
                  <span className="pi-number">{p.number}</span>
                  <span className="pi-title">{p.title}</span>
                  <span className="pi-kind">
                    {p.kind}
                  </span>
                  <svg className="pi-arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                    <path d="M10 4v12M5 11l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
          <div ref={previewRef} className={`pi-preview${hovered !== null ? " is-visible" : ""}`} aria-hidden="true">
            {featured.map((p, i) => (
              <div key={p.id} className={`pi-preview-img${hovered === i ? " is-active" : ""}`}>
                <Image
                  src={p.slides[0].src}
                  alt=""
                  fill
                  sizes="300px"
                  unoptimized={p.slides[0].src.endsWith(".svg")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {featured.map((p, i) => (
        <ProjectCase key={p.id} project={p} flip={i % 2 === 1} />
      ))}

      <div className="container also-built-head">
        <h3 id="also-built" className="also-built-title">Also built</h3>
        <p className="also-built-sub">Shorter write-ups. Open one for screenshots, links and what I did.</p>
      </div>
      {others.map((p) => (
        <ProjectCase key={p.id} project={p} flip={false} />
      ))}
    </section>
  );
}
