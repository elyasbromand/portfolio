import { fonts } from "@/lib/fonts";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <header className={styles.grid}>
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            fontFamily: fonts.mono,
            fontSize: 12.5,
            color: "#7ee787",
            border: "1px solid rgba(126,231,135,0.25)",
            background: "rgba(126,231,135,0.05)",
            padding: "6px 12px",
            borderRadius: 100,
            marginBottom: 34,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#7ee787",
              boxShadow: "0 0 8px #7ee787",
            }}
          />
          available for backend / platform roles
        </div>

        <h1
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: "clamp(38px, 5vw, 64px)",
            lineHeight: 1.03,
            letterSpacing: "-0.028em",
            color: "#f4f6f7",
            maxWidth: "15ch",
            marginBottom: 26,
          }}
        >
          I build the systems that stay up even if your data center blow up.
        </h1>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "#a2a8b0",
            maxWidth: "52ch",
            marginBottom: 14,
          }}
        >
          Elyas Bromand — backend engineer focused on AI integration,
          distributed services, and low-latency APIs. I care about the boring
          parts: correctness, observability, and scalability.
        </p>

        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: 13.5,
            color: "#6b7178",
            marginBottom: 40,
          }}
        >
          // Information Systems, 7th semester · Kabul Polytechnic University
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a
            href="#work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "#141619",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e6e8eb",
              padding: "13px 20px",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            View selected work
            <span style={{ color: "#7ee787" }}>→</span>
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              color: "#8b9199",
              padding: "13px 20px",
              borderRadius: 8,
              fontFamily: fonts.mono,
              fontSize: 14,
              border: "1px solid transparent",
            }}
          >
            get in touch
          </a>
        </div>
      </div>

      {/* PORTRAIT */}
      <div className={styles.portrait} style={{ position: "relative", width: "100%", maxWidth: 340 }}>
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 18,
            background:
              "linear-gradient(160deg, rgba(126,231,135,0.35), rgba(126,231,135,0.02) 55%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.09)",
            background: "#0d0f12",
          }}
        >
          {/*
            Placeholder for Elyas's photo — swap for a real <Image> once one
            is available, e.g.:
            <Image src="/portrait.jpg" alt="Elyas Bromand" fill style={{ objectFit: "cover" }} />
          */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 24,
              fontFamily: fonts.mono,
              fontSize: 13,
              color: "#565b63",
            }}
          >
            Drop Elyas&apos;s photo
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: fonts.mono,
            fontSize: 11.5,
            color: "#0a0b0d",
            background: "rgba(126,231,135,0.92)",
            padding: "5px 11px",
            borderRadius: 100,
            pointerEvents: "none",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a0b0d" }} />
          elyas.bromand
        </div>
      </div>
    </header>
  );
}
