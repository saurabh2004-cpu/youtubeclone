import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:800',  // Adjust this to match your backend server address and port
        rewrite: (path) => path.replace(/^\/api/, ''),
        
      },
    },
  },
  plugins: [react()],
})
