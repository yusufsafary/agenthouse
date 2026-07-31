import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-bold text-acid mb-4" style={{ letterSpacing: '-0.04em' }}>
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page not found
        </h1>
        <p className="text-sm text-fog mb-10 leading-relaxed">
          This page doesn't exist or was moved. Head back and keep auditing your agents.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest"
          >
            <Home size={14} /> Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>
      </motion.div>
    </main>
  )
}
