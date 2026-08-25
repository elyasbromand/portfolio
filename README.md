# Elyas Bromand — Portfolio (Next.js)

A Next.js (App Router + TypeScript) port of the original standalone HTML
portfolio. Visually identical to the source file — same layout, colors,
type, and the animated metrics strip — rebuilt as clean, typed React
components instead of one big HTML file.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Fonts (JetBrains Mono, Space Grotesk, Public
Sans) are fetched from Google Fonts at build time via `next/font/google`,
so an internet connection is needed for `npm install`'s first `next dev` /
`next build` (the fonts are then self-hosted from `.next/`, no runtime
calls to Google).

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Structure

```
app/
  layout.tsx          Root layout — fonts, metadata, global CSS import
  globals.css          Reset, ::selection, scrollbar, keyframes (exact
                        1:1 port of the original <style> block)
  page.tsx              Composes every section for the "/" route

components/
  Nav.tsx               Sticky top nav
  Hero.tsx               Headline, bio, CTAs, portrait placeholder
  Metrics.tsx             Client component — count-up stats + live
                          p99 sparkline (useEffect/useState)
  SelectedWork.tsx         Project card grid (+ SelectedWork.module.css
                            for the hover effect)
  Systems.tsx               Request-lifecycle diagram + principles
  ApiShowcase.tsx            Endpoint list + highlighted Go snippet
  Toolbox.tsx                 Stack group cards
  Experience.tsx               Timeline
  Contact.tsx                   CTA box + footer
  SectionHeading.tsx             Shared "01 — Section title —" heading
                                  used by 5 sections

data/
  portfolio.ts           Typed content: projects, principles, endpoints,
                          stack groups, experience, metric targets
  codeSnippet.ts           Token data for the syntax-highlighted code block

lib/
  fonts.ts                Shared font-stack constants (route through the
                           CSS variables next/font/google sets up)
```

## Notes

- **Portrait**: the hero section ships with the same placeholder box as
  the original file (no photo was included in the source). Swap it for a
  real photo by dropping the file in `public/` and following the comment
  left in `components/Hero.tsx`.
- **Placeholder links**: the GitHub/LinkedIn buttons and email address in
  `components/Contact.tsx` use the same placeholder values as the
  original file — update them with the real profile URLs.
- **Content**: all copy, numbers, and colors were transcribed 1:1 from the
  original file into `data/portfolio.ts` and the components — nothing was
  reworded or restyled.
