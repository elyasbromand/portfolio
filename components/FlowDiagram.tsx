import { fonts } from "@/lib/fonts";
import type { ArchitectureStage } from "@/data/portfolio";
import styles from "./FlowDiagram.module.css";

export interface FlowDiagramProps {
  caption: string;
  stages: ArchitectureStage[];
}

const heroNodeStyle: React.CSSProperties = {
  flex: "0 0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "#141619",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "18px 20px",
  minWidth: 120,
  textAlign: "center",
};

const heroNodeAccentStyle: React.CSSProperties = {
  ...heroNodeStyle,
  background: "rgba(126,231,135,0.06)",
  border: "1px solid rgba(126,231,135,0.28)",
};

const listNodeStyle: React.CSSProperties = {
  background: "#141619",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 18px",
  minWidth: 150,
  fontFamily: fonts.mono,
  fontSize: 12,
  color: "#e6e8eb",
};

const listNodeAccentStyle: React.CSSProperties = {
  ...listNodeStyle,
  background: "#0f1418",
  border: "1px solid rgba(126,231,135,0.2)",
  color: "#a2a8b0",
};

export default function FlowDiagram({ caption, stages }: FlowDiagramProps) {
  return (
    <>
      <div style={{ fontFamily: fonts.mono, fontSize: 12.5, color: "#6b7178", marginBottom: 28 }}>
        {caption}
      </div>

      <div className={styles.flowRow}>
        {stages.map((stage, i) => (
          <div key={i} className={styles.stage}>
            {stage.nodes.length === 1 ? (
              <div style={stage.nodes[0].accent ? heroNodeAccentStyle : heroNodeStyle}>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 12,
                    color: stage.nodes[0].accent ? "#7ee787" : "#e6e8eb",
                  }}
                >
                  {stage.nodes[0].label}
                </span>
                {stage.nodes[0].sublabel && (
                  <span style={{ fontSize: 11, color: "#6b7178" }}>{stage.nodes[0].sublabel}</span>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                {stage.nodes.map((node, j) => (
                  <div key={j} style={node.accent ? listNodeAccentStyle : listNodeStyle}>
                    {node.label}
                    {node.sublabel && <span style={{ color: "#565b63" }}> {node.sublabel}</span>}
                  </div>
                ))}
              </div>
            )}

            {i < stages.length - 1 && (
              <div className={styles.arrow} style={{ fontFamily: fonts.mono }}>
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
