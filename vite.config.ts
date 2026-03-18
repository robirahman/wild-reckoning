import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.ts',
    injectManifest: {
      injectionPoint: undefined,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  }), cloudflare()],
  base: '/wild-reckoning/',
})