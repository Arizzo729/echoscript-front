﻿import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import environment from "vite-plugin-environment";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    // Expose environment variables to the client.
    // Only variables prefixed with VITE_ are exposed by default.
    // This plugin can expose others if needed.
    environment("all"),
  ],
  resolve: {
    // Add the alias from the original TS config
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Add extensions from the JS config
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    historyApiFallback: true, // For client-side routing in dev
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
