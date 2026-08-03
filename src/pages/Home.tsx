import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, TrendingDown, GitBranch, ChevronRight } from 'lucide-react'
import SEO from '../components/SEO'

const TICKER_ITEMS = [
  'AUDIT AGENT TRACES',
  'REDUCE COSTS BY 80%',
  'DETECT RETRY LOOPS',
  'PARALLELIZE TOOL CALLS',
  'SCORE YOUR AGENTS',
  'LIGHTHOUSE FOR AI',
  'OPTIMIZE LLM SPEND',
  'ZERO BACKEND REQUIRED',
]

const FEATURES = [
  {
    icon: <TrendingDown size={20} className="text-acid" />,
    label: 'Cost',
    title: 'Slash Your LLM Bill',
    body: 'Identify frontier models used on trivial steps, uncacheable prompts, and redundant context. See exact USD savings per fix.',
  },
  {
    icon: <Zap size={20} className="text-volt" />,
    label: 'Latency',
    title: 'Cut Critical Path Time',
    body: 'Flag sequential tool calls that could run in parallel. Find duplicate tool invocations wasting wall-clock time.',
  },
  {
    icon: <Shield size={20} className="text-hot" />,
    label: 'Reliability',
    title: 'Eliminate Failure Modes',
    body: 'Surface error spans, retry loops, and stuck agents. Each finding links to the exact spans causing the issue.',
  },
  {
    icon: <GitBranch size={20} className="text-acid" />,
    label: 'Context',
    title: 'Prune Context Bloat',
    body: 'Detect LLM calls with oversized prompts. Know which calls exceed healthy token budgets and by how much.',
  },
]

const BEFORE_AFTER = {
  before: { score: 72, cost: '$0.245', time: '7.0s', label: 'Naive ReAct Agent' },
  after: { score: 100, cost: '$0.024', time: '2.0s', label: 'After Top-3 Fixes' },
}

const FORMATS = ['OpenTelemetry GenAI', 'Vercel AI SDK', 'LangGraph / LangSmith', 'Google ADK']

const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AGENTHOUSE',
  url: 'https://agenthouse.fun',
  description:
    'The command center for AI agents. Audit, score, and optimize your agent runs in seconds. Cut LLM costs by 80%, reduce latency, and eliminate failure modes.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: {
    '@type': 'Organization',
    name: 'AGENTHOUSE',
    url: 'https://agenthouse.fun',
  },
  featureList: [
    'AI Agent Cost Audit',
    'Latency Optimization',
    'Reliability Analysis',
    'Context Pruning',
    'OpenTelemetry Support',
    'LangGraph Support',
    'Vercel AI SDK Support',
    'Google ADK Support',
    'Zero Backend Required',
    'Open Source MIT License',
  ],
}

const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AGENTHOUSE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AGENTHOUSE is a free, open-source AI agent audit tool. Drop a trace JSON and get a scored report with ranked fixes, estimated dollar and millisecond savings. It runs entirely in the browser — zero backend required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does AGENTHOUSE cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AGENTHOUSE is completely free. All audit processing happens in your browser with no subscription, no backend, and no data collection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which AI agent frameworks does AGENTHOUSE support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AGENTHOUSE supports OpenTelemetry GenAI, Vercel AI SDK, LangGraph / LangSmith, and Google ADK. Any framework emitting OpenTelemetry traces is compatible.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my trace data safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All audit logic runs entirely in your browser. Your trace data never leaves your machine and is never sent to any server.',
      },
    },
  ],
}

