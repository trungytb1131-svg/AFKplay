import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Cấu hình hệ lưới 18 cột giống Poki
        '18': 'repeat(18, minmax(0, 1fr))',
      },
      // Bạn có thể thêm các màu sắc đặc trưng của afkplay tại đây
      colors: {
        brand: {
          red: "#ff4757",
          blue: "#2ed573",
          dark: "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};
export default config;