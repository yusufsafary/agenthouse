import { Link } from 'react-router-dom'
import Logo from './Logo'
import { Github, Twitter, ArrowUpRight } from 'lucide-react'

const LINKS = {
  product: [
    { label: 'How It Works', href: '/how-to' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Open Source', href: 'https://github.com/yusufsafary/agenthouse', external: true },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'GitHub', href: 'https://github.com/yusufsafary', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  const year = 2026
  return (
    <footer className="bg-smoke border-t border-steel mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="sm" />
            <p className="mt-4 text-sm text-fog leading-relaxed max-w-xs">
              The command center for AI agents. Audit, score, and optimize your agent runs in seconds.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://github.com/yusufsafary/agenthouse"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-steel text-fog hover:border-acid hover:text-acid transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-steel text-fog hover:border-acid hover:text-acid transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-acid mb-4">Product</h3>
            <ul className="space-y-3">
              {LINKS.product.map(l => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-fog hover:text-white transition-colors">
                      {l.label}<ArrowUpRight size={12} />
                    </a>
                  ) : (
                    <Link to={l.href} className="text-sm text-fog hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-acid mb-4">Company</h3>
            <ul className="space-y-3">
              {LINKS.company.map(l => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-fog hover:text-white transition-colors">
                      {l.label}<ArrowUpRight size={12} />
                    </a>
                  ) : (
                    <Link to={l.href} className="text-sm text-fog hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-acid mb-4">Legal</h3>
            <ul className="space-y-3">
              {LINKS.legal.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-fog hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-steel">
          <p className="text-xs text-fog text-center sm:text-left">
            {year} AGENTHOUSE. MIT License. Based on{' '}
            <a href="https://github.com/addyosmani/agent-house" target="_blank" rel="noopener noreferrer"
              className="text-acid hover:underline">agent-house</a>{' '}by Addy Osmani.
          </p>
        </div>
      </div>
    </footer>
  )
}
