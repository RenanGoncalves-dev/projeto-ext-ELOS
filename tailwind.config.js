/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        elos: {
          slate: '#1E2736',
          kioskBg: '#18202C',
          kioskCard: '#222D3D',
          sage: '#76A897',
          sageLight: '#E6F2EE',
          sky: '#6B9AC4',
          skyLight: '#E8F1F8',
          lavender: '#938BA8',
          lavenderLight: '#EFEBF5',
          sand: '#D4B483',
          sandLight: '#F9F3E8',
        }
      }
    },
  },
  plugins: [],
};

