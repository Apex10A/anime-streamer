import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in-up": "slideInUp 0.8s ease-out",
        "fade-in-scale": "fadeInScale 1s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.7"
          },
          "25%": { 
            transform: "translateY(-20px) translateX(10px)",
            opacity: "1"
          },
          "50%": { 
            transform: "translateY(-10px) translateX(-5px)",
            opacity: "0.8"
          },
          "75%": { 
            transform: "translateY(-30px) translateX(15px)",
            opacity: "0.9"
          },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)" },
        },
        slideInUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInScale: {
          from: {
            opacity: "0",
            transform: "scale(0.9)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;