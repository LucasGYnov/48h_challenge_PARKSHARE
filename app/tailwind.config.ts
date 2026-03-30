/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e8bf0d',
          dark: '#c4a10a',
          light: '#f8fafc',
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      },
      borderRadius: {
        'lg': '0.75rem',
      },
      boxShadow: {
        'sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}