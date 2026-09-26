# ANIMATE_PLAN — bringing the portfolio to life with GSAP

> **Execution note:** Step 0 is to copy this file verbatim to `my-portfolio/ANIMATE_PLAN.md`. Then work through it one phase at a time, ticking the checkboxes as you go.

## Context

The portfolio (`my-portfolio/`, Next.js 16.3.2 App Router, React 19.2.8, TS 7) is static except for a few CSS keyframes (`blink`, `riseIn`, `slideIn`, `sparkDraw`), the Toolbox bracket choreography (IntersectionObserver + CSS transitions), SMIL loops in `FlowDiagram`, and a rAF count-up (`lib/useCountUp.ts`, which `Metrics.tsx` duplicates). The goal is for every component, from Nav to Footer, to feel alive and professional on desktop and on phones. It should stay functional (no gimmicks that slow reading), accessible (`prefers-reduced-motion`), and fast (LCP/CLS must not regress).

**Tooling:** `gsap@^3.15` (all plugins are free since 3.13, including SplitText, ScrambleText, DrawSVG and ScrollSmoother) plus `@gsap/react@^2.1` (`useGSAP`).

**Design language:** this is an engineer's portfolio with a terminal/systems aesthetic, so motion should feel *precise*: masked line reveals, scramble/typing for mono text, lines that "draw", data that counts up, and short, confident eases. No bouncy or elastic eases.

User-selected extras: **scroll progress bar** and **custom cursor** (desktop only). Page transitions and preloader are **out of scope**. A preloader would hurt LCP.

---

## Guiding rules (from GSAP docs; they apply to every phase)

1. **`useGSAP()` instead of `useEffect`** in every animated client component, always with `{ scope: ref }`. Handlers created later (click/hover) are wrapped in `contextSafe`. Strict Mode double-invocation is handled by the automatic revert.
2. **Keep server components server components.** Most sections stay server-rendered and only gain `data-*` attributes. One client `MotionRoot` scans for those attributes. `"use client"` goes only where a component has its own interactive timeline (Nav, Certifications, Toolbox, Metrics, TerminalWindow, etc.), which matches the rule in `CLAUDE.md`.
3. **Use `gsap.matchMedia()` for every responsive or accessibility branch.** Conditions:
   `{ isDesktop: "(min-width: 861px)", isMobile: "(max-width: 860px)", isPhone: "(max-width: 640px)", canHover: "(hover: hover) and (pointer: fine)", reduceMotion: "(prefers-reduced-motion: reduce)" }`
   This reuses the project's existing **860 / 640** breakpoints; don't invent new ones.
4. **Animate only transforms and opacity** (`x/y/xPercent/yPercent/scale/rotate/autoAlpha/clipPath`). Never animate width, height, top or left.
5. **No CSS transitions on properties GSAP animates.** Remove `transition: transform` from `SelectedWork.module.css .card`, the Toolbox `data-drawn` transitions, and similar. Hover colour transitions that GSAP never touches can stay.
6. **Don't let GSAP fight CSS keyframes.** Where an element already has a CSS `transform` loop (e.g. `.endpoint` → `cfFloat`), animate its *parent* (`.stage`) instead.
7. **Prevent FOUC:** elements with `[data-reveal]` start hidden **only when JS is running**. An inline script sets `<html data-js>`, and the CSS is `[data-js] [data-reveal]{visibility:hidden}`. GSAP reveals them with `autoAlpha`. No-JS users and reduced-motion users see everything.
8. **ScrollTrigger hygiene:** create triggers in DOM order. Use `once: true` for reveals and `ScrollTrigger.batch()` for lists. Use function-based `start`/`end` with `invalidateOnRefresh` for anything size-dependent. Call `ScrollTrigger.refresh()` after `document.fonts.ready`. Set `html { scroll-behavior: auto !important }`. Never nest a ScrollTrigger inside a child tween of a timeline.
9. **Mobile is not a shrunken desktop.** **Touch scrolling (decided): `smoothTouch: 0.05` with native touch input, and no `normalizeScroll`.** The user chose it by feel on a real phone, after comparing three modes through a temporary dev-only `?touch=` switch that has since been removed. History:
   1. `smoothTouch: 0.1` made content **vibrate**. Native touch scrolling runs on the compositor thread and the smoother's transform on the main thread, so they drift a frame apart. Keep the value low.
   2. `smoothTouch: 0.05` + `normalizeScroll: true` flung **small swipes far down**. GSAP's normalizeScroll adds its own release momentum, 2.8s by default (read from `ScrollTrigger.js`). A gentler `momentum: 0.8` variant and native-only scrolling were also tried; the user preferred `light`.

   No parallax, no tilt, no magnetic effects, and no cursor on touch. Use durations about 20% shorter and y-offsets about half size. Tap feedback (`scale: .98`) replaces hover.
