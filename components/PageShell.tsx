import { fonts } from "@/lib/fonts";
import Nav from "./Nav";
import SmoothScroll from "./motion/SmoothScroll";
import MotionRoot from "./motion/MotionRoot";
import styles from "./PageShell.module.css";

/**
 * Shared page chrome for every route. Fixed-position layers (grid backdrop,
 * Nav) sit OUTSIDE <SmoothScroll>: ScrollSmoother transforms its content,
 * which would break `position: fixed/sticky` inside it. That's also why the
 * Nav lives here rather than in each route.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0a0b0d",
        color: "#e6e8eb",
        fontFamily: fonts.sans,
        minHeight: "100vh",
        fontSize: 16,
        lineHeight: 1.6,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* subtle grid backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      <div className={styles.navLayer}>
        <div className={styles.container}>
          <Nav />
        </div>
      </div>

      <SmoothScroll>
        <MotionRoot>
          <div className={styles.container}>
            {/* reserves the fixed Nav's height so the layout matches the old sticky nav */}
            <div aria-hidden="true" className={styles.navSpacer} />
            {children}
          </div>
        </MotionRoot>
      </SmoothScroll>
    </div>
  );
}
