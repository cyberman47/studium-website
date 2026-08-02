import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102829",
        teal: { 50: "#effbfa", 100: "#d7f3f1", 300: "#7ed3d1", 500: "#0f8b8d", 600: "#087478", 700: "#075f63" },
        accent: { 50: "#ecfdf5", 100: "#d1fae5", 300: "#6ee7b7", 500: "#059669", 600: "#047857", 700: "#036c53" }
      },
      boxShadow: { soft: "0 18px 55px -25px rgba(16, 40, 41, .22)", lift: "0 28px 60px -28px rgba(16, 40, 41, .35)" },
      fontFamily: { sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"], display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;
