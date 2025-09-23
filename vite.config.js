// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Important for Netlify/any static host so asset URLs resolve correctly
  base: '/',
  build: {
    sourcemap: true, // helps debug if something breaks in prod
  },
})
