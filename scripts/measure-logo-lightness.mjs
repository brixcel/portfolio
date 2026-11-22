// Measures the average lightness of brand-colour logos for app/lib/logoTone.ts (LIGHTNESS).
// Usage: node scripts/measure-logo-lightness.mjs csharp [other-slug ...]
// Needs Playwright with Chromium. Prints { slug: lightness } (0 = black, 1 = white, perceptual).
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: node scripts/measure-logo-lightness.mjs <slug> [...]");
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage();
const out = {};
for (const slug of slugs) {
  const src = "data:image/svg+xml;base64," + readFileSync(`public/icons/${slug}.svg`).toString("base64");
  out[slug] = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = c.height = 96;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, 96, 96);
    const d = ctx.getImageData(0, 0, 96, 96).data;
    const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    let sum = 0, weight = 0;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3] / 255;
      if (!a) continue;
      const L = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      sum += Math.cbrt(L) * a;
      weight += a;
    }
    return +(sum / weight).toFixed(3);
  }, src);
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
