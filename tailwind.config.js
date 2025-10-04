/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // misol uchun ko‘k rang
        secondary: "#F59E0B", // sariq
        dark: "#0F172A", // to‘q fonlar uchun
        light: "#F8FAFC", // och fonlar uchun
      },
    },
  },
  plugins: [],
};
