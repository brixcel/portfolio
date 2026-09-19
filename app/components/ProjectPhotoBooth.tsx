"use client";

import ProjectShowcase from "./ProjectShowcase";
import { photoboothSlides, photoboothStack } from "../data";

export default function ProjectPhotoBooth() {
  return (
    <ProjectShowcase
      id="photobooth"
      projectNumber="05"
      sectionClassName="section-margin-top"
      sectionStyle={{
        marginTop: 110,
      }}
      accentTextColor="#b83253"
      title="Photo Booth"
      subtitle="Interactive camera & photostrip web app"
      role="Solo Developer"
      description="An interactive web photobooth application featuring customizable strip layouts, real-time camera capture with countdowns, theme stickers, and standalone high-resolution photostrip downloads."
      liveHref="https://simple-photobooth.vercel.app/"
      liveButtonStyle={{ background: "#9f1239", color: "#ffffff" }}
      githubHref="https://github.com/brixcel/photo-booth"
      extraNote="Dynamic layouts adapt automatically to the chosen photo count with isolated photostrip exports."
      stack={photoboothStack}
      slides={photoboothSlides}
      collageSlides={[photoboothSlides[1], photoboothSlides[2], photoboothSlides[4]]}
      accentColor="#b83253"
    />
  );
}
