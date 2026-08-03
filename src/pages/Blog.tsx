import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import SEO from '../components/SEO'

export const BLOG_POSTS = [
  {
    slug: 'how-to-reduce-llm-costs-by-80-percent',
    title: 'How to Reduce LLM Costs by 80%: A Practical Guide for AI Agent Developers',
    excerpt:
      'Most AI agents overspend on LLM calls by default. This guide explains the five most common cost leaks and how to fix each one — with real numbers from production traces.',
    date: '2026-08-01',
    readTime: '8 min read',
    tags: ['Cost Optimization', 'LLM', 'AI Agents'],
  },
  {
    slug: 'ai-agent-latency-optimization-guide',
    title: 'AI Agent Latency Optimization: From 7 Seconds to 2 Seconds',
    excerpt:
      "Latency is the silent killer of AI agent UX. We walk through the three biggest latency culprits in agent pipelines — and how to eliminate them using OpenTelemetry traces.",
    date: '2026-07-28',
    readTime: '6 min read',
    tags: ['Latency', 'Performance', 'OpenTelemetry'],
  },
  {
    slug: 'opentelemetry-for-ai-agents',
    title: 'OpenTelemetry for AI Agents: The Complete Setup Guide',
    excerpt:
      'OpenTelemetry is the open standard for observability — and it works beautifully for AI agents. Learn how to instrument LangGraph, Vercel AI SDK, and custom agents to export traces you can actually use.',
    date: '2026-07-22',
    readTime: '10 min read',
    tags: ['OpenTelemetry', 'Observability', 'LangGraph'],
  },
]

const BLOG_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'AGENTHOUSE Blog',
  url: 'https://agenthouse.fun/blog',
  description: 'Practical guides on AI agent cost optimization, LLM latency, and observability with OpenTelemetry.',
  publisher: {
    '@type': 'Organization',
    name: 'AGENTHOUSE',
    url: 'https://agenthouse.fun',
  },
  blogPost: BLOG_POSTS.map(p => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    url: `https://agenthouse.fun/blog/${p.slug}`,
    datePublished: p.date,
    author: { '@type': 'Organization', name: 'AGENTHOUSE' },
  })),
}

export default function Blog() {
  return (
    <main>
      <SEO
        title="Blog — AI Agent Optimization Guides | AGENTHOUSE"
        description="Practical guides on reducing LLM costs, cutting AI agent latency, and setting up OpenTelemetry observability. Learn how to ship faster, cheaper AI agents."
        canonical="/blog"
        structuredData={BLOG_LIST_SCHEMA}
        breadcrumbs={[{ name: 'Blog', url: '/blog' }]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">Blog</p>
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-tightest mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Guides for
            <br />
            <span className="text-acid">agent builders.</span>
          </h1>
          <p className="text-lg text-mist max-w-2xl leading-relaxed mb-16">
            Practical deep-dives on LLM cost optimization, AI agent latency, and OpenTelemetry observability.
          </p>
        </motion.div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-steel bg-ash p-8 group"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-bold uppercase tracking-widest text-acid border border-acid/30 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-acid transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-fog leading-relaxed mb-5">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-fog">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} aria-hidden="true" />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} aria-hidden="true" />
                    {post.readTime}
                  </span>
                </div>
                <Link to={`/blog/${post.slug}`} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-acid hover:gap-2.5 transition-all">
                  Read more <ArrowRight size={12} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-steel text-center">
          <p className="text-sm text-fog mb-6">Ready to audit your agent?</p>
          <Link to="/login" className="btn-acid">
            Start Auditing Free <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  )
}
