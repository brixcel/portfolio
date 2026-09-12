"use client";

import Reveal from "./Reveal";
import { CarouselTrack, CarouselControls, useCarousel } from "./Carousel";
import { TechChip } from "./TechChip";
import { ursachubSlides, ursachubStack } from "../data";

export default function ProjectUrsacHub() {
  const carousel = useCarousel(ursachubSlides.length);
  return (
    <section
      style={{
        marginTop: 110,
        background: "var(--color-accent-2-100)",
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 24px 110px" }}>
        <Reveal style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(56px, 9vw, 104px)",
              lineHeight: 0.85,
              color: "var(--color-accent-2-700)",
            }}
          >
            02
          </span>
          <div>
            <h2 style={{ fontSize: "clamp(34px, 4.4vw, 54px)", margin: "0 0 6px", letterSpacing: "-.02em" }}>
              UrsacHub
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
              }}
            >
              Campus platform · team project, front-end
            </p>
          </div>
        </Reveal>

        <Reveal
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: 44,
            alignItems: "center",
            marginTop: 40,
          }}
        >
          <div>
            <p style={{ fontSize: "clamp(19px, 2vw, 25px)", lineHeight: 1.45, margin: "0 0 26px", textWrap: "pretty" }}>
              A web platform designed to connect users with services and resources through a
              centralized, user-friendly experience.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 30 }}>
              <a
                href="https://ursachub.onrender.com/student/home"
                target="_blank"
                rel="noopener"
                className="btn btn-primary"
                style={{
                  textDecoration: "none",
                  background: "var(--color-accent-2-700)",
                  color: "var(--color-accent-2-100)",
                }}
              >
                Live project
              </a>
              <a
                href="https://github.com/markPie29/ursachub"
                target="_blank"
                rel="noopener"
                className="btn btn-secondary"
                style={{ textDecoration: "none" }}
              >
                GitHub
              </a>
            </div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
                margin: "0 0 14px",
              }}
            >
              Built with
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {ursachubStack.map((tech) => (
                <TechChip key={tech.slug} tech={tech} />
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <CarouselTrack
              slides={ursachubSlides}
              state={carousel}
              style={{
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider)",
                boxShadow: "var(--shadow-lg)",
                background: "var(--color-bg)",
              }}
            />
            <CarouselControls
              slides={ursachubSlides}
              state={carousel}
              accentColor="var(--color-accent-2-700)"
              thumbWidth={52}
            />
          </div>
        </Reveal>

        <Reveal
          className="uh-collage"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 56 }}
        >
          {[
            { src: "/assets/ursachub-3.png", alt: "UrsacHub products grid" },
            { src: "/assets/ursachub-4.png", alt: "UrsacHub events listing" },
            { src: "/assets/ursachub-6.png", alt: "UrsacHub organizations" },
          ].map((img) => (
            <figure
              key={img.src}
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
      </div>
    </section>
  );
}
