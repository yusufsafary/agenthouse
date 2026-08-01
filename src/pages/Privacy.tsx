import { motion } from 'framer-motion'

const SECTIONS = [
  {
    title: 'Overview',
    body: [
      'AGENTHOUSE ("we", "our", or "the application") is a browser-based AI agent auditing tool. This Privacy Policy explains what information we handle and how.',
      'The short version: we collect almost nothing. All audit processing happens entirely in your browser. No agent traces or analysis results are ever sent to a server we control.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      "Account data (optional): If you sign in with email, we store your display name and email address in your browser's localStorage only. If you connect a crypto wallet (MetaMask or Phantom), we store only your public wallet address. No passwords are stored — login uses a demo credential flow for evaluation purposes.",
      'Session data: A session token ("ah_user") is written to localStorage when you sign in. It is never transmitted to any server.',
      'Trace data: Files you upload for auditing are processed entirely in memory within your browser tab. They are never uploaded, stored, or transmitted anywhere.',
    ],
  },
  {
    title: 'Information We Do Not Collect',
    body: [
      'We do not run analytics, tracking pixels, or behavioral advertising tools.',
      'We do not use Google Analytics, Meta Pixel, Hotjar, Mixpanel, or any equivalent service.',
      'We do not store your agent traces, audit results, or any data you analyze.',
      'We do not sell, rent, or share your data with third parties.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'Hosting provider: The hosting platform may collect standard server-side access logs such as IP address, user agent, and timestamp as part of its infrastructure.',
      "Google Fonts: Space Grotesk and JetBrains Mono typefaces are loaded from Google's servers. This involves a standard HTTPS request that Google may log. See Google's Privacy Policy for details.",
    ],
  },
  {
    title: 'Data Retention',
    body: [
      'localStorage data (your session) persists until you sign out or clear your browser storage. We have no server-side copy of this data.',
      'Because we store no data server-side, there is nothing for us to delete on request — your data already lives only in your browser.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'You can clear all locally stored data at any time by clicking Sign Out, or by clearing localStorage for agenthouse.fun in your browser settings.',
      'You may use the public pages (Home, About, Pricing, How To, Legal) without signing in at all.',
    ],
  },
  {
    title: 'Changes',
    body: [
      'We may update this policy as the product evolves. Material changes will be noted by updating the "Last updated" date. Continued use of the site constitutes acceptance.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'Questions about this policy? Please use the contact channel provided by the AGENTHOUSE team.',
    ],
  },
]

export default function Privacy() {
  return (
    <main>
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
            Privacy <span className="text-acid">Policy</span>
          </h1>
          <p className="text-sm text-fog mb-12">Last updated: July 2026</p>

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
                    <p key={j} className="text-sm text-mist leading-relaxed">{para}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  )
}
