"use client";

import { useState } from "react";
import Image from "next/image";
import { fonts } from "@/lib/fonts";
import { certificationIssuers, certifications } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import styles from "./Certifications.module.css";

export default function Certifications() {
  const [activeIssuer, setActiveIssuer] = useState(certificationIssuers[0].key);

  const active = certificationIssuers.find((iss) => iss.key === activeIssuer) ?? certificationIssuers[0];
  const activeCerts = certifications.filter((c) => c.issuer === active.key);

  return (
    <section id="certifications" style={{ padding: "72px 0 40px" }}>
      <SectionHeading index="02" title="Certifications" />

      <p
        style={{
          fontFamily: fonts.mono,
          fontSize: 13,
          color: "#6b7178",
          marginBottom: 30,
        }}
      >
        // {certifications.length} certificates from {certificationIssuers.length} issuers — every one links to a
        verifiable credential
      </p>

      <div
        className={styles.split}
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div className={styles.rail} style={{ background: "#0d0f12" }}>
          {certificationIssuers.map((iss) => {
            const isActive = iss.key === active.key;
            const count = certifications.filter((c) => c.issuer === iss.key).length;
            return (
              <div
                key={iss.key}
                onClick={() => setActiveIssuer(iss.key)}
                className={styles.railItem}
                style={{ cursor: "pointer", transition: "background 0.16s" }}
              >
                <div
                  style={{
                    width: 3,
                    height: 38,
                    borderRadius: 2,
                    flex: "none",
                    transition: "background 0.18s",
                    background: isActive ? "#7ee787" : "#23262b",
                  }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flex: "none",
                    borderRadius: 9,
                    background: "#15181c",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: fonts.mono,
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: isActive ? "#7ee787" : "#6b7178",
                  }}
                >
                  {iss.logo ? (
                    <Image src={iss.logo} alt={`${iss.name} logo`} fill sizes="36px" style={{ objectFit: "cover" }} />
                  ) : (
                    iss.badge
                  )}
                </div>
                <div className={styles.railItemText} style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 600,
                      fontSize: 15,
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                      color: isActive ? "#f4f6f7" : "#8b9199",
                    }}
                  >
                    {iss.name}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 11.5,
                      color: "#565b63",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {iss.via}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 12.5,
                    flex: "none",
                    color: isActive ? "#7ee787" : "#565b63",
                  }}
                >
                  {String(count).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#0d0f12", padding: "26px 28px 22px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: "#7ee787",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {active.name}
            </span>
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: "#565b63" }}>
              {active.via} · {activeCerts.length} {activeCerts.length === 1 ? "credential" : "credentials"}
            </span>
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: fonts.mono,
                fontSize: 11.5,
                color: "#6b7178",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7ee787",
                  animation: "blink 1.6s infinite",
                }}
              />
              all current
            </span>
          </div>

          <p style={{ fontSize: 14, color: "#6b7178", marginBottom: 16, maxWidth: "62ch" }}>{active.blurb}</p>

          {activeCerts.map((c, i) => (
            <div key={c.credentialId} style={{ animation: "slideIn 0.32s ease both", animationDelay: `${i * 50}ms` }}>
              <div className={styles.row} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 600,
                      fontSize: 17.5,
                      color: c.placeholder ? "#6b7178" : "#f4f6f7",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.35,
                      marginBottom: 9,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {c.skills.map((s) => (
                      <span
                        key={s}
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
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.rowMeta}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 12.5, color: "#c4c9cf" }}>{c.date}</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 11.5, color: "#565b63", margin: "3px 0 9px" }}>
                    cred {c.credentialId}
                  </div>
                  <a
                    href={c.verifyUrl}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: fonts.mono, fontSize: 12.5 }}
                  >
                    verify <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
