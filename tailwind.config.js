module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
