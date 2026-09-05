import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fonts } from "@/lib/fonts";
import { projects, getProjectByTag } from "@/data/portfolio";
import PageShell from "@/components/PageShell";
import Nav from "@/components/Nav";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectStats from "@/components/ProjectStats";
import SectionHeading from "@/components/SectionHeading";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import TerminalWindow from "@/components/TerminalWindow";
import CodeBlock from "@/components/CodeBlock";
import ResultsList from "@/components/ResultsList";
import Contact from "@/components/Contact";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectByTag(slug);
  if (!project) return {};

  const title = project.seoTitle ?? project.name;
  const description = project.seoDescription ?? project.tagline;
  const path = `/work/${project.tag}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectByTag(slug);

  if (!project) notFound();

  return (
    <PageShell>
      <Nav />

      <div style={{ paddingTop: 28 }}>
        <Link
          href="/#work"
          style={{ fontFamily: fonts.mono, fontSize: 13, color: "#8b9199" }}
        >
          ← Back to work
        </Link>
      </div>

      <ProjectHeader project={project} />
      <ProjectStats stats={project.stats} />

      <p
        style={{
          fontSize: 17,
          lineHeight: 1.65,
          color: "#a2a8b0",
          maxWidth: "68ch",
          marginBottom: 64,
          textAlign: "justify",
          hyphens: "auto",
        }}
      >
        {project.desc}
      </p>

      <section style={{ marginBottom: 24 }}>
        <SectionHeading index="01" title="The problem" />
        <div
          style={{
            borderLeft: "3px solid #7ee787",
            paddingLeft: 20,
            color: "#c4c9cf",
            fontSize: 16,
            lineHeight: 1.75,
            maxWidth: "72ch",
            textAlign: "justify",
            hyphens: "auto",
          }}
        >
          {project.problem}
        </div>
      </section>

      <section style={{ padding: "48px 0 24px" }}>
        <SectionHeading index="02" title="What I built" />
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#a2a8b0",
            maxWidth: "72ch",
            marginBottom: 28,
            textAlign: "justify",
            hyphens: "auto",
          }}
        >
          {project.approach}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {project.architecture && (
            <ArchitectureDiagram
              caption={project.architecture.caption}
              stages={project.architecture.stages}
            />
          )}
          {project.terminalScreenshot && (
            <TerminalWindow
              screenshot={project.terminalScreenshot.src}
              screenshotAlt={project.terminalScreenshot.alt}
            />
          )}
          {!project.terminalScreenshot && project.terminalLog && (
            <TerminalWindow lines={project.terminalLog} />
          )}
          {project.codeSnippet && (
            <CodeBlock filename={project.codeSnippet.filename} lines={project.codeSnippet.lines} />
          )}
        </div>
      </section>

      <section style={{ padding: "48px 0 24px" }}>
        <SectionHeading index="03" title="Results & impact" />
        <ResultsList results={project.results} />
      </section>

      <div style={{ padding: "24px 0 0" }}>
        <Link
          href="/#work"
          style={{ fontFamily: fonts.mono, fontSize: 13, color: "#8b9199" }}
        >
          ← Back to work
        </Link>
      </div>

      <Contact />
    </PageShell>
  );
}
