import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    proxy: {
      // proxy API calls to your FastAPI backend
      '/api': {
        // target: 'http://127.0.0.1:8000', // change to your backend URL
        target: 'https://uls081qsp0meh0-8000.proxy.runpod.net/', // change to your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true, // enable for VS Code debugging & Netlify builds
  },
});
