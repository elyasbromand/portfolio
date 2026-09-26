"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseCountUpOptions {
  /** Element whose entry into the viewport starts the count. */
  ref: RefObject<Element | null>;
  /** Seconds (not ms — this is GSAP, not the old rAF loop). */
  duration?: number;
  /** 0 snaps to whole numbers as it counts (a deliberate "ticking up" feel);
   * >0 stays continuous and is rounded for display by the caller. */
  decimals?: number;
}

/**
 * Animates from 0 to `target`, starting only once `ref`'s element scrolls
 * into view — the old rAF version started on mount, so anything below the
 * fold had already finished counting by the time it was seen. Reduced
 * motion skips the animation and jumps straight to the final value. Shared
 * by the homepage Metrics strip and ProjectStats on case-study pages so
 * both have one implementation.
 */
export function useCountUp(target: number, { ref, duration = 1.4, decimals = 0 }: UseCountUpOptions): number {
  const [value, setValue] = useState(0);
  // Effect below intentionally doesn't depend on `target`/`onUpdate`-relevant
  // values so it doesn't tear down and recreate the ScrollTrigger if the
  // target changes after mount; it just reads the latest via this ref.
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(targetRef.current);
      return;
    }

    const proxy = { v: 0 };
    const tween = gsap.to(proxy, {
      v: targetRef.current,
      duration,
      ease: "power2.out",
      snap: decimals === 0 ? { v: 1 } : undefined,
      paused: true,
      onUpdate: () => setValue(proxy.v),
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
    // `target` deliberately omitted — see targetRef above.
  }, [ref, duration, decimals]);

  return value;
}
