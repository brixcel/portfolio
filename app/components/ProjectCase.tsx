"use client";

import { useEffect, useRef } from "react";
import type { Project } from "../data";
import { getGsap, prefersReducedMotion } from "../lib/motion";
import ProjectGallery from "./ProjectGallery";
import { TechChip } from "./TechChip";
import Barcode from "./Barcode";

export default function ProjectCase({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const jumpToMyPart = () => {
    const v = videoRef.current;
    if (!v || project.video?.jumpTo === undefined) return;
    const go = () => {
      v.currentTime = project.video!.jumpTo!;
      v.play().catch(() => {});
    };
    // preload="none" means no metadata yet; seek once the browser knows the duration.
    if (v.readyState >= 1) go();
    else {
      v.addEventListener("loadedmetadata", go, { once: true });
      v.load();
    }
    v.focus({ preventScroll: true });
  };
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
      if (featured) gsap.from(q(".case-details > *"), {
        y: 22,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: q(".case-details")[0], start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [flip, featured]);

  // A compact case opens itself when a link (project index, journey) targets it.
  useEffect(() => {
    if (featured) return;
    const open = () => {
      const d = ref.current?.querySelector("details");
      if (d && window.location.hash === "#" + project.id) d.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [featured, project.id]);

  const head = (
    <>
          <span className="case-number">{project.number}</span>
          <h3 id={`${project.id}-title`} className="case-title mask">
            <span>{project.title}</span>
          </h3>
          <p className="case-kind">
            {project.kind}
            <span className="case-role">{project.role}</span>
          </p>
    </>
  );
  const gallery = (
    <ProjectGallery
      title={project.title}
      slides={project.slides}
      aspect={project.aspect}
      sizes={featured ? "(max-width: 900px) 100vw, 680px" : "(max-width: 900px) 100vw, 600px"}
    />
  );
  const body = (
        <div className="case-body">
          {project.video ? (
            // The clip sits under the gallery so the two columns stay balanced.
            <div className="case-media">
              {gallery}
              <figure className="case-video">
                <video
                  ref={videoRef}
                  style={project.video.aspect ? { aspectRatio: project.video.aspect } : undefined}
                  controls
                  muted
                  playsInline
                  preload="none"
                  poster={project.video.poster}
                  aria-label={project.video.label}
                >
                  <source src={project.video.src} type="video/mp4" />
                </video>
                <figcaption>
                  <span>{project.video.caption}</span>
                  {project.video.jumpTo !== undefined && (
                    <button type="button" className="video-jump" onClick={jumpToMyPart}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                        <path d="M7 4.5v15l12-7.5z" />
                      </svg>
                      Jump to my part (0:{String(project.video.jumpTo).padStart(2, "0")})
                    </button>
                  )}
                </figcaption>
              </figure>
            </div>
          ) : (
            gallery
          )}

          <div className="case-details">
            <p className="case-description">{project.description}</p>

            {project.story && (
              <dl className="case-story">
                {project.story.map((s) => (
                  <div key={s.label} className="case-story-row">
                    <dt>{s.label}</dt>
                    <dd>{s.text}</dd>
                  </div>
                ))}
              </dl>
            )}

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
  );

  return (
    <article
      id={project.id}
      ref={ref}
      className={`case case--${project.tone}${featured ? " case--featured" : " case--compact"}${flip ? " case--flip" : ""}`}
      style={{ ["--tone" as string]: `var(--project-${project.tone})` }}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="container">
        {featured ? (
          <>
            <header className="case-head">{head}</header>
            {body}
          </>
        ) : (
          <details className="case-fold">
            <summary className="case-head case-summary">
              {head}
              <span className="case-toggle" aria-hidden="true" />
            </summary>
            {body}
          </details>
        )}
      </div>
    </article>
  );
}
