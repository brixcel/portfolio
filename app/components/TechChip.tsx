import type { Tech } from "../data";

const iconUrl = (slug: string) => `/icons/${slug}.svg`;
const iconClass = (tech: Tech) => (tech.invert ? "icon-invert" : tech.lift ? "icon-lift" : undefined);

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
        className={iconClass(tech)}
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
        className={iconClass(tech)}
      />
      <span>{tech.name}</span>
    </span>
  );
}
