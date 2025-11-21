/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-dark': '#059669',
        secondary: '#6366f1',
      },
    },
  },
  plugins: [],
}
