import { fonts } from "@/lib/fonts";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" style={{ padding: "72px 0 40px" }}>
      <div
        className={styles.card}
        style={{
          background: "#0d0f12",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(126,231,135,0.07), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 13, color: "#7ee787", marginBottom: 18 }}>
            $ ./say-hello.sh
          </div>
          <h2
            style={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: "#f4f6f7",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Let&apos;s talk about your backend.
          </h2>
          <p style={{ fontSize: 17, color: "#a2a8b0", maxWidth: "52ch", margin: "0 auto 34px" }}>
            Open to backend and platform engineering roles, and to
            interesting infrastructure problems. Fastest reply is by email.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:elyasbromand3@gmail.com"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#7ee787",
                color: "#0a0b0d",
                padding: "14px 24px",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 15,
                wordBreak: "break-word",
              }}
            >
              elyasbromand3@gmail.com
            </a>
            <a
              href="https://github.com/elyasbromand"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#141619",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e6e8eb",
                padding: "14px 22px",
                borderRadius: 9,
                fontFamily: fonts.mono,
                fontSize: 14,
              }}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/elyas-bromand"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#141619",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e6e8eb",
                padding: "14px 22px",
                borderRadius: 9,
                fontFamily: fonts.mono,
                fontSize: 14,
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 0",
          fontFamily: fonts.mono,
          fontSize: 12,
          color: "#565b63",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>© 2026 Elyas Bromand</span>
        <span>Kabul, Afghanistan · built from scratch, deployed with care</span>
      </div>
    </section>
  );
}
