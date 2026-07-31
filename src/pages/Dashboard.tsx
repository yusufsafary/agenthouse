import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileJson, X, AlertCircle, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { auditTrace, parseTrace, type Report, type AuditResult } from '../lib/audit'
import ScoreGauge from '../components/ScoreGauge'
import { useAuth } from '../hooks/useAuth'

const EXAMPLE_TRACE = {
  resourceSpans: [
    {
      resource: { attributes: [] },
      scopeSpans: [
        {
          scope: { name: 'example-agent' },
          spans: [
            {
              traceId: 'trace1',
              spanId: 'span1',
              parentSpanId: '',
              name: 'agent.run',
              startTimeUnixNano: '1700000000000000000',
              endTimeUnixNano: '1700000007000000000',
              kind: 3,
              attributes: [],
              status: { code: 0 },
            },
            {
              traceId: 'trace1',
              spanId: 'span2',
              parentSpanId: 'span1',
              name: 'openai.chat',
              startTimeUnixNano: '1700000001000000000',
              endTimeUnixNano: '1700000003000000000',
              kind: 3,
              attributes: [
                { key: 'gen_ai.system', value: { stringValue: 'openai' } },
                { key: 'gen_ai.request.model', value: { stringValue: 'gpt-4o' } },
                { key: 'gen_ai.usage.input_tokens', value: { intValue: 9500 } },
                { key: 'gen_ai.usage.output_tokens', value: { intValue: 120 } },
                { key: 'gen_ai.operation.name', value: { stringValue: 'chat' } },
              ],
              status: { code: 0 },
            },
            {
              traceId: 'trace1',
              spanId: 'span3',
              parentSpanId: 'span1',
              name: 'search_web',
              startTimeUnixNano: '1700000003000000000',
              endTimeUnixNano: '1700000004200000000',
              kind: 3,
              attributes: [
                { key: 'gen_ai.tool.name', value: { stringValue: 'search_web' } },
              ],
              status: { code: 0 },
            },
            {
              traceId: 'trace1',
              spanId: 'span4',
              parentSpanId: 'span1',
              name: 'search_web',
              startTimeUnixNano: '1700000004200000000',
              endTimeUnixNano: '1700000005400000000',
              kind: 3,
              attributes: [
                { key: 'gen_ai.tool.name', value: { stringValue: 'search_web' } },
              ],
              status: { code: 0 },
            },
          ],
        },
      ],
    },
  ],
}

function categoryColor(cat: string) {
  const map: Record<string, string> = { cost: '#FFE500', latency: '#00FF66', reliability: '#FF2D55', context: '#AB9FF2' }
  return map[cat] ?? '#9A9A9A'
}

