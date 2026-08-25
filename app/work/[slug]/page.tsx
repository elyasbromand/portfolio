import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fonts } from "@/lib/fonts";
import { projects, getProjectByTag } from "@/data/portfolio";
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
  return {
    title: `${project.name} — Elyas Bromand`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectByTag(slug);

  if (!project) notFound();

  return (
    <div
      style={{
        background: "#0a0b0d",
        color: "#e6e8eb",
        fontFamily: fonts.sans,
        minHeight: "100vh",
        fontSize: 16,
        lineHeight: 1.6,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
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
      </div>
    </div>
  );
}