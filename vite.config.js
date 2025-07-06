/// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      svgr({
        exportAsDefault: false,
        icon: true,
        svgoConfig: { plugins: [{ removeViewBox: false }] },
      }), // must precede react()
      react(),
      environmentPlugin({
        defaults: {
          VITE_OPENAI_API_KEY:    env.VITE_OPENAI_API_KEY    || '',
          VITE_BROWSE_AI_API_KEY: env.VITE_BROWSE_AI_API_KEY || '',
          VITE_APIFY_API_TOKEN:   env.VITE_APIFY_API_TOKEN   || '',
          VITE_BRIGHTDATA_USERNAME: env.VITE_BRIGHTDATA_USERNAME || '',
          VITE_BRIGHTDATA_PASSWORD: env.VITE_BRIGHTDATA_PASSWORD || '',
        },
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    server: {
      historyApiFallback: true,
    },
    build: {
      rollupOptions: { input: './index.html' },
      outDir: 'dist',
      emptyOutDir: true,
    },
    assetsInclude: ['**/*.svg'],
  };
});

