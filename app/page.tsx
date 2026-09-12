import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ProjectSynctask from "./components/ProjectSynctask";
import ProjectUrsacHub from "./components/ProjectUrsacHub";
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
      <Hero />
      <Marquee />
      <ProjectSynctask />
      <ProjectUrsacHub />
      <About />
      <Contact />
    </div>
  );
}
