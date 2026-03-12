import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        primary: "#2563EB",
        secondary: "#06B6D4",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        glass: "rgba(255,255,255,0.65)",
        glassBorder: "rgba(255,255,255,0.4)"
      },
      boxShadow: {
        glass: "0 12px 40px rgba(37,99,235,0.12)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};

export default config;
