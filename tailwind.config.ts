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
        "fib-1": "0.0625rem",  // 1px
        "fib-2": "0.125rem",   // 2px
        "fib-3": "0.1875rem",  // 3px
        "fib-5": "0.3125rem",  // 5px
        "fib-8": "0.5rem",     // 8px
        "fib-13": "0.8125rem", // 13px
        "fib-21": "1.3125rem", // 21px
        "fib-34": "2.125rem",  // 34px
        "fib-55": "3.4375rem", // 55px
        "fib-89": "5.5625rem", // 89px
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
      },
    },
  },
  plugins: [],
};

export default config;
