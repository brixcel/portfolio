"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "../data";
import { getGsap } from "../lib/motion";
import ProjectCase from "./ProjectCase";

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
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="container projects-intro">
        <h2 id="projects-title" className="section-label">
          Projects
        </h2>
        <div className="projects-index-wrap">
          <ol ref={listRef} className="projects-index" onPointerLeave={() => setHovered(null)}>
            {projects.map((p, i) => (
              <li key={p.id} style={{ ["--tone" as string]: `var(--project-${p.tone})` }}>
                <a
                  href={`#${p.id}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                  onFocus={() => setHovered(null)}
                >
                  <span className="pi-number">{p.number}</span>
                  <span className="pi-title">{p.title}</span>
                  <span className="pi-kind">{p.kind}</span>
                  <svg className="pi-arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                    <path d="M10 4v12M5 11l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
          <div ref={previewRef} className={`pi-preview${hovered !== null ? " is-visible" : ""}`} aria-hidden="true">
            {projects.map((p, i) => (
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

      {projects.map((p, i) => (
        <ProjectCase key={p.id} project={p} flip={i % 2 === 1} />
      ))}
    </section>
  );
}
