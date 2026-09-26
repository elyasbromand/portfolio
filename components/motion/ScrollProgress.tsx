"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";

/**
 * 2px accent line under the nav that fills with page scroll progress. It's
 * rendered inside Nav's `.container` (same centered max-width as the nav bar
 * itself) right after `<nav>`, so it matches the nav's width exactly and sits
 * flush under its border — not edge-to-edge of the viewport. Because it's a
 * normal-flow sibling right after `.nav`, hiding the header (which translates
 * up by exactly `nav.offsetHeight`) still lands it at y=0, so it stays
 * visible while the nav is hidden. Tracks on every device; reduced motion
 * drops the easing.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ reduceMotion: mq.reduceMotion, motionOK: mq.motionOK }, (ctx) => {
      const { reduceMotion } = ctx.conditions as Record<string, boolean>;
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: reduceMotion ? true : 0.3 },
        }
      );
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        width: "100%",
        height: 2,
        background: "#7ee787",
        transformOrigin: "left center",
        transform: "scaleX(0)",
        pointerEvents: "none",
      }}
    />
  );
}
