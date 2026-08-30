import PageShell from "@/components/PageShell";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import SelectedWork from "@/components/SelectedWork";
import Systems from "@/components/Systems";
import Toolbox from "@/components/Toolbox";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { getGithubStats } from "@/lib/github";

export default async function Home() {
  const githubStats = await getGithubStats("elyasbromand");

  return (
    <PageShell>
      <Nav />
      <Hero />
      <Metrics stats={githubStats} />
      <SelectedWork />
      <Systems />
      <Toolbox />
      <Experience />
      <Contact />
    </PageShell>
  );
}
