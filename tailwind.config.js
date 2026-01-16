/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        my: {
          grey: '#1c1c1c',
          white: '#d0d0d0',
          blue: '#005fd7',
          'bright-green': '#00ff5f',
          'light-red': '#ff5f5f',
          'bright-red': '#d70000',
          yellow: '#ffd700',
          magenta: '#ff005f',
        },
      },
    },
  },
  plugins: [],
}
