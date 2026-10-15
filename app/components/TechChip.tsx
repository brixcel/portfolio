import type { Tech } from "../data";

const iconUrl = (slug: string) => `/icons/${slug}.svg`;

export function TechChip({ tech, size = 18 }: { tech: Tech; size?: number }) {
  return (
    <li className="chip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl(tech.slug)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={tech.invert ? "icon-invert" : undefined}
      />
      {tech.name}
    </li>
  );
}

export function MarqueeItem({ tech }: { tech: Tech }) {
  return (
    <span className="marq-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl(tech.slug)}
        alt=""
        width={30}
        height={30}
        className={tech.invert ? "icon-invert" : undefined}
      />
      <span>{tech.name}</span>
    </span>
  );
}
