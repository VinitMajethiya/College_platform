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
          DEFAULT: "#C9A227",
          foreground: "#FFFFFF"
        },
        brand: {
          navy:     '#1B3566',
          navyMid:  '#152D5A',
          navyDeep: '#0F2247',
          navyLight:'#243F78',
          gold:         '#C9A227',
          goldHover:    '#B8911E',
          goldLight:    '#FBF4E0',
          goldMuted:    'rgba(201,162,39,0.12)',
          // Legacy aliases for backward-compat (map orange → gold)
          orange:       '#C9A227',
          orangeHover:  '#B8911E',
          orangeLight:  '#FBF4E0',
          orangeMuted:  'rgba(201,162,39,0.12)',
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.10)",
        gold: "0 4px 24px rgba(201,162,39,0.18)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
