import Image from "next/image";
import { fonts } from "@/lib/fonts";

interface TerminalWindowProps {
  /** Styled text lines — used when you don't have a real screenshot. */
  lines?: string[];
  /** A real screenshot (e.g. "/screenshots/fanout-cli.png" in /public) —
   * takes priority over `lines` if both are given. */
  screenshot?: string;
  screenshotAlt?: string;
  title?: string;
}

/** Renders a line in a terminal-appropriate color: "$ " prefix = command,
 * "# " prefix = comment, anything else = plain output. */
function lineStyle(line: string): React.CSSProperties {
  if (line.startsWith("$ ")) return { color: "#7ee787" };
  if (line.startsWith("# ")) return { color: "#6b7178" };
  return { color: "#c4c9cf" };
}

export default function TerminalWindow({
  lines,
  screenshot,
  screenshotAlt = "Terminal output",
  title = "zsh",
}: TerminalWindowProps) {
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
          {title}
        </span>
      </div>

      {screenshot ? (
        <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
          <Image
            src={screenshot}
            alt={screenshotAlt}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      ) : (
        <pre
          style={{
            margin: 0,
            padding: 20,
            overflowX: "auto",
            fontFamily: fonts.mono,
            fontSize: 12.5,
            lineHeight: 1.75,
          }}
        >
          {(lines ?? []).map((line, i) => (
            <div key={i} style={lineStyle(line)}>
              {line}
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}