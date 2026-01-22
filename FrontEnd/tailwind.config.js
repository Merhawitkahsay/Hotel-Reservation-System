/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#082A4D',        // Navy Blue
        'primary-light': '#0A3560', // Lighter Navy
        'text-secondary': '#D4A017', // Gold
        background: '#F5F5F0',     // Beige
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], 
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}