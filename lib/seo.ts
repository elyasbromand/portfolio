/**
 * Single source of truth for site-wide SEO. Every page/route pulls title,
 * description, canonical, and structured-data values from here instead of
 * repeating literals — change the site URL or bio once, everywhere updates.
 */
import { stackGroups } from "@/data/portfolio";

export const siteConfig = {
  name: "Elyas Bromand",
  role: "Backend AI Engineer & Full-Stack Developer",
  employers: ["FlyRank AI", "Webistan"],
  /** Must also be set in Netlify's env vars (not just .env.local) — update if a custom domain replaces the Netlify subdomain. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://elyasbromand.netlify.app").replace(/\/+$/, ""),
  titleTemplate: "%s — Elyas Bromand",
  defaultTitle: "Elyas Bromand — Backend AI Engineer & Full-Stack Developer",
  defaultDescription:
    "Elyas Bromand is a backend and AI engineer who designs reliable APIs, integrates AI into production systems, and ships full-stack web applications end to end.",
  social: {
    github: "https://github.com/elyasbromand",
    linkedin: "https://www.linkedin.com/in/elyas-bromand",
    email: "elyasbromand3@gmail.com",
  },
} as const;

/** Composes a site-relative path into an absolute URL against `siteConfig.url`. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

/**
 * schema.org Person JSON-LD for the homepage. `knowsAbout` is pulled from
 * `stackGroups` — the same data the Toolbox component renders — so the
 * structured data can never drift from what the tech-stack section shows.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: `mailto:${siteConfig.social.email}`,
    worksFor: siteConfig.employers.map((org) => ({
      "@type": "Organization",
      name: org,
    })),
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    knowsAbout: stackGroups.flatMap((group) => group.items),
  };
}
