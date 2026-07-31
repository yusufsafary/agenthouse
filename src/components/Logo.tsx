interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  wordmark?: boolean
  className?: string
}

export default function Logo({ size = 'md', wordmark = true, className = '' }: LogoProps) {
  const dims = { sm: 28, md: 36, lg: 56 }[size]
  const textSize = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div style={{ width: dims, height: dims }} className="relative flex-shrink-0">
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width={dims} height={dims}>
          {/* outer border */}
          <rect x="1" y="1" width="54" height="54" stroke="#00FF66" strokeWidth="2" />
          {/* house roof */}
          <polygon points="28,6 52,22 52,52 4,52 4,22" fill="#0A0A0A" stroke="#00FF66" strokeWidth="2.5" strokeLinejoin="miter" />
          {/* door */}
          <rect x="21" y="36" width="14" height="16" fill="#00FF66" />
          {/* windows */}
          <rect x="8" y="28" width="9" height="8" fill="none" stroke="#00FF66" strokeWidth="1.5" />
          <rect x="39" y="28" width="9" height="8" fill="none" stroke="#00FF66" strokeWidth="1.5" />
          {/* circuit lines */}
          <line x1="28" y1="22" x2="28" y2="36" stroke="#00FF66" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="28" cy="20" r="2" fill="#00FF66" />
        </svg>
      </div>

      {wordmark && (
        <span
          className={`${textSize} font-bold tracking-tightest text-white uppercase`}
          style={{ letterSpacing: '-0.04em', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          AGENT<span className="text-acid">HOUSE</span>
        </span>
      )}
    </div>
  )
}
