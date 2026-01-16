/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [ // these are dynamically assembled in Filepath.jsx, make sure they exist
    'text-my-bright-red', 'bg-my-bright-red/15',
    'text-my-bright-green', 'bg-my-bright-green/15',
    'text-my-blue', 'bg-my-blue/15',
    'text-my-yellow', 'bg-my-yellow/15',
    'text-my-light-red', 'bg-my-light-red/15',
    'text-my-magenta', 'bg-my-magenta/15',
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
