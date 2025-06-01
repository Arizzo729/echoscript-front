// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  base: "/", // ✅ '/' is correct for root domains like echoscriptai.com
  plugins: [
    react(),
    environmentPlugin({
      VITE_OPENAI_API_KEY: '',
      REACT_APP_BROWSE_AI_API_KEY: '',
      REACT_APP_APIFY_API_TOKEN: '',
      REACT_APP_BRIGHTDATA_USERNAME: '',
      REACT_APP_BRIGHTDATA_PASSWORD: '',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      input: './index.html', // ✅ ensure it uses your root HTML file
    },
    outDir: 'dist', // default is fine, but explicitly set if needed
    emptyOutDir: true,
  },
});
