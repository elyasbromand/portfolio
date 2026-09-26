import { fonts } from "@/lib/fonts";

interface SectionHeadingProps {
  index: string;
  title: string;
}

/**
 * The "01 ── Selected work ──────" heading pattern repeated at the top of
 * Selected Work, Systems, API Showcase, Toolbox, and Experience. Stays a
 * server component — the `data-reveal` attributes are wired up by
 * MotionRoot, so this one change animates every heading on both routes.
 */
export default function SectionHeading({ index, title }: SectionHeadingProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        marginBottom: 34,
      }}
    >
      <span data-reveal="scramble" style={{ fontFamily: fonts.mono, fontSize: 13, color: "#7ee787" }}>
        {index}
      </span>
      <h2
        data-reveal="lines"
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: "clamp(20px, 5vw, 26px)",
          color: "#f4f6f7",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      <div
        data-reveal="rule"
        data-reveal-delay="0.15"
        style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
      />
    </div>
  );
}
