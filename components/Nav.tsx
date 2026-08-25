import { fonts } from "@/lib/fonts";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 0",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        background: "rgba(10,11,13,0.82)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 14,
          letterSpacing: "0.02em",
          color: "#e6e8eb",
        }}
      >
        <span style={{ color: "#7ee787" }}>~/</span>
        elyas
        <span style={{ color: "#565b63" }}>.</span>
        bromand
      </div>
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          fontFamily: fonts.mono,
          fontSize: 13,
        }}
      >
        <a href="#work" style={{ color: "#8b9199" }}>
          work
        </a>
        <a href="#systems" style={{ color: "#8b9199" }}>
          systems
        </a>
        <a href="#stack" style={{ color: "#8b9199" }}>
          stack
        </a>
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            color: "#0a0b0d",
            background: "#7ee787",
            padding: "7px 14px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          hire me
        </a>
      </div>
    </nav>
  );
}
