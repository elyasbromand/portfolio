import { notFound } from "next/navigation";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";
import { projects, getProjectByTag } from "@/data/portfolio";
import { siteConfig } from "@/lib/seo";

export const size = ogImageSize;
export const contentType = ogImageContentType;
/** Static per Next.js's file-convention API (no access to `params` at this scope). */
export const alt = `Case study cover image — ${siteConfig.name}`;

/** Lets this image route (like the page itself) prerender per project. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.tag }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectByTag(slug);
  if (!project) notFound();

  return renderOgImage({
    eyebrow: `${siteConfig.name} · case study`,
    title: project.name,
    subtitle: project.seoDescription ?? project.tagline,
  });
}
