import { fonts } from "@/lib/fonts";
import styles from "./PageShell.module.css";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0a0b0d",
        color: "#e6e8eb",
        fontFamily: fonts.sans,
        minHeight: "100vh",
        fontSize: 16,
        lineHeight: 1.6,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* subtle grid backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      <div className={styles.container}>{children}</div>
    </div>
  );
}
