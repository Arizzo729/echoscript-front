import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    react(),
    environmentPlugin([
      "REACT_APP_BROWSE_AI_API_KEY",
      "REACT_APP_SIMPLE_SCRAPER_API_KEY",
      "REACT_APP_OCTOPARSE_API_KEY"
    ]),
  ],
});
