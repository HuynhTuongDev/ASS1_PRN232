/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        aura: {
          sand: "#FDFBF7",
          emerald: "#065F46",
          sage: "#6B7280",
          clay: "#A78BFA",
        }
      },
    },
  },
  plugins: [],
};
