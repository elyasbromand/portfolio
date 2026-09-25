"use client";

/**
 * The only place GSAP and its plugins are imported and registered.
 * Every animated component imports `gsap` (and any plugin it needs) from
 * here, never from "gsap" directly, so registration happens exactly once.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { ease, dur } from "./motion";

// Client components are also evaluated during SSR; only register in the browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    TextPlugin,
    ScrollToPlugin
  );
  gsap.defaults({ ease: ease.out, duration: dur.md });
  // Mobile address-bar show/hide shouldn't trigger a full refresh.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  TextPlugin,
  ScrollToPlugin,
};
