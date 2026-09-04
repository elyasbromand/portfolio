import { fonts } from "@/lib/fonts";
import { experience } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="03" title="Experience" />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {experience.map((x, i) => (
          <div
            key={i}
            className={styles.row}
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div style={{ fontFamily: fonts.mono, fontSize: 13, color: "#6b7178", paddingTop: 3 }}>
              {x.period}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 18, color: "#f4f6f7" }}>
                  {x.role}
                </span>
                <span style={{ color: "#565b63" }}>·</span>
                <span style={{ fontSize: 15, color: "#7ee787" }}>{x.org}</span>
              </div>
              {Array.isArray(x.desc) ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {x.desc.map((line, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <span style={{ color: "#7ee787", fontFamily: fonts.mono, fontSize: 12.5, marginTop: 3 }}>
                        ◆
                      </span>
                      <p
                        style={{
                          fontSize: 14.5,
                          color: "#9098a0",
                          lineHeight: 1.6,
                          textAlign: "justify",
                          hyphens: "auto",
                        }}
                      >
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 14.5,
                    color: "#9098a0",
                    lineHeight: 1.6,
                    textAlign: "justify",
                    hyphens: "auto",
                  }}
                >
                  {x.desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
