import { projects, techStack, type Tech } from "../data";
import SectionHead from "./SectionHead";
import { TechChip } from "./TechChip";

// Only technologies already in his stack data. "Used in" is derived from each project's stack, never typed in.
// alsoIn: places outside the project list that use the group (this portfolio is Next.js + TypeScript).
const GROUPS: { title: string; note: string; slugs: string[]; alsoIn?: string[] }[] = [
  {
    title: "Core full-stack",
    note: "Typed interfaces, APIs and the data behind them.",
    slugs: ["typescript", "react", "nextjs", "nodejs", "express", "postgresql", "prisma", "tailwindcss", "vitejs"],
    alsoIn: ["this site"],
  },
  {
    title: "CI/CD & infra",
    note: "Builds, checks and deploys that run without someone watching.",
    slugs: ["docker", "githubactions", "cloudflare", "git"],
  },
  {
    // Unity and C# stay listed: they are AR-DUINO's stack, the first project on the page.
    title: "Additional",
    note: "Team projects on Laravel and Firebase, and the AR-DUINO simulation in Unity and C#.",
    slugs: ["laravel", "php", "mysql", "firebase", "unity", "csharp"],
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
