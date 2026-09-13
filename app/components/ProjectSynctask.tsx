"use client";

import Reveal from "./Reveal";
import { CarouselTrack, useCarousel } from "./Carousel";
import { TechChip } from "./TechChip";
import { synctaskSlides, synctaskStack } from "../data";

export default function ProjectSynctask() {
  const carousel = useCarousel(synctaskSlides.length);
  return (
    <section
      id="projects"
      className="section-pad-top"
      style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 24px 96px" }}
    >
      <Reveal style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 36 }}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(56px, 9vw, 104px)",
            lineHeight: 0.85,
            color: "var(--color-accent)",
          }}
        >
          01
        </span>
        <div>
          <div className="text-mask-reveal">
            <h2 style={{ fontSize: "clamp(34px, 4.4vw, 54px)", margin: "0 0 6px", letterSpacing: "-.02em" }}>
              Synctask
            </h2>
          </div>
          <p
            className="stagger-1"
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            }}
          >
            Full-stack web application
          </p>
        </div>
      </Reveal>

      <Reveal
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--color-divider)",
          background: "var(--color-neutral-200)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "var(--color-surface)",
              borderBottom: "1px solid var(--color-divider)",
            }}
          >
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-accent)" }} />
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-accent-2)" }} />
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "var(--color-neutral-400)" }} />
            <span
              style={{
                flex: 1,
                marginLeft: 12,
                padding: "5px 14px",
                borderRadius: 999,
                background: "var(--color-bg)",
                fontSize: 12,
                color: "color-mix(in srgb, var(--color-text) 60%, transparent)",
                maxWidth: 340,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              synctask-proj.vercel.app
            </span>
          </div>
          <CarouselTrack slides={synctaskSlides} state={carousel} />
        </div>
      </Reveal>

      <Reveal
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "start", marginTop: 56 }}
      >
        <div>
          <p style={{ fontSize: "clamp(19px, 2vw, 25px)", lineHeight: 1.45, margin: "0 0 24px", maxWidth: "46ch", textWrap: "pretty" }}>
            A full-stack task management platform with AI-powered natural-language workflows for
            organizing and managing projects.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="https://synctask-proj.vercel.app/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
              style={{ textDecoration: "none" }}
            >
              Live project
            </a>
            <a
              href="https://github.com/brixcel/taskflow"
              target="_blank"
              rel="noopener"
              className="btn btn-secondary"
              style={{ textDecoration: "none" }}
            >
              GitHub
            </a>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 13, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
            Repository is named <strong>taskflow</strong> — the project was renamed to Synctask
            during development.
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
              margin: "0 0 16px",
            }}
          >
            Built with
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {synctaskStack.map((tech) => (
              <TechChip key={tech.slug} tech={tech} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal
        className="project-collage"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 56 }}
      >
        {[
          { src: "/assets/synctask-2.png", alt: "Synctask all-tasks board" },
          { src: "/assets/synctask-7.png", alt: "Synctask new-task dialog with Create with AI" },
          { src: "/assets/synctask-5.png", alt: "Synctask command palette" },
        ].map((img) => (
          <figure
            key={img.src}
            className="project-img-frame"
            style={{
              margin: 0,
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--color-divider)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} style={{ width: "100%", display: "block" }} />
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
