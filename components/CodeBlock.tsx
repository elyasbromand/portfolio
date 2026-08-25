import { fonts } from "@/lib/fonts";
import type { CodeSegment } from "@/data/codeSnippet";

interface CodeBlockProps {
  filename: string;
  lines: CodeSegment[][];
}

/**
 * The mac-style "editor window" used for the syntax-highlighted snippet
 * in "API, up close" — extracted so case study pages can show a project's
 * own snippet with the exact same chrome.
 */
export default function CodeBlock({ filename, lines }: CodeBlockProps) {
  return (
    <div
      style={{
        background: "#0d0f12",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#3a3f45" }} />
        <span style={{ fontFamily: fonts.mono, fontSize: 12, color: "#6b7178", marginLeft: 8 }}>
          {filename}
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 20,
          overflowX: "auto",
          fontFamily: fonts.mono,
          fontSize: 12.5,
          lineHeight: 1.75,
          color: "#c4c9cf",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>
            {line.map((seg, j) =>
              seg.color ? (
                <span key={j} style={{ color: seg.color }}>
                  {seg.text}
                </span>
              ) : (
                <span key={j}>{seg.text}</span>
              )
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}