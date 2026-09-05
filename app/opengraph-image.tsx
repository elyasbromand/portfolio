import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";
import { siteConfig } from "@/lib/seo";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = `${siteConfig.name} — ${siteConfig.role}`;

export default async function Image() {
  return renderOgImage({
    eyebrow: siteConfig.name,
    title: siteConfig.role,
    subtitle: siteConfig.employers.join("  ·  "),
  });
}
