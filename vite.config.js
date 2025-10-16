import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/", // ✅ root is fine
  plugins: [react()],
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
