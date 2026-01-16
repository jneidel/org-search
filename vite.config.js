import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
