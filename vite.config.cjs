const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: { host: true, port: 5173 }
});