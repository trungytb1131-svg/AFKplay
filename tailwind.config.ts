import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. ĐỊNH NGHĨA HỆ LƯỚI 17 CỘT (Cực kỳ quan trọng)
      gridTemplateColumns: {
        '17': 'repeat(17, minmax(0, 1fr))',
      },
      
      // 2. MỞ RỘNG CÁC ĐIỂM BẮT ĐẦU CỘT (Cho phép col-start lên tới 18)
      // Điều này giúp việc né 2 ô đầu (logo) hoạt động chính xác
      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
        '18': '18',
      },

      // 3. MÀU SẮC THƯƠNG HIỆU
      colors: {
        brand: {
          sky: "#87CEEB",
          blue: "#00BFFF",
          dark: "#1f1f1f",
          bg: "#adecf5", // Màu nền cyan bạn đang dùng cho trang chủ
        },
      },

      // 4. HIỆU ỨNG XUẤT HIỆN (Cho mục FavoriteSection)
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;