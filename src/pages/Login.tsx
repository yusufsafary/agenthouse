import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle, Loader2, Wallet, ExternalLink } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { useMetamask, usePhantom } from '../hooks/useWallet'

// Demo accounts for email/password login
const DEMO_ACCOUNTS = [
  { email: 'demo@agenthouse.dev', password: 'agenthouse2026', name: 'Demo User' },
  { email: 'admin@agenthouse.dev', password: 'admin123', name: 'Admin User' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const metamask = useMetamask()
  const phantom = usePhantom()

  const [tab, setTab] = useState<'email' | 'wallet'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/agenthouse/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const account = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    )
    if (!account) {
      setError('Invalid credentials. Try demo@agenthouse.dev / agenthouse2026')
      setLoading(false)
      return
    }
    login({ id: account.email, name: account.name, email: account.email, method: 'email' })
  }

  const handleMetamask = async () => {
    setError(null)
    const address = await metamask.connect()
    if (!address) {
      setError(metamask.error ?? 'MetaMask connection failed.')
      return
    }
    login({ id: address, name: `${address.slice(0, 6)}...${address.slice(-4)}`, address, method: 'metamask' })
  }

  const handlePhantom = async () => {
    setError(null)
    const address = await phantom.connect()
    if (!address) {
      setError(phantom.error ?? 'Phantom connection failed.')
      return
    }
    login({ id: address, name: `${address.slice(0, 6)}...${address.slice(-4)}`, address, method: 'phantom' })
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <div className="bg-smoke border border-steel p-1 flex mb-6">
            {(['email', 'wallet'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null) }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  tab === t ? 'bg-acid text-ink' : 'text-fog hover:text-white'
                }`}
              >
                {t === 'email' ? 'Email Login' : 'Web3 Wallet'}
              </button>
            ))}
          </div>

          <div className="bg-smoke border border-steel p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-3 p-3 bg-hot/10 border border-hot/30 mb-5 text-sm text-hot"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {tab === 'email' ? (
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-fog mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="demo@agenthouse.dev"
                      required
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-fog mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="agenthouse2026"
                      required
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-acid w-full justify-center mt-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
                </button>

                <p className="text-xs text-fog text-center pt-1">
                  Demo: <span className="text-acid">demo@agenthouse.dev</span> / <span className="text-acid">agenthouse2026</span>
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-fog text-center mb-2">
                  Connect your Web3 wallet to sign in. Your address is your identity.
                </p>

                {/* MetaMask */}
                <button
                  onClick={handleMetamask}
                  disabled={metamask.loading}
                  className="w-full flex items-center justify-between gap-3 p-4 border border-steel hover:border-acid/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#F6851B]/10 border border-[#F6851B]/30">
                      <Wallet size={16} className="text-[#F6851B]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">MetaMask</p>
                      <p className="text-xs text-fog">Ethereum / EVM</p>
                    </div>
                  </div>
                  {metamask.loading ? (
                    <Loader2 size={16} className="animate-spin text-fog" />
                  ) : metamask.isAvailable ? (
                    <span className="text-xs text-acid font-bold uppercase tracking-widest">Connect</span>
                  ) : (
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-fog hover:text-white"
                    >
                      Install <ExternalLink size={10} />
                    </a>
                  )}
                </button>

                {/* Phantom */}
                <button
                  onClick={handlePhantom}
                  disabled={phantom.loading}
                  className="w-full flex items-center justify-between gap-3 p-4 border border-steel hover:border-acid/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#AB9FF2]/10 border border-[#AB9FF2]/30">
                      <Wallet size={16} className="text-[#AB9FF2]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Phantom</p>
                      <p className="text-xs text-fog">Solana</p>
                    </div>
                  </div>
                  {phantom.loading ? (
                    <Loader2 size={16} className="animate-spin text-fog" />
                  ) : phantom.isAvailable ? (
                    <span className="text-xs text-acid font-bold uppercase tracking-widest">Connect</span>
                  ) : (
                    <a
                      href="https://phantom.app/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-fog hover:text-white"
                    >
                      Install <ExternalLink size={10} />
                    </a>
                  )}
                </button>

                <p className="text-xs text-fog text-center pt-1">
                  No wallet? Use the email login tab with our demo account.
                </p>
              </div>
            )}
          </div>

          <p className="text-center mt-4 text-xs text-fog">
            By signing in you agree to our{' '}
            <Link to="/agenthouse/cookies" className="text-acid hover:underline">Cookie Policy</Link>.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
