import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/areas_v3": {
        target: "https://geo.datav.aliyun.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});