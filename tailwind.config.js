/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        acid: '#00FF66',
        hot: '#FF2D55',
        volt: '#FFE500',
        ink: '#0A0A0A',
        smoke: '#111111',
        ash: '#1A1A1A',
        steel: '#2A2A2A',
        mist: '#9A9A9A',
        fog: '#6A6A6A',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '0.9' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        ultra: '-0.04em',
      },
      animation: {
        'pulse-acid': 'pulseAcid 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        ticker: 'ticker 20s linear infinite',
      },
      keyframes: {
        pulseAcid: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
