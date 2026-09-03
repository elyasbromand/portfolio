// Static content for the portfolio. Kept separate from the components so
// updating a project, a stat target, or an experience entry never means
// touching JSX/markup.

import type { CodeSegment } from "./codeSnippet";

/** A single case-study stat. Stored as a number + suffix so the case
 * study page can count it up, instead of an already-formatted string. */
export interface StatValue {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/** One box in an architecture diagram. `accent` renders it in the
 * highlighted green style (see the homepage's "API gateway" node). */
export interface ArchitectureNode {
  label: string;
  sublabel?: string;
  accent?: boolean;
}

/** A left-to-right column of the diagram. A single-node stage renders
 * as one large centered box; multiple nodes stack as a compact list. */
export interface ArchitectureStage {
  nodes: ArchitectureNode[];
}

export interface Project {
  tag: string;
  status: string;
  name: string;
  desc: string;
  stack: string[];
  m1v: string;
  m1l: string;
  m2v: string;
  m2l: string;

  // case-study fields
  github: string;
  liveUrl?: string;
  tagline: string;
  problem: string;
  approach: string;
  results: string[];
  stats: StatValue[];
  architecture?: {
    caption: string;
    stages: ArchitectureStage[];
  };
  codeSnippet?: {
    filename: string;
    lines: CodeSegment[][];
  };
  terminalLog?: string[];
  /** A real terminal screenshot instead of styled text — path under /public. */
  terminalScreenshot?: { src: string; alt?: string };
}

export const projects: Project[] = [
  {
    tag: "mcp-file-manager",
    status: "beta",
    name: "MCP File Manager",
    desc: "A terminal-native MCP client and server pair that lets Gemini read, write, and clean up files in any directory — no copy-pasting code into a browser chatbot.",
    stack: ["Python", "FastMCP", "MCP SDK", "Google Gemini API"],
    m1v: "5",
    m1l: "MCP tools exposed",
    m2v: "3",
    m2l: "retries before fallback",

    github: "https://github.com/elyasbromand/mcp-file-manager",
    tagline:
      "A local MCP client/server pair that gives an LLM safe, tool-mediated access to your filesystem, straight from the terminal.",
    problem:
      "Getting an LLM's help on a piece of code usually meant copying it out of my editor and pasting it into a browser tab, losing directory context and repeating the round trip for every file. I wanted Gemini to read, summarize, and clean up code directly from the filesystem I was already working in without leaving the terminal — and to do it over a protocol a client other than mine could reuse, instead of a one-off script wired straight to an API.",
    approach:
      "I built both sides of the exchange: an MCP server (FastMCP) exposing five filesystem tools — list_directory, read_file, write_file, delete_file, update_file — a file:// resource for attaching file contents, and two prompts (summarize_file, clean_up_code); and an MCP client that spawns the server as a subprocess over stdio, forwards its tool schema to Gemini as function declarations, and drives the resulting tool-call loop — executing whichever tool Gemini requests and feeding the result back until it returns a final answer. The part that took real engineering was resilience: Gemini calls sometimes fail outright and sometimes hang, so I split failures into retryable ServerErrors (exponential backoff, three attempts) versus terminal ClientErrors (fail fast), and made both fall back gracefully to the next prompt instead of taking the whole session down.",
    results: [
      "Classified Gemini API failures into retryable (ServerError, exponential backoff, 3 attempts) versus terminal (ClientError, fail fast) so an overloaded or slow model never crashes the chat session — it falls back to the next prompt instead.",
      "Exposes 5 filesystem tools, 1 dynamic file:// resource, and 2 LLM-driven prompts (summarize_file, clean_up_code) through the standard MCP tool-calling protocol, so any MCP-compatible client can drive it, not just this one.",
      "Replaced copy-pasting code into a browser chatbot with a single @filename mention that attaches the file as a resource directly in the terminal.",
    ],
    stats: [
      { value: 5, label: "MCP tools exposed" },
      { value: 3, label: "retries before graceful fallback" },
      { value: 2, label: "LLM-driven prompts" },
      { value: 1, label: "dynamic file resource" },
    ],
    architecture: {
      caption: "// how a request flows through mcp-file-manager",
      stages: [
        { nodes: [{ label: "user", sublabel: "chat loop" }] },
        { nodes: [{ label: "MCP client", sublabel: "Gemini function calling", accent: true }] },
        { nodes: [{ label: "Gemini API", sublabel: "function calling" }] },
        { nodes: [{ label: "MCP server", sublabel: "JSON-RPC over stdio" }] },
        {
          nodes: [
            { label: "tools", sublabel: "list / read / write / delete / update" },
            { label: "resources", sublabel: "file:// via @" },
            { label: "prompts", sublabel: "summarize / cleanup via /" },
          ],
        },
      ],
    },
    terminalLog: [
      "$ python client.py",
      "Connected to server. 5 tools available:",
      "  - list_directory",
      "  - read_file",
      "  - write_file",
      "  - delete_file",
      "  - update_file",
      "You: /summarize_file server.py",
      "  [tool call] read_file({'path': 'server.py'})",
      "  [tool result] import os\\n\\nfrom mcp.server.fastmcp import FastMCP...",
      "Gemini: This file defines an MCP server exposing 5 filesystem tools,",
      "1 file:// resource, and 2 prompts (summarize_file, clean_up_code).",
      "# on a Gemini 503, retries 3x with backoff before falling back gracefully",
    ],
    codeSnippet: {
      filename: "client.py",
      lines: [
        [{ text: "# retry Gemini calls, but never crash the chat loop", color: "#6b7178" }],
        [
          { text: "async def", color: "#79c0ff" },
          { text: " " },
          { text: "_call_gemini", color: "#d2a8ff" },
          { text: "(self, contents):" },
        ],
        [
          { text: "    for", color: "#79c0ff" },
          { text: " attempt in " },
          { text: "range", color: "#d2a8ff" },
          { text: "(1, MAX_ATTEMPTS + 1):" },
        ],
        [{ text: "        try", color: "#79c0ff" }, { text: ":" }],
        [
          { text: "            return", color: "#79c0ff" },
          { text: " self.genai_client.models." },
          { text: "generate_content", color: "#d2a8ff" },
          { text: "(...)" },
        ],
        [
          { text: "        except", color: "#79c0ff" },
          { text: " ServerError as e:" },
        ],
        [
          { text: "            if", color: "#79c0ff" },
          { text: " attempt == MAX_ATTEMPTS:" },
        ],
        [
          { text: "                return", color: "#79c0ff" },
          { text: " " },
          { text: "None", color: "#7ee787" },
          { text: "  # give up, fall back to the prompt", color: "#6b7178" },
        ],
        [
          { text: "            await", color: "#79c0ff" },
          { text: " asyncio.sleep(2 ** attempt)" },
        ],
        [
          { text: "        except", color: "#79c0ff" },
          { text: " ClientError as e:" },
        ],
        [
          { text: "            return", color: "#79c0ff" },
          { text: " " },
          { text: "None", color: "#7ee787" },
          { text: "  # not retryable", color: "#6b7178" },
        ],
      ],
    },
  },
  {
    tag: "web-scraper",
    status: "beta",
    name: "The Polite Scraper",
    desc: "A Node.js scraper for books.toscrape.com that checks robots.txt, caches every fetch, and validates every record against a strict schema before it counts as data.",
    stack: ["Node.js", "Cheerio", "Zod", "Fetch API"],
    m1v: "219x",
    m1l: "faster on warm cache",
    m2v: "0",
    m2l: "invalid records",

    github: "https://github.com/elyasbromand/web-scraper",
    tagline:
      "Everyone talks about the model on top — this is the part underneath, treating a successful fetch and a correct record as two different claims.",
    problem:
      "Most conversations about AI are about the model, not about where its data comes from. I wanted to build a scraper that took the unglamorous part seriously: identify itself honestly, respect the target site's robots.txt and rate limits before a single request goes out, and — the part that actually bit me — never let a technically successful HTTP fetch pass for a correctly extracted record.",
    approach:
      "I built a Node.js scraper (native fetch, cheerio, Zod) that checks robots.txt before issuing any request, then crawls the catalogue through a disk cache in front of every fetch, an 8-second per-request timeout, and exponential backoff with jitter on 429/5xx responses (honoring Retry-After when the server sends one, never retrying 403/404). The harder problem wasn't the retry logic — it was realizing a 200 response tells you nothing about whether your CSS selector actually landed on the right node. Cheerio doesn't throw on a missed selector, it just returns an empty string, so a page with a slightly different DOM shape produces a 'successful' fetch and silently wrong output. I made every record pass a strict Zod schema before it's allowed into books.json — anything that doesn't validate is quarantined to errors.json instead of corrupting the good data — and logged every fetch, cache hit, retry, and skip to a structured run.log, so a bad record is always traceable back to the exact request that produced it.",
    results: [
      "A warm-cache run finished in 439ms versus 96,219ms cold — a 219x speedup — while returning the exact same 60 validated records, so iterating on extraction logic never means re-hitting the target site.",
      "Zero invalid records across 60 real extractions: every field that reaches books.json has passed a strict Zod schema, and a page that renders with the wrong DOM shape gets quarantined to errors.json instead of silently corrupting output.",
      "Every request identifies itself with a real user-agent, respects an 8-second timeout, and retries 429/5xx up to 3 times with exponential backoff plus jitter (honoring Retry-After when present) instead of hammering the site in lockstep.",
    ],
    stats: [
      { value: 8, suffix: "s", label: "per-request timeout" },
      { value: 1, suffix: "s", label: "base backoff delay" },
      { value: 30, suffix: "%", label: "backoff jitter" },
      { value: 500, suffix: "ms", label: "delay between requests" },
    ],
    architecture: {
      caption: "// how a page becomes a validated record",
      stages: [
        { nodes: [{ label: "robots.txt + cache", sublabel: "checked before any request" }] },
        { nodes: [{ label: "scraper", sublabel: "fetch, timeout, backoff + jitter", accent: true }] },
        { nodes: [{ label: "cheerio", sublabel: "DOM extraction" }] },
        { nodes: [{ label: "Zod schema", sublabel: "strict validation" }] },
        {
          nodes: [
            { label: "books.json / .csv", sublabel: "valid, deduped" },
            { label: "errors.json", sublabel: "quarantined" },
          ],
        },
      ],
    },
    terminalLog: [
      "$ node src/index.js",
      "FETCH https://books.toscrape.com/catalogue/page-1.html (status=200, size=50449 bytes)",
      "CACHE HIT https://books.toscrape.com/catalogue/page-2.html (size=50853 bytes)",
      "SKIP https://books.toscrape.com/catalogue/this-book-does-not-exist_99999/index.html: Not found (404)",
      "retry attempt=1 status=500 wait=1187ms https://books.toscrape.com/catalogue/sharp-objects_997/index.html",
      "Extracted 60 book records (1 failed)",
      "Valid: 60, Errors: 0, Failed pages: 1",
      "Run report written to output/run-report.json",
      "CSV written to output/books.csv",
    ],
    codeSnippet: {
      filename: "src/index.js",
      lines: [
        [
          {
            text: "// a 200 doesn't mean the selector found the right node —",
            color: "#6b7178",
          },
        ],
        [
          {
            text: "// every record must pass this schema before it reaches books.json",
            color: "#6b7178",
          },
        ],
        [
          { text: "const", color: "#79c0ff" },
          { text: " BookSchema = z." },
          { text: "object", color: "#d2a8ff" },
          { text: "({" },
        ],
        [
          { text: "  title: z." },
          { text: "string", color: "#d2a8ff" },
          { text: "()." },
          { text: "min", color: "#d2a8ff" },
          { text: "(1)," },
        ],
        [
          { text: "  product_url: z." },
          { text: "url", color: "#d2a8ff" },
          { text: "()," },
        ],
        [
          { text: "  price_gbp: z." },
          { text: "number", color: "#d2a8ff" },
          { text: "()." },
          { text: "positive", color: "#d2a8ff" },
          { text: "()," },
        ],
        [{ text: "});" }],
        [{ text: "" }],
        [
          { text: "function", color: "#79c0ff" },
          { text: " " },
          { text: "normalizeAndValidate", color: "#d2a8ff" },
          { text: "(rawRecord) {" },
        ],
        [
          { text: "  const", color: "#79c0ff" },
          { text: " result = BookSchema." },
          { text: "safeParse", color: "#d2a8ff" },
          { text: "(rawRecord);" },
        ],
        [
          { text: "  " },
          { text: "if", color: "#79c0ff" },
          { text: " (result.success) " },
          { text: "return", color: "#79c0ff" },
          { text: " { ok: " },
          { text: "true", color: "#7ee787" },
          { text: ", record: result.data };" },
        ],
        [
          { text: "  " },
          { text: "return", color: "#79c0ff" },
          { text: " { ok: " },
          { text: "false", color: "#7ee787" },
          { text: ", record: rawRecord, reason: ...issues };" },
        ],
        [{ text: "}" }],
      ],
    },
  },
];

export function getProjectByTag(tag: string): Project | undefined {
  return projects.find((p) => p.tag === tag);
}

export interface Principle {
  t: string;
  d: string;
}

export const principles: Principle[] = [
  { t: "Correctness first", d: "Invariants enforced in the datastore, not just the app layer." },
  { t: "Observable by default", d: "Traces, metrics, and structured logs on every path." },
  { t: "Fail gracefully", d: "Backpressure, timeouts, and circuit breakers, not cascades." },
  { t: "Idempotent writes", d: "Every mutation is safe to retry — replays are no-ops." },
];

export interface StackGroup {
  label: string;
  items: string[];
}

export const stackGroups: StackGroup[] = [
  { label: "Languages", items: ["Go", "Rust", "Python", "SQL", "Bash"] },
  { label: "Datastores", items: ["Postgres", "Redis", "Elasticsearch", "ClickHouse"] },
  { label: "Messaging", items: ["Kafka", "NATS", "gRPC", "Protobuf"] },
  { label: "Infra & ops", items: ["Docker", "Kubernetes", "Terraform", "GitHub Actions"] },
  { label: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "Loki"] },
  { label: "Practices", items: ["TDD", "Load testing", "Chaos drills", "Runbooks"] },
];

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  desc: string;
}

