import Link from "next/link";
import { fonts } from "@/lib/fonts";
import { projects } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import styles from "./SelectedWork.module.css";

export default function SelectedWork() {
  return (
    <section id="work" style={{ padding: "56px 0 24px" }}>
      <SectionHeading index="01" title="Selected work" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
        {projects.map((p) => (
          <Link key={p.tag} href={`/work/${p.tag}`} className={styles.card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: "#7ee787" }}>
                {p.tag}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11.5,
                  color: "#565b63",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {p.status}
              </div>
            </div>

            <h3
              style={{
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 21,
                color: "#f4f6f7",
                marginBottom: 9,
                letterSpacing: "-0.01em",
              }}
            >
              {p.name}
            </h3>

            <p
              style={{
                fontSize: 14.5,
                color: "#9098a0",
                lineHeight: 1.55,
                marginBottom: 18,
                minHeight: 66,
              }}
            >
              {p.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {p.stack.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 11.5,
                    color: "#8b9199",
                    background: "#15181c",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "4px 9px",
                    borderRadius: 5,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 22,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 17, color: "#e6e8eb" }}>
                  {p.m1v}
                </div>
                <div style={{ fontSize: 12, color: "#6b7178" }}>{p.m1l}</div>
              </div>
              <div>
                <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 17, color: "#e6e8eb" }}>
                  {p.m2v}
                </div>
                <div style={{ fontSize: 12, color: "#6b7178" }}>{p.m2l}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 18,
                fontFamily: fonts.mono,
                fontSize: 13,
                color: "#7ee787",
              }}
            >
              View case study <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}