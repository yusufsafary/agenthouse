import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const SECTIONS = [
  {
    title: 'What Are Cookies',
    body: [
      'Cookies are small text files that websites place on your device. They are widely used to make websites work, improve efficiency, and provide information to site owners.',
      'AGENTHOUSE uses a minimal set of browser storage mechanisms to keep the application functional. We do not use advertising cookies, cross-site tracking, or third-party analytics.',
    ],
  },
  {
    title: 'What We Store',
    body: [
      'We use localStorage (not cookies in the traditional sense) to store your session state so you remain signed in when you close and reopen the tab.',
      'Specifically, we store: your chosen authentication method (email, MetaMask, or Phantom), your display name or wallet address, and a session identifier. No trace data you analyze is ever stored or transmitted. All audit processing happens entirely in your browser.',
    ],
  },
  {
    title: 'What We Do Not Do',
    body: [
      'We do not set third-party tracking cookies.',
      'We do not use Google Analytics, Meta Pixel, or any behavioral advertising tools.',
      'We do not sell or share your data with third parties.',
      'We do not store your agent traces or any data you upload for analysis. Everything runs locally in your browser.',
    ],
  },
  {
    title: 'Session Storage',
    body: [
      'Your login session is stored in localStorage under the key "ah_user". This persists until you sign out or clear your browser data.',
      'Wallet connections (MetaMask or Phantom) are managed by your wallet extension. AGENTHOUSE only stores the public address returned after you approve a connection. We have no access to your private keys.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'Hosting provider: The hosting platform may collect standard server-side access logs such as IP address, user agent, and timestamp as part of its infrastructure.',
      "Google Fonts is used to load the Space Grotesk and JetBrains Mono typefaces. This involves a request to Google's servers. See Google's Privacy Policy for details. No additional tracking is performed by font loading.",
    ],
  },
  {
    title: 'Your Choices',
    body: [
      "You can clear your session at any time by clicking Sign Out in the navigation bar, or by clearing your browser's localStorage for this site.",
      'You can use AGENTHOUSE without signing in to browse the public pages (Home, About, How To, Blog, Pricing). Signing in is only required to access the Dashboard and analyze traces.',
      "If you want to block all storage, enable your browser's private/incognito mode. The application will still function; you will simply need to sign in again each visit.",
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this policy to reflect changes in how the application works. When we do, we will update the "Last updated" date below. Continued use of the site after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'Questions about this policy? Please use the contact channel provided by the AGENTHOUSE team.',
    ],
  },
]

export default function Cookies() {
  return (
    <main>
      <SEO
        title="Cookie Policy — AGENTHOUSE"
        description="AGENTHOUSE Cookie Policy. We use minimal browser storage — no third-party tracking, no analytics cookies, no advertising. All audit data stays in your browser."
        canonical="/cookies"
        breadcrumbs={[{ name: 'Cookie Policy', url: '/cookies' }]}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-4">Legal</p>
          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tightest mb-4"
            style={{ letterSpacing: '-0.04em' }}
          >
            Cookie <span className="text-acid">Policy</span>
          </h1>
          <p className="text-sm text-fog mb-12">Last updated: August 2026</p>

          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-t border-steel pt-8"
              >
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-sm text-mist leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-steel">
            <p className="text-sm text-fog mb-6">
              This policy covers <span className="text-acid">agenthouse.fun</span> only.
            </p>
            <Link to="/" className="btn-outline">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