export const experience: ExperienceItem[] = [
  {
    period: "2024 — present",
    role: "Backend Engineer",
    org: "Payments platform",
    desc: "Own the ledger and fanout services end to end — schema design, on-call, and the SLOs that keep them honest.",
  },
  {
    period: "2023 — 2024",
    role: "Backend Developer",
    org: "Logistics startup",
    desc: "Built the order and inventory APIs; cut p99 latency in half by moving hot reads behind Redis and fixing N+1 queries.",
  },
  {
    period: "2022 — 2023",
    role: "Freelance / open source",
    org: "Independent",
    desc: "Shipped internal tools and API integrations for small teams; maintained a handful of Go libraries.",
  },
  {
    period: "2021 — present",
    role: "B.Sc. Information Systems",
    org: "Kabul Polytechnic University",
    desc: "7th semester. Coursework in databases, networks, distributed systems, and software engineering.",
  },
];

export interface Hackathon {
  project: string;
  host: string;
  challenge: string;
  result: string;
  description: string;
}

export const hackathon: Hackathon = {
  project: "Nura",
  host: "DevPost — GitHub Readme Generation Hackathon",
  challenge: "UN SDG 3: Good Health & Well-being",
  result: "Winner",
  description:
    "Nura helps community health workers — often the person closest to a pregnant woman, newborn, or vulnerable patient in underserved communities — recognize maternal and newborn health risks early, act on them, and route referrals to the right people in time.",
};