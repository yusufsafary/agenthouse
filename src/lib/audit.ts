// Core browser-based audit engine (MIT licensed)
// Re-implemented for browser/TypeScript ESM without Node.js dependencies

export type SpanKind = 'agent' | 'llm' | 'tool' | 'retrieval' | 'chain' | 'unknown'
export type SpanStatus = 'ok' | 'error'

export interface TokenUsage {
  input?: number
  output?: number
  total?: number
  cacheRead?: number
  cacheWrite?: number
}

export interface Span {
  id: string
  parentId?: string
  name: string
  kind: SpanKind
  startTime: number
  endTime: number
  status?: SpanStatus
  model?: string
  provider?: string
  usage?: TokenUsage
  cost?: number
  toolName?: string
  input?: unknown
  output?: unknown
  error?: string
  attributes: Record<string, unknown>
}

export interface AgentRun {
  name?: string
  spans: Span[]
  startTime: number
  endTime: number
  source?: string
}

export type AuditCategory = 'cost' | 'latency' | 'reliability' | 'context'

export interface Savings { usd?: number; ms?: number }
export interface Finding { message: string; spanIds: string[]; savings?: Savings }

export interface AuditResult {
  id: string
  title: string
  category: AuditCategory
  score: number
  weight: number
  savings: Savings
  findings: Finding[]
  hint: string
}

export interface Report {
  score: number
  categories: { category: AuditCategory; score: number; audits: AuditResult[] }[]
  audits: AuditResult[]
  savings: Savings
  run: {
    source?: string
    durationMs: number
    spans: number
    llmCalls: number
    toolCalls: number
    tokens: number
    totalCostUsd: number
  }
}

// Pricing table (USD per 1M tokens, 2026-06)
const MODEL_PRICES: Record<string, { input: number; output: number; tier: string }> = {
  'gpt-4o': { input: 2.5, output: 10, tier: 'mid' },
  'gpt-4o-mini': { input: 0.15, output: 0.6, tier: 'small' },
  'gpt-4-turbo': { input: 10, output: 30, tier: 'frontier' },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5, tier: 'small' },
  'claude-opus-4-8': { input: 5, output: 25, tier: 'frontier' },
  'claude-sonnet-4-6': { input: 3, output: 15, tier: 'mid' },
  'claude-haiku-4-5': { input: 1, output: 5, tier: 'small' },
  'claude-3-5-sonnet': { input: 3, output: 15, tier: 'mid' },
  'claude-3-haiku': { input: 0.25, output: 1.25, tier: 'small' },
  'gemini-1.5-pro': { input: 1.25, output: 5, tier: 'mid' },
  'gemini-1.5-flash': { input: 0.075, output: 0.3, tier: 'small' },
}

function findPrice(model?: string) {
  if (!model) return null
  const lower = model.toLowerCase()
  for (const [key, p] of Object.entries(MODEL_PRICES)) {
    if (lower.includes(key)) return p
  }
  return null
}

function estimateCost(span: Span): number {
  if (span.cost != null) return span.cost
  const price = findPrice(span.model)
  if (!price || !span.usage) return 0
  const inp = (span.usage.input ?? 0) * price.input / 1_000_000
  const out = (span.usage.output ?? 0) * price.output / 1_000_000
  return inp + out
}

function spanDuration(s: Span) { return Math.max(0, s.endTime - s.startTime) }
function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }
function round2(n: number) { return Math.round(n * 100) / 100 }

function toolSpans(run: AgentRun) { return run.spans.filter(s => s.kind === 'tool') }
function llmSpans(run: AgentRun) { return run.spans.filter(s => s.kind === 'llm') }

function callSig(s: Span): string {
  return `${s.toolName ?? s.model ?? s.name}::${JSON.stringify(s.input ?? '').slice(0, 200)}`
}

// Audit: duplicate tool calls
function auditDuplicateTools(run: AgentRun): AuditResult {
  const tools = toolSpans(run)
  const groups = new Map<string, Span[]>()
  for (const t of tools) {
    const key = callSig(t)
    const arr = groups.get(key) ?? []
    arr.push(t)
    groups.set(key, arr)
  }
  const findings: Finding[] = []
  let wastedMs = 0, wastedUsd = 0, dupes = 0
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const redundant = group.slice(1)
    dupes += redundant.length
    const ms = redundant.reduce((s, t) => s + spanDuration(t), 0)
    const usd = redundant.reduce((s, t) => s + estimateCost(t), 0)
    wastedMs += ms; wastedUsd += usd
    findings.push({
      message: `Tool "${group[0]!.toolName ?? group[0]!.name}" called ${group.length}x with identical input - ${redundant.length} redundant.`,
      spanIds: group.map(t => t.id),
      savings: { ms: round2(ms), usd: round2(usd) },
    })
  }
  return {
    id: 'duplicate-tool-calls',
    title: 'Duplicate tool calls',
    category: 'latency',
    score: tools.length ? clamp01(1 - dupes / tools.length) : 1,
    weight: 1,
    savings: { ms: round2(wastedMs), usd: round2(wastedUsd) },
    findings,
    hint: 'Memoize tool results by (tool, args) within a run, or deduplicate calls before dispatch.',
  }
}

