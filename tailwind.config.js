module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      custom: ['Lexend Deca'],
    },
    extend: {
      colors: {
        primary: '#0f3057',
        secondary: '#00587a',
        alternative: '#008891',
        bg: '#e7e7de',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
