import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, FileJson, CheckCircle } from 'lucide-react'

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

export default function HowTo() {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">Documentation</p>
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tightest mb-8"
            style={{ letterSpacing: '-0.04em' }}
          >
            How to use
            <br />
            <span className="text-acid">AGENTHOUSE.</span>
          </h1>
          <p className="text-lg text-mist max-w-2xl leading-relaxed mb-4">
            From trace to actionable report in under 30 seconds. No installation, no account required beyond sign-in.
          </p>
        </motion.div>

        {/* Step by step */}
        <div className="mt-16">
          <p className="section-label mb-8">Step by Step</p>
          <div className="space-y-px bg-steel max-w-4xl">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-ink flex gap-6 p-6"
              >
                <span className="text-4xl font-bold text-acid opacity-25 flex-shrink-0 leading-none mt-1">{step.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-fog leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trace formats */}
        <div className="mt-20">
          <p className="section-label mb-4">Supported Trace Formats</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-8">
            Auto-detected from your JSON.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CODE_EXAMPLES).map(([key, code]) => {
              const labels: Record<string, string> = {
                otel: 'OpenTelemetry GenAI (OTLP)',
                vercel: 'Vercel AI SDK',
                langgraph: 'LangGraph / LangSmith',
                adk: 'Google ADK',
              }
              return (
                <div key={key} className="border border-steel bg-ash">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-steel">
                    <Terminal size={12} className="text-acid" />
                    <span className="text-xs font-bold uppercase tracking-widest text-acid">{labels[key]}</span>
                  </div>
                  <pre className="p-4 text-xs text-mist font-mono overflow-x-auto leading-relaxed">{code}</pre>
                </div>
              )
            })}
          </div>
        </div>

        {/* Audit reference */}
        <div className="mt-20">
          <p className="section-label mb-4">Audit Reference</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-8">
            What each audit checks.
          </h2>

          <div className="space-y-3 max-w-4xl">
            {AUDITS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card-dark flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <span className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-widest bg-acid/10 text-acid">{a.cat}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-acid flex-shrink-0" />
                    <h3 className="text-sm font-bold text-white">{a.title}</h3>
                  </div>
                  <p className="text-sm text-fog leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Score Interpretation</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-6">Reading your score</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { range: '90-100', label: 'Excellent', color: '#00FF66' },
              { range: '70-89', label: 'Good', color: '#FFE500' },
              { range: '50-69', label: 'Needs Work', color: '#FF8C00' },
              { range: '0-49', label: 'Critical', color: '#FF2D55' },
            ].map(s => (
              <div key={s.range} className="bg-ash border border-steel p-4 text-center" style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.range}</p>
                <p className="text-xs text-fog uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-fog leading-relaxed">
            A score of 100 means all audits passed with zero findings. Aim for 90+ before moving to production. Scores below 70 typically indicate significant cost or latency savings are available.
          </p>
        </div>

        {/* Getting trace from frameworks */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Framework Tips</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-6">Exporting traces</h2>
          <div className="space-y-4">
            {[
              { fw: 'Vercel AI SDK', tip: 'Use @opentelemetry/exporter-trace-otlp-http with the OTLP JSON exporter. Wrap your AI calls with the SDK\'s built-in tracer.' },
              { fw: 'LangGraph', tip: 'Enable LangSmith tracing with LANGCHAIN_TRACING_V2=true, then export the run as JSON from the LangSmith UI or API.' },
              { fw: 'Google ADK', tip: 'ADK emits a run_result JSON natively. Pass it directly to AGENTHOUSE without transformation.' },
              { fw: 'Custom Agent', tip: 'Instrument with @opentelemetry/sdk-node and the GenAI semantic convention attributes. Export with the OTLP JSON exporter.' },
            ].map(item => (
              <div key={item.fw} className="flex gap-4 p-4 border border-steel bg-ash">
                <div className="flex-shrink-0">
                  <FileJson size={16} className="text-acid mt-0.5" />
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
            <Link to="/agenthouse/login" className="btn-acid">
              Start Auditing
              <ArrowRight size={14} />
            </Link>
            <Link to="/agenthouse/about" className="btn-outline">
              About the Project
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
