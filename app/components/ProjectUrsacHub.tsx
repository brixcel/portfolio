"use client";

import ProjectShowcase from "./ProjectShowcase";
import { ursachubSlides, ursachubStack } from "../data";

export default function ProjectUrsacHub() {
  return (
    <ProjectShowcase
      sectionClassName="section-margin-top"
      sectionStyle={{
        marginTop: 110,
        background: "var(--color-accent-2-100)",
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
      }}
      number="02"
      numberColor="var(--color-accent-2-700)"
      title="UrsacHub"
      subtitle="Campus platform · team project, front-end"
      description="A web platform designed to connect users with services and resources through a centralized, user-friendly experience."
      liveHref="https://ursachub.onrender.com/student/home"
      liveButtonStyle={{ background: "var(--color-accent-2-700)", color: "var(--color-accent-2-100)" }}
      githubHref="https://github.com/markPie29/ursachub"
      stack={ursachubStack}
      slides={ursachubSlides}
      collageSlides={[ursachubSlides[1], ursachubSlides[2], ursachubSlides[3]]}
      accentColor="var(--color-accent-2-700)"
    />
  );
}
