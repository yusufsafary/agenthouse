import { useEffect, useRef } from 'react'

interface ScoreGaugeProps {
  score: number
  size?: number
  label?: string
}

function scoreColor(score: number): string {
  if (score >= 90) return '#00FF66'
  if (score >= 70) return '#FFE500'
  if (score >= 50) return '#FF8C00'
  return '#FF2D55'
}

export default function ScoreGauge({ score, size = 120, label }: ScoreGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))
  const R = (size / 2) * 0.8
  const circum = 2 * Math.PI * R
  const color = scoreColor(clampedScore)
  const offset = circum - (clampedScore / 100) * circum

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circum)
    el.getBoundingClientRect()
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.strokeDashoffset = String(offset)
    })
  }, [clampedScore, circum, offset])

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={size * 0.08}
          />
          {/* Score ring */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.08}
            strokeLinecap="butt"
            strokeDasharray={circum}
            strokeDashoffset={circum}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
          {/* Score text */}
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={size * 0.26}
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="-2"
          >
            {clampedScore}
          </text>
        </svg>
      </div>
      {label && <span className="text-xs font-bold uppercase tracking-widest text-fog">{label}</span>}
    </div>
  )
}
