"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { dur, mq, MOBILE_TIME_SCALE } from "@/lib/motion";

/**
 * Hero's load-in sequence: a hand-built master timeline (not the generic
 * MotionRoot reveal engine — this needs precise cross-element sequencing and
 * a couple of effects, like the typed line and the portrait's clip-path
 * wipe, that engine doesn't cover). It runs once on mount, not on scroll, and
 * is deliberately kept short (finishes well under 1.5s) since the `h1` is
 * the likely LCP element. Plays after `document.fonts.ready` so SplitText
 * measures final line breaks, not fallback-font ones.
 *
 * The portrait's hover tilt and the scroll-out parallax are separate,
 * ongoing behaviours (not part of the one-shot load timeline) and are wired
 * up in their own ungated/matchMedia-gated effects below.
 *
 * `data-hero` elements are hidden via CSS ([data-js] [data-hero]) until this
 * runs; reduced motion shows everything immediately via a plain CSS override
 * (same mechanism as MotionRoot's [data-reveal]), so this component does
 * nothing at all in that case.
 */
interface HeroMotionProps {
  children: React.ReactNode;
  /** Forwarded to the <header> this renders, so Hero.tsx's grid layout class
   * still applies — HeroMotion owns the root element (not a display:contents
   * wrapper) because the scroll-out parallax below needs a real bounding
   * box to use as its ScrollTrigger trigger. */
  className?: string;
}

