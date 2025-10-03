/** @type {import('tailwindcss').Config} */
module.exports = {
  // make sure Tailwind scans your files
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  // explicitly define the default breakpoints so `md:*` etc. work
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  plugins: [],
};
