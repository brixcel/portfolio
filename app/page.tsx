import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Projects from "./components/Projects";
import Capabilities from "./components/Capabilities";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import Life from "./components/Life";
import { lifePhotos } from "./lib/lifePhotos";

export default async function Home() {
  const photos = await lifePhotos();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LoadingScreen />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Journey />
        <Capabilities />
        <Life photos={photos} />
        {/* The 3D desk section (HeroDesk) is paused for now; its code and model stay in the repo. */}
        <Contact />
      </main>
    </>
  );
}
