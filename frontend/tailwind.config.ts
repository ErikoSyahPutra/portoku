import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          cream: "#FDFBF7",
          surface: "#FFFFFF",
          dark: "#0F0F11",
          card: "#16161A",
        },
        coral: {
          400: "#FF6B57",
          500: "#FF462E",
          600: "#E63B24",
          light: "#FFF1EE",
        },
        charcoal: {
          900: "#0F0F11",
          800: "#1A1A1E",
          700: "#2E2E36",
          muted: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        signature: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
