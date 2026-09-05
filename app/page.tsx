import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import SelectedWork from "@/components/SelectedWork";
import Toolbox from "@/components/Toolbox";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { getGithubStats } from "@/lib/github";
import { siteConfig, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  description: siteConfig.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Home() {
  const githubStats = await getGithubStats("elyasbromand");

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Nav />
      <Hero />
      <Metrics stats={githubStats} />
      <SelectedWork />
      <Certifications />
      <Experience />
      <Toolbox />
      <Contact />
    </PageShell>
  );
}
