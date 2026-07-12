import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(11 17 32 / <alpha-value>)",
          card: "rgb(17 24 39 / <alpha-value>)",
          elevated: "rgb(31 41 55 / <alpha-value>)",
        },
        accent: {
          primary: "rgb(59 130 246 / <alpha-value>)",
          secondary: "rgb(139 92 246 / <alpha-value>)",
        },
        status: {
          success: "rgb(34 197 94 / <alpha-value>)",
          warning: "rgb(245 158 11 / <alpha-value>)",
        },
        muted: "rgb(156 163 175 / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.15)",
        "glow-purple": "0 0 40px rgba(139, 92, 246, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
