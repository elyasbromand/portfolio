/**
 * Motion tokens — the single source of truth for eases, durations, staggers
 * and the responsive/accessibility conditions every animation branches on.
 * Breakpoints reuse the project's 860px / 640px tiers.
 */

export const ease = {
  out: "power3.out",
  outStrong: "expo.out",
  inOut: "power2.inOut",
  line: "power4.out",
};

export const dur = { xs: 0.2, sm: 0.35, md: 0.6, lg: 0.9, xl: 1.2 };

export const stagger = { tight: 0.04, base: 0.08, loose: 0.12 };

/** y distance (px) for reveal animations. */
export const offset = { desktop: 32, mobile: 16 };

/** Durations/delays are scaled by this on mobile. */
export const MOBILE_TIME_SCALE = 0.8;

/**
 * Conditions for `gsap.matchMedia().add({...}, fn)`. GOTCHA (found building
 * Nav): with a conditions object, `fn` only runs while AT LEAST ONE condition
 * matches — so never pass `{ reduceMotion }` alone (it would never run for
 * anyone without that preference set); pair it with `motionOK`, and pair
 * width queries so every size is covered.
 */
export const mq = {
  isDesktop: "(min-width: 861px)",
  isMobile: "(max-width: 860px)",
  isPhone: "(max-width: 640px)",
  canHover: "(hover: hover) and (pointer: fine)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
  motionOK: "(prefers-reduced-motion: no-preference)",
};

export interface MotionConditions {
  isDesktop: boolean;
  isMobile: boolean;
  isPhone: boolean;
  canHover: boolean;
  reduceMotion: boolean;
}
