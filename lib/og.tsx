/**
 * Shared branded OG/Twitter image renderer. Every opengraph-image /
 * twitter-image route (homepage and per-project) calls this with just the
 * text to show — the visual design lives in exactly one place.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Rendered at 2x the 1200x630 logical design so the image stays sharp after
 * WhatsApp/LinkedIn crop-and-scale their thumbnail — a crop of a low-pixel
 * source gets blurry once scaled back up; a crop of a high-pixel source doesn't.
 */
const SCALE = 2;
const px = (n: number) => n * SCALE;

export const ogImageSize = { width: px(1200), height: px(630) } as const;
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
      // WhatsApp/some clients crop this to a much smaller centered box before
      // showing it, so all text is centered within a safe zone instead of
      // hugging the left edge — whatever gets cropped is margin, not text.
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: px(64),
          background: "#0a0b0d",
          backgroundImage:
            "radial-gradient(circle at 50% 15%, rgba(126,231,135,0.16), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: px(14),
            fontFamily: "JetBrains Mono",
            fontSize: px(26),
            color: "#7ee787",
            marginBottom: px(36),
          }}
        >
          <div
            style={{
              width: px(14),
              height: px(14),
              borderRadius: "50%",
              background: "#7ee787",
            }}
          />
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Space Grotesk",
            fontSize: px(56),
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#f4f6f7",
            maxWidth: px(840),
            justifyContent: "center",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: px(26),
            color: "#a2a8b0",
            marginTop: px(26),
            maxWidth: px(760),
            justifyContent: "center",
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
