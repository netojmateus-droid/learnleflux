/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      colors: {
        // Dark theme
        'dark-base': '#0B0F14',
        'dark-base-secondary': '#111827',
        'text-primary': '#E5E7EB',
        'text-secondary': '#C7CDD8',
        'text-tertiary': '#94A3B8',
        // Light theme
        'light-base': '#F7F8FB',
        'light-base-secondary': '#F1F5F9',
        'text-light-primary': '#1E293B',
        // Accent
        accent: '#FFD166',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}