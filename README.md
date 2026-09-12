# Brexcel Joe M. Orias — Portfolio

Personal developer portfolio built with Next.js (App Router) and TypeScript. A single page
leading with an animated hanging ID badge, a technology marquee, two featured project
showcases (Synctask, UrsacHub) with carousels, and About/Contact sections. Includes a
light/dark theme toggle ("desk lamp") with a radial light-wash transition.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- GSAP for the ID badge drop/pendulum animation and idle sway
- Plain CSS custom properties for theming (light/dark), no CSS framework

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/layout.tsx` — fonts (Caprasimo, Figtree) and the theme flash-prevention inline script
- `app/globals.css` — design tokens (light/dark) and base styles
- `app/data.ts` — tech stack lists and carousel slide data
- `app/components/` — page sections and UI (Header/lamp, Hero/IdBadge, Marquee, Carousel,
  the two project sections, About, Contact, Reveal-on-scroll)
- `public/assets/` — profile photo and project screenshots
- `public/icons/` — vendored devicon SVGs for the tech stack chips/marquee
