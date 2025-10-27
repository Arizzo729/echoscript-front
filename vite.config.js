import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default dev server port
    open: true,
    proxy: {
      // proxy API calls to your FastAPI backend
      '/api': {
        target: 'http://127.0.0.1:8000', // change to your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true, // enable for VS Code debugging & Netlify builds
  },
});
