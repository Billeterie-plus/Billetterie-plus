/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5b21b6",
          light: "#7c3aed",
          dark: "#4c1d95",
        },
      },
    },
  },
  plugins: [],
};
