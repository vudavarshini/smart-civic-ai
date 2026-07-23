/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0b1c3f",
          dark: "#0f172a",
          primary: "#1e3a8a",
          secondary: "#3b82f6",
          light: "#f8fafc",
          accent: "#f59e0b",
          success: "#10b981",
          danger: "#ef4444",
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
