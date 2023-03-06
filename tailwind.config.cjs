/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./pages/**/index.html"],
  theme: {
    extend: {
      colors: {
        link: "#646cff",
        linkHover: "#535bf2",
      },
    },
  },
  plugins: [],
};
