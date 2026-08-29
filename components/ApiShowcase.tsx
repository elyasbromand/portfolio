import { fonts } from "@/lib/fonts";
import { endpoints, methodStyles } from "@/data/portfolio";
import { codeFilename, codeLines } from "@/data/codeSnippet";
import SectionHeading from "./SectionHeading";
import CodeBlock from "./CodeBlock";
import styles from "./ApiShowcase.module.css";

export default function ApiShowcase() {
  return (
    <section style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="03" title="API, up close" />

      <div className={styles.grid}>
        {/* endpoints */}
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
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontFamily: fonts.mono,
              fontSize: 12.5,
              color: "#6b7178",
            }}
          >
            ledger-core · v2
          </div>
          {endpoints.map((e, i) => {
            const m = methodStyles[e.method];
            return (
              <div
                key={i}
                className={styles.row}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    color: m.color,
                    minWidth: 48,
                    textAlign: "center",
                    background: m.background,
                    padding: "3px 0",
                    borderRadius: 5,
                  }}
                >
                  {e.method}
                </span>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    color: "#c4c9cf",
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.path}
                </span>
                <span className={styles.note} style={{ fontSize: 12, color: "#565b63" }}>
                  {e.note}
                </span>
              </div>
            );
          })}
        </div>

        {/* code */}
        <CodeBlock filename={codeFilename} lines={codeLines} />
      </div>
    </section>
  );
}