export default function HeroMotion({ children, className }: HeroMotionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const reduceMotion = window.matchMedia(mq.reduceMotion).matches;
      if (reduceMotion) return; // CSS already shows everything; add no motion.

      const isMobile = window.matchMedia(mq.isMobile).matches;
      const t = isMobile ? MOBILE_TIME_SCALE : 1;
      const at = (seconds: number) => seconds * t; // scales an absolute offset

      const badge = root.querySelector<HTMLElement>('[data-hero="badge"]')!;
      const h1 = root.querySelector<HTMLElement>('[data-hero="h1"]')!;
      const lead = root.querySelector<HTMLElement>('[data-hero="lead"]')!;
      const typed = root.querySelector<HTMLElement>('[data-hero="typed"]')!;
      const caret = root.querySelector<HTMLElement>('[data-hero="caret"]')!;
      const ctas = root.querySelector<HTMLElement>('[data-hero="ctas"]')!;
      const border = root.querySelector<HTMLElement>('[data-hero="border"]')!;
      const frame = root.querySelector<HTMLElement>('[data-hero="frame"]')!;
      const image = root.querySelector<HTMLElement>('[data-hero="image"]')!;
      const tag = root.querySelector<HTMLElement>('[data-hero="tag"]')!;

      let splitCleanup = () => {};
      // React Strict Mode (dev only) mounts, cleans up, and remounts every
      // effect once to surface exactly this kind of bug. That cleanup cycle
      // runs synchronously, before any microtask — so a plain
      // `document.fonts.ready.then(...)` callback is NOT covered by
      // useGSAP's automatic revert (which only tracks gsap.* calls made
      // synchronously inside the effect). Without this flag, the phantom
      // first mount's callback still fires later and runs SplitText.create()
      // a second time on the same h1, colliding with the real mount's split
      // and corrupting it — found by adding temporary logging: onSplit fired
      // twice, both reporting a fresh `firstSplit=true`. This is the
      // standard cancel-flag pattern for async work started inside an effect.
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled) return;

        // Every child below is placed at an explicit absolute position (in
        // seconds from the timeline's own start) — GSAP defaults an omitted
        // position to "right after whatever was added last", which is NOT
        // what this fixed-offset choreography wants, so every single call
        // gets one, including `.set()`s that look like they don't need it.
        const tl = gsap.timeline({ delay: 0.05 });

        // 0.00 — badge
        tl.fromTo(badge, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: dur.sm * t }, at(0));

        // 0.10 — h1, line by line. `SplitText.create()`'s *initial* split is
        // synchronous — `split.lines` is used directly in a plain `tl.from`
        // below, exactly like every other element, rather than trying to
        // insert an animation into `tl` from inside `onSplit`. That insertion
        // approach was tried first and silently failed: even a single,
        // correctly-created instance never animated (lines stuck at their
        // hidden yPercent:105 start value, confirmed by dumping their
        // computed transforms) — `onSplit`'s *initial* call apparently still
        // lands a frame or two later than this synchronous code, by which
        // point `tl`'s playhead had already advanced past the 0.1s insertion
        // point, and GSAP doesn't rewind a timeline to render something
        // inserted behind its current position. `onSplit` is only needed
        // here for *later* re-splits (an actual resize, well after the intro
        // already played) — those just snap the new lines to their resting
        // position with no animation.
        gsap.set(h1, { autoAlpha: 1 });
        const split = SplitText.create(h1, {
          type: "lines",
          mask: "lines",
          autoSplit: true, // keeps lines correct if the viewport resizes later
          onSplit(self) {
            return gsap.set(self.lines, { yPercent: 0 });
          },
        });
        splitCleanup = () => split.revert();
        tl.from(split.lines, { yPercent: 105, duration: 1.0 * t, ease: "expo.out", stagger: 0.09 * t }, at(0.1));

        // 0.20 — portrait: frame wipes open, image settles from a slight
        // zoom, border glow fades in. `image` needs its own explicit
        // autoAlpha too, same as `frame` — animating only its `scale` (as
        // this did originally) never lifts the CSS-gate's
        // `visibility: hidden`, since that's a direct match on the <img>
        // itself, not something it could inherit "un-hidden" from a
        // revealed ancestor (found via the user reporting the portrait image
        // never appeared).
        tl.set([frame, image], { autoAlpha: 1 }, at(0.2))
          .fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 * t, ease: "power4.inOut" },
            at(0.2)
          )
          .fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.1 * t, ease: "power4.inOut" }, at(0.2))
          .fromTo(border, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur.lg * t }, at(0.2));

        // 0.45 — lead paragraph
        tl.fromTo(lead, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: dur.md * t }, at(0.45));

        // 0.60 — typed mono line, with a caret that blinks (CSS) while
        // typing and fades out once it's done. The clear-to-empty step is a
        // plain DOM write (not a TextPlugin .set()) — simpler and certain to
        // apply instantly regardless of how TextPlugin treats a 0-duration
        // "set".
        const typedText = typed.textContent ?? "";
        tl.set(typed, { autoAlpha: 1 }, at(0.6))
          .call(() => { typed.textContent = ""; }, [], at(0.6))
          .set(caret, { autoAlpha: 1 }, at(0.6))
          .to(typed, { duration: 0.7 * t, ease: "none", text: typedText }, at(0.6))
          .to(caret, { autoAlpha: 0, duration: dur.xs }, `+=${0.15 * t}`);

        // 0.70 — CTAs
        tl.fromTo(ctas, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: dur.md * t }, at(0.7));

        // 0.90 — portrait name tag
        tl.fromTo(tag, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: dur.md * t }, at(0.9));
      });

      return () => {
        cancelled = true;
        splitCleanup();
      };
    },
    { scope: rootRef }
  );

  // Portrait hover tilt (fine pointers only) and scroll-out parallax (desktop
  // only) — ongoing behaviours, separate from the one-shot load timeline
  // above, so they're allowed to react to matchMedia changes normally.
  useGSAP(
    () => {
      const root = rootRef.current!;
      const frame = root.querySelector<HTMLElement>('[data-hero="frame"]')!;
      const image = root.querySelector<HTMLElement>('[data-hero="image"]')!;
      const textCol = root.querySelector<HTMLElement>('[data-parallax="text"]')!;
      const mm = gsap.matchMedia();

      mm.add(
        { canHover: mq.canHover, isTouch: "(hover: none), (pointer: coarse)", reduceMotion: mq.reduceMotion, motionOK: mq.motionOK },
        (ctx) => {
          const { canHover, reduceMotion } = ctx.conditions as Record<string, boolean>;
          if (reduceMotion || !canHover) return;

          gsap.set(frame, { transformPerspective: 800, transformStyle: "preserve-3d" });
          const rotX = gsap.quickTo(frame, "rotationX", { duration: 0.4, ease: "power3.out" });
          const rotY = gsap.quickTo(frame, "rotationY", { duration: 0.4, ease: "power3.out" });
          const clamp = gsap.utils.clamp(-6, 6);
          const move = (e: PointerEvent) => {
            const r = frame.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rotX(clamp(-py * 12));
            rotY(clamp(px * 12));
          };
          const leave = () => {
            rotX(0);
            rotY(0);
          };
          frame.addEventListener("pointermove", move);
          frame.addEventListener("pointerleave", leave);
          return () => {
            frame.removeEventListener("pointermove", move);
            frame.removeEventListener("pointerleave", leave);
          };
        }
      );

      mm.add({ isDesktop: mq.isDesktop, isMobile: mq.isMobile, reduceMotion: mq.reduceMotion, motionOK: mq.motionOK }, (ctx) => {
        const { isDesktop, reduceMotion } = ctx.conditions as Record<string, boolean>;
        if (reduceMotion || !isDesktop) return;

        const st = {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        };
        gsap.to(image, { yPercent: -8, ease: "none", scrollTrigger: st });
        gsap.to(textCol, { y: -40, autoAlpha: 0.3, ease: "none", scrollTrigger: st });
      });
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <header ref={rootRef} className={className}>
      {children}
    </header>
  );
}
