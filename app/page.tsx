import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ProjectSynctask from "./components/ProjectSynctask";
import ProjectUrsacHubSocial from "./components/ProjectUrsacHubSocial";
import ProjectUrsacHub from "./components/ProjectUrsacHub";
import ProjectUrsacDSA from "./components/ProjectUrsacDSA";
import ProjectPhotoBooth from "./components/ProjectPhotoBooth";
import About from "./components/About";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        position: "relative",
      }}
    >
      <LoadingScreen />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <ProjectSynctask />
        <ProjectUrsacHubSocial />
        <ProjectUrsacHub />
        <ProjectUrsacDSA />
        <ProjectPhotoBooth />
        <Contact />
      </main>
    </div>
  );
}
