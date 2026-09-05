/**
 * Shared branded OG/Twitter image renderer. Every opengraph-image /
 * twitter-image route (homepage and per-project) calls this with just the
 * text to show — the visual design lives in exactly one place.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogImageSize = { width: 1200, height: 630 } as const;
export const ogImageContentType = "image/png";

const displayFontData = readFile(join(process.cwd(), "app/fonts/space-grotesk-600.ttf"));
const monoFontData = readFile(join(process.cwd(), "app/fonts/jetbrains-mono-400.ttf"));

interface RenderOgImageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export async function renderOgImage({ eyebrow, title, subtitle }: RenderOgImageProps) {
  const [displayFont, monoFont] = await Promise.all([displayFontData, monoFontData]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          background: "#0a0b0d",
          backgroundImage:
            "radial-gradient(circle at 82% 15%, rgba(126,231,135,0.18), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            color: "#7ee787",
            marginBottom: 40,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#7ee787" }} />
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Space Grotesk",
            fontSize: 62,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#f4f6f7",
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            color: "#a2a8b0",
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Space Grotesk", data: displayFont, style: "normal", weight: 600 },
        { name: "JetBrains Mono", data: monoFont, style: "normal", weight: 400 },
      ],
    }
  );
}
