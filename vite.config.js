// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No @vitejs/plugin-legacy — Vite 7 doesn't need it.
// Minimal, compatible config.
export default defineConfig({
  plugins: [react()],
});