// Audit: parallelizable calls
function auditParallelizable(run: AgentRun): AuditResult {
  const byParent = new Map<string, Span[]>()
  for (const s of run.spans) {
    const key = s.parentId ?? '__root__'
    const arr = byParent.get(key) ?? []
    arr.push(s)
    byParent.set(key, arr)
  }
  const findings: Finding[] = []
  let savedMs = 0
  const PARALLEL = new Set(['tool', 'retrieval'])
  for (const siblings of byParent.values()) {
    const sorted = [...siblings].sort((a, b) => a.startTime - b.startTime)
    let cluster: Span[] = []
    const flush = () => {
      if (cluster.length >= 2) {
        const elapsed = Math.max(...cluster.map(s => s.endTime)) - Math.min(...cluster.map(s => s.startTime))
        const parallel = Math.max(...cluster.map(s => spanDuration(s)))
        const saving = elapsed - parallel
        if (saving > 100) {
          savedMs += saving
          findings.push({
            message: `${cluster.length} independent tool calls ran serially (${Math.round(elapsed)}ms); concurrent execution would take ~${Math.round(parallel)}ms.`,
            spanIds: cluster.map(s => s.id),
            savings: { ms: round2(saving) },
          })
        }
      }
      cluster = []
    }
    for (const s of sorted) {
      if (PARALLEL.has(s.kind)) cluster.push(s)
      else flush()
    }
    flush()
  }
  const runMs = run.endTime - run.startTime
  return {
    id: 'parallelizable',
    title: 'Sequential tool calls that could run in parallel',
    category: 'latency',
    score: runMs > 0 ? clamp01(1 - savedMs / runMs) : 1,
    weight: 1.5,
    savings: { ms: round2(savedMs) },
    findings,
    hint: 'Use Promise.all() or your framework\'s parallel dispatch to run independent tool calls concurrently.',
  }
}

// Audit: errors
function auditErrors(run: AgentRun): AuditResult {
  const errored = run.spans.filter(s => s.status === 'error')
  const findings: Finding[] = errored.map(s => ({
    message: `"${s.name}" failed${s.error ? `: ${s.error}` : ''}.`,
    spanIds: [s.id],
    savings: { ms: round2(spanDuration(s)), usd: round2(estimateCost(s)) },
  }))
  const wastedMs = errored.reduce((sum, s) => sum + spanDuration(s), 0)
  const wastedUsd = errored.reduce((sum, s) => sum + estimateCost(s), 0)
  return {
    id: 'errors',
    title: 'Failed spans',
    category: 'reliability',
    score: run.spans.length ? clamp01(1 - errored.length / run.spans.length) : 1,
    weight: 1,
    savings: { ms: round2(wastedMs), usd: round2(wastedUsd) },
    findings,
    hint: 'Investigate failing calls; add targeted retries with backoff only where transient errors occur.',
  }
}

// Audit: context bloat
function auditContextBloat(run: AgentRun): AuditResult {
  const BUDGET = 4000, BLOAT = 8000
  const llms = llmSpans(run).filter(s => s.usage?.input != null)
  if (!llms.length) return { id: 'context-bloat', title: 'Oversized context', category: 'context', score: 1, weight: 1, savings: {}, findings: [], hint: 'Trim stale conversation history and prune tool outputs before they re-enter the prompt.' }
  const findings: Finding[] = []
  let excessRatioSum = 0, savedUsd = 0
  for (const s of llms) {
    const input = s.usage!.input!
    const excess = Math.max(0, input - BUDGET)
    excessRatioSum += input > 0 ? excess / input : 0
    if (input > BLOAT) {
      const price = findPrice(s.model)
      const usd = price ? (excess * price.input) / 1_000_000 : 0
      savedUsd += usd
      findings.push({ message: `"${s.name}" sent ${input.toLocaleString()} input tokens (~${excess.toLocaleString()} over a ${BUDGET.toLocaleString()}-token budget).`, spanIds: [s.id], savings: usd > 0 ? { usd: round2(usd) } : undefined })
    }
  }
  return {
    id: 'context-bloat',
    title: 'Oversized context sent to model',
    category: 'context',
    score: clamp01(1 - excessRatioSum / llms.length),
    weight: 1,
    savings: { usd: round2(savedUsd) },
    findings,
    hint: 'Trim or summarize stale conversation history, retrieve fewer chunks, and prune tool outputs before they re-enter the prompt.',
  }
}

