"use client";

import { useEffect, useState } from "react";

/**
 * Animates from 0 to `target` over `duration` ms using an ease-out cubic
 * curve. Used by the homepage Metrics strip and by ProjectStats on case
 * study pages so both share one animation implementation.
 */
export function useCountUp(target: number, duration = 1400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * ease(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}