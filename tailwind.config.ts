export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':    '#0A0A12',
        'dungeon': '#111827',
        'mist':    '#1F2937',
        'border':  '#374151',
        'stone':   '#9CA3AF',
        'ghost':   '#F1F5F9',
        'gate':    '#3B82F6',
        'monarch': '#7C3AED',
        'teal':    '#06B6D4',
        'silver':  '#CBD5E1',
        'gold':    '#F59E0B',
        'crimson': '#DC2626',
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        mono:    ['Share Tech Mono', 'monospace'],
        body:    ['Inter', 'sans-serif'],
      },
    }
  }
}
