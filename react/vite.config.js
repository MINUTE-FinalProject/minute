import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_OWM_KEY': JSON.stringify('0cfe5550c93741a70f8a3c3edb2a8da5')
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
