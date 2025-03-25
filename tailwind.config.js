/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FFF0F0',
          200: '#FFD1D1',
          300: '#FFB3B3',
          400: '#FF9494',
          500: '#FF7676',
          600: '#FF5757',
        },
        secondary: {
          100: '#E8F9FF',
          200: '#C1F0FF',
          300: '#9AE6FF',
          400: '#73DCFF',
          500: '#4CD3FF',
          600: '#25C9FF',
        },
        accent: {
          100: '#FFF3E0',
          200: '#FFE0B2',
          300: '#FFCC80',
          400: '#FFB74D',
          500: '#FFA726',
          600: '#FF9800',
        },
        candy: {
          pink: '#FF9ECD',
          blue: '#87CEEB',
          yellow: '#FFE156',
          green: '#98FB98',
          purple: '#DDA0DD',
          orange: '#FFB366',
        },
      },
      fontFamily: {
        kuaile: ['var(--font-kuaile)'],
        qingke: ['var(--font-qingke)'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#FF7676",
        "secondary": "#4CD3FF",
        "accent": "#FFB74D",
        "neutral": "#3D4451",
        "base-100": "#FFFFFF",
        "info": "#87CEEB",
        "success": "#98FB98",
        "warning": "#FFE156",
        "error": "#FF9ECD",
      }
    }],
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
} 