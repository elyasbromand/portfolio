import { fonts } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import SelectedWork from "@/components/SelectedWork";
import Systems from "@/components/Systems";
import ApiShowcase from "@/components/ApiShowcase";
import Toolbox from "@/components/Toolbox";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
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

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
        <Nav />
        <Hero />
        <Metrics />
        <SelectedWork />
        <Systems />
        <ApiShowcase />
        <Toolbox />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}
