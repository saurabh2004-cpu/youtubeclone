import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:8000',  // Ensure this matches your backend server address
        changeOrigin: true,
        secure: false,  // This might be necessary for self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
  plugins: [react()],
});
