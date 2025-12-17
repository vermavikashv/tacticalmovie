/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}", // safe even if unused
  ],
  theme: {
    extend: {
      colors: {
        primary: "#093545",
        accent: "#2BD17E",
        input: "#224957",
        error: "#EB5757",
        card: "#092C39",
      },
    },
  },
  plugins: [],
};
