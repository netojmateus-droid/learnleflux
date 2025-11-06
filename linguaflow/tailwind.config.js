
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      colors: {
        'dark-base-start': '#0B0F14',
        'dark-base-end': '#111827',
        'light-base-start': '#F7F8FB',
        'light-base-end': '#F1F5F9',
        'dark-text-primary': '#E5E7EB',
        'dark-text-secondary': '#C7CDD8',
        'dark-text-tertiary': '#94A3B8',
        'light-text-primary': '#1E293B',
        accent: '#FFD166',
      },
      boxShadow: {
        soft: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
   