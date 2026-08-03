import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <SEO
        title="404 — Page Not Found | AGENTHOUSE"
        description="This page does not exist. Head back to AGENTHOUSE to audit your AI agent traces."
        noindex={true}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-bold text-acid mb-4" style={{ letterSpacing: '-0.04em' }} aria-hidden="true">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page not found
        </h1>
        <p className="text-sm text-fog mb-10 leading-relaxed">
          This page doesn&apos;t exist or was moved. Head back and keep auditing your agents.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest"
          >
            <Home size={14} aria-hidden="true" /> Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Go Back
          </button>
        </div>
      </motion.div>
    </main>
  )
}