10. **Reduced motion:** smoothing is off and there are no parallax, scrub, scramble or typing effects. Reveals become a 0.2s opacity fade or appear instantly. Count-ups jump to the final value. Infinite CSS loops are already disabled by existing `@media (prefers-reduced-motion)` blocks; keep them and extend them to new loops.
11. **Pause work that's offscreen:** infinite loops (FlowDiagram SMIL, sparkline, `blink` dots) are paused when out of view (`svg.pauseAnimations()` / `animation-play-state`) with a `ScrollTrigger` `onToggle`.
12. **Pinning:** no pinned sections. Pin-heavy scroll-jacking hurts a content-first portfolio and misbehaves on mobile address-bar resizes.

---

## Motion tokens (single source of truth)

`lib/motion.ts`:
```ts
export const ease = { out: "power3.out", outStrong: "expo.out", inOut: "power2.inOut", line: "power4.out" };
export const dur  = { xs: .2, sm: .35, md: .6, lg: .9, xl: 1.2 };
export const stagger = { tight: .04, base: .08, loose: .12 };
export const offset = { desktop: 32, mobile: 16 };   // y distance for reveals
export const MOBILE_TIME_SCALE = 0.8;
export const mq = { /* the matchMedia conditions object from rule 3 */ };
```
Set `gsap.defaults({ ease: ease.out, duration: dur.md })` once.

Nav height and the anchor landing offset are **CSS variables**, not JS constants (implemented in Phase 1): `--nav-h` is 92px, or 101px at ≤640px, which matches the old nav's exact height; `--anchor-offset` is 64px, the old `scroll-margin-top`. Both are defined in `app/globals.css`, and `lib/scroll.ts` reads `--anchor-offset`, so CSS and JS can't drift apart.

---

## Phase 0 — Setup
- [x] Copy this plan to `my-portfolio/ANIMATE_PLAN.md`.
- [x] Branch `feat/gsap-motion` created from `main`. The uncommitted FlowDiagram redesign and hero badge text were committed there on their own (`6808044`), and this plan was committed as `563ca2e`. `main` is untouched.
- [x] `npm i gsap @gsap/react`: installed `gsap@^3.15.0` and `@gsap/react@^2.1.2`. The ScrollSmoother, SplitText, ScrambleText, DrawSVG, Text and ScrollTo plugins ship in the package. (`npm audit` reports existing `next` and `sharp` advisories that GSAP didn't introduce. They're out of scope here.)
- [x] Read `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`. Findings that apply to Phase 1:
  - The official pattern is a plain `<script dangerouslySetInnerHTML>` inside `<head>` in `app/layout.tsx` plus `suppressHydrationWarning` on `<html>`. It runs during HTML parsing, before first paint.
  - **Use a `data-js` attribute, not a class.** `<html className>` is managed by React (the font CSS variables), so a script-added class competes with React for that attribute.
  - **Dev-only gotcha:** Strict Mode remounts reset `<html>` to only its JSX attributes, which clears `data-js`. `MotionRoot` must set it again in a `useLayoutEffect` (this does nothing in production).
- [x] **Baseline** (Lighthouse 12, mobile preset, `next start`, before any motion work):

  | route | perf | FCP | LCP | TBT | CLS | LCP element |
  |---|---|---|---|---|---|---|
  | `/` | 89 | 1.1 s | 3.7 s | 90 ms | 0 | hero `h1` |
  | `/work/mcp-file-manager` | 86 | 0.9 s | 3.7 s | 210 ms | 0 | ProjectHeader tagline `p` |

  LCP is already 3.7 s before any animation, which points to font-swap/render delay on the hero `h1`, not animation. Motion work must not push it higher. Keep the hero intro ≤ 1.3 s and never hide the `h1` behind `fonts.ready` for longer than necessary. CLS must stay at 0.

## Phase 1 — Motion infrastructure
> **Status: implemented, awaiting the user's review before commit.** Differences from the original plan are marked *Built:* below.

New files:
- [x] **`lib/scroll.ts`** *(added)*: `scrollToTarget(el | y, smooth)` uses ScrollSmoother when it's active and native scrolling otherwise; also `anchorOffset()` and `hashTarget()`. Later phases use it for the logo click, back to top, and so on.
- [x] **`lib/gsap.ts`** (`"use client"`): imports and registers `ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin, DrawSVGPlugin, TextPlugin, ScrollToPlugin, useGSAP` once, sets defaults, and sets `ScrollTrigger.config({ ignoreMobileResize: true })`. Everything imports `gsap` from here, never directly.
- [x] **`lib/motion.ts`**: tokens (above).
- [x] **`components/motion/SmoothScroll.tsx`** (client): renders `#smooth-wrapper > #smooth-content` and creates `ScrollSmoother.create({ smooth: 1, smoothTouch: 0.05, effects: false, normalizeScroll: false })` inside `mm.add("(prefers-reduced-motion: no-preference)")`. See rule 9 for how the touch value was chosen. Also:
  - *Built:* the instance is reached with GSAP's own `ScrollSmoother.get()` (inside `lib/scroll.ts`), so no context was needed;
  - **hash links:** a delegated **capture-phase** click handler for same-origin, same-path `#hash` links calls `preventDefault()`, then `scrollToTarget(el)`, then `history.pushState(null, "", hash)`. It's verified in Next's source that `next/link` still runs its own `onClick` (so the mobile menu closes) but skips navigation when `defaultPrevented` is set. When there's no smoother, it does nothing and native scrolling handles the link;
  - **arriving with a hash** (e.g. `/work/x` → `/#work`, or a reload on `/#experience`): after `document.fonts.ready` it runs `ScrollTrigger.refresh()` and then an instant `scrollToTarget`;
  - *Built:* **back/forward and address-bar hash changes.** Found in testing: the browser's own fragment jump scrolls the `overflow:hidden` `#smooth-wrapper` instead of the page, which silently shifts the whole site inside it (the top becomes unreachable). Fixed with a `scroll` listener on the wrapper that resets it to 0 and routes the jump through the smoother, plus a `hashchange` listener;
  - *Built:* React runs child effects before parent effects, so in-page ScrollTriggers exist before the smoother. `ScrollTrigger.refresh()` runs right after `create()`;
  - on unmount it runs `smoother.kill()`. Because `PageShell` re-mounts per route, SPA navigation is clean.
