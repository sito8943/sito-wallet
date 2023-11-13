/** @type {import('tailwindcss').Config} */

export default {
  // eslint-disable-next-line no-undef
  presets: [require("./node_modules/@sito/ui/dist/assets/styles/theme")],

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  plugins: [],
};