function AuditCard({ audit }: { audit: AuditResult }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round(audit.score * 100)
  const color = pct >= 90 ? '#00FF66' : pct >= 70 ? '#FFE500' : pct >= 50 ? '#FF8C00' : '#FF2D55'

  return (
    <div className="border border-steel bg-ash">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-steel/30 transition-colors"
      >
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-steel" style={{ borderColor: color + '40' }}>
          <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{audit.title}</p>
          <p className="text-xs text-fog mt-0.5">
            {audit.category}
            {audit.savings.usd ? ` — save $${audit.savings.usd}` : ''}
            {audit.savings.ms ? ` / ${Math.round(audit.savings.ms)}ms` : ''}
          </p>
        </div>
        <div className="flex-shrink-0">
          {open ? <ChevronUp size={14} className="text-fog" /> : <ChevronDown size={14} className="text-fog" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-steel pt-4">
              <div className="bg-smoke border border-steel p-3 mb-3">
                <p className="text-xs text-fog mb-1 font-bold uppercase tracking-widest">Hint</p>
                <p className="text-sm text-mist">{audit.hint}</p>
              </div>
              {audit.findings.length > 0 ? (
                <div className="space-y-2">
                  {audit.findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-hot mt-1.5 flex-shrink-0" />
                      <span className="text-mist">{f.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-acid font-bold">No issues found. This audit passed.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [report, setReport] = useState<Report | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const processTrace = useCallback(async (json: unknown, name: string) => {
    setParseError(null)
    setReport(null)
    setProcessing(true)
    setFileName(name)
    await new Promise(r => setTimeout(r, 200))
    try {
      const run = parseTrace(json)
      const result = auditTrace(run)
      setReport(result)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Failed to parse trace.')
    } finally {
      setProcessing(false)
    }
  }, [])

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        processTrace(json, file.name)
      } catch {
        setParseError('Invalid JSON file. Make sure it is a valid agent trace.')
      }
    }
    reader.readAsText(file)
  }, [processTrace])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
  })

  const loadExample = () => processTrace(EXAMPLE_TRACE, 'example-otel-trace.json')

  const downloadReport = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agenthouse-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tightest">
            Agent Trace Auditor
          </h1>
          <p className="text-sm text-fog mt-1">
            Signed in as <span className="text-acid">{user?.name}</span>
            {user?.method === 'metamask' && ' via MetaMask'}
            {user?.method === 'phantom' && ' via Phantom'}
          </p>
        </div>
        {report && (
          <button onClick={downloadReport} className="btn-ghost gap-2 self-start">
            <Download size={14} />
            Export JSON
          </button>
        )}
      </div>

      {/* Drop zone */}
      {!report && !processing && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-acid bg-acid/5' : 'border-steel hover:border-fog'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={32} className={`mx-auto mb-4 ${isDragActive ? 'text-acid' : 'text-fog'}`} />
          <p className="text-lg font-bold text-white mb-2">
            {isDragActive ? 'Drop your trace here' : 'Drop agent trace JSON'}
          </p>
          <p className="text-sm text-fog mb-6">
            Supports OpenTelemetry GenAI, Vercel AI SDK, LangGraph, Google ADK
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              className="btn-acid gap-2"
              onClick={e => { e.stopPropagation() }}
            >
              <FileJson size={14} />
              Browse Files
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); loadExample() }}
              className="btn-ghost gap-2"
            >
              Load Example Trace
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div className="border border-steel bg-ash p-12 text-center">
          <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Auditing {fileName}...</p>
        </div>
      )}

      {/* Error */}
      {parseError && (
        <div className="flex items-start gap-3 p-4 border border-hot/30 bg-hot/5 mb-6 text-sm text-hot">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Parse Error</p>
            <p>{parseError}</p>
          </div>
          <button onClick={() => setParseError(null)} className="ml-auto flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Report */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="flex items-center gap-3 text-sm text-fog">
              <FileJson size={14} />
              <span>{fileName}</span>
              <button
                onClick={() => { setReport(null); setParseError(null); setFileName(null) }}
                className="text-fog hover:text-hot transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Score + Category breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <div className="col-span-2 sm:col-span-1 card-dark flex flex-col items-center justify-center py-6">
              <ScoreGauge score={report.score} size={100} label="Overall" />
            </div>
            {report.categories.map(cat => (
              <div key={cat.category} className="card-dark flex flex-col items-center justify-center py-4">
                <span className="text-3xl font-bold tabular-nums" style={{ color: categoryColor(cat.category) }}>
                  {cat.score}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-fog mt-1 capitalize">{cat.category}</span>
              </div>
            ))}
          </div>

          {/* Run stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Source', value: report.run.source ?? 'Unknown' },
              { label: 'Duration', value: `${(report.run.durationMs / 1000).toFixed(1)}s` },
              { label: 'Spans', value: report.run.spans },
              { label: 'LLM Calls', value: report.run.llmCalls },
              { label: 'Tool Calls', value: report.run.toolCalls },
              { label: 'Total Cost', value: `$${report.run.totalCostUsd.toFixed(4)}` },
            ].map(stat => (
              <div key={stat.label} className="bg-ash border border-steel p-3">
                <p className="text-xs text-fog uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-sm font-bold text-white truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Savings banner */}
          {(report.savings.usd || report.savings.ms) && (
            <div className="bg-acid/10 border border-acid/40 p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-acid">Potential Savings</span>
              <div className="flex gap-6 text-sm">
                {report.savings.usd ? <span className="text-white">Cost: <strong className="text-acid">${report.savings.usd}</strong> per run</span> : null}
                {report.savings.ms ? <span className="text-white">Latency: <strong className="text-acid">{Math.round(report.savings.ms)}ms</strong> off critical path</span> : null}
              </div>
            </div>
          )}

          {/* Audits */}
          <div>
            <p className="section-label mb-4">Audit Results</p>
            <div className="space-y-2">
              {[...report.audits].sort((a, b) => a.score - b.score).map(audit => (
                <AuditCard key={audit.id} audit={audit} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </main>
  )
}