- [x] **`components/motion/MotionRoot.tsx`** (client, lives inside `#smooth-content`): one `useGSAP` over the whole page that wires up the declarative attributes:

  | attribute | effect (desktop) | mobile | reduced motion |
  |---|---|---|---|
  | `data-reveal="up"` | y 32→0, autoAlpha 0→1, `dur.md`, start `top 85%`, once | y 16, `dur.sm` | fade .2s |
  | `data-reveal="fade"` | autoAlpha only | same | instant |
  | `data-reveal="lines"` | SplitText `lines`, `mask:"lines"`, `autoSplit`, yPercent 100→0, stagger `.08`, `ease.line`, animation returned from `onSplit` | same, stagger `.06` | no split, fade |
  | `data-reveal="scramble"` | ScrambleText (chars `"01<>/_"`, 0.8s) | plain fade | instant |
  | `data-reveal="stagger"` | children `[data-reveal-item]` via `ScrollTrigger.batch` (stagger `.08`, y 24) | y 12 | fade |
  | `data-reveal="rule"` | scaleX 0→1, origin left, `ease.inOut` | same | instant |
  | `data-reveal-delay="0.2"` | extra delay | ×0.8 | ignored |
  | `data-magnetic` | quickTo x/y toward the pointer (strength .25, max 8px), `elastic` return **off** → `power3.out` | none | none |
  | `data-spotlight` | sets CSS vars `--mx/--my` via `quickSetter` for a radial-gradient glow following the cursor | none | none |

  *Built:* under reduced motion **every** reveal is instant (CSS shows it and JS adds no motion), rather than some being 0.2s fades. That's simpler and can't flash. The scramble reveal uses `fromTo` for its visibility step, because a `.set()` at time 0 of a scroll-triggered timeline renders immediately and revealed the element early (caught in testing). **Rule:** don't combine `data-magnetic` with a transform-based reveal on the same element; wrap one in the other.
- [x] **`app/globals.css`:** added `html{scroll-behavior:auto!important}`, the `--nav-h`/`--anchor-offset` variables, and the `[data-js]` reveal gate. *Built:* the gate hides `[data-reveal]` except `="stagger"` containers, whose `[data-reveal-item]` descendants are hidden instead, plus the reduced-motion override. The spotlight is `[data-spotlight]::after` (opt-in, fine pointers only) instead of a `.spotlight::before` class, to avoid clashing with existing `::before` decorations such as the FlowDiagram panel.
- [x] **`app/layout.tsx`:** inline `<script>` in `<head>` with `document.documentElement.setAttribute('data-js','')`, plus `suppressHydrationWarning` on `<html>`. Also set it again from `MotionRoot` in a `useLayoutEffect` (see the Phase 0 findings).
- [x] **`components/PageShell.tsx` restructure** (required: ScrollSmoother transforms the content, which breaks `position: sticky/fixed` inside it):
  ```
  <div fixed grid backdrop/>            ← outside wrapper
  <Nav/> (now position: fixed)          ← outside wrapper, rendered by PageShell
  <ScrollProgress/> <Cursor/>           ← outside wrapper
  <SmoothScroll><MotionRoot>
     <div container>{children}</div>
  </MotionRoot></SmoothScroll>
  ```
  Remove `<Nav />` from `app/page.tsx` and `app/work/[slug]/page.tsx`. `PageShell` now owns it (one place, as the `CLAUDE.md` philosophy suggests). Add a top spacer of nav height in the content.
  *Built:* the fixed layer (`.navLayer`) is full-width but click-through, and the `<nav>` bar sits inside the same 1160px container as before. So it looks identical to the old sticky nav: the same width, and the same gutters where content shows at the sides. The spacer and nav both use `height: var(--nav-h)`, so the hero starts exactly where it used to (verified at 92px desktop and 101px phone). `scroll-margin-top` stays at the old 64px through `--anchor-offset`, so anchors land where they always did. `<ScrollProgress/>` and `<Cursor/>` are added in Phase 2.
