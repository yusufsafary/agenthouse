import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import { BLOG_POSTS } from './Blog'

const POSTS_CONTENT: Record<string, { body: React.ReactNode; description: string }> = {
  'how-to-reduce-llm-costs-by-80-percent': {
    description:
      'Most AI agents overspend on LLM calls by default. This guide explains the five most common cost leaks in AI agent pipelines and how to fix each one with real production numbers.',
    body: (
      <article className="prose-content">
        <p>
          If you have deployed an AI agent to production, there is a high chance it is spending more on LLM calls than it needs to.
          Most agents are built fast — prompts are copy-pasted, models are left at their defaults, and caching is an afterthought.
          The result is a bill that grows faster than your user base.
        </p>
        <p>
          After analyzing hundreds of agent traces, we have identified five cost leaks that appear in nearly every production agent.
          Fixing all five typically reduces LLM spend by 70–85%.
        </p>

        <h2>1. Model Tier Mismatch</h2>
        <p>
          The most expensive mistake is using a frontier model like GPT-4o or Claude Opus for tasks that a smaller model handles just as well.
          Frontier models cost 10–50x more per token than mid-tier alternatives like GPT-4o-mini or Claude Haiku.
        </p>
        <p>
          <strong>How to fix it:</strong> Identify low-stakes steps in your agent pipeline — classification, extraction, routing decisions — and route them to cheaper models. Reserve frontier models for reasoning-heavy steps where quality genuinely matters.
        </p>
        <p>
          <strong>Expected savings:</strong> 40–60% cost reduction on most agents.
        </p>

        <h2>2. Redundant Context Passed on Every Call</h2>
        <p>
          Many agents pass the full conversation history on every LLM call, even when only the last few turns are relevant.
          If your agent has a 20-turn conversation and you are sending all 20 turns as context each time, you are paying for 19 turns of context that add no value.
        </p>
        <p>
          <strong>How to fix it:</strong> Implement context windowing — pass only the last N turns, or use a summarization step to compress older history. Tools like LangChain's ConversationSummaryMemory do this automatically.
        </p>
        <p>
          <strong>Expected savings:</strong> 20–40% reduction in input token costs.
        </p>

        <h2>3. Uncacheable Prompts</h2>
        <p>
          Prompt caching is one of the most underused cost optimizations. Anthropic and OpenAI both offer cache hits at 90% discounts — but only if your prompts are structured to be cacheable.
          Dynamic elements (timestamps, user IDs) at the start of a prompt break caching entirely.
        </p>
        <p>
          <strong>How to fix it:</strong> Move static elements — system prompts, tool definitions, static context — to the front of your prompt. Put dynamic elements at the end. This maximizes the cacheable prefix length.
        </p>
        <p>
          <strong>Expected savings:</strong> 50–90% on repeated calls with the same system prompt.
        </p>

        <h2>4. Duplicate Tool Calls</h2>
        <p>
          In agentic loops, the same tool is often called multiple times with identical arguments within a single run.
          This happens most often with search tools and retrieval steps — the agent forgets it already ran the query.
        </p>
        <p>
          <strong>How to fix it:</strong> Add a simple in-memory cache keyed on tool name + arguments. If the agent tries to call a tool it already called with the same args, return the cached result instead.
        </p>
        <p>
          <strong>Expected savings:</strong> 5–20% depending on how loopy your agent is.
        </p>

        <h2>5. Over-Instrumented Streaming</h2>
        <p>
          Streaming responses feel faster to users, but they increase the risk of partial completions being retried.
          Agents that stream and then parse the streamed output often fail silently and retry the entire call, doubling the cost.
        </p>
        <p>
          <strong>How to fix it:</strong> For structured outputs that need parsing, disable streaming and use the synchronous API. Reserve streaming for final user-facing responses only.
        </p>

        <h2>Measure Before and After</h2>
        <p>
          Before applying any of these fixes, baseline your costs using a tool like{' '}
          <Link to="/" className="text-acid hover:underline">AGENTHOUSE</Link>. Drop a trace JSON and you will see exactly which cost leaks apply to your agent, ranked by estimated dollar savings.
          This makes it easy to prioritize — fix the highest-impact issues first.
        </p>
        <p>
          Most agents reach a score of 90+ after addressing their top three findings. That typically corresponds to a 70–85% cost reduction.
        </p>
      </article>
    ),
  },
  'ai-agent-latency-optimization-guide': {
    description:
      "Latency is the silent killer of AI agent UX. We walk through the three biggest latency culprits in agent pipelines and how to eliminate them using OpenTelemetry traces.",
    body: (
      <article className="prose-content">
        <p>
          A 7-second response time feels fine in a demo. In production, it loses users. AI agent latency is a product problem as much as a technical one — users have a mental model of "AI is fast," and anything over 3 seconds breaks that model.
        </p>
        <p>
          The good news: most latency in agent pipelines is structural, not fundamental. You are not waiting on the model — you are waiting on how you have wired the model together.
        </p>

        <h2>The Three Latency Culprits</h2>

        <h3>1. Sequential Tool Calls That Could Run in Parallel</h3>
        <p>
          This is the single biggest latency win in most agents. When an agent needs to call three tools — say, a web search, a database lookup, and a code execution — it often runs them one after another.
          If none of those tools depend on the output of the others, that is pure wasted time.
        </p>
        <p>
          <strong>Example:</strong> Three 1-second tool calls run sequentially = 3 seconds. Run in parallel = 1 second.
        </p>
        <p>
          <strong>How to fix it:</strong> Identify independent tool calls and batch them with Promise.all (JavaScript) or asyncio.gather (Python). LangGraph supports this natively with parallel node execution.
        </p>
        <p>
          <strong>Expected improvement:</strong> 40–60% latency reduction on multi-tool agents.
        </p>

        <h3>2. Duplicate Tool Invocations</h3>
        <p>
          Beyond costing money, duplicate tool calls add latency. If your agent calls the same search query twice within a run, it is waiting twice for the same result.
        </p>
        <p>
          <strong>How to fix it:</strong> Same fix as cost: cache tool results within a run. A simple in-memory map keyed on <code>toolName + JSON.stringify(args)</code> is enough.
        </p>

        <h3>3. Blocking on the Wrong Model</h3>
        <p>
          Frontier models have higher latency than smaller models. GPT-4o averages 2–3x the TTFT of GPT-4o-mini.
          If you are using a frontier model for a classification step that runs on the critical path, you are adding unnecessary latency.
        </p>
        <p>
          <strong>How to fix it:</strong> Route lightweight, deterministic steps to faster models. Use frontier models only for steps where reasoning quality matters — and try to run those steps in parallel with other work.
        </p>

        <h2>How to Find Latency Issues in Your Agent</h2>
        <p>
          The easiest way is to look at a trace. OpenTelemetry traces show you the exact timeline of every span in your agent run — which calls overlapped, which ran serially, and how long each one took.
        </p>
        <p>
          <Link to="/how-to" className="text-acid hover:underline">AGENTHOUSE</Link> reads your trace and automatically flags parallelizable calls and duplicate invocations, showing you exactly which spans to fix and estimating the latency savings in milliseconds.
        </p>

        <h2>A Real Example: 7s to 2s</h2>
        <p>
          A typical ReAct agent running three search calls serially looks like this:
        </p>
        <ul>
          <li>Step 1: web_search("query A") — 1.2s</li>
          <li>Step 2: web_search("query B") — 1.1s</li>
          <li>Step 3: web_search("query C") — 0.9s</li>
          <li>Step 4: GPT-4o synthesis — 3.8s</li>
          <li><strong>Total: 7.0s</strong></li>
        </ul>
        <p>
          After parallelizing the three search calls and switching synthesis to GPT-4o-mini:
        </p>
        <ul>
          <li>Steps 1–3: web_search (parallel) — 1.2s</li>
          <li>Step 4: GPT-4o-mini synthesis — 0.8s</li>
          <li><strong>Total: 2.0s</strong></li>
        </ul>
        <p>
          That is a 71% latency reduction with zero change to the agent logic — just a structural change to how the calls are ordered, and a model routing decision.
        </p>
      </article>
    ),
  },
  'opentelemetry-for-ai-agents': {
    description:
      'OpenTelemetry is the open standard for observability. Learn how to instrument LangGraph, Vercel AI SDK, and custom Python agents to export traces you can audit with AGENTHOUSE.',
    body: (
      <article className="prose-content">
        <p>
          OpenTelemetry (OTel) is the CNCF-backed open standard for distributed tracing, metrics, and logs.
          It was originally built for microservices, but it has become the de facto standard for AI agent observability — and for good reason.
          Every major AI framework now either emits OTel traces natively or has first-class support for it.
        </p>

        <h2>Why OpenTelemetry for AI Agents?</h2>
        <p>
          The alternative is vendor-specific tracing: LangSmith for LangChain, Langfuse for custom agents, Helicone for OpenAI calls.
          These tools are excellent, but they lock your observability data into a single vendor.
          OpenTelemetry gives you a vendor-neutral format that any tool — including{' '}
          <Link to="/" className="text-acid hover:underline">AGENTHOUSE</Link> — can read.
        </p>

        <h2>The GenAI Semantic Conventions</h2>
        <p>
          The OpenTelemetry community has defined semantic conventions for generative AI workloads.
          These are standardized attribute names for LLM calls — things like <code>gen_ai.system</code>, <code>gen_ai.request.model</code>, <code>gen_ai.usage.input_tokens</code>.
        </p>
        <p>
          When you instrument your agent using these conventions, any OTel-compatible tool can understand your traces automatically.
        </p>

        <h2>Instrumenting LangGraph</h2>
        <p>LangGraph integrates with LangSmith for tracing. To export OTel-compatible traces:</p>
        <ol>
          <li>Set <code>LANGCHAIN_TRACING_V2=true</code> in your environment</li>
          <li>Run your agent and navigate to LangSmith</li>
          <li>Export the run as JSON from the LangSmith UI (Run → Export → JSON)</li>
          <li>Drop the exported JSON into AGENTHOUSE</li>
        </ol>
        <p>
          AGENTHOUSE auto-detects the LangSmith trace format — no conversion needed.
        </p>

        <h2>Instrumenting Vercel AI SDK</h2>
        <p>The Vercel AI SDK has native OpenTelemetry support:</p>
        <ol>
          <li>Install <code>@opentelemetry/sdk-node</code> and <code>@opentelemetry/exporter-trace-otlp-http</code></li>
          <li>Initialize the SDK with the OTLP JSON exporter pointed at a local file or collector</li>
          <li>Wrap your AI calls — the SDK automatically attaches GenAI attributes to spans</li>
          <li>Collect the exported <code>.json</code> trace file and upload to AGENTHOUSE</li>
        </ol>

        <h2>Instrumenting a Custom Python Agent</h2>
        <p>For custom agents built with the OpenAI or Anthropic SDK directly:</p>
        <ol>
          <li>Install <code>opentelemetry-sdk</code> and <code>opentelemetry-exporter-otlp-json</code></li>
          <li>Create a tracer and wrap each LLM call in a span</li>
          <li>Add GenAI attributes: model, input tokens, output tokens, system</li>
          <li>Export traces to a JSON file using the OTLP JSON exporter</li>
        </ol>

        <h2>What to Do with Your Traces</h2>
        <p>
          Once you have an OTel trace, drop it into{' '}
          <Link to="/login" className="text-acid hover:underline">AGENTHOUSE</Link> to get a scored report.
          AGENTHOUSE runs 7 audit checks — cost, latency, reliability, and context — and ranks every finding by estimated savings.
        </p>
        <p>
          Everything runs in the browser. Your traces never leave your machine.
        </p>
      </article>
    ),
  },
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find(p => p.slug === slug)
  const content = slug ? POSTS_CONTENT[slug] : undefined

  if (!post || !content) return <Navigate to="/blog" replace />

  const ARTICLE_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: content.description,
    url: `https://agenthouse.fun/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'AGENTHOUSE', url: 'https://agenthouse.fun' },
    publisher: {
      '@type': 'Organization',
      name: 'AGENTHOUSE',
      url: 'https://agenthouse.fun',
      logo: { '@type': 'ImageObject', url: 'https://agenthouse.fun/favicon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://agenthouse.fun/blog/${post.slug}` },
    image: { '@type': 'ImageObject', url: 'https://agenthouse.fun/og-image.png', width: 1200, height: 630 },
    keywords: post.tags.join(', '),
  }

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug)

  return (
    <main>
      <SEO
        title={post.title}
        description={content.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImageAlt={`${post.title} — AGENTHOUSE`}
        keywords={post.tags.join(', ')}
        articlePublishedTime={post.date}
        articleModifiedTime={post.date}
        structuredData={ARTICLE_SCHEMA}
        breadcrumbs={[
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fog hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-bold uppercase tracking-widest text-acid border border-acid/30 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.03em' }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-fog mb-12 pb-8 border-b border-steel">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} aria-hidden="true" />
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} aria-hidden="true" />
              {post.readTime}
            </span>
            <span>AGENTHOUSE Team</span>
          </div>

          <div className="blog-body text-mist leading-relaxed">
            {content.body}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-steel">
              <p className="text-xs font-bold uppercase tracking-widest text-fog mb-6">Related Articles</p>
              <div className="space-y-4">
                {relatedPosts.map(related => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="flex items-start gap-4 group border border-steel bg-ash p-4 hover:border-acid/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-acid transition-colors leading-snug mb-1">
                        {related.title}
                      </p>
                      <p className="text-xs text-fog">{related.readTime}</p>
                    </div>
                    <ArrowRight size={14} className="text-fog group-hover:text-acid transition-colors shrink-0 mt-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-steel">
            <p className="text-sm text-fog mb-6">Ready to audit your own agent?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="btn-acid">
                Start Auditing Free <ArrowRight size={14} />
              </Link>
              <Link to="/blog" className="btn-outline">
                All Articles <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  )
}
