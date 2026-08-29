import { fonts } from "@/lib/fonts";
import type { Project } from "@/data/portfolio";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header style={{ padding: "48px 0 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: "#7ee787" }}>
          {project.tag}
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11.5,
            color: "#565b63",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {project.status}
        </span>
      </div>

      <h1
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: "clamp(30px, 4.5vw, 48px)",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          color: "#f4f6f7",
          marginBottom: 16,
        }}
      >
        {project.name}
      </h1>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "#a2a8b0",
          maxWidth: "56ch",
          marginBottom: 28,
        }}
      >
        {project.tagline}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {project.stack.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: fonts.mono,
              fontSize: 12.5,
              color: "#8b9199",
              background: "#15181c",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "5px 11px",
              borderRadius: 6,
            }}
          >
            {t}
          </span>
        ))}
      </div>

<div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#7ee787",
              color: "#0a0b0d",
              padding: "12px 20px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14.5,
            }}
          >
            View on GitHub
          </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#141619",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e6e8eb",
              padding: "12px 20px",
              borderRadius: 8,
              fontFamily: fonts.mono,
              fontSize: 13.5,
            }}
          >
            Live demo
          </a>
        )}
      </div>
    </header>
  );
}