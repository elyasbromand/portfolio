import { fonts } from "@/lib/fonts";
import { stackGroups } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";

export default function Toolbox() {
  return (
    <section id="stack" style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="04" title="Toolbox" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {stackGroups.map((g) => (
          <div
            key={g.label}
            style={{
              background: "#0d0f12",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 22,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: "#7ee787",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              {g.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {g.items.map((i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 12.5,
                    color: "#c4c9cf",
                    background: "#15181c",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "5px 11px",
                    borderRadius: 6,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
