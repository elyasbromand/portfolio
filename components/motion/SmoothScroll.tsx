"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollSmoother, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget, hashTarget } from "@/lib/scroll";

/**
 * ScrollSmoother wrapper. Full smoothing (1s) with a mouse/trackpad; a very
 * light touch on phones (`smoothTouch: 0.05`, native touch input — chosen by
 * feel on a real phone over native-only and over normalizeScroll, whose
 * release momentum flung small swipes far down). Heavier touch smoothing
 * (0.1) visibly vibrated, so keep this value low. Reduced motion gets no
 * smoother at all: the wrapper divs are inert and the page scrolls natively.
 *
 * Anything `position: fixed` (Nav, backdrop, cursor…) must live OUTSIDE this
 * component: ScrollSmoother transforms #smooth-content, which would make fixed
 * and sticky descendants scroll with the page.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current!,
          content: contentRef.current!,
          smooth: 1,
          smoothTouch: 0.05,
          effects: false,
          normalizeScroll: false,
        });
        // React runs child effects before parent effects, so in-page
        // ScrollTriggers already exist by now — re-measure them against the
        // smoothed layout (GSAP expects the smoother to exist first).
        ScrollTrigger.refresh();

        // Hash changes the click handler below can't intercept (back/forward
        // between #anchors, typing a hash in the address bar) make the browser
        // scroll the nearest scrollable box — the overflow:hidden wrapper —
        // instead of the page, silently offsetting everything. The wrapper
        // must never scroll, so undo that and route the jump to the smoother.
        const wrapper = wrapperRef.current!;
        const onWrapperScroll = () => {
          if (!wrapper.scrollTop && !wrapper.scrollLeft) return;
          wrapper.scrollTop = 0;
          wrapper.scrollLeft = 0;
          const el = hashTarget(window.location.hash);
          if (el) scrollToTarget(el);
        };
        wrapper.addEventListener("scroll", onWrapperScroll);
        const onHashChange = () => {
          const el = hashTarget(window.location.hash);
          if (el) scrollToTarget(el);
        };
        window.addEventListener("hashchange", onHashChange);

        return () => {
          wrapper.removeEventListener("scroll", onWrapperScroll);
          window.removeEventListener("hashchange", onHashChange);
          smoother.kill();
        };
      });

      // Same-page hash links ("#work", "/#work" while on "/"): the browser's
      // fragment jump measures the transformed content wrongly, so hand them
      // to the smoother. Capture phase runs before React's root listener, and
      // next/link skips its own navigation when defaultPrevented is already
      // set — while still running the Link's onClick (e.g. closing the menu).
      const onClick = (e: MouseEvent) => {
        if (!ScrollSmoother.get()) return; // native path handles itself
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
        if (!a || (a.target && a.target !== "_self")) return;
        const url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
        const el = hashTarget(url.hash);
        if (!el) return;
        e.preventDefault();
        scrollToTarget(el);
        if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
      };
      document.addEventListener("click", onClick, true);

      // Arriving with a hash (reload on /#stack, or /work/x → /#work): once
      // fonts have settled and triggers are measured, land precisely.
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        const el = hashTarget(window.location.hash);
        if (el) scrollToTarget(el, false);
      });

      return () => {
        cancelled = true;
        document.removeEventListener("click", onClick, true);
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
