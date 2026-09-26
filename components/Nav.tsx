"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fonts } from "@/lib/fonts";
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from "@/lib/gsap";
import { dur, ease, mq, stagger } from "@/lib/motion";
import { magnetic } from "@/lib/pointer";
import { scrollToTarget } from "@/lib/scroll";
import ScrollProgress from "./motion/ScrollProgress";
import styles from "./Nav.module.css";

const links = [
  { href: "/#work", label: "work" },
  { href: "/#certifications", label: "certifications" },
  { href: "/#experience", label: "experience" },
  { href: "/#stack", label: "stack" },
];

/** Net px scrolled in one direction, since the last direction flip, before
 * the nav toggles. Filters out the jitter/flicker that a naive
 * instantaneous-direction check produces (e.g. right as inertial scrolling
 * decelerates to a stop, its sign oscillates near zero). */
const TOGGLE_THRESHOLD = 24;
/** Don't hide until scrolled at least this far — keeps the nav present while
 * reading the very top of the page. */
const HIDE_AFTER = 120;

/**
 * Fixed site header (rendered by PageShell outside the smoothed content):
 * the nav bar plus the scroll-progress line under it. Motion:
 * - intro slide-down; hides on scroll down, returns on scroll up (net
 *   scroll distance, not instantaneous direction — see TOGGLE_THRESHOLD)
 * - background/border firm up once the page is scrolled
 * - desktop: an accent bar tracks the section in view and previews hovered
 *   links (no text effects — just the bar moving)
 * - phone: the menu panel wipes open, links stagger in, ☰ morphs into ✕
 */
