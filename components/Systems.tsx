import { fonts } from "@/lib/fonts";
import { principles } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";

const nodeBase: React.CSSProperties = {
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
  minWidth: 104,
};

const arrowStyle: React.CSSProperties = {
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  color: "#565b63",
  fontFamily: fonts.mono,
};

const serviceRowStyle: React.CSSProperties = {
  background: "#141619",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 18px",
  minWidth: 150,
  fontFamily: fonts.mono,
  fontSize: 12,
  color: "#e6e8eb",
};

const storageRowStyle: React.CSSProperties = {
  background: "#0f1418",
  border: "1px solid rgba(126,231,135,0.2)",
  borderRadius: 10,
  padding: "12px 18px",
  minWidth: 150,
  fontFamily: fonts.mono,
  fontSize: 12,
  color: "#a2a8b0",
};

export default function Systems() {
  return (
    <section id="systems" style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="02" title="Systems I've shaped" />

      <div
        style={{
          background: "#0d0f12",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "34px 32px",
        }}
      >
        <div style={{ fontFamily: fonts.mono, fontSize: 12.5, color: "#6b7178", marginBottom: 28 }}>
          {"// request lifecycle — payments platform"}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingBottom: 6,
          }}
        >
          <div style={nodeBase}>
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: "#e6e8eb" }}>client</span>
            <span style={{ fontSize: 11, color: "#6b7178" }}>web / mobile</span>
          </div>

          <div style={arrowStyle}>→</div>

          <div
            style={{
              ...nodeBase,
              background: "rgba(126,231,135,0.06)",
              border: "1px solid rgba(126,231,135,0.28)",
              minWidth: 120,
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: "#7ee787" }}>API gateway</span>
            <span style={{ fontSize: 11, color: "#6b7178" }}>auth · rate-limit</span>
          </div>

          <div style={arrowStyle}>→</div>

          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={serviceRowStyle}>
              ledger-core <span style={{ color: "#565b63" }}>svc</span>
            </div>
            <div style={serviceRowStyle}>
              fanout <span style={{ color: "#565b63" }}>svc</span>
            </div>
            <div style={serviceRowStyle}>
              notify <span style={{ color: "#565b63" }}>svc</span>
            </div>
          </div>

          <div style={arrowStyle}>→</div>

          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={storageRowStyle}>
              Postgres <span style={{ color: "#565b63" }}>primary</span>
            </div>
            <div style={storageRowStyle}>
              Redis <span style={{ color: "#565b63" }}>cache</span>
            </div>
            <div style={storageRowStyle}>
              Kafka <span style={{ color: "#565b63" }}>events</span>
            </div>
          </div>
        </div>

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