- [x] Verify (headless Chrome via puppeteer-core against `next start`; desktop 1440, phone 390 with touch emulation, desktop with reduced motion): the build passes; the smoother is active on desktop and on the phone (`smoothTouch: 0.05`, no normalizeScroll) and off under reduced motion; the nav stays at top 0 while scrolling; nav links, the hero `#work` link and the mobile-menu links land the target at exactly 64px, and the menu closes; `/work/x` → "Back to work" lands `#work` at 64px; a reload on `/#experience` lands at 64px; back/forward and address-bar hash changes land at 64px with the wrapper staying at 0 and scrolling consistent afterwards; no console errors.
  The reveal engine was tested with **temporary** attributes on Contact/SectionHeading (reverted afterwards). Below-the-fold elements stay hidden until reached; `up`, `lines`, `scramble`, `rule` and `stagger` all end fully visible with no stray transforms; a reload at the bottom reveals everything; a resize from 1440 to 800 re-splits lines; magnetic drifts to +8px and returns to 0; spotlight works; reduced motion shows everything with no split and no transforms.

## Phase 2 — Global chrome: Nav, progress bar, cursor

> **Status: implemented (2nd attempt), awaiting the user's review before commit.**
>
> *First attempt was rejected by the user and reset (`git stash`, back to the Phase 1 commit) for three specific problems, all fixed in this attempt:*
> 1. **Nav hide/show "not working properly."** The first attempt used ScrollTrigger's instantaneous `self.direction` (a velocity sign). Near the end of any decelerating scroll (trackpad/inertial), velocity oscillates around zero and its sign flips repeatedly, so the nav flickered. **Fix:** hide/show is now driven by *net scroll distance in one direction since the last flip* (`TOGGLE_THRESHOLD = 24`px), which ignores that noise — direction has to actually reverse and accumulate before anything toggles. Verified with a simulated decelerating-scroll tail (large deltas shrinking to near-zero with sign noise): 0 toggles during the tail, stayed hidden throughout.
> 2. **Scramble-text on link hover.** Removed entirely per user feedback — hovering a link now only previews the active-indicator bar under it (dimmed), no text effect. (The logo's `~/` scramble on page load was also dropped as part of the same cleanup, since it used the same pattern the user didn't like.)
> 3. **Custom cursor jank.** The first attempt used `mix-blend-mode: difference` on the ring. Combined with the Nav's `backdrop-filter: blur(10px)`, a blend mode forces the browser to recompute blending every frame near/over that element — a well-known GPU-compositing cost. **Fix:** dropped the blend mode; the ring is a plain bordered circle with enough contrast against the site's uniformly dark background, no trick needed.
>
> GSAP gotcha found and fixed (independent of the above): with a conditions object, `gsap.matchMedia().add({...}, fn)` only runs `fn` while **at least one** condition matches. A block with just `{ reduceMotion }` never ran for normal visitors. Every conditions object is paired (`mq.motionOK` was added to `lib/motion.ts`, with a comment there).

