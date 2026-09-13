"use client";

import ProjectShowcase from "./ProjectShowcase";
import { synctaskSlides, synctaskStack } from "../data";

export default function ProjectSynctask() {
  return (
    <ProjectShowcase
      id="projects"
      containerClassName="section-pad-top"
      containerStyle={{ padding: "96px 24px 0" }}
      number="01"
      numberColor="var(--color-accent)"
      title="Synctask"
      subtitle="Full-stack web application"
      description="A full-stack task management platform with AI-powered natural-language workflows for organizing and managing projects."
      liveHref="https://synctask-proj.vercel.app/"
      githubHref="https://github.com/brixcel/taskflow"
      extraNote={
        <>
          Repository is named <strong>taskflow</strong> — the project was renamed to Synctask
          during development.
        </>
      }
      stack={synctaskStack}
      slides={synctaskSlides}
      collageSlides={[synctaskSlides[1], synctaskSlides[2], synctaskSlides[3]]}
      accentColor="var(--color-accent)"
    />
  );
}
