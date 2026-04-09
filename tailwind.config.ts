import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#C5A028",
          accent: "#C5A028",
          muted: "#8B7355",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          card: "#111118",
          border: "#1a1a2e",
          hover: "#16161f",
        },
      },
      fontSize: {
        "phi-xs": "0.618rem",
        "phi-sm": "0.786rem",
        "phi-base": "1rem",
        "phi-lg": "1.618rem",
        "phi-xl": "2.618rem",
        "phi-2xl": "4.236rem",
        "phi-3xl": "6.854rem",
      },
      spacing: {
        "fib-1": "0.0625rem",
        "fib-2": "0.125rem",
        "fib-3": "0.1875rem",
        "fib-5": "0.3125rem",
        "fib-8": "0.5rem",
        "fib-13": "0.8125rem",
        "fib-21": "1.3125rem",
        "fib-34": "2.125rem",
        "fib-55": "3.4375rem",
        "fib-89": "5.5625rem",
      },
      borderRadius: {
        phi: "1.618rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #C5A028 50%, #8B7355 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0f 0%, #111118 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(197,160,40,0.02) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(255, 215, 0, 0.15)",
        "gold-lg": "0 0 40px rgba(255, 215, 0, 0.2)",
      },
      animation: {
        "phi-pulse": "phiPulse 2.618s ease-in-out infinite",
        "phi-spin": "phiSpin 1.618s linear infinite",
        "golden-float": "goldenFloat 3s ease-in-out infinite",
      },
      keyframes: {
        phiPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.618" },
        },
        phiSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        goldenFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