**Nav (`components/Nav.tsx`, already a client component)**
- [x] **Structure:** `Nav` renders its own fixed `<header>` layer (full width, click-through; its own `.container` in `Nav.module.css`, not shared with `PageShell`), containing the nav bar **and** `<ScrollProgress/>`. Hiding moves the whole header up by the nav's height, so the progress line stays pinned at y=0. `PageShell` renders `<Nav/>` and `<Cursor/>` directly. Magnetic/spotlight live in `lib/pointer.ts` so the Nav (outside `MotionRoot`) can reuse them.
- [x] **Intro:** `yPercent: -100 → 0`, autoAlpha, 0.6s, delay 0.1. Logo segments (`~/`, `elyas`, `.`, `bromand`) stagger in. *(No scramble — see above.)* Hidden via `[data-js] .nav { visibility: hidden }` until the intro runs, so it never flashes; reduced motion shows it immediately. Lives in its own `matchMedia` block (paired with `motionOK`) so crossing a breakpoint doesn't replay it.
- [x] **Hide on scroll down, reveal on scroll up:** net-distance hysteresis (see above), not `self.direction`. Doesn't hide until `HIDE_AFTER = 120`px, and never while the mobile menu is open. `focusin` on the header shows it again for keyboard users tabbing in.
- [x] **Scrolled state:** past 40px, `--nav-bg-a` goes .82 → .92 and `--nav-border-a` .07 → .12 (tweened CSS vars, no CSS transition).
- [x] **Active-section indicator (functional):** one absolutely positioned 2px bar; GSAP sets `x = link.offsetLeft` and `scaleX = link.offsetWidth` (transform-only). Re-placed on every `ScrollTrigger` refresh (resize). Link colors moved from inline styles to `.link` / `.link[data-active]` so the active state can change them; hover now correctly brightens to `#e6e8eb` (an inline color was blocking this in the pre-Phase-2 code).
- [x] **Link hover** (`canHover`): previews the indicator bar under the hovered link at 45% opacity (no text effect); leaving the links returns the bar to the actual active section.
- [x] **"let's connect":** `magnetic()` from `lib/pointer.ts`, plus a hover fill sweep — a real `<span>` (not a pseudo-element; GSAP can't tween those) that sweeps in from the left and out to the right.
- [x] **Mobile menu:** paused timeline, panel `clipPath: inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)` (0.4s), links stagger y 12→0 (`stagger.tight`), hamburger as **3 spans** morphing ☰ → ✕ (±45° rotation, middle span scaleX/autoAlpha 0). Driven from React state via a `useEffect`, not `contextSafe` (the timeline itself is built inside `useGSAP`/`matchMedia`; only `.play()`/`.reverse()` are called from the effect). `ScrollSmoother.get()?.paused(isOpen)` locks scrolling. Escape/link-click closing and `aria-*` kept from Phase 1.
- [x] **Logo click** → `scrollToTarget(0)` (the shared helper from `lib/scroll.ts`; smoother when active, native fallback otherwise).

**ScrollProgress (`components/motion/ScrollProgress.tsx`)**
- [x] A 2px accent line, `scaleX` 0→1 origin-left, `scrollTrigger: { start: 0, end: "max", scrub }`. `scrub: 0.3` normally, `scrub: true` (no added lag) under reduced motion.
- [x] *Refinement (user feedback after Phase 2 rebuild):* the bar originally spanned edge-to-edge of the viewport (`position: absolute; left:0; right:0` on a direct child of the full-width fixed header). Moved it inside `.container` as a normal-flow sibling right after `<nav>`, so it's centered and exactly as wide as the nav bar (matches its `1160px`/padding-aware content width at every breakpoint) and sits flush under its border, rather than full width. Still lands at y=0 when the nav hides, because it's still positioned immediately after `.nav` in the flow and the header still translates up by exactly `nav.offsetHeight`. Verified with `getBoundingClientRect()`: nav and bar left/right edges match exactly at 1440px and 800px viewports, and the bar's top is 0 once hidden. Confirmed visually with a screenshot too.

**Cursor (`components/motion/Cursor.tsx`)**, created only under `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`
- [x] A 6px accent dot (quickTo, 0.1s) plus a 32px ring (quickTo, 0.35s lag), `pointer-events: none`, fixed outside the smoothed content. *(No `mix-blend-mode` — see above.)*
- [x] Delegated `pointerover` states, deduped so a tween is only created on an actual category change (not every mousemove): `a, button, [role='button'], label, summary` → ring scales 1.6× and brightens, dot hides; `[data-cursor="view"]` → ring scales 2.25× and shows the "view" label; `pre, code` → ring squashes into a thin I-beam. Hidden on `pointerleave` of `<html>`. Native cursor is never hidden.

**Verified** (headless Chrome against the dev server, desktop/phone/reduced-motion + two targeted regression tests for the reset issues):
- **Nav-flicker test:** a simulated decelerating scroll tail (deltas shrinking from 18px to 0 with sign noise, mimicking real inertial scroll) produced **0 toggles** — the header stayed hidden throughout instead of flickering.
- **Hover-scramble test:** the "work" link's text sampled 10× during a 400ms hover — stayed `"work"` every time, confirming no scrambling.
- **Cursor-blend test:** ring's computed `mix-blend-mode` is `normal`; hover-over-link scale still reaches 1.6× as designed.
- **Full regression:** intro, hide/show, scrolled-state, indicator tracking (incl. case pages with no sections → indicator stays hidden), hover preview, magnetic + fill sweep on "let's connect", keyboard-focus-reveals-hidden-nav, mobile menu (wipe/stagger/burger morph/scroll-lock/Escape/tap-to-navigate/resize-to-desktop), reduced motion (nav visible immediately, never hides, progress still tracks, cursor `display: none`) — all pass. All Phase 1 anchor/back-button/hash-landing cases still land at 64px. No console errors in any run.

## Phase 3 — Shared primitives
- [ ] **`SectionHeading.tsx`** (stays a server component, adds attributes): the index `01` gets `data-reveal="scramble"`, the `h2` gets `data-reveal="lines"`, and the rule gets `data-reveal="rule"` with delay .15. This one change animates every heading on both routes.
- [ ] **`lib/useCountUp.ts`** is rewritten with GSAP. Signature: `useCountUp(target, { ref, duration = 1.4, decimals })`. It tweens a proxy `{v:0}` with `ease: "power2.out"` and `snap` when `decimals` is 0, triggered by `ScrollTrigger({ trigger: ref, start: "top 85%", once: true })`. It starts only when visible; today it starts on mount, so numbers below the fold finish before anyone sees them. Under reduced motion it sets the final value immediately. Use `tabular-nums` so the width doesn't jitter.
- [ ] **`Metrics.tsx`** drops its duplicated rAF loop and uses the shared hook, so there's one implementation (the `CLAUDE.md` intent).

## Phase 4 — Hero (`components/Hero.tsx`)
Load timeline (not scroll-triggered). It runs after hydration and `document.fonts.ready` and **finishes in ≤ 1.3s**, because the `h1` is the likely LCP element. It's wrapped in a small client `HeroMotion` component so `Hero` itself can stay server-rendered, `next/image priority` included.
- [ ] 0.00 — badge: scale .9 → 1 and autoAlpha. The green dot gets an infinite "ping" ring (a pseudo element with scale 1 → 2.4 and opacity → 0, repeat, 1.8s).
- [ ] 0.10 — `h1`: SplitText `lines` + `mask: "lines"`, yPercent 105 → 0, `stagger .09`, `expo.out` 1.0s. Use `autoSplit` so resizing re-splits correctly.
- [ ] 0.45 — the lead paragraph fades up (y 16).
- [ ] 0.60 — the `// Information Systems…` mono line types in (TextPlugin, ~0.7s) with a blinking caret that disappears afterwards.
- [ ] 0.70 — CTAs stagger up. "View selected work" gets `data-magnetic`, and its `→` nudges x +4 on hover.
- [ ] 0.20 — portrait: the frame goes `clipPath: inset(100% 0 0 0) → inset(0% 0 0 0)` (1.1s, `power4.inOut`), the inner image scales 1.25 → 1 at the same time, the gradient border fades in, and the name tag slides in from x -12 at 0.9.
- [ ] **Scroll-out (desktop, scrub 0.5):** the portrait image gets `yPercent -8` parallax inside its frame and the text column gets y -40 with autoAlpha .3 as the hero leaves (`start: "top top", end: "bottom top"`).
- [ ] **Hover (`canHover`):** a 3D tilt on the portrait (quickTo `rotationX/Y` ±6°, `transformPerspective: 800`) with a moving glare via `data-spotlight`; it resets on leave.
- [ ] **Mobile:** the same sequence at about 0.8× duration, with no parallax and no tilt. The portrait reveal stays; it's cheap and looks great.

## Phase 5 — Metrics (`components/Metrics.tsx`)
- [ ] Cells use `data-reveal="stagger"`: y 24 and autoAlpha, stagger .08. On desktop the 1px grid gap lines "draw in" by fading the grid background from 0 → .07.
- [ ] Numbers use `useCountUp` on enter (see Phase 3). The static "1" hackathon value gets a scramble reveal.
- [ ] Sparkline: on enter, DrawSVG `0% → 100%` (1.2s), then the end dot pops in (scale 0 → 1, `back.out(3)`). **Then** a slow idle loop takes over: a GSAP repeating timeline that redraws every 6s with `repeatDelay`, which replaces the CSS `sparkDraw` keyframes. It's paused offscreen.
- [ ] Hover (`canHover`): `data-spotlight` accent glow follows the cursor inside each card, and the number nudges y -2.
- [ ] Mobile: single column, each card reveals as it enters (batch handles this naturally).

## Phase 6 — Selected Work (`components/SelectedWork.tsx`)
- [ ] Heading: from `SectionHeading` (Phase 3).
- [ ] Cards: `ScrollTrigger.batch` with y 48 → 0, autoAlpha, stagger .12. Inside each card, a small timeline cascades tag/status → title (`lines` mask) → desc → chips (stagger .03) → metrics → CTA.
- [ ] Metric values (`m1v/m2v`, which are strings like "<50ms") scramble in (ScrambleText reveals the real string).
- [ ] **Hover (`canHover`)**, via a small client wrapper `ProjectCardMotion` or delegated handlers in MotionRoot: lift y -4, border colour to accent (tweened), subtle tilt ±3°, spotlight glow, `View case study →` arrow x +6, chips brighten in sequence (stagger .02). Add `data-cursor="view"`. **Remove** the CSS `transform` transition and the `:hover` transform from `SelectedWork.module.css` (rule 5).
- [ ] Mobile/touch: no tilt or spotlight; `pointerdown` scales to .985 and `pointerup` returns to 1.

## Phase 7 — Certifications (`components/Certifications.tsx`, already a client component)
- [ ] Intro on enter: the split panel fades up, rail items stagger from x -20 (vertical rail on desktop) or x +20 (horizontal rail below 860px), and the mono caption `// N certificates…` scrambles in.
- [ ] **Active indicator:** replace the per-item 3px bar colour swap with one shared accent bar that glides to the active item (`gsap.to(bar, { y: item.offsetTop, height })` on desktop, `{ x, width }` in the horizontal mobile rail, `power3.inOut` .45s). The inactive bars stay dim.
- [ ] **Issuer switch:** use `useGSAP(..., { dependencies: [activeIssuer], scope })`. The header text scrambles to the new issuer name and the cert rows stagger in (x -16 → 0, autoAlpha, stagger .05), **replacing the CSS `slideIn` animation**. The logo tile gets a quick scale pulse 1 → 1.08 → 1.
- [ ] Mobile: when an issuer chip is tapped, the rail auto-scrolls it into the centre with ScrollToPlugin (`scrollTo: { x: el, offsetX: … }`).
- [ ] Hover: rail item background (existing CSS, colour only, fine) plus the logo tile lifting; `verify →` arrow nudge.
- [ ] Functional/accessibility fix while here: the rail items are clickable `div`s. Make them `button`s (or `role="tab"` + `tabIndex` + Enter/Space). Motion work touches this element anyway.

## Phase 8 — Experience (`components/Experience.tsx`)
- [ ] Add a **timeline spine**: a 1px accent line down the left edge of the list, `scaleY` 0 → 1 **scrubbed** to the section's scroll (`start: "top 70%", end: "bottom 60%", scrub: 0.6`). Each row gets a dot on the spine that lights up (scale 0 → 1 with an accent glow) when the spine passes it (`onEnter` per row). Desktop and mobile both work; it's a cheap transform.
- [ ] Per row (on enter, once): the period scrambles, role and org fade up, and the bullet `◆` rotates 90 → 0 with scale 0 → 1 (stagger .06). Description lines use a `lines` mask reveal. Justified text still splits fine because SplitText `lines` keeps the layout; if hyphenation causes issues, fall back to a whole-paragraph fade.
- [ ] Hover (`canHover`): a faint row background highlight, the diamonds spin 90°, and the org text brightens.

## Phase 9 — Tech Stack / Toolbox (`components/Toolbox.tsx` + `.module.css`)
Migrate the existing choreography from **IntersectionObserver + CSS transitions** to one GSAP timeline (same look, but reversible, interruptible and properly reduced-motion aware). Delete the `data-drawn` state, the observer, all `[data-drawn="true"]` transition rules and the per-child `transition-delay`s. Keep only the static layout CSS and move initial states into GSAP (rule 4 of the GSAP mistakes list: set transforms through GSAP).
- [ ] **Desktop timeline** (trigger `top 75%`, once): `bigTitle` SplitText chars stagger .02 from yPercent 100 (masked) → caption scramble → stem `scaleY` (.3) → rail `scaleX` from centre (.5) → legs stagger .04 (.26 each) → columns stagger .07 (y 16, autoAlpha) → items inside each column stagger .03. Total about 2s, the same as today.
- [ ] **Desktop hover:** hovering a column brightens its items to accent and makes its leg glow (the matching leg's opacity and colour tween); other columns dim to .5. This teaches the "tree" relationship.
- [ ] **Mobile spine:** the spine's `scaleY` is **scrubbed** to scroll (`start: "top 70%", end: "bottom 80%"`), so it grows as you read. Each branch has its own trigger: tick `scaleX` 0 → 1, branch x -14 → 0, chips stagger .025.
- [ ] Fix while here: the mobile title says "FULL STACK DEVELOPER" but the desktop one says "Backend AI Engineer". Confirm with the user which is intended.

## Phase 10 — Contact & Footer (`components/Contact.tsx`)
- [ ] Card on enter: scale .96 → 1, y 40 → 0, autoAlpha. The radial glow intensifies (opacity .5 → 1) and, on desktop, follows the pointer (`data-spotlight`).
- [ ] `$ ./say-hello.sh` types in with TextPlugin and a blinking caret, and the `h2` gets a `lines` mask reveal. On a successful type, append a one-frame "✓" (tiny terminal flourish).
- [ ] Buttons stagger up. The email button gets `data-magnetic` plus a fill sweep; GitHub/LinkedIn get a border colour tween and a `↗` arrow that slides in on hover.
- [ ] Footer row: fade in. Add a functional **"↑ back to top"** mono link that uses `smoother.scrollTo(0, true)`, with the native fallback.
- [ ] Contact is reused on case-study pages, so it gets the same behaviour for free.

## Phase 11 — Case-study page (`app/work/[slug]/page.tsx` and its components)
- [ ] **Back link `← Back to work`:** the arrow nudges x -4 on hover and fades in on load.
- [ ] **`ProjectHeader`:** a load timeline mirroring the Hero: the tag scrambles, the status fades, `h1` gets a `lines` mask, the tagline fades up, stack chips stagger (.03), CTAs stagger with `data-magnetic` on "View on GitHub".
- [ ] **`ProjectStats`:** cells stagger in and each value counts up via the new `useCountUp` (prefix, suffix and decimals preserved).
- [ ] **Description paragraph and "The problem":** the left accent border draws `scaleY` 0 → 1 (scrub on desktop, once on mobile) and the text gets a `lines` reveal.
- [ ] **`FlowDiagram` / `ArchitectureDiagram`** (a client `FlowDiagramMotion` wrapper):
  - On enter (`top 75%`, once): the panel fades up, the caption types in, then stages reveal **in flow order**: stage i fades and moves (x -20 on desktop, y -16 on phones where the layout is vertical), then its connector "draws". The connector path already uses a `strokeDasharray` with SMIL, so DrawSVG would conflict (rule 6). Reveal the `.connector` wrapper with `clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)` instead; the wrapper is rotated 90° on phones, so the same clip reads top → bottom. Then the next stage follows.
  - Hub node: scale .9 → 1 with a one-time glow burst (the `hubGlow` opacity goes .6 → the CSS loop value).
  - Endpoint nodes: animate the `.stage` parent, never `.endpoint` (it has the `cfFloat` transform loop).
  - **Signal pulse (functional storytelling):** after the build-in, one bright accent pulse travels the whole pipeline once (a sequential `scale` + glow flash on each node, 0.12s apart), showing the request path. Hovering a node on desktop re-runs the pulse from that node.
  - Performance: `svg.pauseAnimations()` and CSS `animation-play-state: paused` on all SMIL/CSS loops while the diagram is offscreen (`ScrollTrigger` `onToggle`).
- [ ] **`TerminalWindow`** (client):
  - The window reveals y 24 and scale .98 → 1. The traffic lights stay grey and **tint to red/yellow/green on window hover** (a small delight).
  - **Text mode (typing simulation):** on enter, lines play sequentially. `$ ` commands type char by char (TextPlugin, ~35 chars/s, capped at 0.9s per line) with a block caret; output lines appear instantly, 60ms apart; `# ` comments fade. The total is capped at about 4s by scaling speed to line count. All lines are **server-rendered in the DOM** (SEO/a11y, no CLS) and hidden with `visibility`, not removed. **Clicking the terminal or pressing Enter fast-forwards** (`tl.progress(1)`). A `↻ replay` button appears in the title bar when it finishes. Reduced motion shows everything instantly.
  - **Screenshot mode:** the image is revealed top-down with `clipPath` like a "render" scan, plus a thin accent scanline that sweeps once.
- [ ] **`CodeBlock`:** the chrome is the same as the terminal. Lines stagger in (x -8, autoAlpha, stagger .025, capped at 1s total). On desktop, hovering a line gives it a faint highlight background (CSS only; no GSAP needed).
- [ ] **`ResultsList`:** items `data-reveal="stagger"`, and the `◆` rotates in like in Experience.

## Phase 12 — Ambient polish (desktop only unless noted)
- [ ] Grid backdrop: a very subtle parallax. `backgroundPositionY` moves at 0.3× scroll via `ScrollTrigger` scrub (a background-position tween on a fixed layer is cheap). Off on mobile and under reduced motion.
- [ ] Pause the `blink` dots and other infinite loops when offscreen (rule 11).
- [ ] `will-change: transform` only on the cursor, the progress bar and the tilt target. Nowhere else; GSAP handles `force3D` during tweens.

## Phase 13 — Docs
- [ ] Update `CLAUDE.md` with a "Motion" section covering `lib/gsap.ts` as the only import point, `lib/motion.ts` tokens, the `data-reveal` vocabulary, the PageShell/Nav/SmoothScroll structure, "no CSS transitions on GSAP-animated props", and the reduced-motion/mobile rules. Also fix its stale `Systems.tsx` / `ApiShowcase` mentions.

---

## Files touched (summary)
- **New:** `lib/gsap.ts`, `lib/motion.ts`, `components/motion/{SmoothScroll,MotionRoot,ScrollProgress,Cursor,HeroMotion}.tsx`, plus small client motion wrappers for FlowDiagram and project cards as needed.
- **Modified:** `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/work/[slug]/page.tsx`, `components/PageShell.tsx`, `components/Nav.tsx` (+ module), `components/SectionHeading.tsx`, `lib/useCountUp.ts`, `components/Metrics.tsx`, `components/SelectedWork.tsx` (+ module), `components/Certifications.tsx` (+ module), `components/Experience.tsx` (+ module), `components/Toolbox.tsx` (+ module; big CSS cleanup), `components/Contact.tsx`, `components/ProjectHeader.tsx`, `components/ProjectStats.tsx`, `components/FlowDiagram.tsx` (+ module), `components/TerminalWindow.tsx`, `components/CodeBlock.tsx`, `components/ResultsList.tsx`, `CLAUDE.md`.
- **Reused:** `lib/fonts.ts` constants, the existing breakpoints, the existing `@keyframes blink`, and the existing reduced-motion blocks in `FlowDiagram.module.css` / `Toolbox.module.css`.

## Verification (after every phase, full pass at the end)
1. `npm run build` passes (there's no test suite, and `npm run lint` is known to be broken).
2. `npm run dev` and check at **1440px, 1024px, 768px, 390px** (DevTools device mode with touch emulation) on `/` and on both `/work/mcp-file-manager` and `/work/web-scraper`:
   - every section reveals once and nothing stays invisible (scroll fast to the bottom, then reload mid-page);
   - nav links land with the heading visible below the fixed nav, both same-page and from a case study → `/#work`; the back button works;
   - the mobile menu opens and closes (tap, Escape, link) and scrolling is locked while it's open;
   - no hover-only effects fire on touch, and there's no cursor on touch;
   - resizing across 860 and 640 re-splits text correctly with no stuck transforms (matchMedia reverts).
3. **Reduced motion:** DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Expect native scrolling, all content visible immediately, final numbers, and a fully printed terminal.
4. **JS disabled:** all content visible (the `html[data-js]` gate).
5. **Performance:** Lighthouse mobile on `/`, with CLS ≈ 0 and LCP not worse than the pre-change baseline (record the baseline in Phase 0). The Performance panel should show no long tasks from scroll handlers and a steady 60fps while scrolling.
6. Real phone check if possible (iOS Safari address-bar show/hide shouldn't cause jumps; `ignoreMobileResize` is on).
