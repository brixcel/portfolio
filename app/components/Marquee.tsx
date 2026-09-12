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
        padding: "24px 0",
        overflow: "hidden",
      }}
    >
      <div className="marq-wrap">
        <div className="marq-track">
          <div className="marq-group">
            {techStack.map((tech) => (
              <MarqueeItem key={tech.slug} tech={tech} />
            ))}
          </div>
          <div className="marq-group" aria-hidden="true">
            {techStack.map((tech) => (
              <MarqueeItem key={`dup-${tech.slug}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
