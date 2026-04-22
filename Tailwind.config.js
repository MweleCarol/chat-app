/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body:    ["'Inter'", "sans-serif"],
      },
      colors: {
        bg: {
          0: "#08080e",
          1: "#0d0d17",
          2: "#111120",
          3: "#161626",
          4: "#1c1c2e",
          5: "#232338",
          6: "#2a2a42",
        },
        surface: {
          1: "rgba(255,255,255,0.03)",
          2: "rgba(255,255,255,0.05)",
          3: "rgba(255,255,255,0.08)",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          light:   "#a78bfa",
          dark:    "#6d28d9",
          pink:    "#ec4899",
          glow:    "rgba(139,92,246,0.35)",
          muted:   "rgba(139,92,246,0.12)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          bright:  "rgba(255,255,255,0.10)",
          strong:  "rgba(255,255,255,0.15)",
          accent:  "rgba(139,92,246,0.30)",
        },
        text: {
          0: "#eeeef5",
          1: "#9898b0",
          2: "#5a5a75",
          3: "#333348",
        },
        online:  "#34d399",
        danger:  "#f87171",
        warning: "#fbbf24",
      },
      animation: {
        "pulse-dot":   "pulseDot 2.5s ease-in-out infinite",
        "rotate-ring": "rotateRing 3s linear infinite",
        "bubble-in":   "bubbleIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-up":     "fadeUp 0.3s ease both",
        "fade-in":     "fadeIn 0.2s ease both",
        "scale-in":    "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        "slide-right": "slideRight 0.25s ease both",
        "typing-1":    "typingBounce 1.4s ease-in-out 0s infinite",
        "typing-2":    "typingBounce 1.4s ease-in-out 0.18s infinite",
        "typing-3":    "typingBounce 1.4s ease-in-out 0.36s infinite",
        "spin-slow":   "spin 0.75s linear infinite",
        "shimmer":     "shimmer 2s linear infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%":     { opacity: "0.6", transform: "scale(0.8)" },
        },
        rotateRing: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        bubbleIn: {
          from: { opacity: "0", transform: "scale(0.88) translateY(10px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.90)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        typingBounce: {
          "0%,60%,100%": { transform: "translateY(0)",    opacity: "0.35" },
          "30%":         { transform: "translateY(-5px)", opacity: "1"    },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
      },
      boxShadow: {
        "accent":     "0 4px 20px rgba(139,92,246,0.35)",
        "accent-lg":  "0 8px 32px rgba(139,92,246,0.45)",
        "card":       "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset",
        "card-lg":    "0 16px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.07) inset",
        "glow-sm":    "0 0 20px rgba(139,92,246,0.3)",
        "inset-top":  "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa)",
        "grad-pink":   "linear-gradient(135deg, #8b5cf6, #ec4899)",
        "grad-mesh":   "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15), transparent)",
        "noise":       "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      width:    { sidebar: "300px" },
      minWidth: { sidebar: "300px" },
      maxWidth: { auth: "420px" },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};