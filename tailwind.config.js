/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          gray: {
            50: '#fbfbfd',
            100: '#f5f5f7',
            200: '#e8e8ed',
            300: '#d2d2d7',
            400: '#aeaeb2',
            500: '#86868b',
            600: '#6e6e73',
            700: '#515154',
            800: '#3a3a3c',
            900: '#1d1d1f',
            950: '#0b0b0d',
          },
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          green: '#34c759',
          'green-hover': '#2bb24c',
        },
      },
      borderRadius: {
        'apple': '18px',
        'apple-sm': '12px',
        'apple-lg': '22px',
        'apple-xl': '28px',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
    },
  },
  plugins: [],
};
