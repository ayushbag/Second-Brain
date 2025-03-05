/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      mona: "Mona Sans",
      dmSans: "DM Sans"
    },
  extend: {
    colors: {
      gray: {
        100: "eeeeef",
        200: "#e6e9ed",
        600: "#95989c"
      },
      purple: {
        200: "#d9ddee",
        500: "#9492db",
        600: "#5446ab",
      },
      violet: {
        700: "#6D28D9",
      }
    }
  },
},
plugins: [],
}