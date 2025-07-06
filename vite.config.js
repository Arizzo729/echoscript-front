// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      // Move SVGR before react, and export SVGs as the default export:
      svgr({
        exportAsDefault: true,
        icon: true,
        svgoConfig: { plugins: [{ removeViewBox: false }] },
      }),
      react(),
      environmentPlugin({ /* ... */ }),
    ],
    resolve: { /* ... */ },
    server: { historyApiFallback: true },
    build: {
      rollupOptions: { input: './index.html' },
      outDir: 'dist',
      emptyOutDir: true,
    },
    // You can remove assetsInclude here; SVGR will handle the SVG imports
  };
});
