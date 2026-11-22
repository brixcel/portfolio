import type { CSSProperties } from "react";
import type { Tech } from "../data";
import { LIGHTNESS, MONO_LOGOS, logoFilters } from "../lib/logoTone";

const iconUrl = (slug: string) => `/icons/${slug}.svg`;

// Mono logos are styled by class alone; brand-colour ones carry their own filters as CSS variables.
const logoProps = (tech: Tech): { className: string; style?: CSSProperties } => {
  if (MONO_LOGOS.has(tech.slug) || !(tech.slug in LIGHTNESS)) return { className: "logo logo-mono" };
  const { light, dark } = logoFilters(tech.slug);
  return { className: "logo", style: { "--logo-light": light, "--logo-dark": dark } as CSSProperties };
};

export function TechChip({ tech, size = 18 }: { tech: Tech; size?: number }) {
  return (
    <li className="chip">
      {!tech.noIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl(tech.slug)} alt="" width={size} height={size} loading="lazy" {...logoProps(tech)} />
      )}
      {tech.name}
    </li>
  );
}

export function MarqueeItem({ tech }: { tech: Tech }) {
  return (
    <span className="marq-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconUrl(tech.slug)} alt="" width={30} height={30} loading="lazy" decoding="async" {...logoProps(tech)} />
      <span>{tech.name}</span>
    </span>
  );
}
