/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand accents carried over from the web app's CSS variables.
        accent: '#aa3bff',
      },
    },
  },
  plugins: [],
};