// Audit: model tier mismatch
function auditModelTierMismatch(run: AgentRun): AuditResult {
  const TRIVIAL_OUT = 64, TRIVIAL_IN = 4000
  const llms = llmSpans(run)
  const findings: Finding[] = []
  let savedUsd = 0
  for (const s of llms) {
    const price = findPrice(s.model)
    if (!price || price.tier !== 'frontier') continue
    const inp = s.usage?.input ?? 0, out = s.usage?.output ?? 0
    if (inp <= TRIVIAL_IN && out <= TRIVIAL_OUT) {
      const usd = estimateCost(s)
      savedUsd += usd * 0.8
      findings.push({ message: `"${s.name}" used a frontier model for a trivial call (${inp} in / ${out} out tokens). A smaller model would cost ~80% less.`, spanIds: [s.id], savings: { usd: round2(usd * 0.8) } })
    }
  }
  return {
    id: 'model-tier-mismatch',
    title: 'Frontier model used for trivial steps',
    category: 'cost',
    score: llms.length ? clamp01(1 - findings.length / llms.length) : 1,
    weight: 1,
    savings: { usd: round2(savedUsd) },
    findings,
    hint: 'Route trivial classification, extraction, or routing steps to a cheaper small model.',
  }
}

// Trace format detection + normalization
function detectOtelGenai(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false
  const j = json as Record<string, unknown>
  return Array.isArray(j.resourceSpans) || Array.isArray(j.spans)
}

function detectLangGraph(json: unknown): boolean {
  if (!Array.isArray(json)) return false
  const first = json[0] as Record<string, unknown> | undefined
  return first != null && ('run_id' in first || 'name' in first) && 'events' in first
}

function detectADK(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false
  const j = json as Record<string, unknown>
  return 'type' in j && j.type === 'run_result'
}

function detectVercel(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false
  const j = json as Record<string, unknown>
  const spans = j.resourceSpans
  if (!Array.isArray(spans)) return false
  const first = spans[0] as Record<string, unknown> | undefined
  if (!first) return false
  const scopes = first.scopeSpans as unknown[]
  const scope = (scopes?.[0] as Record<string, unknown> | undefined)?.scope as Record<string, unknown> | undefined
  return scope?.name === '@vercel/ai'
}

function flattenOtelSpans(json: Record<string, unknown>): Span[] {
  const spans: Span[] = []
  const resourceSpans = json.resourceSpans as unknown[] ?? []
  for (const rs of resourceSpans) {
    const scopeSpans = (rs as Record<string, unknown>).scopeSpans as unknown[] ?? []
    for (const ss of scopeSpans) {
      const rawSpans = (ss as Record<string, unknown>).spans as unknown[] ?? []
      for (const raw of rawSpans) {
        const r = raw as Record<string, unknown>
        const attrs: Record<string, unknown> = {}
        const attrList = r.attributes as Array<{ key: string; value: Record<string, unknown> }> ?? []
        for (const a of attrList) {
          const v = a.value
          attrs[a.key] = v.stringValue ?? v.intValue ?? v.doubleValue ?? v.boolValue ?? v.arrayValue ?? null
        }
        const startNs = Number(r.startTimeUnixNano ?? 0)
        const endNs = Number(r.endTimeUnixNano ?? 0)
        const kind = attrs['gen_ai.operation.name'] ? 'llm' : attrs['opentelemetry.instrumentation.genai.tool_call.name'] ? 'tool' : 'unknown'
        spans.push({
          id: String(r.spanId ?? Math.random()),
          parentId: r.parentSpanId ? String(r.parentSpanId) : undefined,
          name: String(r.name ?? 'span'),
          kind: kind as SpanKind,
          startTime: startNs / 1_000_000,
          endTime: endNs / 1_000_000,
          status: (r.status as Record<string, unknown>)?.code === 2 ? 'error' : 'ok',
          model: String(attrs['gen_ai.response.model'] ?? attrs['gen_ai.request.model'] ?? ''),
          provider: String(attrs['gen_ai.system'] ?? ''),
          usage: {
            input: Number(attrs['gen_ai.usage.input_tokens'] ?? 0) || undefined,
            output: Number(attrs['gen_ai.usage.output_tokens'] ?? 0) || undefined,
          },
          toolName: String(attrs['gen_ai.tool.name'] ?? ''),
          attributes: attrs,
        })
      }
    }
  }
  return spans
}

