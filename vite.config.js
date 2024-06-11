import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-project-7.onrender.com',  // Adjust this to match your backend server address and port
        
      },
    },
  },
  plugins: [react()],
})
