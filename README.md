# AGENTHOUSE

**Lighthouse for AI Agents** — audit, score, and optimize your agent runs in seconds.

[![GitHub Pages](https://img.shields.io/badge/Live-yusufsafary.github.io%2Fagenthouse-00FF66?style=flat&labelColor=0A0A0A)](https://yusufsafary.github.io/agenthouse/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=flat&labelColor=0A0A0A)](./LICENSE)

> Web-first fork of [agent-house](https://github.com/addyosmani/agent-house) by Addy Osmani — reimagined with a full product UI, Web3 authentication, and a live browser-based audit engine.

## What It Does

AGENTHOUSE ingests an agent run trace and produces a scored report (cost, latency, reliability, context) with concrete, ranked fixes — each with an estimated **$ / ms saved** and a code-level hint.

```
  BEFORE: score 72/100   cost $0.245   7.0s
  AFTER:  score 100/100  cost $0.024   2.0s

  +28 points · saved $0.221 and 5.0s per run
```

## Features

- **5 audit checks** across cost, latency, reliability, and context hygiene
- **4 trace formats**: OpenTelemetry GenAI, Vercel AI SDK, LangGraph, Google ADK
- **Zero backend** — everything runs in the browser, traces never leave your machine
- **Web3 login** — MetaMask (Ethereum) and Phantom (Solana) supported
- **Mobile first** responsive design
- **Open source** — MIT licensed

## Live Demo

Visit [yusufsafary.github.io/agenthouse](https://yusufsafary.github.io/agenthouse/)

Demo credentials: `demo@agenthouse.dev` / `agenthouse2026`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — product overview, features, before/after comparison |
| `/about` | About — mission, tech stack, scoring methodology |
| `/how-to` | How To — step-by-step guide, trace format reference, audit docs |
| `/cookies` | Cookie Policy — what data is stored and why |
| `/login` | Login — email, MetaMask, or Phantom |
| `/dashboard` | Dashboard — trace upload and audit report (protected) |

## Supported Trace Formats

| Framework | Format |
|-----------|--------|
| OpenTelemetry GenAI | OTLP JSON (`resourceSpans`) |
| Vercel AI SDK | OTLP with `scope.name = "@vercel/ai"` |
| LangGraph / LangSmith | Array of run objects |
| Google ADK | `{ type: "run_result", events: [...] }` |

## Audits

| Audit | Category | What It Catches |
|-------|----------|----------------|
| Duplicate Tool Calls | Latency | Identical tool+args called multiple times |
| Parallelizable Calls | Latency | Sequential tool calls that could run concurrently |
| Failed Spans | Reliability | Error spans wasting time and budget |
| Oversized Context | Context | LLM calls with excessive input tokens |
| Model Tier Mismatch | Cost | Frontier models used on trivial steps |

## Development

```bash
pnpm install
pnpm dev          # dev server at localhost:5173
pnpm build        # production build
```

## License

MIT — see [LICENSE](./LICENSE). Based on [agent-house](https://github.com/addyosmani/agent-house) by Addy Osmani (MIT).
