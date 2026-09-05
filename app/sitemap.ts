import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { siteConfig } from "@/lib/seo";

/** Derived from `projects` — a new entry in data/portfolio.ts appears here with no edits. */
export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/work/${project.tag}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectEntries,
  ];
}
