import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"], // Add Montserrat for the playful design
      },
      colors: {
        primary: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
        },
        "neon-purple": "#8B5CF6",
        "neon-blue": "#3B82F6",
        "neon-pink": "#EC4899",
        "dark-bg": "#1F2937",
        "dark-card": "rgba(55, 65, 81, 0.8)",
        // Add playful geometric colors
        "coral": "#FF6F61",
        "teal": "#26A69A",
        "mustard": "#FFCA28",
        "lavender": "#E1BEE7",
        "light-gray": "#F5F7FA",
      },
      boxShadow: {
        "neon-glow": "0 0 15px rgba(139, 92, 246, 0.5)",
        "neon-blue-glow": "0 0 15px rgba(59, 130, 246, 0.5)",
        "playful-shadow": "0 6px 12px rgba(0, 0, 0, 0.1)", // Playful shadow for cards
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
      },
      // Add clip-path for hexagonal shapes
      clipPath: {
        hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      },
    },
  },
  darkMode: "class",
  plugins: [flowbite.plugin()],
};