function TickerTape() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap bg-acid py-3 overflow-hidden" aria-hidden="true">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-8 text-ink text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-ink rounded-full" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      <SEO
        title="AGENTHOUSE — AI Agent Audit Tool | Cut LLM Costs by 80%"
        description="Free, open-source AI agent audit tool. Score and optimize your agent traces in seconds. Cut LLM costs by 80%, reduce latency, and eliminate failure modes."
        canonical="/"
        keywords="AI agent audit, LLM cost optimization, agent tracing, OpenTelemetry AI, LangGraph audit, Vercel AI SDK, agent score, AI agent latency, LLM cost reduction"
        structuredData={[HOME_STRUCTURED_DATA, HOME_FAQ_SCHEMA]}
      />

      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 max-w-7xl mx-auto pt-16 pb-8" aria-label="Hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <p className="section-label mb-6">v1.0 — Open Source</p>

          <h1
            className="text-6xl sm:text-8xl md:text-[7rem] font-bold text-white leading-none tracking-tightest"
            style={{ letterSpacing: '-0.04em' }}
          >
            LIGHT<span className="text-acid">HOUSE</span>
            <br />
            FOR AI
            <br />
            <span className="text-acid">AGENTS</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-mist max-w-2xl leading-relaxed">
            Drop a trace JSON. Get a scored report with ranked fixes, estimated savings in dollars and milliseconds, and code-level hints. Zero backend required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link to="/login" className="btn-acid gap-2">
              Launch App Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/how-to" className="btn-outline gap-2">
              See How It Works
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-4 mt-12">
            {[
              { value: '7', label: 'Audit Checks' },
              { value: '80%', label: 'Avg Cost Reduction' },
              { value: '4', label: 'Frameworks Supported' },
              { value: '0', label: 'Data Leaves Browser' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-start">
                <span className="text-2xl font-bold text-acid">{stat.value}</span>
                <span className="text-xs text-fog uppercase tracking-wider mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <TickerTape />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24" aria-label="Features">
        <p className="section-label mb-3">What AGENTHOUSE Audits</p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tightest mb-4 max-w-2xl" style={{ letterSpacing: '-0.03em' }}>
          Four dimensions. One score.
        </h2>
        <p className="text-mist text-base max-w-xl mb-14 leading-relaxed">
          Every trace gets scored on cost, latency, reliability, and context. Each finding comes with a ranked fix and estimated savings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-dark"
            >
              <div className="flex items-center gap-2 mb-4">
                {f.icon}
                <span className="text-xs font-bold uppercase tracking-widest text-fog">{f.label}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-fog leading-relaxed">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="border-y border-steel bg-smoke" aria-label="Before and after comparison">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <p className="section-label mb-3">Impact</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tightest mb-14" style={{ letterSpacing: '-0.03em' }}>
            Real results from real agents.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {([
              { ...BEFORE_AFTER.before, tag: 'Before', tagColor: 'text-hot border-hot' },
              { ...BEFORE_AFTER.after, tag: 'After', tagColor: 'text-acid border-acid' },
            ] as Array<typeof BEFORE_AFTER.before & { tag: string; tagColor: string }>).map(item => (
              <div key={item.tag} className="border border-steel bg-ash p-6">
                <span className={`text-xs font-bold uppercase tracking-[0.2em] border px-2 py-0.5 ${item.tagColor}`}>{item.tag}</span>
                <p className="text-xs text-fog mt-4 mb-2 uppercase tracking-wider">{item.label}</p>
                <p className="text-5xl font-bold text-white mb-4">{item.score}<span className="text-2xl text-fog">/100</span></p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-fog uppercase tracking-wider">Cost / Run</p>
                    <p className="text-lg font-bold text-white mt-1">{item.cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fog uppercase tracking-wider">Latency</p>
                    <p className="text-lg font-bold text-white mt-1">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24" aria-label="Supported frameworks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-3">Compatibility</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tightest mb-6">Works with every major agent framework.</h2>
            <p className="text-mist text-base leading-relaxed mb-8">
              Ingest is built on the OpenTelemetry GenAI semantic conventions. Format is auto-detected from the trace structure.
            </p>
            <Link to="/how-to" className="btn-outline">
              View format docs
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FORMATS.map((f) => (
              <div key={f} className="flex items-center gap-3 p-4 border border-steel bg-ash">
                <span className="w-2 h-2 bg-acid flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-white">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 border-t border-steel" aria-label="Frequently asked questions">
        <p className="section-label mb-3">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tightest mb-12">Frequently asked questions</h2>
        <div className="max-w-3xl space-y-6">
          {[
            {
              q: 'What is AGENTHOUSE?',
              a: 'AGENTHOUSE is a free, open-source AI agent audit tool. Drop a trace JSON and receive a scored report with ranked fixes, estimated dollar and millisecond savings. Everything runs in the browser — no backend, no account required.',
            },
            {
              q: 'Which AI agent frameworks does AGENTHOUSE support?',
              a: 'AGENTHOUSE supports OpenTelemetry GenAI, Vercel AI SDK, LangGraph / LangSmith, and Google ADK. Any framework that emits OTLP JSON traces is compatible.',
            },
            {
              q: 'Is my trace data safe?',
              a: 'Yes. All audit logic runs entirely in your browser. Your trace data never leaves your machine and is never sent to any server.',
            },
            {
              q: 'How much does AGENTHOUSE cost?',
              a: 'AGENTHOUSE is completely free. All audit processing happens in your browser with no subscription, no backend, and no data collection required.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-steel bg-ash p-6">
              <h3 className="text-base font-bold text-white mb-3">{q}</h3>
              <p className="text-sm text-fog leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-steel bg-smoke" aria-label="Call to action">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tightest mb-6">
            Your agent is leaking money.
            <br />
            <span className="text-acid">Let's fix it.</span>
          </h2>
          <p className="text-mist max-w-xl mx-auto mb-10 text-lg">
            Free, open source, zero backend. Connect with email, MetaMask, or Phantom.
          </p>
          <Link to="/login" className="btn-acid text-base px-10 py-4">
            Start Auditing Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
