# Adding a New Project to the Portfolio

Everything about a project — copy, metrics, diagrams, code, terminal output — lives in
**one file**: `data/portfolio.ts`. You never touch JSX to add a project. Add an object
to the `projects` array and two pages update automatically:

- **Homepage grid** (`/`) — a card showing tag, status, name, description, stack, and two headline metrics.
- **Case study page** (`/work/<tag>`) — the full write-up, built from `app/work/[slug]/page.tsx`, which renders whichever optional fields you fill in.

This guide covers **every field** and **every visual component** you can use, so you
know not just what's required, but what's available to make a case study compelling.

---

## 1. The fastest path: minimal project

```ts
{
  tag: "my-new-project",
  status: "production",
  name: "My Project Name",
  desc: "What it does, in one sentence.",
  stack: ["React", "Node", "Postgres"],
  m1v: "0", m1l: "latency ms",
  m2v: "99", m2l: "% uptime",

  github: "https://github.com/you/my-new-project",
  tagline: "A brief, punchy tagline for the header.",
  problem: "The problem you were solving, in a few sentences.",
  approach: "How you solved it, in a few sentences.",
  results: ["Result 1", "Result 2", "Result 3"],
  stats: [{ value: 99, suffix: "%", label: "success rate" }],
},
```

Paste this into the `projects` array in `data/portfolio.ts` (anywhere between the
`[` and the closing `];` — order doesn't matter, but the existing entries are newest-ish
first, so appending at the end is fine), fill in real values, and you have a working
case study at `/work/my-new-project`. Everything below is about the fields and
components you can layer on top of this.

---

## 2. Field reference

### Required on every project

| Field | Type | Used where | Notes |
|---|---|---|---|
| `tag` | `string` | URL slug (`/work/<tag>`), homepage card, header pill | Must be unique. Lowercase, hyphenated (`ledger-core`). |
| `status` | `string` | Homepage card, header pill | Free text, but stick to `"production"` / `"beta"` for visual consistency (uppercased via CSS). |
| `name` | `string` | Homepage card title, case-study `<h1>`, SEO `<title>` | |
| `desc` | `string` | Homepage card description, case-study intro paragraph | One or two sentences. Card has a `minHeight` sized for ~2 lines — much longer wraps awkwardly. |
| `stack` | `string[]` | Homepage card tags, header tag chips | e.g. `["Go", "Postgres", "gRPC"]` |
| `m1v`, `m1l` | `string` | Homepage card's first metric (value + label) | These are **pre-formatted strings** shown only on the grid card, e.g. `m1v: "8ms"`, `m1l: "median write"`. Independent of `stats` (below), which is the case-study page's own metric set. |
| `m2v`, `m2l` | `string` | Homepage card's second metric | Same idea, second column. |
| `github` | `string` | "View on GitHub" button in the case-study header | Full URL. |
| `tagline` | `string` | Case-study header subtitle, SEO `<meta description>` | One sentence, more narrative than `desc`. |
| `problem` | `string` | Case-study "01 — The problem" section | A paragraph. Rendered in a green-left-border blockquote style. |
| `approach` | `string` | Case-study "02 — What I built" intro paragraph | A paragraph, sits above whichever visual components you add (diagram/terminal/code). |
| `results` | `string[]` | Case-study "03 — Results & impact" section | Each string becomes one bullet (◆) via `ResultsList`. Aim for concrete, numbers-first sentences. |
| `stats` | `StatValue[]` | Case-study stat tiles, right under the header | See §3.1 — these are the animated count-up numbers, separate from `m1v`/`m2v`. |

### Optional — pick whichever fit the project

