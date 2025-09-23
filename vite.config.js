// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',          // ensure correct asset URLs on Netlify
  build: { sourcemap: true }
})
