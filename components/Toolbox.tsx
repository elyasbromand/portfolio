"use client";

import { useEffect, useRef, useState } from "react";
import { fonts } from "@/lib/fonts";
import { stackGroups } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import styles from "./Toolbox.module.css";

/**
 * Bracket-tree toolbox. On scroll into view a stem drops from the title, the
 * rail opens out to both sides, six legs drop to the middle of each column,
 * and the columns land left-to-right.
 *
 * Below 860px the bracket rotates into a vertical spine: one branch per group,
 * tools as tap-sized chips.
 */

/** Shorter display labels so a column heading fits one or two lines. */
const SHORT_LABEL: Record<string, string> = {
  "Frameworks / Runtime": "Frameworks",
};

export default function Toolbox() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setDrawn(true);
        });
      },
      { threshold: 0.25 }
    );
    [desktopRef.current, mobileRef.current].forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stack" style={{ padding: "72px 0 24px" }}>
      <SectionHeading index="04" title="Tech Stack" />

      {/* ── desktop: bracket tree ─────────────────────────────── */}
      <div ref={desktopRef} className={styles.desktop} data-drawn={drawn}>
        <div style={{ textAlign: "center" }}>
          <div className={styles.bigTitle} style={{ fontFamily: fonts.display }}>
            <span style={{ color: "#7ee787" }}>Backend AI</span>{" "}
            <span style={{ color: "#f4f6f7" }}>Engineer</span>
          </div>
          <div className={styles.caption} style={{ fontFamily: fonts.mono }}>
            // 26 tools, arranged the way I&apos;d explain them
          </div>
        </div>

        <div className={styles.bracket}>
          <div className={styles.stem} />
          <div className={styles.rail} />
          <div className={styles.legs}>
            {stackGroups.map((g) => (
              <div key={g.label} className={styles.legCell}>
                <div className={styles.leg} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cols}>
          {stackGroups.map((g) => (
            <div key={g.label} className={styles.col}>
              <div
                className={styles.colTitle}
                style={{ fontFamily: fonts.display }}
              >
                {SHORT_LABEL[g.label] ?? g.label}
              </div>
              <div className={styles.colItems}>
                {g.items.map((i) => (
                  <div key={i} style={{ fontFamily: fonts.mono, fontSize: 12.5, color: "#c4c9cf", lineHeight: 1.45 }}>
                    {i}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── phone: spine ──────────────────────────────────────── */}
      <div ref={mobileRef} className={styles.mobile} data-drawn={drawn}>
        <div className={styles.mBigTitle} style={{ fontFamily: fonts.display }}>
          <span style={{ color: "#7ee787" }}>FULL STACK</span>
          <br />
          <span style={{ color: "#f4f6f7" }}>DEVELOPER</span>
        </div>
        <div className={styles.mCaption} style={{ fontFamily: fonts.mono }}>
          // {stackGroups.reduce((n, g) => n + g.items.length, 0)} tools, {stackGroups.length} groups
        </div>

        <div className={styles.spineWrap}>
          <div className={styles.spine} />
          {stackGroups.map((g) => (
            <div key={g.label} className={styles.branch}>
              <div className={styles.tick} />
              <div className={styles.branchHead}>
                <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 16, color: "#f4f6f7", letterSpacing: "-0.01em" }}>
                  {SHORT_LABEL[g.label] ?? g.label}
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: "#565b63" }}>
                  {String(g.items.length).padStart(2, "0")}
                </div>
              </div>
              <div className={styles.chips}>
                {g.items.map((i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 12.5,
                      color: "#c4c9cf",
                      background: "#15181c",
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "6px 11px",
                      borderRadius: 6,
                    }}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
