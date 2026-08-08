import Projects from "./components/Projects";
import EngineeringApproach from "./components/EngineeringApproach";
import Contact from "./components/Contact";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <main className="bg-[#F9FAFB]">
      <Hero />
      <Projects />
      <EngineeringApproach />
      <Contact />
    </main>
  );
}