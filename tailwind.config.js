/** @type {import('tailwindcss').Config} */

export default {
  // eslint-disable-next-line no-undef

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "383px" },
      // => @media (max-width: 383px) { ... }
    },
    colors: {
      dark: { dark: "#101010", default: "#303030", light: "#4e4e4e" },
      light: { dark: "#e1e1e1", default: "#ededed", light: "#f7f7f7" },
    },
    extend: {},
  },
  plugins: [],
};
