/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        swiss: {
          black: '#0a0a0a',
          white: '#ffffff',
          paper: '#f9fafb',
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          red: '#dc2626',      // Classic Swiss poster signal red
          blue: '#1d4ed8',     // International Cobalt
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        widest: '0.15em',
      },
    },
  },
  plugins: [],
};
