"use client";

import ProjectShowcase from "./ProjectShowcase";
import { ursacdsaSlides, ursacdsaStack } from "../data";

export default function ProjectUrsacDSA() {
  return (
    <ProjectShowcase
      id="ursac-dsa"
      projectNumber="04"
      sectionClassName="section-margin-top"
      sectionStyle={{
        marginTop: 110,
        background: "color-mix(in srgb, #2563eb 6%, var(--color-surface))",
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
      }}
      accentTextColor="#2563eb"
      title="DSA Workbench"
      subtitle="Interactive academic visualization suite"
      role="Lead Developer"
      description="An interactive academic visualization suite developed for URS Antipolo Campus to demonstrate fundamental abstract data types, runtime memory layouts, algorithmic mutations, and asymptotic behavior across 8 core structures."
      features={[
        "8 interactive abstract data types",
        "Real-time memory & pointer stage",
        "Ring buffer modulo mechanics",
        "AVL tree rotations & balance factors",
      ]}
      liveHref="https://ursacdsa.vercel.app/index.html"
      liveLabel="Live project"
      liveButtonStyle={{ background: "#2563eb", color: "#ffffff" }}
      extraNote="Interactive laboratory suite covering Stacks, Regular & Circular Queues, Priority Queues, Singly / Doubly / Circular Linked Lists, and AVL Trees."
      stack={ursacdsaStack}
      slides={ursacdsaSlides}
      collageSlides={[ursacdsaSlides[0], ursacdsaSlides[1], ursacdsaSlides[2]]}
      accentColor="#2563eb"
    />
  );
}
