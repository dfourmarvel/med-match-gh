import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      },
      boxShadow: {
        glow: "0 20px 80px -30px rgba(16, 185, 129, 0.35)"
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at top left, rgba(16,185,129,0.16), transparent 35%), radial-gradient(circle at top right, rgba(14,165,233,0.12), transparent 30%), radial-gradient(circle at bottom center, rgba(244,114,182,0.1), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
