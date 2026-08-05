/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F6F3EC",
        ink: "#22201C",
        forest: {
          DEFAULT: "#2F4739",
          light: "#3E5B49",
          dark: "#20332A",
        },
        gold: "#C9A227",
        line: "#E4DFD3",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        wrap: "1280px",
      },
    },
  },
  plugins: [],
};
