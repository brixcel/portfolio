// Tech logos are single-colour Simple Icons (CC0, public/icons/*.svg, drawn in #111), so they
// match automatically: ink on light backgrounds, inverted to light ink on dark ones (globals.css).
// C# is the one exception: Simple Icons removed it, so it keeps its brand-colour file and gets a
// greyscale filter from its measured lightness (scripts/measure-logo-lightness.mjs).
export const MONO_LOGOS = new Set([
  "react", "typescript", "javascript", "nodejs", "express", "postgresql", "prisma", "tailwindcss",
  "nextjs", "vitejs", "laravel", "php", "mysql", "firebase", "bootstrap", "html5", "css3", "docker",
  "githubactions", "cloudflare", "git", "github", "unity", "blender", "pnpm",
]);

/** Average lightness (0 black … 1 white) of the brand-colour logos that have no mono version. */
export const LIGHTNESS: Record<string, number> = {
  csharp: 0.607,
};

const INK_ON_LIGHT = 0.3;
const INK_ON_DARK = 0.86;
const f = (n: number) => Math.min(Math.max(n, 0.2), 4).toFixed(2);

/** Greyscale filters that bring a brand-colour logo to the same tone as the mono ones. */
export function logoFilters(slug: string) {
  const v = LIGHTNESS[slug];
  if (v === undefined) throw new Error(`No lightness measured for logo "${slug}"`);
  const light = v < INK_ON_LIGHT ? "grayscale(1)" : `grayscale(1) brightness(${f(INK_ON_LIGHT / v)})`;
  const dark =
    v < 0.45
      ? `grayscale(1) invert(1) brightness(${f(INK_ON_DARK / Math.max(1 - v, 0.2))})`
      : `grayscale(1) brightness(${f(INK_ON_DARK / v)})`;
  return { light, dark };
}
