/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 프라이머리 컬러
        "primary-dark": "#4F5039",
        primary: "#727361",
        "primary-50": "#A6A79B",
        "primary-30": "#CBCBC4",

        // 포인트 컬러 (레드)
        "point-red-dark": "#900000",
        "point-red": "#AE4D4D",
        "point-red-40": "#D19999",
        "point-red-dark-20": "#E8CCCC",

        // 우드 컬러
        wood: "#C4A380",
        "wood-70": "#D6BFA7",
        "wood-30": "#EEE4D9",

        // 배경 컬러
        bg: "#EFEBE0",
        "bg-muted": "#F6F4EF",

        // 텍스트 컬러
        "text-main": "#2F2F2F",
        "text-muted": "#585858",
        "text-muted-40": "#BCBCBC",
        "text-muted-20": "#DEDEDE",

        // shadcn/ui 기본 색상 맵핑
        background: "#EFEBE0",
        foreground: "#2F2F2F",
        destructive: "#AE4D4D",
        "destructive-foreground": "#FFFFFF",
        accent: "#F6F4EF",
        "accent-foreground": "#2F2F2F",
        muted: "#585858",
        "muted-foreground": "#BCBCBC",
        border: "#DEDEDE",
        input: "#CBCBC4",
        ring: "#A6A79B",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
}
