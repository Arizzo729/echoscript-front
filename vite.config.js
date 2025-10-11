// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://api.echoscript.ai",
        changeOrigin: true,
        secure: true,
      },
      "/v1": {
        target: "https://api.echoscript.ai",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
