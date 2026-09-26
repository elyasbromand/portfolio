"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { dur, ease, mq, offset, stagger, MOBILE_TIME_SCALE, type MotionConditions } from "@/lib/motion";
import { magnetic, spotlight } from "@/lib/pointer";

/**
 * Declarative motion for server components: they only add data-attributes,
 * and this one client component wires the animations up.
 *
 *   data-reveal="up"        y + fade in when scrolled into view
 *   data-reveal="fade"      fade in
 *   data-reveal="lines"     SplitText masked line reveal (plain text only)
 *   data-reveal="scramble"  ScrambleText into place (plain text only)
 *   data-reveal="rule"      horizontal line draws from the left
 *   data-reveal="stagger"   container; its [data-reveal-item] descendants
 *                           reveal in staggered batches
 *   data-reveal-delay="0.2" extra delay in seconds
 *   data-magnetic           element drifts toward the pointer (fine pointers)
 *   data-spotlight          accent glow follows the pointer (fine pointers)
 *
 * Hidden-before-reveal is CSS (`[data-js] [data-reveal]` in globals.css), so
 * no-JS and reduced-motion visitors always see everything. Don't put
 * data-magnetic on an element that also reveals — both animate transforms;
 * wrap one in the other instead.
 */
export default function MotionRoot({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // The inline <head> script sets this before first paint; in dev, Strict
  // Mode's remount resets <html> attributes, so set it again here.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-js", "");
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const all = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
      const mm = gsap.matchMedia();

      mm.add(mq, (ctx) => {
        const c = ctx.conditions as unknown as MotionConditions;
        // Reduced motion: CSS already shows everything; add no motion at all.
        if (c.reduceMotion) return;

        const t = c.isMobile ? MOBILE_TIME_SCALE : 1;
        const y = c.isMobile ? offset.mobile : offset.desktop;
        const delayOf = (el: HTMLElement) => (parseFloat(el.dataset.revealDelay ?? "") || 0) * t;
        const onEnter = (el: HTMLElement): ScrollTrigger.Vars => ({ trigger: el, start: "top 85%", once: true });

        all('[data-reveal="up"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y },
            { autoAlpha: 1, y: 0, duration: dur.md * t, delay: delayOf(el), scrollTrigger: onEnter(el) }
          );
        });

        all('[data-reveal="fade"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: dur.md * t, delay: delayOf(el), scrollTrigger: onEnter(el) }
          );
        });

        all('[data-reveal="rule"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, ease: ease.inOut, duration: dur.lg * t, delay: delayOf(el), scrollTrigger: onEnter(el) }
          );
        });

        all('[data-reveal="scramble"]').forEach((el) => {
          if (c.isMobile) {
            gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur.sm, delay: delayOf(el), scrollTrigger: onEnter(el) });
            return;
          }
          const text = el.textContent ?? "";
          // fromTo (not .set) so the timeline renders the hidden state until
          // it's triggered — a .set at 0 would reveal the element immediately.
          gsap
            .timeline({ delay: delayOf(el), scrollTrigger: onEnter(el) })
            .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
            .to(el, { duration: 0.8, ease: "none", scrambleText: { text, chars: "01<>/_", speed: 0.6 } });
        });

        all('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true, // re-split on font load / resize so lines stay correct
            onSplit(self) {
              gsap.set(el, { autoAlpha: 1 });
              return gsap.from(self.lines, {
                yPercent: 100,
                duration: dur.lg * t,
                ease: ease.line,
                stagger: c.isMobile ? 0.06 : stagger.base,
                delay: delayOf(el),
                scrollTrigger: onEnter(el),
              });
            },
          });
        });

        const items = all('[data-reveal="stagger"] [data-reveal-item]');
        if (items.length) {
          ScrollTrigger.batch(items, {
            start: "top 85%",
            once: true,
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { autoAlpha: 0, y: y * 0.75 },
                { autoAlpha: 1, y: 0, duration: dur.md * t, stagger: stagger.base, overwrite: true }
              ),
          });
        }

        if (!c.canHover) return;

        // Pointer effects — fine pointers only (never on touch).
        const cleanups: Array<() => void> = [];
        all("[data-magnetic]").forEach((el) => cleanups.push(magnetic(el)));
        all("[data-spotlight]").forEach((el) => cleanups.push(spotlight(el)));
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
