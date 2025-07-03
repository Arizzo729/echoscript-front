// File: vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
  // Load .env files and merge into process.env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      react(),
      svgr({ exportAsDefault: false }), // enable ReactComponent imports
      environmentPlugin({
        // Expose only VITE_ variables (avoid REACT_APP_ prefix)
        VITE_OPENAI_API_KEY: env.VITE_OPENAI_API_KEY,
        VITE_BROWSE_AI_API_KEY: env.VITE_BROWSE_AI_API_KEY,
        VITE_APIFY_API_TOKEN: env.VITE_APIFY_API_TOKEN,
        VITE_BRIGHTDATA_USERNAME: env.VITE_BRIGHTDATA_USERNAME,
        VITE_BRIGHTDATA_PASSWORD: env.VITE_BRIGHTDATA_PASSWORD,
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    server: {
      historyApiFallback: true,
    },
    build: {
      rollupOptions: {
        input: './index.html',
      },
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});

/*
- Run:
    npm install --save-dev vite-plugin-environment vite-plugin-svgr
  OR
    yarn add -D vite-plugin-environment vite-plugin-svgr

- Ensure you have .env and .env.production with VITE_ prefixed keys, e.g.: 
    VITE_OPENAI_API_KEY=your_key_here
    VITE_APIFY_API_TOKEN=token

- In code, access via import.meta.env.VITE_OPENAI_API_KEY
*/
