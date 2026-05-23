import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF"
        },
        brand: {
          navy:    '#1a1a2e',
          navyMid: '#16213e',
          navyDeep:'#0f3460',
          orange:  '#F97316',
          orangeHover: '#EA580C',
          orangeLight: '#FFF7ED',
          orangeMuted: 'rgba(249,115,22,0.12)',
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
