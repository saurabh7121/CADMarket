import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'https://cadmarket.onrender.com/api'
  const target = backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
        },
      },
    },
  }
})
