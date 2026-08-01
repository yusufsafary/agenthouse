import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch, Layers, Zap } from 'lucide-react'

const TECH = [
  { name: 'React 18', role: 'UI framework' },
  { name: 'TypeScript', role: 'Type safety' },
  { name: 'Vite', role: 'Build tool' },
  { name: 'Framer Motion', role: 'Animation' },
  { name: 'Tailwind CSS', role: 'Styling' },
  { name: 'OpenTelemetry', role: 'Trace standard' },
]

const PRINCIPLES = [
  {
    icon: <Zap size={20} className="text-acid" />,
    title: 'Zero Backend',
    body: 'Everything runs in the browser. No server, no tracking, no cost. Your traces never leave your machine.',
  },
  {
    icon: <Layers size={20} className="text-volt" />,
    title: 'Open Source First',
    body: 'AGENTHOUSE is MIT licensed and built in the open. Fork it, extend it, run your own version.',
  },
  {
    icon: <GitBranch size={20} className="text-hot" />,
    title: 'Framework Agnostic',
    body: 'Built on the OpenTelemetry GenAI semantic conventions so it works with any agent framework today and tomorrow.',
  },
]

export default function About() {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">About</p>
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tightest mb-8"
            style={{ letterSpacing: '-0.04em' }}
          >
            Built for builders
            <br />
            who ship <span className="text-acid">agents.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <div>
              <p className="text-lg text-mist leading-relaxed mb-6">
                AGENTHOUSE started from a simple observation: the ecosystem has plenty of tracers that show you what happened, but nothing that tells you what to fix.
              </p>
              <p className="text-base text-fog leading-relaxed">
                We built AGENTHOUSE as the missing profiler: drop a trace, get a score, receive concrete ranked fixes with estimated dollar and millisecond savings per recommendation. Think Lighthouse, but for your AI agent pipeline.
              </p>
            </div>
            <div>
              <p className="text-base text-fog leading-relaxed mb-6">
                AGENTHOUSE is a web-first audit workspace, reimagined with a full product UI, Web3 authentication, and a live browser-based audit engine.
              </p>
              <p className="text-base text-fog leading-relaxed">
                All audit logic runs entirely in the browser. Your traces never touch a server. Wallet login via MetaMask and Phantom gives you a portable identity without signing up for yet another account.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Principles */}
        <div className="mt-20">
          <p className="section-label mb-8">Principles</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dark"
              >
                <div className="mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                <p className="text-sm text-fog leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-20">
          <p className="section-label mb-8">Tech Stack</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {TECH.map(t => (
              <div key={t.name} className="bg-ash border border-steel p-4 text-center">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-fog mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring methodology */}
        <div className="mt-20 max-w-3xl">
          <p className="section-label mb-4">Scoring Methodology</p>
          <h2 className="text-3xl font-bold tracking-tightest mb-6">How the score is calculated</h2>
          <p className="text-mist leading-relaxed mb-6">
            AGENTHOUSE runs 5 built-in audits across four categories. Each audit produces a 0-1 score and a list of findings. Category scores are weighted averages of their constituent audits; the overall score is a weighted average of category scores.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { cat: 'Cost', w: '30%', color: '#FFE500' },
              { cat: 'Latency', w: '30%', color: '#00FF66' },
              { cat: 'Reliability', w: '20%', color: '#FF2D55' },
              { cat: 'Context', w: '20%', color: '#AB9FF2' },
            ].map(c => (
              <div key={c.cat} className="bg-ash border border-steel p-4 text-center" style={{ borderTopColor: c.color, borderTopWidth: 2 }}>
                <p className="text-lg font-bold" style={{ color: c.color }}>{c.w}</p>
                <p className="text-xs text-fog uppercase tracking-wider mt-1">{c.cat}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-fog leading-relaxed">
            Scores of 90+ are green, 70-89 yellow, 50-69 orange, and below 50 red. A perfect 100 means the agent passed all audits with no findings.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-20 pt-12 border-t border-steel">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link to="/login" className="btn-acid">
              Try AGENTHOUSE
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
