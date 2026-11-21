# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: recruiters and hiring managers screening Computer Engineering students for software engineering internships. They scan in seconds for who he is, his level, his availability, and proof of shipped work.
- Secondary: potential freelance clients looking for someone to build web apps.

## Product Purpose

Personal portfolio of Brexcel Joe M. Orias at brexcel.vercel.app. Success is a recruiter or client understanding who he is and what he has shipped within the first screen, then opening a project, downloading the CV, or getting in touch.

## Positioning

A Computer Engineering student who ships real, team-used software and the pipelines that deploy it: Software Engineer Intern at Egoist Labs building CI/CD workflows, plus full-stack projects with real users.

## Operating Context

- Visitors arrive from the CV, LinkedIn-style links, GitHub, and direct messages, on desktop and on phones.
- The downloadable CV lives at `public/Brexcel-Orias-CV.pdf`.

## Capabilities and Constraints

- Next.js app, deployed on Vercel. GSAP is used for motion. No MDX.
- Three.js (React Three Fiber + drei) is allowed for the hero desk only, loaded after the text. Reduced motion and no-WebGL visitors get the Blender poster render instead.
- Hero title text is exactly "software developer". Loading screen text is "brexcel". The phrase "Computer Engineering" appears in the hero world.
- Confirmed status line: "Software Engineer Intern at Egoist Labs · Computer Engineering, URS Antipolo, Class of 2027 · Open to internships and freelance".
- The Robinsons Mall RFID Parking System is not shown anywhere yet.
- Do not show TaskFlow as a separate project, AWS, or n8n.
- The AR-DUINO thesis (team project; he built the 3D circuit simulation) is shown first and ranked above SyncTask, on the site and the CV.

## Brand Commitments

- Owner-confirmed direction (Nov 19, 2026): monochrome "developer" look: grey paper, black ink, Inter Tight (heavy) with JetBrains Mono labels, a giant "//" brand mark, terminal-prompt details and a dark tech strip. Green is used only for the open-to-work status. The desk lamp in the header stays the light/dark switch ("Lights on" / "Lights off"). Replaces the cream / olive / Caprasimo identity.
- Project names are spelled SyncTask and UrsacHub (owner-confirmed Nov 21, 2026: "SyncTask", matching the app title and the CV).
- SyncTask's stack is React + Vite (JavaScript), Node.js/Express, PostgreSQL/Prisma, Tailwind and Docker, as verified in its repo on Nov 21, 2026. It uses no TypeScript and no Next.js.
- UrsacHub is a team repo. He worked on the front end: the login/register pages, the product and news pages, the admin add-news/add-product forms, and styling in the shared stylesheet. That is 17 of about 206 commits. Teammates created those files, so never say he "built the front end".
- Owner answers, Nov 21, 2026:
  - **SyncTask** is solo; he built it alone. It is a Jira-style task tracker with AI, made for small teams that can't afford Jira or other paid trackers. "For small teams" on the CV describes who it is for. It has no users yet (Nov 21, 2026), so never imply users, teams or adoption.
  - **DSA Workbench** is a team project that he led. Its code is the public repo github.com/brixcel/conditional.
  - **UrsacHub Social:** the 5-person team he led includes the analyst who made the full Figma design.
  - **AR-DUINO** stays first. The team repo is private; he'll raise making it public with the team and will record a demo clip.
  - **UrsacHub:** the live link stays, even though Render takes up to about 90 s to wake.
  - **Photo Booth** supports layouts of 1–9 photos.
  - **Freelance offer** for now: website development.
  - **Look:** grey paper confirmed, not warm off-white.

## Evidence on Hand

- Real project screenshots in `public/assets/` for AR-DUINO, SyncTask, UrsacHub, UrsacHub Social, DSA Workbench, Photo Booth, and the Egoist Labs pipelines.
- Photos of him: `public/assets/profile.jpg` (formal portrait, in the 3D desk frame) and his lookout photo (side profile, hands in pockets), used in the hero as `hero-me.webp` (his own cut-out outline applied to the full-res original) over `hero-vista-fade.webp` (the same photo, B/W and faded). Sources in `design/hero/`.
- Confirmed numbers: authored 37 C# scripts in the AR-DUINO repository (github.com/Yiizer/Arduino-Ar-App, private: 404 to the public, so it is not linked on the site); Egoist Labs deploys went from 15–30 minutes manual to 3–5 minutes automated; 5 automated quality gates; 13 workflow runs since his changes merged; led a 5-person team on UrsacHub Social; DSA Workbench used in a class of about 40 students.
- AR-DUINO media: the team's 41 s thesis introduction video (`public/videos/ar-duino-demo.mp4`). It's a team promo, not a close-up of his simulation work, so caption it as the team's video.
- Profiles: LinkedIn https://www.linkedin.com/in/brexcel-orias-6b2a28321 and GitHub https://github.com/brixcel. JobStreet exists but isn't public yet, so don't link it.
- Not yet on hand: photos of his desk, the IoT RC car, or his laptop. Never fabricate users, clients, testimonials, metrics, or photos.

## Product Principles

1. Show real work before describing it.
2. Every claim is something an interviewer can verify.
3. Answer who, level, and availability in the first screen.
4. One signature moment per page, rooted in his own desk, not a borrowed trend.
