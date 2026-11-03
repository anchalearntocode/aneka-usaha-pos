/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          navy: '#1E3156',
          steel: '#496995',
          slate: '#A5B5D2',
          ice: '#B0CBE6',
          peach: '#FDD6CD',
        },
        brand: {
          50: '#f4f7fb',
          100: '#e5ecf5',
          200: '#B0CBE6',
          300: '#A5B5D2',
          400: '#7590b5',
          500: '#496995',
          600: '#3a5477',
          700: '#2b3f5c',
          800: '#1E3156',
          900: '#14213d',
          950: '#0b1324',
        },
      }
    },
  },
  plugins: [],
}
