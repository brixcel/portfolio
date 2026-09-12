import { techStack } from "../data";
import { MarqueeItem } from "./TechChip";

export default function Marquee() {
  return (
    <section
      aria-label="Technologies I use"
      style={{
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
        background: "var(--color-neutral-100)",
        padding: "26px 0",
        overflow: "hidden",
      }}
    >
      <style>{`
        .marq-wrap {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        .marq-track {
          display: flex;
          width: max-content;
          animation: marq 38s linear infinite;
        }
        .marq-wrap:hover .marq-track {
          animation-play-state: paused;
        }
        .marq-group {
          display: flex;
          align-items: center;
          gap: 52px;
          padding-right: 52px;
        }
        .marq-item {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.82;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .marq-item:hover {
          opacity: 1;
          transform: translateY(-3px);
        }
      `}</style>
      <div className="marq-wrap">
        <div className="marq-track">
          <div className="marq-group">
            {techStack.map((tech) => (
              <MarqueeItem key={tech.slug} tech={tech} />
            ))}
          </div>
          <div className="marq-group" aria-hidden="true">
            {techStack.map((tech) => (
              <MarqueeItem key={tech.slug} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
