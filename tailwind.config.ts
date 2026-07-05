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
        muted: "hsl(var(--muted))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        gold: "hsl(var(--gold))",
        forest: "hsl(var(--forest))",
        clay: "hsl(var(--clay))",
        ink: "hsl(var(--ink))"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      },
      boxShadow: {
        card: "0 1px 2px hsl(var(--ink) / 0.06), 0 8px 24px -12px hsl(var(--ink) / 0.14)",
        lift: "0 2px 4px hsl(var(--ink) / 0.08), 0 18px 40px -16px hsl(var(--ink) / 0.24)",
        "glow-gold": "0 20px 70px -25px hsl(var(--gold) / 0.55)"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
