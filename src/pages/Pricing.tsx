import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import SEO from '../components/SEO'

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
    cta: 'Explore Free',
    href: '/login',
    highlight: true,
    features: [
      'Everything in Free',
      'Team workspaces & shared audits',
      'CI/CD integration',
      'Historical score tracking',
      'Slack & webhook alerts',
      'Priority support',
    ],
  },
]

const PRICING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'AGENTHOUSE Pricing',
  url: 'https://agenthouse.fun/pricing',
  description:
    'AGENTHOUSE is free forever. Unlimited AI agent trace audits with zero backend and no data collection. Pro plan with team features coming soon.',
  mainEntity: {
    '@type': 'Product',
    name: 'AGENTHOUSE Free',
    description: 'Free AI agent audit tool with unlimited trace uploads and full audit reports.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
    },
  },
}

const PRICING_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is AGENTHOUSE really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. AGENTHOUSE Free is free forever. All audit processing happens in your browser — no subscription, no credit card, no backend required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in the free plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free plan includes unlimited local trace uploads, full audit reports per trace, cost, latency and reliability scores, support for OpenTelemetry, LangGraph, Vercel AI SDK, and Google ADK.',
      },
    },
    {
      '@type': 'Question',
      name: 'When will the Pro plan launch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Pro plan with team workspaces, CI/CD integration, and historical score tracking is coming soon. Start with the free plan today.',
      },
    },
  ],
}

export default function Pricing() {
  return (
    <main>
      <SEO
        title="Pricing — AGENTHOUSE Free AI Agent Audit Tool"
        description="AGENTHOUSE is free forever. Unlimited AI agent trace audits, full cost and latency scoring, zero backend, no data collection. Pro plan with team features coming soon."
        canonical="/pricing"
        structuredData={[PRICING_SCHEMA, PRICING_FAQ]}
        breadcrumbs={[{ name: 'Pricing', url: '/pricing' }]}
      />

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
            <motion.article
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
                    <Check size={14} className="text-acid mt-0.5 shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`${plan.highlight ? 'btn-secondary' : 'btn-primary'} text-center py-3 text-sm font-bold uppercase tracking-widest`}
              >
                {plan.cta}
              </Link>
            </motion.article>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Pricing questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is AGENTHOUSE really free?',
                a: 'Yes. AGENTHOUSE Free is free forever. All audit processing happens in your browser — no subscription, no credit card, no backend required.',
              },
              {
                q: 'What is included in the free plan?',
                a: 'Unlimited local trace uploads, full audit reports per trace, cost, latency and reliability scores, plus support for OpenTelemetry, LangGraph, Vercel AI SDK, and Google ADK.',
              },
              {
                q: 'When will the Pro plan launch?',
                a: 'The Pro plan with team workspaces, CI/CD integration, and historical score tracking is coming soon. Start with the free plan today — no migration required.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-steel bg-ash p-5">
                <h3 className="text-sm font-bold text-white mb-2">{q}</h3>
                <p className="text-sm text-fog leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
