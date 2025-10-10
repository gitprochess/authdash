/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bolt-inspired dark mode palette
        'bolt-dark': {
          50: '#f5f5f6',
          100: '#e6e7e9',
          200: '#d0d1d5',
          300: '#aeafb5',
          400: '#85868e',
          500: '#6a6b73',
          600: '#5a5b62',
          700: '#4c4d53',
          800: '#424347',
          900: '#1a1b1e',
          950: '#0f1011',
        },
        'bolt-accent': {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          green: '#10b981',
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(166, 53, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(166, 53, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};