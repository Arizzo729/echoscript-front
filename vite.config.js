import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  base: "/", // ✅ root is fine
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
  server: {
    historyApiFallback: true, // ✅ crucial for dev routing
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});

