"use client";

import { ScrollSmoother } from "./gsap";

/**
 * Distance (px) an anchor target should land below the viewport top — read
 * from the `--anchor-offset` CSS variable so the smoothed path and the native
 * `scroll-margin-top` fallback always agree.
 */
export function anchorOffset(): number {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--anchor-offset");
  return parseFloat(v) || 0;
}

/**
 * Scroll to an element or a y position. Uses ScrollSmoother when it's active
 * (desktop/touch without reduced motion), otherwise native scrolling — which
 * respects `scroll-margin-top` on sections.
 */
export function scrollToTarget(target: Element | number, smooth = true): void {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    if (typeof target === "number") smoother.scrollTo(target, smooth);
    else smoother.scrollTo(target, smooth, `top ${anchorOffset()}px`);
    return;
  }
  const behavior: ScrollBehavior =
    smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}

/** Resolve "#id" to an element, or null. */
export function hashTarget(hash: string): Element | null {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}
