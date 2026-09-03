// Static content for the portfolio. Kept separate from the components so
// updating a project, a stat target, or an experience entry never means
// touching JSX/markup.

import type { CodeSegment } from "./codeSnippet";
import { codeLines as ledgerTransferSnippet } from "./codeSnippet";

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
    tag: "ledger-core",
    status: "production",
    name: "Double-entry ledger",
    desc: "Atomic, idempotent money movement with an append-only journal. Reconciles millions of entries nightly with zero drift.",
    stack: ["Go", "Postgres", "gRPC"],
    m1v: "0",
    m1l: "reconciliation errors",
    m2v: "8ms",
    m2l: "median write",

    github: "https://github.com/elyasbromand/ledger-core",
    tagline:
      "A double-entry ledger service that never double-spends, even when clients retry.",
    problem:
      "The payments platform needed a single source of truth for money movement across a dozen services, but the existing approach — updating balance columns directly — made retries dangerous and reconciliation a nightly, error-prone chore. A network timeout on a transfer could silently duplicate it, and nobody could say with confidence why two ledgers disagreed.",
    approach:
      "I modeled money movement as an append-only journal instead of mutable balances: every transfer is a pair of debit/credit entries written in one transaction, keyed by a client-supplied idempotency key. Replays of the same key are detected before they touch the ledger and return the original result instead of writing again. Balances are derived by summing entries, never stored directly, which makes reconciliation a query instead of a process.",
    results: [
      "Zero reconciliation discrepancies since the append-only model shipped, down from a handful every week.",
      "Median write latency of 8ms even with the extra idempotency check, thanks to a unique index doing the dedup work.",
      "Retried transfers became a non-event instead of an incident — the same request key always returns the same outcome.",
    ],
    stats: [
      { value: 0, label: "reconciliation errors" },
      { value: 8, suffix: "ms", label: "median write latency" },
      { value: 2.4, suffix: "M", label: "entries processed / day" },
    ],
    architecture: {
      caption: "// how a transfer flows through ledger-core",
      stages: [
        { nodes: [{ label: "client", sublabel: "payments API" }] },
        {
          nodes: [
            { label: "Ledger service", sublabel: "idempotency check", accent: true },
          ],
        },
        {
          nodes: [
            { label: "journal", sublabel: "append-only" },
            { label: "balances", sublabel: "derived view" },
          ],
        },
        { nodes: [{ label: "Postgres", sublabel: "single writer" }] },
      ],
    },
    codeSnippet: {
      filename: "transfer.go",
      lines: ledgerTransferSnippet,
    },
  },
  {
    tag: "fanout",
    status: "production",
    name: "Event fanout gateway",
    desc: "Kafka-backed pub/sub that decouples writes from downstream consumers, with at-least-once delivery and dead-letter replay.",
    stack: ["Kafka", "Go", "Protobuf"],
    m1v: "180k",
    m1l: "events/min peak",
    m2v: "3x",
    m2l: "consumer scale-out",

    github: "https://github.com/elyasbromand/fanout",
    tagline:
      "One write, many consumers — without the writing service knowing or caring who's listening.",
    problem:
      "Every time a new team wanted to react to a payment event, they added another synchronous call into the write path — another point of failure, another few milliseconds of latency the core service had to absorb for someone else's feature. Deploys were coupled: the ledger team couldn't ship without checking who else was reading its writes.",
    approach:
      "I put a Kafka topic between writers and readers and moved responsibility for delivery onto the gateway instead of the caller. Producers publish once and move on; the gateway handles partitioning by account, at-least-once delivery, and a dead-letter topic with replay tooling for consumers that fall behind or crash. Consumer groups scale independently of the write path entirely.",
    results: [
      "New consumers can subscribe without a single code change or deploy on the producer side.",
      "Peaked at 180k events/minute during a promotional spike with no backpressure on writers.",
      "Consumer group scaled 3x horizontally during that spike with zero coordination with the ledger team.",
    ],
    stats: [
      { value: 180, suffix: "k", label: "events / min, peak" },
      { value: 3, suffix: "x", label: "consumer scale-out" },
      { value: 99.95, suffix: "%", decimals: 2, label: "delivery success rate" },
    ],
    architecture: {
      caption: "// one event, many independent consumers",
      stages: [
        { nodes: [{ label: "ledger-core", sublabel: "producer" }] },
        { nodes: [{ label: "fanout gateway", sublabel: "partition + route", accent: true }] },
        {
          nodes: [
            { label: "notify-svc", sublabel: "consumer group" },
            { label: "analytics-svc", sublabel: "consumer group" },
            { label: "audit-svc", sublabel: "consumer group" },
          ],
        },
        { nodes: [{ label: "dead-letter topic", sublabel: "replay on demand" }] },
      ],
    },
    terminalLog: [
      "$ fanoutctl lag --topic transfers.completed",
      "CONSUMER GROUP     LAG    STATUS",
      "notify-svc         0      healthy",
      "analytics-svc      12     healthy",
      "audit-svc          0      healthy",
      "$ fanoutctl replay --topic dlq.transfers --since 1h",
      "replaying 3 messages from dead-letter topic...",
      "done — 3 delivered, 0 failed",
    ],
  },
  {
    tag: "sentinel",
    status: "production",
    name: "Auth & rate-limit edge",
    desc: "Token introspection and sliding-window rate limiting at the gateway. Sheds load gracefully before services feel it.",
    stack: ["Rust", "Redis", "JWT"],
    m1v: "1.2ms",
    m1l: "auth overhead",
    m2v: "99.99%",
    m2l: "edge uptime",

    github: "https://github.com/elyasbromand/sentinel",
    tagline:
      "Every request earns its way past the edge before it costs a backend service anything.",
    problem:
      "Auth checks and rate limiting were duplicated across services, each with slightly different rules, which meant a client could get inconsistent answers depending on which service happened to handle a request. Under load, badly-behaved clients could still reach expensive backend paths before anything pushed back.",
    approach:
      "I built a single edge layer in Rust that terminates auth and rate limiting before a request reaches any service. Tokens are introspected once and cached; a sliding-window counter in Redis enforces per-client limits with sub-millisecond overhead. Services trust a signed header from the edge instead of re-checking auth themselves.",
    results: [
      "Auth overhead of 1.2ms at the edge — cheaper than the round trip it replaced in every downstream service.",
      "One rate-limiting policy instead of a dozen slightly-different ones scattered across services.",
      "99.99% edge uptime over the last 12 months, including through two Redis failovers.",
    ],
    stats: [
      { value: 1.2, decimals: 1, suffix: "ms", label: "auth overhead" },
      { value: 99.99, decimals: 2, suffix: "%", label: "edge uptime" },
      { value: 12, label: "services simplified" },
    ],
    architecture: {
      caption: "// request lifecycle at the edge",
      stages: [
        { nodes: [{ label: "client", sublabel: "web / mobile" }] },
        { nodes: [{ label: "sentinel", sublabel: "auth + rate limit", accent: true }] },
        { nodes: [{ label: "Redis", sublabel: "sliding window" }] },
        { nodes: [{ label: "upstream service", sublabel: "trusts signed header" }] },
      ],
    },
  },
  {
    tag: "atlas",
    status: "beta",
    name: "Geo-sharded search API",
    desc: "Region-partitioned search over 40M documents with tunable consistency and per-tenant isolation.",
    stack: ["Elasticsearch", "Go", "Terraform"],
    m1v: "40M",
    m1l: "indexed docs",
    m2v: "p95 60ms",
    m2l: "query latency",

    github: "https://github.com/elyasbromand/atlas",
    tagline:
      "Search that stays fast and isolated as tenants and regions both grow.",
    problem:
      "A single shared search cluster meant one noisy tenant could slow down queries for everyone, and latency crept up as documents grew past what one region's cluster could serve quickly for users on the other side of the world.",
    approach:
      "I partitioned the index by region and tenant, with a router in front that directs each query to the right shard set based on the caller's region and consistency requirements. Terraform manages cluster topology per region so adding a new region is a config change, not a manual rebuild.",
    results: [
      "40M documents indexed across regions with no cross-tenant slowdowns observed since launch.",
      "p95 query latency holding at 60ms even as document count has grown quarter over quarter.",
      "Adding a new region now takes an afternoon instead of a multi-week migration.",
    ],
    stats: [
      { value: 40, suffix: "M", label: "indexed documents" },
      { value: 60, prefix: "p95 ", suffix: "ms", label: "query latency" },
      { value: 4, label: "regions live" },
    ],
    architecture: {
      caption: "// a query's path across regions",
      stages: [
        { nodes: [{ label: "client", sublabel: "region-aware SDK" }] },
        { nodes: [{ label: "atlas router", sublabel: "picks shard set", accent: true }] },
        {
          nodes: [
            { label: "shard — us-east", sublabel: "tenant-isolated" },
            { label: "shard — eu-west", sublabel: "tenant-isolated" },
          ],
        },
        { nodes: [{ label: "merged results", sublabel: "ranked + paginated" }] },
      ],
    },
  },
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