/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1d4ed8",
          light: "#3b82f6",
          dark: "#1e3a8a",
        },
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-1%, -1%)" },
        },
      },
      animation: {
        gradientMove: "gradientMove 8s ease infinite",
        marquee: "marquee 28s linear infinite",
        fadeInUp: "fadeInUp 0.6s ease-out both",
        floaty: "floaty 5s ease-in-out infinite",
        kenBurns: "kenBurns 18s ease-in-out infinite alternate",
      },
      backgroundSize: {
        200: "200% 200%",
      },
    },
  },
  plugins: [],
};
