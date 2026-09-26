"use client";

import { gsap } from "./gsap";
import { ease } from "./motion";

/**
 * Pointer effects shared by MotionRoot (data-magnetic / data-spotlight inside
 * the page) and components outside it (Nav). Call them inside a gsap context
 * or matchMedia branch gated on fine pointers; each returns its cleanup.
 */

/** Element drifts toward the pointer (max ±`max` px) and eases back on leave.
 * Don't use on an element whose transform another tween animates. */
export function magnetic(el: HTMLElement, { strength = 0.25, max = 8 } = {}): () => void {
  const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: ease.out });
  const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: ease.out });
  const clamp = gsap.utils.clamp(-max, max);
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
  };
}

/** Sets --mx/--my/--spot for the `[data-spotlight]::after` glow in globals.css. */
export function spotlight(el: HTMLElement): () => void {
  const setX = gsap.quickSetter(el, "--mx", "px");
  const setY = gsap.quickSetter(el, "--my", "px");
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    setX(e.clientX - r.left);
    setY(e.clientY - r.top);
  };
  const enter = () => el.style.setProperty("--spot", "1");
  const leave = () => el.style.setProperty("--spot", "0");
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerenter", enter);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerenter", enter);
    el.removeEventListener("pointerleave", leave);
    el.style.removeProperty("--spot");
  };
}
