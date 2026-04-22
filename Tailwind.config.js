/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: {
          0: "#0a0a0f",
          1: "#111118",
          2: "#18181f",
          3: "#202028",
          4: "#2a2a35",
          5: "#343440",
        },
        accent: {
          DEFAULT: "#7c6dfa",
          2:       "#fa6d9a",
          dim:     "#7c6dfa29",   // 16% opacity
          glow:    "#7c6dfa4d",   // 30% opacity
        },
        border: {
          DEFAULT: "#ffffff12",   // 7%  white
          bright:  "#ffffff24",   // 14% white
          hover:   "#ffffff38",   // 22% white
        },
        text: {
          0: "#f0f0f8",
          1: "#a8a8c0",
          2: "#6a6a88",
          3: "#3e3e55",
        },
        online: "#3ddc97",
      },
      animation: {
        "pulse-dot":   "pulseDot 2s ease-in-out infinite",
        "rotate-ring": "rotateRing 3s linear infinite",
        "bubble-in":   "bubbleIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-in":     "fadeIn 0.25s ease both",
        "scale-in":    "scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        "slide-left":  "slideLeft 0.2s ease both",
        "typing-1":    "typingBounce 1.2s ease-in-out 0s infinite",
        "typing-2":    "typingBounce 1.2s ease-in-out 0.2s infinite",
        "typing-3":    "typingBounce 1.2s ease-in-out 0.4s infinite",
        "spin-slow":   "spin 0.8s linear infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { boxShadow: "0 0 6px #7c6dfa" },
          "50%":     { boxShadow: "0 0 18px #7c6dfa, 0 0 32px #7c6dfa4d", transform: "scale(1.25)" },
        },
        rotateRing: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        bubbleIn: {
          from: { opacity: "0", transform: "scale(0.85) translateY(8px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        slideLeft: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        typingBounce: {
          "0%,60%,100%": { transform: "translateY(0)",    opacity: "0.4" },
          "30%":         { transform: "translateY(-6px)", opacity: "1"   },
        },
      },
      boxShadow: {
        glow:      "0 4px 16px #7c6dfa4d",
        "glow-lg": "0 6px 24px #7c6dfa66",
        dark:      "0 8px 32px rgba(0,0,0,0.5)",
        darker:    "0 20px 60px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "bubble-mine": "linear-gradient(135deg, #7c6dfa, #9b8dff)",
        "ring-grad":   "linear-gradient(135deg, #7c6dfa, #fa6d9a)",
        "auth-glow1":  "radial-gradient(circle, rgba(124,109,250,0.10), transparent 70%)",
        "auth-glow2":  "radial-gradient(circle, rgba(250,109,154,0.07), transparent 70%)",
      },
      width:    { sidebar: "300px" },
      minWidth: { sidebar: "300px" },
      maxWidth: { auth: "440px" },
    },
  },
  plugins: [],
};