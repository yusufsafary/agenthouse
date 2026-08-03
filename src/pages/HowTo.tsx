import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, FileJson, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

const CODE_EXAMPLES = {
  otel: `// OpenTelemetry GenAI (OTLP JSON format)
{
  "resourceSpans": [{
    "scopeSpans": [{
      "spans": [{
        "spanId": "abc123",
        "name": "openai.chat",
        "startTimeUnixNano": "1700000001000000000",
        "endTimeUnixNano": "1700000003000000000",
        "attributes": [
          { "key": "gen_ai.system",
            "value": { "stringValue": "openai" } },
          { "key": "gen_ai.request.model",
            "value": { "stringValue": "gpt-4o" } },
          { "key": "gen_ai.usage.input_tokens",
            "value": { "intValue": 4200 } },
          { "key": "gen_ai.usage.output_tokens",
            "value": { "intValue": 80 } }
        ]
      }]
    }]
  }]
}`,
  vercel: `// Vercel AI SDK trace (same OTLP shape,
// scope.name = "@vercel/ai")
{
  "resourceSpans": [{
    "scopeSpans": [{
      "scope": { "name": "@vercel/ai" },
      "spans": [...]
    }]
  }]
}`,
  langgraph: `// LangGraph / LangSmith trace
[
  {
    "run_id": "abc-123",
    "name": "ChatOpenAI",
    "start_time": 1700000001.0,
    "end_time": 1700000003.0,
    "inputs": { "messages": [...] },
    "outputs": { "generations": [...] }
  }
]`,
  adk: `// Google ADK trace
{
  "type": "run_result",
  "events": [
    {
      "name": "agent.run",
      "start_time": 1700000001.0,
      "end_time": 1700000007.0,
      "kind": "agent",
      "status": "ok"
    }
  ]
}`,
}

const AUDITS = [
  { id: 'duplicate-tool-calls', title: 'Duplicate Tool Calls', cat: 'Latency', desc: 'Identical tool calls (same tool + args) repeated within a run. Each repeat is wasted work. Savings show the wall-clock time of redundant calls.' },
  { id: 'parallelizable', title: 'Sequential Parallelizable Calls', cat: 'Latency', desc: 'Batches of independent tool/retrieval calls that ran serially. Savings = serial time minus the slowest call (what Promise.all would cost).' },
  { id: 'errors', title: 'Failed Spans', cat: 'Reliability', desc: 'Spans that ended in error. Each failed call wastes work and usually forces a retry. Savings = wasted time and cost of errored spans.' },
  { id: 'context-bloat', title: 'Oversized Context', cat: 'Context', desc: 'LLM calls sending more than 8,000 input tokens. Score reflects the average excess ratio; savings price the excess tokens.' },
  { id: 'model-tier-mismatch', title: 'Model Tier Mismatch', cat: 'Cost', desc: 'Frontier models used on trivial steps (low token counts). Routing to a smaller model would reduce cost by ~80% with no quality loss.' },
]

const STEPS = [
  { num: '01', title: 'Collect your trace', body: 'Run your agent with OpenTelemetry instrumentation. Most frameworks support exporting OTLP JSON natively. Alternatively, use Langfuse, LangSmith, or Google Cloud Trace to export a run as JSON.' },
  { num: '02', title: 'Open the Dashboard', body: 'Sign in at agenthouse and navigate to the Dashboard. You can use an email account, MetaMask (Ethereum), or Phantom (Solana). No personal data is stored.' },
  { num: '03', title: 'Drop your trace file', body: 'Drag and drop your trace.json onto the upload area, or click Browse Files. The format is auto-detected. Try the built-in example trace first to see how reports look.' },
  { num: '04', title: 'Read the report', body: 'Your overall score (0-100) and per-category breakdown appear instantly. Expand any audit card to see the exact spans causing each issue and the estimated savings.' },
  { num: '05', title: 'Apply the ranked fixes', body: 'Each audit includes a code-level hint. Start with the lowest-scoring audits. Re-run the trace after applying fixes to confirm the score improves.' },
]

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Audit an AI Agent Trace with AGENTHOUSE',
  description:
    'Step-by-step guide to auditing your AI agent traces using AGENTHOUSE. Collect your trace, upload it, read the scored report, and apply ranked fixes to cut LLM costs and latency.',
  totalTime: 'PT5M',
  supply: [{ '@type': 'HowToSupply', name: 'AI agent trace JSON file (OpenTelemetry, LangGraph, Vercel AI SDK, or Google ADK format)' }],
  tool: [{ '@type': 'HowToTool', name: 'AGENTHOUSE (free, browser-based)' }],
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
}

