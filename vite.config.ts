import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true
      }
    },
    allowedHosts: [
      '.ngrok-free.app',
    ]
  }
})