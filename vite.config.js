import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import orgTextPlugin from "./src/org-mode/orgTextPlugin.js";

export default defineConfig({
  plugins: [
    react(),
    orgTextPlugin(),
  ],
  server: {
    proxy: {
      '/es': {
        target: 'https://es.neidel.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/es/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            try {
              if (typeof proxyReq.removeHeader === 'function') {
                proxyReq.removeHeader('origin')
                proxyReq.removeHeader('referer')
              }
            } catch (_) {
              // ignore
            }
          })
        },
      },
    },
  },
})
