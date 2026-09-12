import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DEFAULT — Pantone 5773 C (наш фирменный оливковый), #899064.
        // Светлее прежнего #7A8A4F — dark/light оставлены как есть, это
        // отдельные тона для заголовков/лёгких акцентов, не завязанные
        // напрямую на Pantone-спеку.
        olive: {
          DEFAULT: "#899064",
          dark: "#4A5530",
          light: "#A4B176",
        },
        cream: {
          DEFAULT: "#FAFAF7",
          dark: "#F1EFE8",
        },
        rose: {
          DEFAULT: "#C4908A",
          light: "#E0BCB6",
        },
        text: {
          DEFAULT: "#2C2C2A",
          muted: "#888780",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "6px",
        pill: "9999px",
      },
      maxWidth: {
        app: "420px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
