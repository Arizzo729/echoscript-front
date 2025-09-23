// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => ({
  // … your existing config …
  plugins: [
    svgr({
      exportAsDefault: true,
      include: '**/*.svg',           // <— add this line
      icon: true,
      svgoConfig: { plugins: [{ removeViewBox: false }] },
    }),                            // :contentReference[oaicite:2]{index=2}
    react(),
    environmentPlugin({ /* … */ }),
  ],
  // …
}));
