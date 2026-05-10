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
        "red-primary": "#8B1E2D",
        "red-accent": "#B3263B",
        "bg-dark": "#0D0D0D",
        "panel": "#1A1A1A",
        "panel2": "#141414",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "cursive"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
