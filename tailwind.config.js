module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
    },
    extend: {
      animation: {
        nodeVisitedAnimation: "visitedAnimation 1s ease-in",
      },
      keyframes: {
        visitedAnimation: {
          "0%": {
            transform: "scale(.2)",
            backgroundColor: "#7400b8",
            borderRadius: "100%",
          },
          "20%": {
            backgroundColor: "#6930c3",
          },
          "40%": {
            backgroundColor: "#5e60ce",
          },
          "60%": {
            transform: "scale(1.1)",
            backgroundColor: "#5390d9",
            borderRadius: "0%",
          },
          "80%": {
            backgroundColor: "#4ea8de",
          },
          "100%": {
            transform: "scale(1)",
            backgroundColor: "#48bfe3",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
