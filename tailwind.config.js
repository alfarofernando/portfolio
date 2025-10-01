const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: colors.indigo,
        accent: colors.orange,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        neutral: colors.slate,
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        brand: '0 12px 30px -12px rgba(79,70,229,0.45), 0 20px 60px -30px rgba(79,70,229,0.35)',
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(circle at top, rgba(99,102,241,0.2), transparent 55%)',
      },
      transitionDuration: {
        2000: '2000ms',
      },
    },
  },
  plugins: [],
};