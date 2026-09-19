"use client";

import ProjectShowcase from "./ProjectShowcase";
import { ursachubSocialSlides, ursachubSocialStack } from "../data";

export default function ProjectUrsacHubSocial() {
  return (
    <ProjectShowcase
      id="ursachub-social"
      projectNumber="02"
      sectionClassName="section-margin-top"
      sectionStyle={{
        marginTop: 110,
        background: "color-mix(in srgb, #0284c7 6%, var(--color-surface))",
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
      }}
      accentTextColor="#0284c7"
      title="UrsacHub Social"
      subtitle="Social networking & campus community platform"
      role="Lead Developer"
      description="Reimagined URSAC Hub as a social networking platform inspired by Facebook. Students can create posts, interact through likes and comments, join conversations, and stay updated with organizations through a familiar social media experience."
      features={[
        "Social media feed",
        "Posts, likes & comments",
        "Organization pages",
        "Authentication & role management",
      ]}
      liveButtonStyle={{ background: "#0284c7", color: "#ffffff" }}
      extraNote="Lead Developer — led architecture, full-stack implementation, and real-time social interaction features."
      stack={ursachubSocialStack}
      slides={ursachubSocialSlides}
      collageSlides={[ursachubSocialSlides[1], ursachubSocialSlides[2], ursachubSocialSlides[4]]}
      accentColor="#0284c7"
    />
  );
}
