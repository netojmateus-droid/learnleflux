const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Main colors
        primary: {
          light: '#3b82f6', // blue-500
          DEFAULT: '#2563eb', // blue-600
          dark: '#1d4ed8', // blue-700
        },
        accent: {
          DEFAULT: '#f59e0b', // amber-500
          dark: '#b45309', // amber-700
        },
        // Backgrounds
        'background-light': '#f8fafc', // slate-50
        'background-dark': '#0f172a',  // slate-900
        // Borders
        'border-light': '#e2e8f0', // slate-200
        'border-dark': '#334155', // slate-700
        // Status colors
        status: {
          new: '#3b82f6',       // blue-500
          learning: '#f59e0b',  // amber-500
          mastered: '#22c55e',  // green-500
          saved: '#22c55e',      // green-500
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        lexend: ['"Lexend Deca"', ...fontFamily.sans],
        noto: ['"Noto Serif"', ...fontFamily.serif],
      },
      boxShadow: {
        'lg-soft': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}