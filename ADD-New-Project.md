# Adding a New Project to the Portfolio

## What You Need

Based on the `Project` interface in `data/portfolio.ts:32-62`, here are all the fields required when adding a new project:

| Field | Required? | Description |
|---|---|---|
| `tag` | **Yes** | Unique identifier (used in URLs like `/work/${tag}`) |
| `status` | **Yes** | Typically `"production"` or `"beta"` |
| `name` | **Yes** | Display name of the project |
| `desc` | **Yes** | Short description |
| `stack` | **Yes** | Array of technologies used, e.g., `["Go", "Postgres", "gRPC"]` |
| `m1v`, `m1l` | **Yes** | Metric 1 value + label (e.g., `"0"` + `"reconciliation errors"`) |
| `m2v`, `m2l` | **Yes** | Metric 2 value + label |
| `github` | **Yes** | GitHub repository URL |
| `liveUrl` | Optional | Live demo URL (shows "Live demo" button in header) |
| `tagline` | **Yes** | Short tagline displayed in the project header |
| `problem` | **Yes** | The problem the project solved |
| `approach` | **Yes** | Your approach to solving it |
| `results` | **Yes** | Array of result strings (impact/outcomes) |
| `stats` | **Yes** | Array of `StatValue` objects for the stats cards |
| `architecture?` | Optional | Diagram data for the architecture diagram |
| `codeSnippet?` | Optional | Highlighted code block |
| `terminalLog?` | Optional | Terminal command lines |
| `terminalScreenshot?` | Optional | Image path under `/public/` |

### StatValue interface
Each entry in `stats` has:
- `value: number` - The numeric value
- `label: string` - Description label
- `prefix?: string` - Optional prefix (e.g., `"p95 "`)
- `suffix?: string` - Optional suffix (e.g., `"ms"`, `"%"`)
- `decimals?: number` - Optional decimal places

## How to Do It

### Step 1: Edit `data/portfolio.ts`

Open `data/portfolio.ts` and append a new object to the `projects` array (after line 251, before the `getProjectByTag` function). Follow the existing structure exactly.

**Minimal example:**

```ts
{
  tag: "my-new-project",
  status: "production",
  name: "My Project Name",
  desc: "What it does",
  stack: ["React", "Node", "Postgres"],
  m1v: "0", m1l: "latency ms",
  m2v: "99", m2l: "% uptime",
  github: "https://github.com/...",
  tagline: "A brief tagline",
  problem: "The problem...",
  approach: "The approach...",
  results: ["Result 1", "Result 2"],
  stats: [{ value: 99, suffix: "%", label: "success rate" }],
},
```

### Step 2: What Happens Automatically

After adding the project:

- **Home page grid**: The project appears in the "Selected work" grid on the homepage (`/`)
- **Detail page**: A new page is created at `/work/${tag}` (e.g., `/work/ledger-core`)
- **SEO metadata**: Automatically generates title `${project.name} — Elyas Bromand` and description `project.tagline`
- **Navigation**: Project card is clickable, linking to its detail page

### Step 3: Optional Enhancements

| Feature | What to add | Where |
|---|---|---|
| **Live demo button** | Add `liveUrl: "https://..."` | Project object in `data/portfolio.ts` |
| **Architecture diagram** | Add `architecture: { caption, stages }` | Project object; `stages` is `ArchitectureNode[]` array |
| **Code snippet** | Add `codeSnippet: { filename, lines }` | Project object; `lines` comes from `data/codeSnippet.ts` |
| **Terminal screenshot** | Add `terminalScreenshot: { src, alt }` | Project object; image file in `/public/` |
| **Terminal log** | Add `terminalLog: ["$ cmd1", "$ cmd2", ...]` | Project object (alternative to screenshot) |

### Architecture diagram structure (if adding)

```ts
architecture: {
  caption: "// how a transfer flows through my-project",
  stages: [
    { nodes: [{ label: "client", sublabel: "web app" }] },
    { nodes: [{ label: "my-project", sublabel: "api", accent: true }] },
    { nodes: [{ label: "database", sublabel: "Postgres" }] },
  ],
},
```

### Code snippet (if adding)

First ensure the code exists in `data/codeSnippet.ts`, then reference it:

```ts
codeSnippet: {
  filename: "main.go",
  lines: codeLinesFromCodeSnippetTs, // import from ./codeSnippet
},
```

## Verification

- Run `npm run dev` to see the project appear in the grid
- Visit `/work/${tag}` to verify the detail page renders correctly
- Check that SEO metadata generates properly (title + description)
- Ensure the project card shows: tag, status, name, description, stack tags, and metrics