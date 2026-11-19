import { readdir } from "node:fs/promises";
import path from "node:path";

// Server-only: lists public/life-photos for the "Life beyond the code" carousel.
// Order and caption come from the file name: "01-sunrise-at-the-lookout.jpg" → first, "Sunrise at the lookout".
const DIR = "life-photos";
const IMAGE = /\.(jpe?g|jfif|png|webp|avif)$/i;
// Camera and download names (IMG_1234.jpg, 0cf993b7-….jfif) are not captions.
const NO_CAPTION = /^((img|dsc|pxl|photo)[-_ ]?\d{3,}|(?=[0-9a-f-]*\d)[0-9a-f-]{6,})\.\w+$/i;

// unoptimized: Vercel serves .jfif as application/octet-stream, which the image optimizer rejects, so those
// files skip it (rename them to .jpg to get resized versions).
export type LifePhoto = { src: string; caption: string; unoptimized: boolean };

function captionOf(file: string) {
  if (NO_CAPTION.test(file)) return "";
  const words = file.replace(IMAGE, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "";
}

export async function lifePhotos(): Promise<LifePhoto[]> {
  const files = await readdir(path.join(process.cwd(), "public", DIR)).catch(() => [] as string[]);
  return files
    .filter((f) => IMAGE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => ({ src: `/${DIR}/${encodeURIComponent(f)}`, caption: captionOf(f), unoptimized: /\.jfif$/i.test(f) }));
}
