// File: vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import environmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [
      react(),
      svgr({ exportAsDefault: false }),
      environmentPlugin({
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

/* Troubleshooting bundle errors on Netlify CI

1. Ensure both plugins are installed in your package.json:
   "devDependencies": {
     "vite-plugin-svgr": "^3.0.0",
     "vite-plugin-environment": "^1.0.0"
   }

   Run:
     npm install --save-dev vite-plugin-svgr vite-plugin-environment
   OR
     yarn add -D vite-plugin-svgr vite-plugin-environment

2. Netlify by default skips devDependencies when NODE_ENV=production. Options:
   a) Move plugins to "dependencies" instead of devDependencies. (Less ideal)
   b) In Netlify UI or your netlify.toml, set the build environment:
        [build.environment]
        NODE_ENV = "development"
        NPM_FLAGS = "--include=dev"

3. Verify install and rebuild:
   Run locally:
     npm run build
   On Netlify:
     netlify build --context=production

4. Access env vars in code via:
     console.log(import.meta.env.VITE_OPENAI_API_KEY);

*/

