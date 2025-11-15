// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can add your brand colors here
        'stylehub-primary': '#0f35df',
        'stylehub-secondary': '#fa0f8c',
        'stylehub-accent': '#f4d40f',
      }
    },
  },
  plugins: [],
}