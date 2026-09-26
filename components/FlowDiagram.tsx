import { fonts } from "@/lib/fonts";
import type { ArchitectureNode, ArchitectureStage } from "@/data/portfolio";
import styles from "./FlowDiagram.module.css";

export interface FlowDiagramProps {
  caption: string;
  stages: ArchitectureStage[];
}

const NEUTRAL = "#c7cbd1";
const ACCENT = "#7ee787";
const NEUTRAL_SUB = "#6b7178";
const ACCENT_SUB = "rgba(126,231,135,0.6)";
const NEUTRAL_BORDER = "rgba(230,232,235,0.32)";
const ACCENT_BORDER = "rgba(126,231,135,0.55)";
const NEUTRAL_BG = "rgba(255,255,255,0.025)";
const ACCENT_BG = "rgba(126,231,135,0.06)";
const EDGE_COLOR = "rgba(126,231,135,0.4)";

type Kind = "endpoint" | "hub" | "process";

function kindForStage(stage: ArchitectureStage, index: number, total: number): Kind {
  if (stage.nodes.length !== 1) return "process";
  if (index === 0 || index === total - 1) return "endpoint";
  if (stage.nodes[0].accent) return "hub";
  return "process";
}

function Connector({ id }: { id: string }) {
  return (
    <div className={styles.connector}>
      <svg
        className={styles.connectorSvg}
        width="52"
        height="34"
        viewBox="0 0 52 34"
        fill="none"
        aria-hidden="true"
      >
        <path
          id={id}
          d="M2,17 C16,9 36,25 50,17"
          stroke={EDGE_COLOR}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 5"
        >
          <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.1s" repeatCount="indefinite" />
        </path>
        <circle r="2.1" fill={ACCENT}>
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}

function EndpointNode({ node }: { node: ArchitectureNode }) {
  const color = node.accent ? ACCENT : NEUTRAL;
  return (
    <div className={styles.endpoint} style={{ color }}>
      <span className={styles.endpointLabel} style={{ fontFamily: fonts.mono }}>
        {node.label}
      </span>
      <div className={styles.endpointBox}>
        <span className={styles.core} />
        <span className={`${styles.corner} ${styles.cornerTL}`} />
        <span className={`${styles.corner} ${styles.cornerTR}`} />
        <span className={`${styles.corner} ${styles.cornerBL}`} />
        <span className={`${styles.corner} ${styles.cornerBR}`} />
      </div>
      {node.sublabel && (
        <span className={styles.endpointSub} style={{ fontFamily: fonts.mono }}>
          {node.sublabel}
        </span>
      )}
    </div>
  );
}

function HubNode({ node }: { node: ArchitectureNode }) {
  return (
    <div
      className={styles.hub}
      style={{
        color: ACCENT,
        background: ACCENT_BG,
        border: `1px solid ${ACCENT_BORDER}`,
      }}
    >
      <div className={styles.hubGlow} />
      <svg className={styles.hubBorder} aria-hidden="true">
        <rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx="20"
          ry="20"
          fill="none"
          stroke={ACCENT_BORDER}
          strokeWidth="1.5"
          strokeDasharray="8 8"
          strokeLinecap="round"
        >
          <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.6s" repeatCount="indefinite" />
        </rect>
      </svg>
      <div className={styles.hubContent}>
        <span className={styles.hubLabel} style={{ fontFamily: fonts.mono, color: ACCENT }}>
          {node.label}
        </span>
        {node.sublabel && (
          <span className={styles.hubSub} style={{ fontFamily: fonts.mono, color: ACCENT_SUB }}>
            {node.sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

function ProcessBox({ node, delay }: { node: ArchitectureNode; delay: number }) {
  const accent = Boolean(node.accent);
  return (
    <div
      className={styles.processBox}
      style={{
        background: accent ? ACCENT_BG : NEUTRAL_BG,
        borderColor: accent ? ACCENT_BORDER : NEUTRAL_BORDER,
        animationDelay: `${delay}s`,
      }}
    >
      <span
        className={styles.processLabel}
        style={{ fontFamily: fonts.mono, color: accent ? ACCENT : "#e6e8eb" }}
      >
        {node.label}
      </span>
      {node.sublabel && (
        <span
          className={styles.processSub}
          style={{ fontFamily: fonts.mono, color: accent ? ACCENT_SUB : NEUTRAL_SUB }}
        >
          {node.sublabel}
        </span>
      )}
    </div>
  );
}

export default function FlowDiagram({ caption, stages }: FlowDiagramProps) {
  return (
    <>
      <div style={{ fontFamily: fonts.mono, fontSize: 12.5, color: "#6b7178", marginBottom: 28 }}>
        {caption}
      </div>

      <div className={styles.flowRow}>
        {stages.map((stage, i) => {
          const kind = kindForStage(stage, i, stages.length);

          return (
            <div key={i} className={styles.stage}>
              {kind === "endpoint" && <EndpointNode node={stage.nodes[0]} />}
              {kind === "hub" && <HubNode node={stage.nodes[0]} />}
              {kind === "process" && (
                <div className={styles.processList}>
                  {stage.nodes.map((node, j) => (
                    <ProcessBox key={j} node={node} delay={(i * stage.nodes.length + j) * 0.3} />
                  ))}
                </div>
              )}

              {i < stages.length - 1 && <Connector id={`flow-edge-${i}`} />}
            </div>
          );
        })}
      </div>
    </>
  );
}
