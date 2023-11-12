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
      white: "#f0f0f0",
      "white-hover": "#c2c7cc",
      "placeholder-dark": "#636362",
      "dark-gray": "#333",
      "dark-background2": "#222333",
      "dark-background": "#1b1b1b",
      "light-background2": "#f0f0f0",
      "light-background": "#e3e3e3",
      "light-background-placeholder": "#e3e3e399",
      "dark-drawer-background": "#222222ce",
      "light-drawer-background": "#e3e3e3ce",
    },
    extend: {},
    minHeight: {
      screen: "100vh",
    },
  },
  plugins: [],
};