export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hireRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Drive the menu timeline from state; lock page scroll while it's open.
  useEffect(() => {
    isOpenRef.current = isOpen;
    const tl = menuTl.current;
    if (tl) {
      if (isOpen) tl.play();
      else tl.reverse();
    }
    ScrollSmoother.get()?.paused(isOpen);
    if (isOpen) gsap.to(headerRef.current, { y: 0, duration: dur.sm, overwrite: true });
  }, [isOpen]);

  useGSAP(
    () => {
      const header = headerRef.current!;
      const nav = navRef.current!;
      const panel = panelRef.current!;
      const bar = barRef.current!;
      const linkEls = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[data-section]"));
      const mm = gsap.matchMedia();

      // Page-level behaviour: depends only on reduced motion, so crossing a
      // breakpoint doesn't replay the intro.
      mm.add({ reduceMotion: mq.reduceMotion, motionOK: mq.motionOK }, (ctx) => {
        const { reduceMotion } = ctx.conditions as Record<string, boolean>;
        const d = reduceMotion ? 0 : 1; // duration multiplier
        const cleanups: Array<() => void> = [];

        // ── intro ────────────────────────────────────────────
        if (!reduceMotion) {
          gsap
            .timeline({ delay: 0.1 })
            .fromTo(nav, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: dur.md })
            .fromTo(
              nav.querySelectorAll("[data-logo-part]"),
              { autoAlpha: 0, y: 8 },
              { autoAlpha: 1, y: 0, stagger: stagger.tight, duration: dur.sm },
              0.2
            );
        } else {
          gsap.set(nav, { autoAlpha: 1 });
        }

        // ── hide on scroll down / show on scroll up ──────────
        // Net-distance hysteresis, not instantaneous direction: a naive
        // `self.direction` check flickers as inertial scrolling decelerates
        // to a stop (its sign oscillates near zero velocity).
        const show = () => gsap.to(header, { y: 0, duration: dur.sm, ease: ease.out, overwrite: true });
        const hide = () =>
          gsap.to(header, { y: -nav.offsetHeight, duration: dur.sm, ease: ease.inOut, overwrite: true });

        if (!reduceMotion) {
          let lastY = 0;
          let dir = 0; // -1 up, 1 down, 0 none yet
          let acc = 0; // px accumulated in the current direction
          let hidden = false;

          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              if (isOpenRef.current) return;
              const y = self.scroll();
              const delta = y - lastY;
              lastY = y;
              if (delta === 0) return;

              if (y <= HIDE_AFTER) {
                acc = 0;
                if (hidden) {
                  hidden = false;
                  show();
                }
                return;
              }

              const sign = delta > 0 ? 1 : -1;
              if (sign !== dir) {
                dir = sign;
                acc = 0;
              }
              acc += Math.abs(delta);
              if (acc < TOGGLE_THRESHOLD) return;
              acc = 0;

              if (dir === 1 && !hidden) {
                hidden = true;
                hide();
              } else if (dir === -1 && hidden) {
                hidden = false;
                show();
              }
            },
          });
          // keyboard users tabbing into a hidden nav bring it back
          header.addEventListener("focusin", show);
          cleanups.push(() => header.removeEventListener("focusin", show));
        }

        // ── scrolled state: firmer background + border ───────
        ScrollTrigger.create({
          start: 40,
          end: "max",
          onToggle: (self) =>
            gsap.to(nav, {
              "--nav-bg-a": self.isActive ? 0.92 : 0.82,
              "--nav-border-a": self.isActive ? 0.12 : 0.07,
              duration: dur.sm * d,
            }),
        });

        return () => cleanups.forEach((fn) => fn());
      });

      // Layout-specific behaviour: phone menu vs. desktop indicator/hover.
      mm.add(
        {
          isPhone: mq.isPhone,
          isWide: "(min-width: 641px)",
          reduceMotion: mq.reduceMotion,
          canHover: mq.canHover,
        },
        (ctx) => {
          const { reduceMotion, isPhone, canHover } = ctx.conditions as Record<string, boolean>;
          const d = reduceMotion ? 0 : 1;
          const cleanups: Array<() => void> = [];

          if (isPhone) {
            // ── phone menu: panel wipe, link stagger, ☰ → ✕ ────
            const [top, mid, bot] = Array.from(burgerRef.current!.querySelectorAll("span"));
            const tl = gsap
              .timeline({ paused: true, defaults: { ease: ease.out } })
              .fromTo(
                panel,
                { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
                { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.4 * d, ease: ease.inOut }
              )
              .fromTo(linkEls, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: stagger.tight, duration: 0.3 * d }, 0.12 * d)
              .to(top, { y: 6, rotation: 45, duration: 0.3 * d }, 0)
              .to(mid, { scaleX: 0, autoAlpha: 0, duration: 0.2 * d }, 0)
              .to(bot, { y: -6, rotation: -45, duration: 0.3 * d }, 0);
            if (isOpenRef.current) tl.progress(1);
            menuTl.current = tl;
            cleanups.push(() => {
              menuTl.current = null;
              setIsOpen(false); // leaving the phone layout closes the menu
            });
          } else {
            // ── desktop: active-section indicator ───────────────
            let active: HTMLAnchorElement | null = null;
            const place = (link: HTMLAnchorElement | null, preview = false, instant = false) => {
              if (!link) {
                gsap.to(bar, { autoAlpha: 0, duration: dur.xs * d, overwrite: true });
                return;
              }
              gsap.to(bar, {
                x: link.offsetLeft,
                scaleX: link.offsetWidth,
                autoAlpha: preview ? 0.45 : 1,
                duration: instant ? 0 : 0.45 * d,
                ease: ease.inOut,
                overwrite: true,
              });
            };
            const setActive = (link: HTMLAnchorElement | null) => {
              active = link;
              linkEls.forEach((l) => (l.dataset.active = String(l === link)));
              place(link);
            };
            gsap.set(bar, { transformOrigin: "left center", autoAlpha: 0 });
            linkEls.forEach((link) => {
              const section = document.getElementById(link.dataset.section!);
              if (!section) return; // e.g. on case-study pages
              ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => {
                  if (self.isActive) setActive(link);
                  else if (active === link) setActive(null);
                },
              });
            });
            const onRefresh = () => place(active, false, true);
            ScrollTrigger.addEventListener("refresh", onRefresh);
            cleanups.push(() => {
              ScrollTrigger.removeEventListener("refresh", onRefresh);
              linkEls.forEach((l) => delete l.dataset.active);
            });

            if (canHover && !reduceMotion) {
              // hover: preview the bar under the link (no text effects)
              linkEls.forEach((link) => {
                const enter = () => place(link, link !== active);
                link.addEventListener("pointerenter", enter);
                cleanups.push(() => link.removeEventListener("pointerenter", enter));
              });
              const leavePanel = () => place(active);
              panel.addEventListener("pointerleave", leavePanel);
              cleanups.push(() => panel.removeEventListener("pointerleave", leavePanel));

              // "let's connect": magnetic + fill sweep in from the left, out to the right
              const hire = hireRef.current!;
              const fill = fillRef.current!;
              gsap.set(fill, { scaleX: 0 });
              const fillIn = () =>
                gsap.fromTo(fill, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: dur.sm, overwrite: true });
              const fillOut = () =>
                gsap.to(fill, { scaleX: 0, transformOrigin: "right center", duration: dur.sm, overwrite: true });
              hire.addEventListener("pointerenter", fillIn);
              hire.addEventListener("pointerleave", fillOut);
              cleanups.push(magnetic(hire), () => {
                hire.removeEventListener("pointerenter", fillIn);
                hire.removeEventListener("pointerleave", fillOut);
              });
            }
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );
    },
    { scope: headerRef }
  );

  return (
    <header ref={headerRef} className={styles.layer}>
      <div className={styles.container}>
        <nav
          ref={navRef}
          className={styles.nav}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,var(--nav-border-a))",
            background: "rgba(10,11,13,var(--nav-bg-a))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Link
            href="/"
            onClick={() => {
              setIsOpen(false);
              // Already on "/": the URL doesn't change, so Next won't scroll.
              if (window.location.pathname === "/") scrollToTarget(0);
            }}
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              letterSpacing: "0.02em",
              color: "#e6e8eb",
            }}
          >
            <span data-logo-part style={{ color: "#7ee787" }}>
              ~/
            </span>
            <span data-logo-part>elyas</span>
            <span data-logo-part style={{ color: "#565b63" }}>
              .
            </span>
            <span data-logo-part>bromand</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              ref={panelRef}
              id="nav-links-panel"
              className={styles.links}
              style={{ fontFamily: fonts.mono, fontSize: 13 }}
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.link}
                  data-section={link.href.split("#")[1]}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <span ref={barRef} className={styles.indicator} aria-hidden="true" />
            </div>

            <Link
              ref={hireRef}
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
              <span ref={fillRef} className={styles.hireFill} aria-hidden="true" />
              <span style={{ position: "relative" }}>let&apos;s connect</span>
            </Link>

            <button
              ref={burgerRef}
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
              }}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
        <ScrollProgress />
      </div>
    </header>
  );
}
