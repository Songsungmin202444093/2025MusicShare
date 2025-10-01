/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // 다크모드 제어 방식을 class로
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"  // src 폴더 전체 스캔
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
