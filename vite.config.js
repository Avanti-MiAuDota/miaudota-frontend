import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      "/images": "http://192.168.15.201:8080",
      "/uploads": "http://192.168.15.201:8080",
      "/api": {
        target: "http://192.168.15.201:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
