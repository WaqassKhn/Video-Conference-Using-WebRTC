import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 💡 Add this line: Listen on all network interfaces
    // This allows access from other devices on the same network
    host: true, 
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../backend/certs/cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../backend/certs/cert.crt')),
    },
    proxy: {
      '/socket.io': {
        target: 'https://localhost:8181',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/api': {
        target: 'https://localhost:8181',
        changeOrigin: true,
        secure: false
      }
    }
  }
})