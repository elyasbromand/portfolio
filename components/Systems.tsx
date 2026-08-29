import { fonts } from "@/lib/fonts";
import { principles } from "@/data/portfolio";
import type { ArchitectureStage } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import FlowDiagram from "./FlowDiagram";
import flowStyles from "./FlowDiagram.module.css";

const stages: ArchitectureStage[] = [
  { nodes: [{ label: "client", sublabel: "web / mobile" }] },
  { nodes: [{ label: "API gateway", sublabel: "auth · rate-limit", accent: true }] },
  {
    nodes: [
      { label: "ledger-core", sublabel: "svc" },
      { label: "fanout", sublabel: "svc" },
      { label: "notify", sublabel: "svc" },
    ],
  },
  {
    nodes: [
      { label: "Postgres", sublabel: "primary", accent: true },
      { label: "Redis", sublabel: "cache", accent: true },
      { label: "Kafka", sublabel: "events", accent: true },
    ],
  },
];

export default function Systems() {
  return (
    <section id="systems" style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="02" title="Systems I've shaped" />

      <div className={flowStyles.panel}>
        <FlowDiagram caption="// request lifecycle — payments platform" stages={stages} />

        <div
          style={{
            display: "flex",
            gap: 26,
            flexWrap: "wrap",
            marginTop: 26,
            paddingTop: 22,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {principles.map((pr) => (
            <div key={pr.t} style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 230 }}>
              <span style={{ color: "#7ee787", fontFamily: fonts.mono, fontSize: 13, marginTop: 1 }}>
                ◆
              </span>
              <div>
                <div style={{ fontSize: 14, color: "#e6e8eb", fontWeight: 500 }}>{pr.t}</div>
                <div style={{ fontSize: 12.5, color: "#6b7178", lineHeight: 1.5 }}>{pr.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
