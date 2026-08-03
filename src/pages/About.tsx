import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch, Layers, Zap } from 'lucide-react'
import SEO from '../components/SEO'

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

const ABOUT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AGENTHOUSE',
  url: 'https://agenthouse.fun',
  description:
    'AGENTHOUSE is an open-source AI agent audit platform that helps developers identify cost overruns, latency bottlenecks, and reliability issues in their LLM-powered agents.',
  foundingDate: '2026',
  license: 'https://opensource.org/licenses/MIT',
  sameAs: ['https://github.com/yusufsafary/agenthouse'],
}

export default function About() {
  return (
    <main>
      <SEO
        title="About AGENTHOUSE — The Open-Source AI Agent Profiler"
        description="AGENTHOUSE is an open-source AI agent profiler. Built for developers who ship agents to production — audit traces, cut LLM costs, and eliminate failure modes. Zero backend, MIT licensed."
        canonical="/about"
        structuredData={ABOUT_SCHEMA}
        breadcrumbs={[{ name: 'About', url: '/about' }]}
      />

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
              <motion.article
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
              </motion.article>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-20">
          <p className="section-label mb-8">Tech Stack</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-3xl">
            {TECH.map(t => (
              <div key={t.name} className="border border-steel bg-ash p-4 text-center">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-fog mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 pt-12 border-t border-steel">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link to="/login" className="btn-acid">
              Start Auditing Free
              <ArrowRight size={14} />
            </Link>
            <Link to="/how-to" className="btn-outline">
              How It Works
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