| Field | Type | Adds |
|---|---|---|
| `liveUrl` | `string` | A second "Live demo" button next to "View on GitHub" in the header. |
| `architecture` | `{ caption, stages }` | A left-to-right flow diagram. See §3.2. |
| `codeSnippet` | `{ filename, lines }` | A syntax-highlighted code editor window. See §3.3. |
| `terminalLog` | `string[]` | A styled fake-terminal window with colored command/output lines. See §3.4. |
| `terminalScreenshot` | `{ src, alt? }` | A real screenshot inside the terminal window chrome. **Takes priority over `terminalLog`** if both are set — pick one. See §3.4. |

You can mix and match freely: one project might have only a diagram, another a
terminal log and no diagram, another all three. Look at the four existing projects in
`data/portfolio.ts` for real combinations — none of them use every optional field.

---

## 3. The visual components — what's available and how to use each

This is the part that makes a case study "appealing" rather than a wall of text. The
case-study page renders these **in this fixed order**, and each one is skipped
entirely if you don't provide its data:

```
Header (tag/status/name/tagline/stack/buttons)
Stat tiles
Summary paragraph
01 — The problem   (blockquote)
02 — What I built  (prose) → diagram → terminal/screenshot → code snippet
03 — Results & impact (bullet list)
Contact
```

### 3.1 Stat tiles — `stats`

Animated, count-up-on-scroll number tiles rendered in a responsive grid strip right
below the header. This is usually the single highest-impact addition — it's the first
thing a visitor sees after the tagline.

```ts
stats: [
  { value: 0, label: "reconciliation errors" },
  { value: 8, suffix: "ms", label: "median write latency" },
  { value: 2.4, suffix: "M", label: "entries processed / day" },
  { value: 99.99, decimals: 2, suffix: "%", label: "uptime" },
  { value: 60, prefix: "p95 ", suffix: "ms", label: "query latency" },
],
```

`StatValue` fields:

| Field | Required | Notes |
|---|---|---|
| `value` | yes | **Raw number**, not a string — this is what animates. Don't pre-format it (`"8ms"`); use `value: 8, suffix: "ms"` instead. |
| `label` | yes | Small caption under the number. |
| `prefix` | no | Rendered before the number, e.g. `"p95 "`. |
| `suffix` | no | Rendered after the number, e.g. `"ms"`, `"%"`, `"M"`, `"x"`. |
| `decimals` | no | Decimal places shown, e.g. `decimals: 2` → `99.99`. Defaults to `0`. |

Tip: 2–4 stats look best. The grid auto-fits, so any count works, but a single stat
looks sparse and 6+ starts to crowd on mobile.

### 3.2 Architecture diagram — `architecture`

A left-to-right flow diagram of boxes connected by `→` arrows (auto-reflows to a
vertical stack with `↓` on phones). Great for showing a request's path through your
system without writing a paragraph of prose.

```ts
architecture: {
  caption: "// how a transfer flows through my-project",
  stages: [
    { nodes: [{ label: "client", sublabel: "web app" }] },
    { nodes: [{ label: "my-project", sublabel: "api", accent: true }] },
    {
      nodes: [
        { label: "cache", sublabel: "Redis" },
        { label: "queue", sublabel: "Kafka" },
      ],
    },
    { nodes: [{ label: "database", sublabel: "Postgres" }] },
  ],
},
```

