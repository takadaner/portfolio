import type { Config } from "tailwindcss";

// Palette extracted 1:1 from the Polo (Framebase) reference PDFs:
// pure-black page, slightly raised dark cards, hairline borders,
// white headings, warm-gray secondary text, white pill CTAs.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0d0d0d",
        "surface-2": "#161616",
        line: "#222222",
        foreground: "#f5f5f5",
        muted: "#9c9c9c",
        "muted-2": "#6b6b6b",
        accent: "#b9b1a4",
      },
      borderRadius: {
        card: "1.25rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "marquee-y": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-x-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "marquee-y": "marquee-y linear infinite",
        "marquee-x": "marquee-x linear infinite",
        "marquee-x-reverse": "marquee-x-reverse linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
