"use client";

import { useEffect, useRef } from "react";
import type { Project } from "../data";
import { getGsap, prefersReducedMotion } from "../lib/motion";
import ProjectGallery from "./ProjectGallery";
import { TechChip } from "./TechChip";
import Barcode from "./Barcode";

export default function ProjectCase({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { featured } = project;

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      // Title lifts out of its mask once, then drifts against the scroll.
      gsap.fromTo(
        q(".case-title > span"),
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        q(".case-title"),
        { xPercent: flip ? -2.5 : 2.5 },
        {
          xPercent: flip ? 2.5 : -2.5,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 },
        }
      );
      gsap.from(q(".case-details > *"), {
        y: 22,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: q(".case-details")[0], start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [flip]);

  return (
    <article
      id={project.id}
      ref={ref}
      className={`case case--${project.tone}${featured ? " case--featured" : " case--compact"}${flip ? " case--flip" : ""}`}
      style={{ ["--tone" as string]: `var(--project-${project.tone})` }}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="container">
        <header className="case-head">
          <span className="case-number">{project.number}</span>
          <h3 id={`${project.id}-title`} className="case-title mask">
            <span>{project.title}</span>
          </h3>
          <p className="case-kind">
            {project.kind}
            <span className="case-role">{project.role}</span>
          </p>
        </header>

        <div className="case-body">
          <ProjectGallery
            title={project.title}
            slides={project.slides}
            aspect={project.aspect}
            sizes={featured ? "(max-width: 900px) 100vw, 680px" : "(max-width: 900px) 100vw, 600px"}
          />

          <div className="case-details">
            <p className="case-description">{project.description}</p>

            {project.highlights && (
              <ul className="case-highlights">
                {project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}

            {(project.liveHref || project.githubHref) && (
              <div className="case-actions">
                {project.liveHref && (
                  <a href={project.liveHref} target="_blank" rel="noopener noreferrer" className="btn btn-tone">
                    Open live project
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {project.githubHref && (
                  <a href={project.githubHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/github.svg" alt="" width={16} height={16} className="icon-invert" />
                    View code
                    <span className="sr-only"> on GitHub (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}

            {project.note && <p className="case-note">{project.note}</p>}

            <div className="case-stack">
              <div className="case-stack-head">
                <h4>Built with</h4>
                <Barcode height={11} opacity={0.32} />
              </div>
              <ul className="chips">
                {project.stack.map((tech) => (
                  <TechChip key={tech.slug} tech={tech} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