How it renders:
- `caption` — a small monospace line above the diagram, styled like a code comment (start it with `//` to match the existing projects' convention).
- `stages` — each stage is one column, left to right, connected by arrows.
  - A stage with **one node** renders as a large centered box.
  - A stage with **two or more nodes** renders as a compact stacked list (use this for "fans out to N things" moments, like consumers or shards).
- `label` — the node's name (short — these are compact boxes).
- `sublabel` — optional smaller gray text under/after the label (a role or tech, e.g. `"idempotency check"`, `"Postgres"`).
- `accent: true` — highlights **one node** in green to mark "the thing this case study is about" (usually your own service, not the client or the datastore). Use it on exactly one node for the effect to read clearly.

### 3.3 Code snippet — `codeSnippet`

A macOS-style editor window with hand-highlighted syntax (not a real syntax
highlighter — you color the tokens yourself, so it works for any language).

```ts
codeSnippet: {
  filename: "transfer.go",
  lines: myProjectSnippet, // a CodeSegment[][] — see below
},
```

Define the snippet as its own export, following the pattern in `data/codeSnippet.ts`,
then import it at the top of `data/portfolio.ts`:

```ts
// in data/portfolio.ts
import type { CodeSegment } from "./codeSnippet";

const keyword = "#79c0ff"; // blue
const fn = "#d2a8ff";      // purple
const comment = "#6b7178"; // gray
const literal = "#7ee787"; // green

const myProjectSnippet: CodeSegment[][] = [
  [{ text: "// idempotent, atomic double-entry transfer", color: comment }],
  [
    { text: "func", color: keyword },
    { text: " (s *Ledger) " },
    { text: "Transfer", color: fn },
    { text: "(ctx " },
    { text: "context", color: keyword },
    { text: ".Context, r Req) " },
    { text: "error", color: keyword },
    { text: " {" },
  ],
  // ... one array per line; each line is an array of colored/plain segments
];
```

Rules of thumb:
- Each **line** is an array of **segments**. A segment is `{ text, color? }` — omit
  `color` for plain text (it inherits the base gray-white color).
- Reuse the four-color palette above (`keyword` blue, `fn` purple, `comment` gray,
  `literal` green) so new snippets match the existing visual language. You can add
  more constants if a language needs them (e.g. a string-literal color), but keep it
  minimal — 3–4 colors reads as code, 8 reads as confetti.
- Keep it short: 8–15 lines that show *one* interesting mechanism (an idempotency
  check, a retry loop, a locking strategy) reads much better than a whole file.
- If you'd rather keep snippet data colocated with the project instead of a separate
  export, you can inline the array directly as `lines: [...]` in the project object —
  the separate-file pattern in `data/codeSnippet.ts` is just what the homepage's own
  snippet uses, not a hard requirement.

### 3.4 Terminal — `terminalLog` or `terminalScreenshot`

Same macOS-style window chrome as the code block, showing either styled fake text or
a real image. **If both fields are set, the screenshot wins** — `terminalLog` is
ignored, so pick one per project.

**Option A — styled text (`terminalLog`):**

```ts
terminalLog: [
  "$ myctl status --service my-project",
  "SERVICE        STATUS     LATENCY",
  "my-project     healthy    12ms",
  "# everything nominal",
],
```

Line coloring is automatic based on prefix:
- Lines starting with `"$ "` render green (commands).
- Lines starting with `"# "` render gray (comments).
- Everything else renders as plain light-gray output.

Good for CLI output, health checks, replay tooling, migration runs — anything you can
represent as plausible terminal text without needing a real screenshot.

**Option B — real screenshot (`terminalScreenshot`):**

```ts
terminalScreenshot: {
  src: "/screenshots/my-project-cli.png",
  alt: "myctl status output showing all services healthy",
},
```

- Drop the image file under `public/` (e.g. `public/screenshots/my-project-cli.png`)
  and reference it with a leading `/` (`"/screenshots/my-project-cli.png"`), same as
  any Next.js static asset.
- Use this when the real output (a Grafana panel, an actual terminal capture, a
  `htop`/`k9s` screen) is more convincing than retyped text — it renders full-width
  inside the same terminal chrome via `next/image`.
- Always set `alt` — it's the accessible description, not just decoration.

### 3.5 Sections you don't control (fixed, but worth knowing about)

These render automatically and aren't configurable per-project — mentioned here so you
know they exist and can write `problem`/`approach`/`results` with them in mind:

- **`SectionHeading`** — the `"01 — The problem —————"` numbered heading style used for every section. You just supply the section body text; the numbering/rule-line is automatic.
- **`ResultsList`** — turns your `results` array into a bulleted list with green ◆ markers. Write each entry as a complete, numbers-first sentence ("Zero reconciliation discrepancies since the append-only model shipped, down from a handful every week.") rather than a fragment — they read as standalone claims, not sub-bullets.
- **`Contact`** — the closing contact block, identical across every page.

---

## 4. Step-by-step

1. **Open `data/portfolio.ts`.**
2. **(Optional) Write a code snippet.** If you want a `codeSnippet`, write its
   `CodeSegment[][]` first (either inline or as a separate `const`/import) — see §3.3.
3. **(Optional) Add a screenshot.** If you want `terminalScreenshot`, save the image
   under `public/` first so you have the path to reference.
4. **Append a project object** to the `projects` array. Start from the minimal example
   in §1, then layer on `stats` (§3.1), `architecture` (§3.2), `codeSnippet` (§3.3),
   and `terminalLog`/`terminalScreenshot` (§3.4) as the project supports.
5. **Save.** That's it — no other file needs to change.

### What happens automatically

- **Homepage grid** (`/`) — the project appears as a new card, using `tag`, `status`, `name`, `desc`, `stack`, `m1v`/`m1l`, `m2v`/`m2l`.
- **Case-study page** — created at `/work/<tag>` with no extra routing work (`generateStaticParams` picks up every `project.tag` automatically).
- **SEO metadata** — `<title>` becomes `"${name} — Elyas Bromand"`, description becomes `tagline` (via `generateMetadata`).
- **Homepage → case-study link** — the card is a `<Link>` to `/work/<tag>` automatically.

---

## 5. Verification checklist

- [ ] `npm run dev`, open `/` — new card appears in "Selected work" with correct tag/status/name/desc/stack/m1/m2.
- [ ] Visit `/work/<tag>` directly — header, stats, problem, approach, results all render.
- [ ] If you added `architecture` — diagram renders left-to-right on desktop and stacks vertically on a narrow/mobile viewport.
- [ ] If you added `codeSnippet` — colors look intentional, no stray uncolored keywords.
- [ ] If you added `terminalLog`/`terminalScreenshot` — commands are green, comments are gray, or the screenshot loads and isn't stretched.
- [ ] `npm run build` passes (this also runs the TypeScript check — will catch typos in field names or a missing required field).
- [ ] Tab title in the browser reads `"<name> — Elyas Bromand"`.

---

## 6. Full example (every optional field used)

For reference, here's what a "maximal" entry looks like combining every component —
adapt values, don't copy verbatim:

```ts
{
  tag: "my-new-project",
  status: "production",
  name: "My Project Name",
  desc: "One-sentence summary for the homepage card.",
  stack: ["Go", "Redis", "Postgres"],
  m1v: "12ms", m1l: "p99 latency",
  m2v: "99.9%", m2l: "uptime",

  github: "https://github.com/you/my-new-project",
  liveUrl: "https://my-new-project.example.com",
  tagline: "A one-sentence, more narrative pitch for the header.",
  problem: "What was broken or missing, and why it mattered.",
  approach: "What you built and the key design decision behind it.",
  results: [
    "Concrete outcome #1, with a number.",
    "Concrete outcome #2, with a number.",
    "Concrete outcome #3, with a number.",
  ],
  stats: [
    { value: 12, suffix: "ms", label: "p99 latency" },
    { value: 99.9, decimals: 1, suffix: "%", label: "uptime" },
    { value: 3, suffix: "x", label: "throughput gain" },
  ],
  architecture: {
    caption: "// request path through my-project",
    stages: [
      { nodes: [{ label: "client" }] },
      { nodes: [{ label: "my-project", sublabel: "api", accent: true }] },
      { nodes: [{ label: "cache" }, { label: "queue" }] },
      { nodes: [{ label: "Postgres" }] },
    ],
  },
  terminalLog: [
    "$ myctl status",
    "all services healthy",
    "# p99 12ms over last 5m",
  ],
  codeSnippet: {
    filename: "handler.go",
    lines: myProjectSnippet,
  },
},
```
