/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/index.astro',
    './src/components/landing/**/*.astro',
    './src/layouts/LandingLayout.astro',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#087CF4',
          hover: '#0668CC',
          active: '#0556A8',
          light: '#E8F2FE',
          dark: '#06264B',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
        mono: [
          '"SF Mono"', '"Fira Code"', '"Fira Mono"', 'Menlo', 'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
