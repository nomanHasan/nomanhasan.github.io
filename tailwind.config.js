const colors = require('./tailwind/colors.json');


module.exports = {
  purge: false,
  theme: {
    extend: {
      colors: {
        ...colors
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '100': '25rem',
        '104': '26rem',
      },
      maxWidth: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '100': '25rem',
        '104': '26rem',
      }
    },
  },
  variants: {},
  plugins: [],
};