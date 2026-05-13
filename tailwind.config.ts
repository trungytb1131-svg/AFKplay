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
        // Chuyển sang 17 cột chuẩn cho afkplay
        '17': 'repeat(17, minmax(0, 1fr))',
      },
      colors: {
        brand: {
          sky: "#87CEEB", // Màu xanh da trời trong sáng
          blue: "#00BFFF",
          dark: "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};
export default config;