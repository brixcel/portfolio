import type { Tech } from "../data";

const iconUrl = (slug: string) => `/icons/${slug}.svg`;

export function TechChip({ tech, size = 20 }: { tech: Tech; size?: number }) {
  return (
    <span className="chip" style={{ background: "var(--color-neutral-100)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl(tech.slug)}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, filter: tech.invert ? "invert(var(--icon-invert, 0))" : undefined }}
      />
      {tech.name}
    </span>
  );
}

export function MarqueeItem({ tech }: { tech: Tech }) {
  return (
    <span className="marq-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl(tech.slug)}
        alt=""
        width={34}
        height={34}
        style={{ width: 34, height: 34, filter: tech.invert ? "invert(var(--icon-invert, 0))" : undefined }}
      />
      <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{tech.name}</span>
    </span>
  );
}
