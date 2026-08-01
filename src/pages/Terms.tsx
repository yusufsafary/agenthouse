import { motion } from 'framer-motion'

const SECTIONS = [
  {
    title: '1. Acceptance',
    body: [
      'By accessing or using AGENTHOUSE ("the Service") at agenthouse.fun, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
    ],
  },
  {
    title: '2. Description of Service',
    body: [
      'AGENTHOUSE is a browser-based tool that allows you to audit, score, and analyze AI agent execution traces. All processing occurs locally in your browser. The Service is provided free of charge under the MIT License.',
    ],
  },
  {
    title: '3. Use of the Service',
    body: [
      'You may use AGENTHOUSE for any lawful purpose, personal or commercial.',
      'You agree not to use the Service to process traces containing illegally obtained data, personal data belonging to others without consent, or content that violates applicable law.',
      'You are solely responsible for the agent traces and data you upload for analysis.',
    ],
  },
  {
    title: '4. Open Source License',
    body: [
      'AGENTHOUSE is available under the MIT License. You are free to use, modify, and self-host the application under the terms of that license.',
      'The MIT License applies to the application. These Terms of Service apply to your use of the hosted Service at agenthouse.fun.',
    ],
  },
  {
    title: '5. Disclaimer of Warranties',
    body: [
      'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR FIT FOR ANY PARTICULAR PURPOSE.',
      'Audit scores and recommendations are provided for informational purposes only. They do not constitute professional advice.',
    ],
  },
  {
    title: '6. Limitation of Liability',
    body: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGENTHOUSE AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.',
    ],
  },
  {
    title: '7. Changes to the Service',
    body: [
      'We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We will not be liable for any modification, suspension, or discontinuation.',
    ],
  },
  {
    title: '8. Changes to These Terms',
    body: [
      'We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms. The "Last updated" date below indicates when these Terms were last revised.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved in the appropriate courts of competent jurisdiction.',
    ],
  },
  {
    title: '10. Contact',
    body: [
      'Questions about these Terms? Please use the contact channel provided by the AGENTHOUSE team.',
    ],
  },
]

export default function Terms() {
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
            Terms of <span className="text-acid">Service</span>
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
