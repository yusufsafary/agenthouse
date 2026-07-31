import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, TrendingDown, GitBranch, ChevronRight } from 'lucide-react'

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

function TickerTape() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap bg-acid py-3 overflow-hidden">
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
      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 max-w-7xl mx-auto pt-16 pb-8">
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
              { value: '4', label: 'Trace Formats' },
              { value: '0', label: 'Backend Needed' },
              { value: '100%', label: 'Open Source' },
            ].map(stat => (
              <div key={stat.label} className="px-4 py-2 border border-steel bg-ash">
                <span className="text-xl font-bold text-acid">{stat.value}</span>
                <span className="ml-2 text-xs text-fog uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Before / After preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
        >
          {[BEFORE_AFTER.before, BEFORE_AFTER.after].map((item, i) => {
            const isAfter = i === 1
            return (
              <div key={i} className={`p-5 border ${isAfter ? 'border-acid/50 bg-acid/5' : 'border-steel bg-ash'}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-fog mb-3">{item.label}</p>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-4xl font-bold tabular-nums ${isAfter ? 'text-acid' : 'text-white'}`}>
                    {item.score}
                  </span>
                  <span className="text-xs text-fog">/100</span>
                </div>
                <div className="flex gap-4 text-xs text-fog">
                  <span>Cost <strong className="text-white ml-1">{item.cost}</strong></span>
                  <span>Time <strong className="text-white ml-1">{item.time}</strong></span>
                </div>
              </div>
            )
          })}
          <div className="sm:col-span-2 text-center py-2">
            <span className="text-xs text-acid font-bold tracking-widest">+28 POINTS &middot; SAVED $0.221 AND 5s PER RUN</span>
          </div>
        </motion.div>
      </section>

      {/* Ticker */}
      <TickerTape />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-12">
          <p className="section-label mb-3">What We Catch</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tightest">Four dimensions. One score.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="card-dark group"
            >
              <div className="flex items-center gap-2 mb-4">
                {f.icon}
                <span className="text-xs font-bold uppercase tracking-widest text-fog">{f.label}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-acid transition-colors">{f.title}</h3>
              <p className="text-sm text-fog leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works strip */}
      <section className="bg-smoke border-y border-steel py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-3">Process</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tightest mb-12">Three steps to clarity.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-steel">
            {[
              { num: '01', title: 'Drop your trace', body: 'Upload any trace JSON from OpenTelemetry, Vercel AI SDK, LangGraph, or Google ADK. Auto-detected.' },
              { num: '02', title: 'Get your score', body: 'AGENTHOUSE runs 7 audits across cost, latency, reliability, and context. Your overall score: 0-100.' },
              { num: '03', title: 'Apply ranked fixes', body: 'Each finding comes with exact spans, estimated $ and ms saved, and a code-level remediation hint.' },
            ].map((step) => (
              <div key={step.num} className="bg-ink p-8">
                <span className="text-5xl font-bold text-acid opacity-30 block mb-6">{step.num}</span>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
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
                <span className="w-2 h-2 bg-acid flex-shrink-0" />
                <span className="text-sm font-medium text-white">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-steel bg-smoke">
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