const HOWTO_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What trace formats does AGENTHOUSE support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AGENTHOUSE supports OpenTelemetry GenAI (OTLP JSON), Vercel AI SDK traces, LangGraph / LangSmith traces, and Google ADK run_result JSON. The format is auto-detected from the trace structure.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does AGENTHOUSE score an AI agent trace?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AGENTHOUSE runs 7 audit checks across four dimensions: cost (model tier mismatch, uncacheable prompts), latency (duplicate tool calls, parallelizable calls), reliability (failed spans, retry loops), and context (oversized prompts). Each check contributes to a 0-100 score.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I export a trace from LangGraph?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enable LangSmith tracing with LANGCHAIN_TRACING_V2=true, then export the run as JSON from the LangSmith UI or API. Pass the exported JSON directly to AGENTHOUSE.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I export a trace from Vercel AI SDK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use @opentelemetry/exporter-trace-otlp-http with the OTLP JSON exporter. Wrap your AI calls with the SDK built-in tracer and export the resulting JSON file.',
      },
    },
  ],
}

export default function HowTo() {
  return (
    <main>
      <SEO
        title="How to Audit AI Agent Traces — AGENTHOUSE Guide"
        description="Step-by-step guide to auditing your AI agent with AGENTHOUSE. Upload an OpenTelemetry, LangGraph, or Vercel AI SDK trace and get a scored report with ranked fixes in seconds."
        canonical="/how-to"
        structuredData={[HOWTO_SCHEMA, HOWTO_FAQ]}
        breadcrumbs={[{ name: 'How To', url: '/how-to' }]}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">How It Works</p>
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tightest mb-8"
            style={{ letterSpacing: '-0.04em' }}
          >
            From trace to fix
            <br />
            in <span className="text-acid">five steps.</span>
          </h1>
        </motion.div>

        {/* Steps */}
        <div className="mt-12 max-w-3xl space-y-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-6 p-6 border border-steel bg-ash"
            >
              <span className="text-3xl font-bold text-acid/30 font-mono flex-shrink-0">{s.num}</span>
              <div>
                <h2 className="text-base font-bold text-white mb-2">{s.title}</h2>
                <p className="text-sm text-fog leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trace formats */}
        <div className="mt-20">
          <p className="section-label mb-4">Supported Formats</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-8">Four trace formats supported</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(Object.entries(CODE_EXAMPLES) as [string, string][]).map(([key, code]) => (
              <div key={key} className="border border-steel bg-ash overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-steel">
                  <Terminal size={12} className="text-acid" />
                  <span className="text-xs font-bold text-acid uppercase tracking-widest">{key}</span>
                </div>
                <pre className="p-4 text-xs text-fog overflow-x-auto leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Audits */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Audit Checks</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-8">What AGENTHOUSE audits</h2>
          <div className="space-y-3">
            {AUDITS.map((a) => (
              <div key={a.id} className="flex gap-4 p-5 border border-steel bg-ash">
                <CheckCircle size={16} className="text-acid flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-bold text-white">{a.title}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-acid border border-acid/30 px-1.5 py-0.5">{a.cat}</span>
                  </div>
                  <p className="text-sm text-fog leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Scoring</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-6">How the score is calculated</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { range: '90-100', label: 'Excellent', color: 'text-acid' },
              { range: '70-89', label: 'Good', color: 'text-volt' },
              { range: '0-69', label: 'Needs Work', color: 'text-hot' },
            ].map(s => (
              <div key={s.range} className="border border-steel bg-ash p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.range}</p>
                <p className="text-xs text-fog uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-fog leading-relaxed">
            A score of 100 means all audits passed with zero findings. Aim for 90+ before moving to production. Scores below 70 typically indicate significant cost or latency savings are available.
          </p>
        </div>

        {/* Framework Tips */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Framework Tips</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-6">Exporting traces</h2>
          <div className="space-y-4">
            {[
              { fw: 'Vercel AI SDK', tip: "Use @opentelemetry/exporter-trace-otlp-http with the OTLP JSON exporter. Wrap your AI calls with the SDK's built-in tracer." },
              { fw: 'LangGraph', tip: 'Enable LangSmith tracing with LANGCHAIN_TRACING_V2=true, then export the run as JSON from the LangSmith UI or API.' },
              { fw: 'Google ADK', tip: 'ADK emits a run_result JSON natively. Pass it directly to AGENTHOUSE without transformation.' },
              { fw: 'Custom Agent', tip: 'Instrument with @opentelemetry/sdk-node and the GenAI semantic convention attributes. Export with the OTLP JSON exporter.' },
            ].map(item => (
              <div key={item.fw} className="flex gap-4 p-4 border border-steel bg-ash">
                <div className="flex-shrink-0">
                  <FileJson size={16} className="text-acid mt-0.5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{item.fw}</p>
                  <p className="text-sm text-fog">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 pt-12 border-t border-steel">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link to="/login" className="btn-acid">
              Start Auditing
              <ArrowRight size={14} />
            </Link>
            <Link to="/about" className="btn-outline">
              About the Project
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
