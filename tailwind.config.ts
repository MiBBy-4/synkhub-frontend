import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        surface: {
          DEFAULT: "#1A1A1A",
          light: "#1F1F1F",
        },
        border: "#2A2A2A",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A3A3A3",
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        widget: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
