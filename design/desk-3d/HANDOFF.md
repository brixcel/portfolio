# 3D desk hero — handoff

Read this first if you are a new Claude session picking up the portfolio redesign.
Also read `PRODUCT.md` at the repo root: it holds the confirmed facts and rules.

## Where things stand

- Branch: `claude/compassionate-johnson-r7qq6n` (default branch is `claude/do-this-3zpyjr`).
- **Live in code now:** a 2D "desk under the lamp" hero (`app/components/Hero.tsx`, `app/components/HeroDesk.tsx`,
  hero section of `app/globals.css`). It replaced the old falling lanyard ID badge.
- **Owner feedback on the 2D hero:** "underwhelming". He wants a real **3D desk** hero.
- **Built so far for 3D (this folder):**
  - `desk.py`: a Blender 4.x Python script that models the whole desk scene, renders it, and exports a GLB.
  - `renders/`: Cycles renders (desktop and mobile, light and dark) and `desk.glb` / `desk.blend`.
  - `threejs-prototype/index.html`: an earlier Three.js prototype of the same scene with primitive models.
  - `preview-layout.html`: lays a render behind the real hero copy, for screenshots.
- Nothing 3D is wired into the website yet.

## Decisions already made (do not reopen)

- Audience priority: recruiters for internships. Hero title is exactly "software developer".
- Status line: "Software Engineer Trainee at Egoist Labs · Computer Engineering, URS Antipolo, Class of 2027 ·
  Open to internships and freelance".
- Direction: his desk / developer's notebook, lit by the moss desk lamp. The header lamp toggles light/dark and
  should switch the 3D lamp too (dark mode = lamp glowing in a dark room).
- **Three.js is allowed for the hero only** (owner chose 3D). Update `PRODUCT.md` "Capabilities and Constraints",
  which still says "No Three.js", when the 3D build starts.
- **Models are made in Blender**, ideally with the owner's **Blender MCP** on his PC.
- Phones get a **lighter 3D** version, loaded after the text.
- His **profile photo must be clearly visible** (framed photo facing the camera, own soft light).
- **No RFID reader** in the scene or anywhere on the site yet.
- Only real material: Synctask screenshot on the laptop, the Egoist Labs CI/CD diagram in the notebook,
  his real numbers (15–30 min → 3–5 min deploys, 5 quality gates). Never invent claims.

## The scene (see `desk.py`)

Wooden desk (floating slab), moss desk lamp with a spot light, laptop showing `public/assets/synctask-2.png`,
open notebook (CI/CD diagram + handwritten-style notes), IoT RC car (Arduino Uno, NodeMCU, L298N, TT motors,
18650 cells — his real build), breadboard with a lit red LED (nod to the AR-DUINO thesis), mug with a moss band,
framed portrait (`public/assets/profile.jpg`). Palette: paper #f7f5f0, ink #1c1b18, moss #56633f, clay #c67139.

Run it (Blender 4.x on PATH):

```bash
cd design/desk-3d
blender -b -P desk.py -- --theme light --out renders/desk-light.png --scale 100 --samples 160
blender -b -P desk.py -- --theme dark  --out renders/desk-dark.png  --scale 100 --samples 160
blender -b -P desk.py -- --theme light --view mobile --out renders/desk-mobile-light.png --samples 128
blender -b -P desk.py -- --theme light --glb renders/desk.glb --blend renders/desk.blend
```

`tex/` holds the generated textures (wood, CI/CD page, notes page, breadboard). Regenerating them is optional;
`tex-generate.html` + `tex-generate.mjs` made them with headless Chromium.

## Next steps

1. **Polish the models in Blender (on his PC, with the Blender MCP).** Open `renders/desk.blend` or rerun
   `desk.py` inside Blender. The models are code-built primitives: the RC car should be remodeled after his real
   car (ask for a photo), and the laptop, lamp and mug can get real detail. Keep the object names: the web build
   will use them for hover/click.
2. **Bake lighting** if needed for the web (or rely on real-time lights), then export `public/models/desk.glb`
   (Draco or meshopt compressed, target under ~2 MB).
3. **Build the 3D hero** with React Three Fiber (`@react-three/fiber`, `@react-three/drei`):
   - left column stays the current hero copy; the canvas fills the right side.
   - hover an object → lift + label; click laptop/notebook/RC car → camera glides in, then scrolls to
     `#synctask`, `#egoist-cicd`, and the projects section.
   - header lamp toggle drives the 3D lamp light (`data-theme` on `<html>`).
   - load the canvas after the text; `prefers-reduced-motion` gets a static render (`renders/desk-*.png`).
   - mobile: lighter scene (fewer shadows, lower DPR), text first, desk below.
4. Verify with screenshots at 1440 and 390 wide, light and dark, then run `/impeccable critique` again.

## Other state worth knowing

- CV source: `resume/cv.html` → `public/Brexcel-Orias-CV.pdf` (one A4 page; AR-DUINO listed above SyncTask).
- AR-DUINO thesis repo: github.com/Yiizer/Arduino-Ar-App (he wrote 37 C# scripts for the 3D circuit simulation).
- Impeccable and taste-skill design skills are installed in `.claude/skills/`. Last critique scored the old
  hero 22/32; the deferred items are the loader's fake %, the word-by-word About reveal, missing LinkedIn,
  the "top 1%" line, the 22-logo marquee, and the numbered project labels.
