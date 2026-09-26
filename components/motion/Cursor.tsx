"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { fonts } from "@/lib/fonts";

/**
 * Decorative cursor for mouse/trackpad users: an accent dot that tracks the
 * pointer and a ring that trails it. It reacts to what's underneath —
 * links/buttons grow the ring, `[data-cursor="view"]` shows a "view" label,
 * code blocks squash it into an I-beam. The native cursor is never hidden
 * (accessibility); none of this exists on touch or under reduced motion.
 *
 * No `mix-blend-mode` here: combined with the Nav's `backdrop-filter: blur`,
 * a blend mode forces the browser to recompute the blend every frame the
 * cursor moves near/over it, which is a well-known source of visible jank
 * (found testing the first version of this component). Plain colors with
 * enough contrast against the site's dark background achieve the same look
 * without that cost.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const dot = dotRef.current!;
      const ring = ringRef.current!;
      const label = labelRef.current!;
      const parts = [dot, ring, label];

      gsap.set(parts, { xPercent: -50, yPercent: -50, autoAlpha: 0, display: "block" });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
      const ringX = gsap.quickTo([ring, label], "x", { duration: 0.35, ease: "power3.out" });
      const ringY = gsap.quickTo([ring, label], "y", { duration: 0.35, ease: "power3.out" });

      let visible = false;
      let state = "";

      const setState = (next: string) => {
        if (next === state) return; // dedupe: only re-tween on an actual category change
        state = next;
        const d = 0.3;
        if (next === "view") {
          gsap.to(ring, { scaleX: 2.25, scaleY: 2.25, borderColor: "rgba(126,231,135,0.9)", duration: d, overwrite: "auto" });
          gsap.to(label, { autoAlpha: 1, duration: d, overwrite: "auto" });
          gsap.to(dot, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
        } else if (next === "link") {
          gsap.to(ring, { scaleX: 1.6, scaleY: 1.6, borderColor: "rgba(126,231,135,0.9)", duration: d, overwrite: "auto" });
          gsap.to(label, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
          gsap.to(dot, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
        } else if (next === "text") {
          gsap.to(ring, { scaleX: 0.08, scaleY: 0.75, borderColor: "rgba(230,232,235,0.9)", duration: d, overwrite: "auto" });
          gsap.to(label, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
          gsap.to(dot, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
        } else {
          gsap.to(ring, { scaleX: 1, scaleY: 1, borderColor: "rgba(230,232,235,0.45)", duration: d, overwrite: "auto" });
          gsap.to(label, { autoAlpha: 0, duration: d * 0.6, overwrite: "auto" });
          gsap.to(dot, { autoAlpha: 1, duration: d * 0.6, overwrite: "auto" });
        }
      };

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        if (!visible) {
          visible = true;
          // first sighting: jump into place, then fade in
          gsap.set(parts, { x: e.clientX, y: e.clientY });
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const t = e.target as Element | null;
        if (!t || !t.closest) return;
        if (t.closest('[data-cursor="view"]')) setState("view");
        else if (t.closest("a, button, [role='button'], label, summary")) setState("link");
        else if (t.closest("pre, code")) setState("text");
        else setState("");
      };
      const leaveDoc = () => {
        visible = false;
        state = "";
        gsap.to(parts, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      };

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leaveDoc);
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leaveDoc);
      };
    });
  });

  const base: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    pointerEvents: "none",
    zIndex: 100,
    display: "none", // shown by GSAP only for fine pointers without reduced motion
    willChange: "transform",
  };

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(230,232,235,0.45)",
        }}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        style={{
          ...base,
          fontFamily: fonts.mono,
          fontSize: 11,
          letterSpacing: "0.04em",
          color: "#7ee787",
        }}
      >
        view
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ ...base, width: 6, height: 6, borderRadius: "50%", background: "#7ee787" }}
      />
    </>
  );
}
