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
export type LifePhoto = { src: string; caption: string; alt: string; unoptimized: boolean };

// Alt text for files whose names aren't captions. Describes only what is visible; no names.
const ALT: Record<string, string> = {
  "0cf993b7-7755-45e7-b28a-ee90780e077f.jpg": "A selfie at home",
  "19e5da6a-4a3d-43ed-a730-cacb5a1d6e16.jpg": "Sitting in a wicker chair at a mountain lookout at sunset",
  "432232a7-d6d5-4eab-908e-188242f69623.jpg": "A mirror selfie at the mall",
  "48798f87-fc2c-434f-aec1-063911f28127.jpg": "A selfie at home with a ribbon flower",
  "4cf0d3b8-cdac-43be-b9a7-052799cca9db.jpg": "With friends at CPE-Yesta 2026, a campus event",
  "4d476e13-d102-454e-9f36-32585bcc142c.jpg": "An outdoor selfie on a cloudy day",
  "5180ed30-5fd7-47c9-a5d4-e076ebbcdd7b.jpg": "Two motorcycles parked on a quiet road",
  "57fdace3-1839-40f7-9178-45f7d71e1c78.jpg": "A certificate of recognition from CPE-Yesta 2026",
  "5c2f3f9f-7b61-4014-8747-d33881e5c2e9.jpg": "Receiving a certificate on stage at CPE-Yesta 2026",
  "949f24b1-8eeb-4756-a5aa-c8c78a5669a7.jpg": "Under red lanterns at a riverside market",
  "9ad0ef2f-f330-4ecf-a8cc-d96947af8467.jpg": "Someone sitting in the wicker chair at the mountain lookout at dusk",
  "a3aabcf6-5ba0-4281-99a0-703cda5533dc.jpg": "A mirror selfie with a gym towel",
  "b0084889-652c-4535-8b66-36a482f464c3.jpg": "Flexing at a campus campout at night",
  "b2191c4f-4630-4d18-af0e-59fbd8399322.jpg": "A group photo at a padlock wall in a garden",
  "d3f4e2a4-4e15-4c00-a48d-37854eef3b94.jpg": "Playing billiards with a friend",
  "d7ee7c66-f6a4-45ec-b519-a057bbdda383.jpg": "Team poster for the Campus Clash 2025 Valorant tournament",
  "f3cb5a49-8650-4584-b284-34c93fb39d0c.jpg": "A goofy selfie at home",
  "f9551e06-650f-4ca5-97d3-2f366a1b274b.jpg": "A goofy selfie outdoors at dusk",
  "fa792df0-f46a-475b-aa19-9ab18f78b035.jpg": "The AR-DUINO team with faculty in front of the project display",
};

// The carousel opens on these (recruiters see the first photo): the CPE-Yesta certificate,
// the AR-DUINO team with faculty, then CPE-Yesta with friends. Everything else follows by name.
const LEAD = [
  "5c2f3f9f-7b61-4014-8747-d33881e5c2e9.jpg",
  "fa792df0-f46a-475b-aa19-9ab18f78b035.jpg",
  "4cf0d3b8-cdac-43be-b9a7-052799cca9db.jpg",
];
const leadRank = (f: string) => (LEAD.includes(f) ? LEAD.indexOf(f) : LEAD.length);

function captionOf(file: string) {
  if (NO_CAPTION.test(file)) return "";
  const words = file.replace(IMAGE, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "";
}

export async function lifePhotos(): Promise<LifePhoto[]> {
  const files = await readdir(path.join(process.cwd(), "public", DIR)).catch(() => [] as string[]);
  return files
    .filter((f) => IMAGE.test(f))
    .sort((a, b) => leadRank(a) - leadRank(b) || a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => ({ src: `/${DIR}/${encodeURIComponent(f)}`, caption: captionOf(f), alt: ALT[f] ?? "", unoptimized: /\.jfif$/i.test(f) }));
}
