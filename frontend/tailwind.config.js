/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
  50: '#f1fce8',
  100: '#e0f7c8',
  200: '#c9f0a0',
  400: '#8fe043',
  500: '#6fca2b',
  600: '#57a520',
},
        surface: {
          light: '#ffffff',
          dark: '#1e2023',
          darkCard: '#26282c',
        },
      },
    },
  },
  plugins: [],
}