function parseSimpleSpans(json: unknown[]): Span[] {
  return json.map((raw, i) => {
    const r = raw as Record<string, unknown>
    return {
      id: String(r.id ?? r.span_id ?? i),
      parentId: r.parent_id ? String(r.parent_id) : undefined,
      name: String(r.name ?? r.operation_name ?? 'span'),
      kind: String(r.kind ?? r.span_kind ?? 'unknown') as SpanKind,
      startTime: Number(r.start_time ?? r.startTime ?? 0),
      endTime: Number(r.end_time ?? r.endTime ?? 0),
      status: r.status === 'error' || r.error ? 'error' : 'ok',
      model: String(r.model ?? ''),
      provider: String(r.provider ?? ''),
      usage: r.usage as TokenUsage | undefined,
      toolName: String(r.tool_name ?? r.toolName ?? ''),
      input: r.input,
      output: r.output,
      error: r.error ? String(r.error) : undefined,
      attributes: r as Record<string, unknown>,
    }
  })
}

export function parseTrace(json: unknown): AgentRun {
  let spans: Span[] = []
  let source = 'unknown'

  if (detectADK(json)) {
    source = 'Google ADK'
    const j = json as Record<string, unknown>
    const events = j.events as unknown[] ?? []
    spans = parseSimpleSpans(events)
  } else if (detectVercel(json)) {
    source = 'Vercel AI SDK'
    spans = flattenOtelSpans(json as Record<string, unknown>)
  } else if (detectOtelGenai(json)) {
    source = 'OpenTelemetry GenAI'
    const j = json as Record<string, unknown>
    if (Array.isArray(j.resourceSpans)) {
      spans = flattenOtelSpans(j)
    } else if (Array.isArray(j.spans)) {
      spans = parseSimpleSpans(j.spans as unknown[])
    }
  } else if (detectLangGraph(json)) {
    source = 'LangGraph'
    const arr = json as unknown[]
    spans = parseSimpleSpans(arr)
  } else if (Array.isArray(json)) {
    source = 'Generic OTEL'
    spans = parseSimpleSpans(json)
  } else {
    throw new Error('Could not detect trace format. Supported: OpenTelemetry GenAI, Vercel AI SDK, LangGraph, Google ADK.')
  }

  if (!spans.length) throw new Error('No spans found in trace.')

  const startTime = Math.min(...spans.map(s => s.startTime))
  const endTime = Math.max(...spans.map(s => s.endTime))
  return { spans, startTime, endTime, source }
}

export function auditTrace(run: AgentRun): Report {
  const audits = [
    auditDuplicateTools(run),
    auditParallelizable(run),
    auditErrors(run),
    auditContextBloat(run),
    auditModelTierMismatch(run),
  ]

  const WEIGHTS = { cost: 0.3, latency: 0.3, reliability: 0.2, context: 0.2 }
  const catKeys: AuditCategory[] = ['cost', 'latency', 'reliability', 'context']
  const categories = catKeys
    .map(cat => {
      const members = audits.filter(a => a.category === cat)
      if (!members.length) return null
      const total = members.reduce((s, a) => s + a.weight, 0) || 1
      const catScore = Math.round(members.reduce((s, a) => s + a.score * a.weight, 0) / total * 100)
      return { category: cat, score: catScore, audits: members }
    })
    .filter(Boolean) as Report['categories']

  const wsum = categories.reduce((s, c) => s + WEIGHTS[c.category], 0) || 1
  const overall = Math.round(categories.reduce((s, c) => s + c.score * WEIGHTS[c.category], 0) / wsum)

  const llms = run.spans.filter(s => s.kind === 'llm')
  const tools = run.spans.filter(s => s.kind === 'tool')
  const tokens = llms.reduce((s, sp) => s + (sp.usage?.input ?? 0) + (sp.usage?.output ?? 0), 0)
  const totalCost = run.spans.reduce((s, sp) => s + estimateCost(sp), 0)

  const totalSavingsMs = audits.reduce((s, a) => s + (a.savings.ms ?? 0), 0)
  const totalSavingsUsd = audits.reduce((s, a) => s + (a.savings.usd ?? 0), 0)

  return {
    score: overall,
    categories,
    audits,
    savings: { ms: round2(totalSavingsMs), usd: round2(totalSavingsUsd) },
    run: {
      source: run.source,
      durationMs: run.endTime - run.startTime,
      spans: run.spans.length,
      llmCalls: llms.length,
      toolCalls: tools.length,
      tokens,
      totalCostUsd: round2(totalCost),
    },
  }
}
