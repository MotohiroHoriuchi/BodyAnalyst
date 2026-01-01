/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7F4',
          100: '#DCEEE5',
          200: '#B9DDCB',
          300: '#8DC6AA',
          400: '#5FAA86',
          500: '#3D8B6A',
          600: '#2E6F54',
          700: '#255A44',
          800: '#1F4837',
          900: '#1A3B2E',
        },
        secondary: {
          50: '#FDF6F3',
          100: '#FCE8DE',
          200: '#F9CFBD',
          300: '#F4AD8F',
          400: '#EE8A63',
          500: '#E76B3F',
          600: '#D44E23',
          700: '#B23B1A',
          800: '#91321C',
          900: '#762D1B',
        },
        neutral: {
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#E8E5E0',
          300: '#D4CFC7',
          400: '#B8B0A5',
          500: '#948B7E',
          600: '#6E6659',
          700: '#4A4339',
          800: '#322D25',
          900: '#1C1914',
        },
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Hiragino Sans', 'Noto Sans CJK JP', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(28, 25, 20, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(28, 25, 20, 0.08), 0 2px 4px -1px rgba(28, 25, 20, 0.04)',
        'md': '0 4px 6px -1px rgba(28, 25, 20, 0.08), 0 2px 4px -1px rgba(28, 25, 20, 0.04)',
        'lg': '0 10px 15px -3px rgba(28, 25, 20, 0.1), 0 4px 6px -2px rgba(28, 25, 20, 0.05)',
        'xl': '0 20px 25px -5px rgba(28, 25, 20, 0.12), 0 10px 10px -5px rgba(28, 25, 20, 0.04)',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
    },
  },
  plugins: [],
}
