import PageShell from "@/components/PageShell";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import SelectedWork from "@/components/SelectedWork";
import Systems from "@/components/Systems";
import ApiShowcase from "@/components/ApiShowcase";
import Toolbox from "@/components/Toolbox";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <PageShell>
      <Nav />
      <Hero />
      <Metrics />
      <SelectedWork />
      <Systems />
      <ApiShowcase />
      <Toolbox />
      <Experience />
      <Contact />
    </PageShell>
  );
}
