/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      "2xl": { max: "1535px" },

      xl: { max: "1279px" },

      lg: { max: "1023px" },

      md: { max: "767px" },

      sm: { max: "639px" },

      xs: { max: "500px" },
    },
    colors: {
      "light-background": "#fbfbfb",
      "dark-background": "#1b1b1b",
      "light-background-opacity": "#fbfbfb99",
      "dark-background-opacity": "#1b1b1b99",
    },
    extend: {},
    minHeight: {
      screen: "100vh",
    },
  },
  plugins: [],
};
