import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to start auditing your agents.',
    cta: 'Start Free',
    href: '/login',
    highlight: false,
    features: [
      'Unlimited local trace uploads',
      'Full audit report per trace',
      'Cost, latency & reliability scores',
      'OpenTelemetry, LangGraph, Vercel AI SDK',
      'Google ADK support',
      'Browser-only — zero data leaves your machine',
    ],
  },
  {
    name: 'Pro',
    price: 'Coming Soon',
    period: '',
    description: 'Advanced tooling for teams shipping agents to production.',
    cta: 'Join Waitlist',
    href: 'https://github.com/yusufsafary/agenthouse/discussions',
    highlight: true,
    features: [
      'Everything in Free',
      'Team workspaces & shared audits',
      'CI/CD integration (GitHub Actions)',
      'Historical score tracking',
      'Slack & webhook alerts',
      'Priority support',
    ],
  },
]

export default function Pricing() {
  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Pricing</p>
          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tightest mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Simple,{' '}
            <span className="text-acid">honest</span> pricing
          </h1>
          <p className="text-base sm:text-lg text-mist max-w-xl mx-auto">
            AGENTHOUSE is free to use. All audit processing happens in your browser —
            no backend, no data collection, no subscription required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative border p-8 flex flex-col ${
                plan.highlight
                  ? 'border-acid glow-acid'
                  : 'border-steel bg-smoke'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-8">
                  <span className="bg-acid text-black text-xs font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} /> Upcoming
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-acid mb-2">{plan.name}</p>
                <p className="text-4xl font-bold text-white">{plan.price}</p>
                {plan.period && <p className="text-sm text-fog mt-1">{plan.period}</p>}
                <p className="text-sm text-mist mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-mist">
                    <Check size={14} className="text-acid mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.highlight ? (
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-center py-3 text-sm font-bold uppercase tracking-widest"
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  to={plan.href}
                  className="btn-primary text-center py-3 text-sm font-bold uppercase tracking-widest"
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 border border-steel p-6 text-center"
        >
          <p className="text-sm text-fog">
            AGENTHOUSE is open source. You can self-host, fork, or contribute on{' '}
            <a
              href="https://github.com/yusufsafary/agenthouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-acid hover:underline"
            >
              GitHub
            </a>.
          </p>
        </motion.div>
      </section>
    </main>
  )
}
