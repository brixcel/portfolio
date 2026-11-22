// Brand logos come in every colour, so one CSS filter can't make them look like one set.
// LIGHTNESS is each icon's measured average lightness (0 = black, 1 = white, perceptual),
// taken from public/icons/*.svg. logoFilters() turns it into two greyscale filters that land
// every logo on the same tone: dark ink on light backgrounds, light ink on dark ones.
// Re-measure (scratchpad script, canvas average of opaque pixels) when adding an icon.
const LIGHTNESS: Record<string, number> = {
  blender: 0.638, bootstrap: 0.543, cloudflare: 0.702, csharp: 0.607, css3: 0.68, docker: 0.597,
  express: 0, firebase: 0.827, git: 0.628, github: 0.202, githubactions: 0.631, html5: 0.712,
  javascript: 0.811, laravel: 0.628, mysql: 0.469, nextjs: 0.101, nodejs: 0.642, php: 0.504,
  pnpm: 0.738, postgresql: 0.548, prisma: 0.335, react: 0.842, tailwindcss: 0.761, typescript: 0.628,
  unity: 0.341, vitejs: 0.73,
};

const INK_ON_LIGHT = 0.3; // target lightness on grey paper
const INK_ON_DARK = 0.86; // target lightness on the dark strip / dark mode
const f = (n: number) => Math.min(Math.max(n, 0.2), 4).toFixed(2);

export function logoFilters(slug: string) {
  const v = LIGHTNESS[slug] ?? 0.6;
  const light = v < INK_ON_LIGHT ? "grayscale(1)" : `grayscale(1) brightness(${f(INK_ON_LIGHT / v)})`;
  // Dark logos are inverted first so their shapes keep their contrast, then brought to the target.
  const dark =
    v < 0.45
      ? `grayscale(1) invert(1) brightness(${f(INK_ON_DARK / Math.max(1 - v, 0.2))})`
      : `grayscale(1) brightness(${f(INK_ON_DARK / v)})`;
  return { light, dark };
}
