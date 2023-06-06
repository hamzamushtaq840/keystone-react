/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./src/**/*.{html,js}",
  "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      boxShadow: {
        onboardingShadow: '0px 1px 2px -1px rgba(55, 48, 163, 0.4), 0px 8px 40px -12px rgba(55, 48, 163, 0.5)',
      },
      colors: {
        primarybtn: '#3730A3',
        primarytext: '#3730A3',
        pirmaryColor:  '#60A498',
        primaryBackground: '#EEF2FF',
        hoverPrimary: '#DCFCE7',
        NavBarText: '#4B5563'
      },
      screens: {
        'tablet': '810px',
        's-laptop': '1350px',
        'm-screen': '1680px',
        'lg-screen' : '1800px',
        'xl-screen' : '1920px',
        'xxl-screen' : '2400px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
});
