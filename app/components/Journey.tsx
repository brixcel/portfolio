import SectionHead from "./SectionHead";

// No dates here that his existing content doesn't already state. Every number is from PRODUCT.md "Confirmed numbers".
const STEPS = [
  {
    when: "Now",
    title: "Software Engineer Intern",
    org: "Egoist Labs",
    text: "Wrote Learning Platform's deploy workflow and reworked Capability Studio's into per-environment deploys on Cloudflare Pages.",
    stat: "3–5 min",
    statLabel: "deploys, down from 15–30 min manual",
    href: "#egoist-cicd",
    live: true,
  },
  {
    when: "Thesis",
    title: "3D Simulation Developer",
    org: "AR-DUINO",
    text: "Built the 3D circuit simulation for our team's AR Arduino learning app: drag-and-snap parts, wires that snap to pins, circuit checks and a mock IDE.",
    stat: "37",
    statLabel: "C# scripts authored",
    href: "#ar-duino",
  },
  {
    when: "Team lead",
    title: "Lead Developer",
    org: "UrsacHub Social",
    text: "Led the architecture, the full-stack implementation and the real-time chat of a campus social platform.",
    stat: "5",
    statLabel: "person team led",
    href: "#ursachub-social",
  },
  {
    when: "Campus",
    title: "Lead Developer",
    org: "DSA Workbench",
    text: "A teaching tool for URS Antipolo that shows data structures working in memory as you push, pop, insert and rotate.",
    stat: "~40",
    statLabel: "students in the class that used it",
    href: "#ursac-dsa",
  },
  {
    when: "Class of 2027",
    title: "BS Computer Engineering",
    org: "URS Antipolo",
    text: "Where the hardware side comes from: circuits, microcontrollers, and the systems thinking behind the rest of this page.",
  },
];

export default function Journey() {
  return (
    <section id="journey" className="journey sec" aria-labelledby="journey-title">
      <div className="container">
        <SectionHead
          id="journey-title"
          index="05 — Journey"
          prompt="git log --oneline"
          title="the journey"
          sub="Where I've been building, most recent first."
        />
        <ol className="tl">
          {STEPS.map((s) => (
            <li key={s.org} className="tl-item">
              <span className="tl-when">
                {s.live && <span className="status-dot" aria-hidden="true" />}
                {s.when}
              </span>
              <div className="tl-main">
                <h3>
                  {s.title}
                  <span>, {s.org}</span>
                </h3>
                <p>{s.text}</p>
                {s.href && (
                  <a href={s.href} className="tl-link">
                    See the project
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                )}
              </div>
              {s.stat && (
                <p className="tl-stat">
                  <b>{s.stat}</b>
                  <span className="mono-label">{s.statLabel}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
