import { projects, techStack, type Tech } from "../data";
import SectionHead from "./SectionHead";
import { TechChip } from "./TechChip";

// Only technologies already in his stack data. "Used in" is derived from each project's stack, never typed in.
// alsoIn: places outside the project list that use the group (this portfolio is Next.js + TypeScript).
const GROUPS: { title: string; note: string; slugs: string[]; alsoIn?: string[] }[] = [
  {
    title: "Frontend engineering",
    note: "Interfaces, app shells and the views people actually click.",
    slugs: ["react", "nextjs", "typescript", "javascript", "tailwindcss", "vitejs", "html5", "css3", "bootstrap"],
    alsoIn: ["this site"],
  },
  {
    title: "Backend engineering",
    note: "APIs, auth and the server logic behind the screens.",
    slugs: ["nodejs", "express", "laravel", "php"],
  },
  {
    title: "Databases",
    note: "Schemas, queries and the ORM layer in between.",
    slugs: ["postgresql", "mysql", "prisma", "firebase"],
  },
  {
    title: "DevOps & infrastructure",
    note: "Builds, checks and deploys that run without someone watching.",
    slugs: ["githubactions", "cloudflare", "docker", "pnpm"],
  },
  {
    title: "Creative engineering",
    note: "3D simulation and augmented reality.",
    slugs: ["unity", "csharp", "blender", "vuforia", "arfoundation"],
  },
  {
    title: "Other tools",
    note: "Version control and collaboration.",
    slugs: ["git", "github"],
  },
];

const bySlug = new Map<string, Tech>();
for (const t of [...techStack, ...projects.flatMap((p) => p.stack)]) if (!bySlug.has(t.slug)) bySlug.set(t.slug, t);

export default function Capabilities() {
  return (
    <section id="capabilities" className="capabilities sec" aria-labelledby="capabilities-title">
      <div className="container">
        <SectionHead
          id="capabilities-title"
          index="Skills"
          title="Engineering capabilities"
          sub="What I build with, grouped by layer, and where each one shows up in my projects."
        />
        <ol className="cap-list">
          {GROUPS.map((g) => {
            const techs = g.slugs.map((s) => bySlug.get(s)).filter((t): t is Tech => !!t);
            const usedIn = projects.filter((p) => p.stack.some((t) => g.slugs.includes(t.slug))).map((p) => p.title).concat(g.alsoIn ?? []);
            return (
              <li key={g.title} className="cap-row">
                <div className="cap-head">
                  <h3>{g.title}</h3>
                  <p>{g.note}</p>
                </div>
                <div className="cap-body">
                  <ul className="chips">
                    {techs.map((t) => (
                      <TechChip key={t.slug} tech={t} />
                    ))}
                  </ul>
                  {usedIn.length > 0 && (
                    <p className="cap-used">
                      <span className="mono-label">Used in</span> {usedIn.join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
