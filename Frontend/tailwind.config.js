/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#FAF3E0',
        clay: '#C97C5D',
        lavender: '#8D6A9F',
        ink: '#3E3E3E',
        golden: '#EAC696',
        paper: '#FFF8E7',
      },
      fontFamily: {
        serif: ['Crimson Text', 'serif'],
        sans: ['Inter', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};
