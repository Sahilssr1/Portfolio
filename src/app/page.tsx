import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import GithubSection from "@/components/GithubSection";
import Contact from "@/components/Contact";
import DevCharacter from "@/components/DevCharacter";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <GithubSection />
        <Contact />
        <DevCharacter />
      </main>
      <Footer />
    </>
  );
}
