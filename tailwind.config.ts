import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#060D18",
          navy: "#0B192C",
          surface: "#0F223D",
          royal: "#1B365D",
          muted: "#23497B",
          accent: "#0284C7",
          light: "#38BDF8",
          ice: "#E0F2FE",
        },
        kenya: {
          green: "#059669",
          emerald: "#10B981",
          gold: "#D97706",
          dark: "#0F172A",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
