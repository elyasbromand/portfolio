# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Non-standard Next.js version — read this first

This repo pins **Next.js 16.3.2**, **React 19.2.8**, and **TypeScript 7.0.2** — all ahead of what training data typically covers. APIs, conventions, and file structure may differ from what you expect. Before writing Next.js code (routing, data fetching, `next/font`, metadata, etc.), check the guide in `node_modules/next/dist/docs/` and heed any deprecation notices rather than relying on memorized Next.js patterns. (This requirement comes from `AGENTS.md` in this repo.)

## Commands

```bash
npm install      # first install needs internet access — see Fonts note below
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
```

There is no test suite in this repo. There is no `.env` — the project has no external config or secrets. `npm run lint` currently fails (`next lint`/`eslint` find no config) — there's no ESLint dependency or config file anywhere in the repo despite the script existing in `package.json`; this is pre-existing, not something a change broke. Verify correctness with `npm run build` (runs the TypeScript check too) instead.

## Architecture

This is a single-portfolio Next.js App Router site with two routes:

- `/` (`app/page.tsx`) — composes every homepage section (`Nav`, `Hero`, `Metrics`, `SelectedWork`, `Systems`, `ApiShowcase`, `Toolbox`, `Experience`, `Contact`) in order.
- `/work/[slug]` (`app/work/[slug]/page.tsx`) — a case-study page rendered per project. `generateStaticParams` pre-renders one page per `project.tag`; `generateMetadata` derives the page `<title>`/description from `project.name`/`project.tagline`. Unknown slugs call `notFound()`.

Both routes wrap their content in `<PageShell>` (`components/PageShell.tsx`) — the shared dark background, decorative grid backdrop, and `maxWidth:1160` content container. This used to be duplicated inline in both route files; it's now the one place that owns the page's outer responsive padding. Any new route should use it too rather than re-inlining the wrapper.

**Content lives in `data/portfolio.ts`, not in components.** Both routes are thin renderers over this file — the `Project` interface there is the schema for a case study (summary fields used on the homepage grid like `tag`/`stack`/`m1v`/`m2v`, plus case-study fields like `problem`/`approach`/`results`/`stats`/optional `architecture`/`codeSnippet`/`terminalLog`/`terminalScreenshot`). `data/portfolio.ts` also holds `principles`, `endpoints` + `methodStyles`, `stackGroups`, `experience`, and `metricTargets` — every piece of copy/numbers used across the homepage sections. `data/codeSnippet.ts` holds the token data (`CodeSegment[][]`) for the syntax-highlighted snippet shown via `CodeBlock`.

To add or edit a project, follow `ADD-New-Project.md` — it documents the `Project` fields and confirms that adding an entry to the `projects` array in `data/portfolio.ts` is the only step needed; the homepage grid, the `/work/[tag]` detail page, and its SEO metadata all derive from that array automatically.

**Presentational components are pure props-in renderers** (`ProjectHeader`, `ProjectStats`, `ArchitectureDiagram`, `TerminalWindow`, `CodeBlock`, `ResultsList`, `SectionHeading`) shared between the homepage and case-study pages — e.g. `SectionHeading` renders the `"01 — Section title —"` heading used across both. `ArchitectureDiagram.tsx` is a thin wrapper around `FlowDiagram.tsx` (the shared implementation of the request/architecture-flow diagram used by both `Systems.tsx` on the homepage and case-study pages) — edit `FlowDiagram.tsx` for diagram behavior, not `ArchitectureDiagram.tsx`. Keep new shared UI in `components/` and new content in `data/portfolio.ts`, not hardcoded inline.

**Styling is inline `style={{...}}` objects almost everywhere** (the whole design was ported 1:1 from a single-file HTML original — colors, spacing, and animations are literal values in the components, e.g. background `#0a0b0d`, accent `#7ee787`). `app/globals.css` only carries global resets, `::selection`, scrollbar styling, and shared `@keyframes` (`blink`, `riseIn`). Follow the existing pattern (inline styles, occasional shared `React.CSSProperties` constants like in `Metrics.tsx`/`FlowDiagram.tsx`) for anything that doesn't vary by viewport.

**Responsive design**: most components now ship a matching `*.module.css` file (e.g. `Hero.module.css`, `Metrics.module.css`, `Nav.module.css`) used *only* for the properties that must change at a breakpoint — `grid-template-columns`, `flex-direction`, `display` toggles, and a couple of paddings — because inline React styles can't hold a `@media` query. Colors, fonts, and other static values stay inline as before; don't move them into the module just because a module file now exists for that component. Two breakpoints are used consistently everywhere (documented as a comment at the top of `app/globals.css`): **`860px`** collapses desktop 2-/4-column grids to 1 (or 2) columns, and **`640px`** is the phone tier — further collapses, row→column stacking, and a second padding/font step. Don't invent new breakpoint values; reuse these two. Where a value scales smoothly instead of needing a hard breakpoint (font sizes, some paddings), it's expressed as an inline `clamp(min, preferred, max)` instead — e.g. `Hero.tsx`'s `h1`, `Metrics.tsx`'s stat numbers, `SectionHeading.tsx`. Grids with a content-driven column count (`ProjectStats.tsx`, `Toolbox.tsx`) use `repeat(auto-fit, minmax(..., 1fr))` rather than a hardcoded breakpoint, so they reflow correctly regardless of how many items the data has.

The two architecture-flow diagrams (`Systems.tsx`, `FlowDiagram.tsx`) deliberately reflow from horizontal scroll to a vertical stack below 640px (rotating the `→` connector into `↓`) rather than keeping the horizontal scroll on mobile — on a narrow phone the old horizontal layout silently clipped later stages off-screen. `CodeBlock.tsx`/`TerminalWindow.tsx` keep their `overflowX:"auto"` `<pre>` blocks unchanged at every width — that's correct, expected behavior for code, not a fixed-width bug.

**Client vs. server components**: almost everything is a server component by default. `"use client"` is used only where interactivity/browser APIs are required — `Metrics.tsx` (count-up animation + live-updating p99 sparkline via `useEffect`/`setInterval`), the shared `lib/useCountUp.ts` hook (used by both `Metrics` and `ProjectStats` so the count-up-on-mount animation has one implementation), and `Nav.tsx` (holds the open/closed state for the mobile hamburger menu, closes on link click or `Escape`). Don't add `"use client"` to a component unless it needs state/effects/browser APIs.

**Fonts**: `app/layout.tsx` loads three fonts with `next/font/local` from `.ttf` files checked into `app/fonts/` (JetBrains Mono, Space Grotesk, Public Sans) and exposes them as CSS variables on `<html>`. `lib/fonts.ts` re-exports them as `fonts.mono` / `fonts.display` / `fonts.sans` — components should reference these constants rather than writing `var(--font-...)` or literal font-family strings directly. (Note: `README.md` says fonts come from `next/font/google` — that's stale; the code uses local self-hosted `.ttf` files.)

**Path alias**: `@/*` maps to the project root (`tsconfig.json`), e.g. `@/lib/fonts`, `@/data/portfolio`, `@/components/Nav`.
