"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fonts } from "@/lib/fonts";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "work" },
  { href: "/#systems", label: "systems" },
  { href: "/#stack", label: "stack" },
  { href: "/#certifications", label: "certifications" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

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

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          id="nav-links-panel"
          className={isOpen ? styles.linksOpen : styles.links}
          style={{ fontFamily: fonts.mono, fontSize: 13 }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "#8b9199" }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/#contact"
          className={styles.hireMe}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            color: "#0a0b0d",
            background: "#7ee787",
            borderRadius: 6,
            fontWeight: 600,
            fontFamily: fonts.mono,
            fontSize: 13,
          }}
        >
          let&apos;s connect
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="nav-links-panel"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#e6e8eb",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
