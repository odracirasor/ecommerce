import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // ✅ Adicione esta linha para evitar erro 404 nas rotas do React Router
  build: {
    rollupOptions: {
      input: 'index.html'
    }

    
  },
  // ✅ Este plugin já cuida do fallback automaticamente
});
